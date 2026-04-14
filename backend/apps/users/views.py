import hashlib

from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken as SimpleJWTRefreshToken

from .models import RefreshToken
from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    RefreshSerializer,
    RegisterSerializer,
    UserSerializer,
)


def hash_token(raw_token):
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def refresh_expiry():
    return timezone.now() + settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]


def build_auth_payload(user, refresh):
    access = str(refresh.access_token)
    return {
        "access": access,
        "refresh": str(refresh),
        "user": UserSerializer(user).data,
    }


def persist_refresh_token(user, refresh_token):
    token_hash = hash_token(str(refresh_token))
    RefreshToken.objects.create(
        user=user,
        token_hash=token_hash,
        expires_at=refresh_expiry(),
        revoked=False,
    )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = SimpleJWTRefreshToken.for_user(user)
        persist_refresh_token(user, refresh)

        return Response(build_auth_payload(user, refresh), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = SimpleJWTRefreshToken.for_user(user)
        persist_refresh_token(user, refresh)

        return Response(build_auth_payload(user, refresh), status=status.HTTP_200_OK)


class RefreshView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh_token = serializer.validated_data["refresh"]
        token_hash = hash_token(refresh_token)

        try:
            token_record = RefreshToken.objects.get(
                user=request.user,
                token_hash=token_hash,
                revoked=False,
            )
        except RefreshToken.DoesNotExist:
            return Response({"detail": "Refresh token is invalid or revoked."}, status=status.HTTP_401_UNAUTHORIZED)

        if token_record.expires_at <= timezone.now():
            token_record.revoked = True
            token_record.save(update_fields=["revoked"])
            return Response({"detail": "Refresh token has expired."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            parsed_refresh = SimpleJWTRefreshToken(refresh_token)
        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"access": str(parsed_refresh.access_token)}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh_token = serializer.validated_data["refresh"]
        token_hash = hash_token(refresh_token)

        token_record, created = RefreshToken.objects.get_or_create(
            user=request.user,
            token_hash=token_hash,
            defaults={
                "expires_at": refresh_expiry(),
                "revoked": True,
            },
        )

        if not created and not token_record.revoked:
            token_record.revoked = True
            token_record.save(update_fields=["revoked"])

        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)
