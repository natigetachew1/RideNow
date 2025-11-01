from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from deepface import DeepFace
from io import BytesIO
from PIL import Image
import os
import tempfile
import uuid

class FaceVerificationView(APIView):
    def post(self, request):
        
        if 'image1' not in request.FILES or 'image2' not in request.FILES:
            return Response(
                {"error": "Both 'image1' and 'image2' files are required in the request."},
                status=status.HTTP_400_BAD_REQUEST
            )

        temp_files = []
        try:
            
            img1_file = request.FILES['image1']
            img1_path = self._save_uploaded_file(img1_file)
            temp_files.append(img1_path)

            
            img2_file = request.FILES['image2']
            img2_path = self._save_uploaded_file(img2_file)
            temp_files.append(img2_path)

            
            result = DeepFace.verify(
                img1_path=img1_path,
                img2_path=img2_path,
                model_name='Facenet',
                detector_backend='opencv',
                distance_metric='cosine',
                enforce_detection=True
            )
            
            return Response({
                "verified": bool(result["verified"]),
                "distance": float(result["distance"]),
                "threshold": float(result["threshold"]),
                "model": "Facenet",
                "detector_backend": "opencv"
            })
            
        except Exception as e:
            return Response(
                {"error": f"Error during face verification: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        finally:
            
            for file_path in temp_files:
                if file_path and os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                    except:
                        pass

    def _save_uploaded_file(self, uploaded_file):
        """Save uploaded file to a temporary location and return its path."""
        try:
            
            img = Image.open(BytesIO(uploaded_file.read()))
            
            
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            
            temp_dir = os.path.join('media', 'temp')
            os.makedirs(temp_dir, exist_ok=True)
            temp_filename = f"temp_{uuid.uuid4()}.jpg"
            temp_path = os.path.join(temp_dir, temp_filename)
            
            
            img.save(temp_path)
            return temp_path
            
        except Exception as e:
            print(f"Error processing uploaded file: {str(e)}")
            return None