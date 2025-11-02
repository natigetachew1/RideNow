import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../component/Button';

const KYCVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, name } = location.state || {};
  
  const [step, setStep] = useState<number>(1);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdPhoto(file);
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLivePhoto(file);
    }
  };
  
  const handleNext = () => {
    setStep(2);
  };
  
  const handleBack = () => {
    setStep(1);
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Take a photo of your ID</h2>
        <p className="mt-2 text-sm text-gray-600">
          Make sure your ID is clearly visible and all text is readable
        </p>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          {!idPhoto ? (
            <>
              <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="mt-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Take Photo of ID
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleIdPhotoChange}
                    className="sr-only"
                    required
                  />
                </label>
              </div>
            </>
          ) : (
            <div className="relative">
              <div className="w-full max-w-xs mx-auto bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                <img 
                  src={URL.createObjectURL(idPhoto)} 
                  alt="ID preview" 
                  className="w-full h-auto rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => setIdPhoto(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                aria-label="Retake photo"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-2">
        <Button
          type="button"
          onClick={handleNext}
          className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={!idPhoto}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Take a selfie</h2>
        <p className="mt-2 text-sm text-gray-600">
          We'll use this to verify your identity
        </p>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          {!livePhoto ? (
            <>
              <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="mt-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Take Selfie
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleSelfieChange}
                    className="sr-only"
                    required
                  />
                </label>
              </div>
            </>
          ) : (
            <div className="relative">
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full overflow-hidden">
                <img 
                  src={URL.createObjectURL(livePhoto)} 
                  alt="Selfie preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setLivePhoto(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                aria-label="Retake photo"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={!livePhoto || isSubmitting}
        >
          {isSubmitting ? 'Verifying...' : 'Submit Verification'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            RN
          </div>
        </div>
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          {step === 1 ? 'ID Verification' : 'Face Verification'}
        </h1>
        <p className="text-center text-sm text-gray-600">
          {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-gray-100 sm:px-10">
          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
