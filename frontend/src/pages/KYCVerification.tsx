import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  idType: yup.string().required('ID Type is required'),
  idNumber: yup.string().required('ID Number is required'),
  idPhoto: yup.mixed()
    .required('ID Photo is required')
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value) return true;
      const file = value as File;
      return file.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value) return true;
      const file = value as File;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
    }),
  selfiePhoto: yup.mixed()
    .required('Selfie with ID is required')
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value) return true;
      const file = value as File;
      return file.size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value) return true;
      const file = value as File;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
    }),
});

type FormData = yup.InferType<typeof schema>;

export const KYCVerification = () => {
  const { verifyKYC, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const idPhoto = watch('idPhoto');
  const selfiePhoto = watch('selfiePhoto');

  const handleFileChange = (fieldName: 'idPhoto' | 'selfiePhoto', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(fieldName, file, { shouldValidate: true });
      setError(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = authApi.prepareKYCFormData({
        userId: user.id,
        idType: data.idType,
        idNumber: data.idNumber,
        idPhoto: data.idPhoto as File,
        selfiePhoto: data.selfiePhoto as File,
      });

      await verifyKYC(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('KYC verification failed:', err);
      setError(err instanceof Error ? err.message : 'KYC verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">KYC Verification</h2>
        <p className="text-gray-600 mb-6">
          Please complete your KYC verification to start using all features of our platform.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
            <select
              {...register('idType')}
              className={`mt-1 block w-full rounded-md border ${
                errors.idType ? 'border-red-500' : 'border-gray-300'
              } p-2`}
            >
              <option value="">Select ID Type</option>
              <option value="passport">Passport</option>
              <option value="driver_license">Driver's License</option>
              <option value="national_id">National ID</option>
            </select>
            {errors.idType && <p className="text-red-500 text-xs mt-1">{errors.idType.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
            <input
              type="text"
              {...register('idNumber')}
              className={`mt-1 block w-full rounded-md border ${
                errors.idNumber ? 'border-red-500' : 'border-gray-300'
              } p-2`}
              placeholder="Enter your ID number"
            />
            {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Photo</label>
              <div className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                {idPhoto ? (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(idPhoto as File)} 
                      alt="ID Preview" 
                      className="h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('idPhoto', null as any, { shouldValidate: true })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="id-photo"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload ID Photo</span>
                        <input
                          id="id-photo"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => handleFileChange('idPhoto', e)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                  </div>
                )}
              </div>
              {errors.idPhoto && <p className="text-red-500 text-xs mt-1">{errors.idPhoto.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selfie with ID</label>
              <div className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                {selfiePhoto ? (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(selfiePhoto as File)} 
                      alt="Selfie Preview" 
                      className="h-32 w-32 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('selfiePhoto', null as any, { shouldValidate: true })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="selfie-photo"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Take Selfie</span>
                        <input
                          id="selfie-photo"
                          type="file"
                          accept="image/*"
                          capture="user"
                          className="sr-only"
                          onChange={(e) => handleFileChange('selfiePhoto', e)}
                        />
                      </label>
                      <p className="pl-1">or upload</p>
                    </div>
                    <p className="text-xs text-gray-500">JPG or PNG up to 5MB</p>
                  </div>
                )}
              </div>
              {errors.selfiePhoto && <p className="text-red-500 text-xs mt-1">{errors.selfiePhoto.message}</p>}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Submit Verification'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYCVerification;
