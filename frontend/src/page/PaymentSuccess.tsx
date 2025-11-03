import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navigation from '../component/Navigation';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('processing');

  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    const status = searchParams.get('status');

    if (status === 'success' && txRef) {
      setPaymentStatus('success');
      // Verify payment with your backend
      verifyPayment(txRef);
    } else {
      setPaymentStatus('failed');
    }
  }, [searchParams]);

  const verifyPayment = async (txRef: string) => {
    try {
      // Verify payment with your backend
      const response = await fetch(`/api/payments/verify/${txRef}`);
      if (response.ok) {
        // Update user balance
        console.log('Payment verified successfully');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          {paymentStatus === 'success' ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">Your wallet has been topped up successfully.</p>
            </>
          ) : paymentStatus === 'failed' ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">Please try again or contact support.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
              <p className="text-gray-600 mb-6">Please wait while we verify your payment.</p>
            </>
          )}

          <button
            onClick={() => navigate('/balance')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;