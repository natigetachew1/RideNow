import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../component/Navigation';

const Balance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Chapa configuration
  const CHAPA_PUBLIC_KEY = 'CHAPUBK_TEST-xxxxxxxxx'; // Replace with your actual public key
  const CHAPA_BASE_URL = 'https://api.chapa.co/v1'; // Chapa API base URL

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Fetch user balance and transactions
    setBalance(1250);
    setEarnings(3560);
    setTransactions([
      { 
        id: 1, 
        type: 'deposit', 
        amount: 500, 
        date: '2023-11-02', 
        status: 'completed',
        description: 'Wallet top-up via Chapa'
      },
      { 
        id: 2, 
        type: 'rental', 
        amount: 120, 
        date: '2023-11-01', 
        status: 'completed',
        description: 'Received from rental #RID123'
      },
    ]);
  }, []);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount < 10) {
      alert('Please enter a valid amount (minimum 10 ETB)');
      return;
    }

    if (amount > 50000) {
      alert('Maximum deposit amount is 50,000 ETB');
      return;
    }

    setShowPayment(true);
  };

  const processChapaPayment = async () => {
    setIsLoading(true);
    
    try {
      const amount = parseFloat(depositAmount);
      const txRef = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize Chapa payment
      const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CHAPA_PUBLIC_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount.toString(),
          currency: 'ETB',
          email: 'user@example.com', // You should get this from user profile
          first_name: 'User', // You should get this from user profile
          last_name: 'Name', // You should get this from user profile
          tx_ref: txRef,
          callback_url: `${window.location.origin}/payment-success`,
          return_url: `${window.location.origin}/payment-success`,
          customization: {
            title: 'RideShare Wallet Deposit',
            description: `Deposit ${amount} ETB to your wallet`,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }

      const paymentData = await response.json();
      
      // Redirect to Chapa checkout page
      if (paymentData.data && paymentData.data.checkout_url) {
        window.location.href = paymentData.data.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Alternative: Using Chapa's React component (if available) or direct form submission
  const handleChapaPayment = async () => {
    setIsLoading(true);
    
    try {
      const amount = parseFloat(depositAmount);
      const txRef = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create payment form data
      const formData = new FormData();
      formData.append('public_key', CHAPA_PUBLIC_KEY);
      formData.append('amount', amount.toString());
      formData.append('currency', 'ETB');
      formData.append('email', 'user@example.com'); // Get from user profile
      formData.append('first_name', 'User'); // Get from user profile
      formData.append('last_name', 'Name'); // Get from user profile
      formData.append('tx_ref', txRef);
      formData.append('callback_url', `${window.location.origin}/payment-success`);
      formData.append('return_url', `${window.location.origin}/payment-success`);
      formData.append('title', 'RideShare Wallet Deposit');
      formData.append('description', `Deposit ${amount} ETB to wallet`);

      // For direct form submission approach
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://api.chapa.co/v1/checkout';
      
      Object.entries({
        public_key: CHAPA_PUBLIC_KEY,
        amount: amount.toString(),
        currency: 'ETB',
        email: 'user@example.com',
        first_name: 'User',
        last_name: 'Name',
        tx_ref: txRef,
        callback_url: `${window.location.origin}/payment-success`,
        return_url: `${window.location.origin}/payment-success`,
        title: 'RideShare Wallet Deposit',
        description: `Deposit ${amount} ETB to wallet`,
      }).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Confirm Payment</h3>
          <button 
            onClick={() => setShowPayment(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-900">{formatCurrency(parseFloat(depositAmount))}</h4>
          <p className="text-gray-600 mt-2">Wallet Deposit via Chapa</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-800">Payment Method</span>
            <span className="font-medium text-blue-900">Chapa</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-blue-800">Transaction Fee</span>
            <span className="text-blue-900">Included</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={processChapaPayment}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : `Pay ${formatCurrency(parseFloat(depositAmount))}`}
          </button>
          
          <button
            onClick={handleChapaPayment}
            disabled={isLoading}
            className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-xl font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Alternative Payment Method
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You will be redirected to Chapa to complete your payment securely
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navigation />
      
      {/* Payment Modal */}
      {showPayment && <PaymentModal />}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">My Wallet</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm text-blue-100 mb-1">Available Balance</p>
          <p className="text-3xl font-bold mb-6">{formatCurrency(balance)}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-blue-100">Total Earnings</p>
              <p className="font-medium">{formatCurrency(earnings)}</p>
            </div>
            <button 
              onClick={() => setActiveTab('deposit')}
              className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Add Money
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              activeTab === 'deposit' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
              activeTab === 'history' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Transaction History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4">
        {activeTab === 'deposit' ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Add Money to Wallet</h2>
            
            {/* Amount Input */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount (ETB)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  ETB
                </span>
                <input
                  type="number"
                  id="amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  min="10"
                  max="50000"
                  step="1"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimum: 10 ETB, Maximum: 50,000 ETB
              </p>
            </div>

            {/* Quick Amounts */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Quick Select</p>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDepositAmount(amount.toString())}
                    className={`py-3 px-4 border rounded-xl text-sm font-medium transition-colors ${
                      depositAmount === amount.toString()
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {amount} ETB
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h3 className="font-medium text-sm text-blue-800 mb-2">Payment Method</h3>
              <div className="flex items-center p-3 bg-white rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Chapa Payment</h4>
                  <p className="text-xs text-gray-500">Secure payment with Chapa</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeposit}
              disabled={!depositAmount || parseFloat(depositAmount) < 10 || isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Processing...' : `Deposit ${depositAmount ? formatCurrency(parseFloat(depositAmount)) : ''}`}
            </button>
          </div>
        ) : (
          // ... (keep the existing history tab content)
          <div className="space-y-4">
            {/* Existing history tab content remains the same */}
            {/* ... */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;