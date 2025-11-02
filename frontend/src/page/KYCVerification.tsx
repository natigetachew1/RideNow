import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../component/Button';

const KYCVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, name } = location.state || {};
  
  const [step, setStep] = useState<number>(1);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [livePhoto, setLivePhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [currentCameraType, setCurrentCameraType] = useState<'id' | 'selfie'>('id');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      return videoDevices;
    } catch (error) {
      console.error('Error getting cameras:', error);
      return [];
    }
  };

  const startCamera = async (type: 'id' | 'selfie') => {
    try {
      setCameraError(null);
      setIsCameraActive(true);
      setCurrentCameraType(type);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      let constraints: MediaStreamConstraints;
      
      if (type === 'id') {
        constraints = {
          video: {
            facingMode: { ideal: 'environment' }, 
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        };
      } else {
        constraints = {
          video: {
            facingMode: 'user', 
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Unable to access camera. Please check permissions and try again.');
      setIsCameraActive(false);
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageDataUrl = canvasRef.current.toDataURL('image/png');
        
        if (step === 1) {
          setIdPhoto(imageDataUrl);
        } else {
          setLivePhoto(imageDataUrl);
        }
        
        stopCamera();
        setIsCameraActive(false);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        if (type === 'id') {
          setIdPhoto(imageDataUrl);
        } else {
          setLivePhoto(imageDataUrl);
        }
        setShowUploadOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    if (step === 1) {
      setIdPhoto(null);
    } else {
      setLivePhoto(null);
    }
    setShowUploadOptions(false);
  };

  const startCameraForCurrentStep = () => {
    startCamera(step === 1 ? 'id' : 'selfie');
  };

  const handleNext = () => {
    setStep(2);
    setShowUploadOptions(false);
  };
  
  const handleBack = () => {
    setStep(1);
    setShowUploadOptions(false);
  };

  const handleSubmit = async () => {
    if (!idPhoto || !livePhoto) {
      alert('Please complete all verification steps');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('KYC data:', { email, idPhoto, livePhoto });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('KYC verification failed:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Verify Your ID
        </h2>
        <p className="mt-3 text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
          Take a clear photo of your government-issued ID. Ensure all details are visible and readable.
        </p>
      </div>
      
      <div className="border-3 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center justify-center space-y-6">
          {!idPhoto ? (
            <>
              {!showUploadOptions ? (
                <div className="space-y-4 w-full max-w-sm">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 font-medium">CHOOSE UPLOAD METHOD</p>
                    <p className="text-xs text-gray-400">JPG, PNG • MAX 5MB</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={startCameraForCurrentStep}
                      className="flex flex-col items-center p-4 border-2 border-blue-200 rounded-xl bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                    >
                      <svg className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Take Photo</span>
                      <span className="text-xs text-gray-500 mt-1">Use Camera</span>
                    </button>
                    
                    <button
                      onClick={() => setShowUploadOptions(true)}
                      className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                    >
                      <svg className="w-8 h-8 text-gray-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Upload File</span>
                      <span className="text-xs text-gray-500 mt-1">From Device</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 w-full max-w-sm">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 font-medium">UPLOAD EXISTING PHOTO</p>
                    <p className="text-xs text-gray-400">Select from your device</p>
                  </div>
                  
                  <label className="cursor-pointer flex items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 group">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-base font-semibold text-blue-600">Choose File</span>
                      <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'id')}
                        className="sr-only"
                      />
                    </div>
                  </label>
                  
                  <button
                    onClick={() => setShowUploadOptions(false)}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    ← Back to options
                  </button>
                </div>
              )}

              {/* Camera View */}
              {isCameraActive && !showUploadOptions && (
                <div className="space-y-4 w-full max-w-md mt-4">
                  {cameraError ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-red-600 font-medium">{cameraError}</p>
                      <button
                        onClick={startCameraForCurrentStep}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Retry Camera
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 border-2 border-white border-dashed rounded-lg m-4 pointer-events-none"></div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center space-x-2 text-white bg-black/50 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Live - Rear Camera</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            stopCamera();
                            setIsCameraActive(false);
                          }}
                          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={takePicture}
                          className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                          <span>Capture</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="relative space-y-4">
              <div className="w-full max-w-sm mx-auto bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <img 
                  src={idPhoto} 
                  alt="ID preview" 
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={retakePhoto}
                  className="inline-flex items-center px-6 py-3 border-2 border-red-200 text-base font-medium rounded-xl text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retake
                </button>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Take a Selfie
        </h2>
        <p className="mt-3 text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
          Look directly at the camera and make sure your face is clearly visible
        </p>
      </div>
      
      <div className="border-3 border-dashed border-purple-200 rounded-2xl p-8 text-center bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-col items-center justify-center space-y-6">
          {!livePhoto ? (
            <>
              {!showUploadOptions ? (
                <div className="space-y-4 w-full max-w-sm">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 font-medium">CHOOSE UPLOAD METHOD</p>
                    <p className="text-xs text-gray-400">JPG, PNG • MAX 5MB</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={startCameraForCurrentStep}
                      className="flex flex-col items-center p-4 border-2 border-purple-200 rounded-xl bg-white hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 group"
                    >
                      <svg className="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Take Selfie</span>
                      <span className="text-xs text-gray-500 mt-1">Use Camera</span>
                    </button>
                    
                    <button
                      onClick={() => setShowUploadOptions(true)}
                      className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                    >
                      <svg className="w-8 h-8 text-gray-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Upload File</span>
                      <span className="text-xs text-gray-500 mt-1">From Device</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 w-full max-w-sm">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 font-medium">UPLOAD EXISTING PHOTO</p>
                    <p className="text-xs text-gray-400">Select from your device</p>
                  </div>
                  
                  <label className="cursor-pointer flex items-center justify-center p-6 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-200 group">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-base font-semibold text-purple-600">Choose File</span>
                      <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'selfie')}
                        className="sr-only"
                      />
                    </div>
                  </label>
                  
                  <button
                    onClick={() => setShowUploadOptions(false)}
                    className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    ← Back to options
                  </button>
                </div>
              )}

              {/* Camera View */}
              {isCameraActive && !showUploadOptions && (
                <div className="space-y-4 w-full max-w-md mt-4">
                  {cameraError ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <p className="text-red-600 font-medium">{cameraError}</p>
                      <button
                        onClick={startCameraForCurrentStep}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                      >
                        Retry Camera
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 border-2 border-white border-dashed rounded-full m-8 pointer-events-none"></div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center space-x-2 text-white bg-black/50 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Live - Front Camera</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            stopCamera();
                            setIsCameraActive(false);
                          }}
                          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={takePicture}
                          className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                          <span>Capture</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="relative space-y-4">
              <div className="w-48 h-48 mx-auto bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img 
                  src={livePhoto} 
                  alt="Selfie preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={retakePhoto}
                  className="inline-flex items-center px-6 py-3 border-2 border-red-200 text-base font-medium rounded-xl text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all duration-200"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retake
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
            RN
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Identity Verification
          </h1>
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">ID Photo</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Selfie</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white/95 backdrop-blur-lg py-10 px-8 shadow-2xl rounded-3xl border border-white/20">
          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;