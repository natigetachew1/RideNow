from rest_framework import serializers

class FaceVerificationSerializer(serializers.Serializer):
    image1 = serializers.CharField(required=True, help_text="Base64 encoded image data or URL of the first image")
    image2 = serializers.CharField(required=True, help_text="Base64 encoded image data or URL of the second image")