import jwt
from jwt.algorithms import RSAAlgorithm
import requests
from django.contrib.auth import get_user_model
from django.core.cache import cache
from decouple import config
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()


def get_clerk_jwks():
    """Fetch and cache Clerk's public JSON Web Key Set (JWKS)."""
    jwks = cache.get("clerk_jwks")
    if not jwks:
        issuer = config("CLERK_ISSUER", default="").rstrip("/")
        if not issuer:
            raise AuthenticationFailed("CLERK_ISSUER not configured")
        
        jwks_url = f"{issuer}/.well-known/jwks.json"
        try:
            res = requests.get(jwks_url, timeout=5)
            if res.status_code == 200:
                jwks = res.json()
                cache.set("clerk_jwks", jwks, 3600 * 24)  # Cache for 24h
            else:
                raise AuthenticationFailed("Failed to retrieve Clerk public keys")
        except Exception as e:
            raise AuthenticationFailed("Could not connect to Clerk auth provider") from e

    return jwks


class ClerkAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]

        try:
            # Unverified header to find kid
            header = jwt.get_unverified_header(token)
            kid = header.get("kid")
            jwks = get_clerk_jwks()

            public_key = None
            for key in jwks.get("keys", []):
                if key.get("kid") == kid:
                    public_key = RSAAlgorithm.from_jwk(key)
                    break

            if not public_key:
                raise AuthenticationFailed("Invalid token key identifier")

            issuer = config("CLERK_ISSUER", default="").rstrip("/")
            payload = jwt.decode(
                token,
                key=public_key,
                algorithms=["RS256"],
                options={"verify_aud": False},
                issuer=issuer,
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Authentication token has expired")
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f"Invalid authentication token: {str(e)}")

        clerk_user_id = payload.get("sub")
        email = payload.get("email") or f"{clerk_user_id}@clerk.user"
        first_name = payload.get("first_name", "")
        last_name = payload.get("last_name", "")

        # Get or create corresponding local Django user
        user, created = User.objects.get_or_create(
            username=clerk_user_id,
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
            },
        )

        return (user, token)
