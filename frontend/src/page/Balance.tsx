import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../component/Navigation';

const Balance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit');
  const fixedDepositAmount = 100; // Fixed deposit amount in ETB
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        description: 'Wallet top-up for posting ads'
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
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to process the payment
      console.log('Processing deposit of', fixedDepositAmount, 'ETB');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After successful payment, update the balance
      setBalance(prev => prev + fixedDepositAmount);
      alert('Deposit successful!');
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navigation />
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
          <div className="w-8"></div> {/* For spacing */}
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
            
            <div className="mb-6">
              <div className="text-center py-6">
                <p className="text-3xl font-bold text-gray-900">{fixedDepositAmount} ETB</p>
                <p className="text-sm text-gray-500 mt-1">Fixed deposit amount</p>
              </div>
            </div>

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
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Processing...' : `Deposit ${fixedDepositAmount} ETB`}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Your Earnings</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">How it works</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        You receive payments directly from renters in person. This section shows your rental history and any deposits made to post ads.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-xl font-bold">{formatCurrency(earnings)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(balance)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3">Transaction History</h3>
                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-start p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                              tx.type === 'rental' ? 'bg-green-50' : 'bg-blue-50'
                            }`}>
                              {tx.type === 'rental' ? (
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {tx.type === 'rental' ? 'Rental Payment' : 'Wallet Deposit'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{tx.description || 'Transaction'}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(tx.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              tx.type === 'rental' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {tx.type === 'rental' ? '+' : ''}{formatCurrency(tx.amount)}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Your {activeTab} history will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-3">Payment Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                All rental payments are handled in person with your clients. The wallet balance is only used for posting and maintaining your listings.
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                <p className="font-medium">Important:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Always confirm payment before releasing your bike/scooter</li>
                  <li>Use the app's messaging system for communication</li>
                  <li>Report any payment issues to support immediately</li>
                </ul>
              </div>
              <button className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;
