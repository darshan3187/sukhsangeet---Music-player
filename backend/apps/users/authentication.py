import jwt
from jwt.algorithms import RSAAlgorithm
import requests
from django.contrib.auth import get_user_model
from django.core.cache import cache
from decouple import config
from rest_framework.authentication import BaseAuthentication

User = get_user_model()


def get_clerk_jwks():
    """Fetch and cache Clerk's public JSON Web Key Set (JWKS)."""
    jwks = cache.get("clerk_jwks")
    if not jwks:
        issuer = config("CLERK_ISSUER", default="").rstrip("/")
        if not issuer:
            return None
        
        jwks_url = f"{issuer}/.well-known/jwks.json"
        try:
            res = requests.get(jwks_url, timeout=5)
            if res.status_code == 200:
                jwks = res.json()
                cache.set("clerk_jwks", jwks, 3600 * 24)  # Cache for 24h
            else:
                return None
        except Exception:
            return None

    return jwks


class ClerkAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]

        try:
            header = jwt.get_unverified_header(token)
        except Exception:
            return None

        kid = header.get("kid")
        alg = header.get("alg")

        # Clerk tokens are RS256 signed with a JWKS key identifier ('kid')
        if not kid or alg != "RS256":
            return None

        jwks = get_clerk_jwks()
        if not jwks:
            return None

        public_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                public_key = RSAAlgorithm.from_jwk(key)
                break

        if not public_key:
            return None

        try:
            issuer = config("CLERK_ISSUER", default="").rstrip("/")
            payload = jwt.decode(
                token,
                key=public_key,
                algorithms=["RS256"],
                options={"verify_aud": False},
                issuer=issuer if issuer else None,
            )
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None

        clerk_user_id = payload.get("sub")
        if not clerk_user_id:
            return None

        email = payload.get("email") or f"{clerk_user_id}@clerk.user"
        first_name = payload.get("first_name", "")
        last_name = payload.get("last_name", "")

        user = User.objects.filter(username=clerk_user_id).first()
        if not user and email:
            user = User.objects.filter(email__iexact=email).first()
            if user:
                try:
                    user.username = clerk_user_id
                    user.save(update_fields=["username"])
                except Exception:
                    pass

        if not user:
            try:
                user = User.objects.create(
                    username=clerk_user_id,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                )
                user.set_unusable_password()
                user.save()
            except Exception:
                user, _ = User.objects.get_or_create(
                    username=f"clerk_{clerk_user_id[:20]}",
                    defaults={"email": f"{clerk_user_id}@clerk.user"}
                )

        return (user, token)
