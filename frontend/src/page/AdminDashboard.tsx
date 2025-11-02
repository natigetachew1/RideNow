import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface RentalData {
  id: number;
  date: string;
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  vehicle: string;
  user: string;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}


const mockRentals: RentalData[] = [
  { id: 1, date: '2025-11-01', amount: 75, status: 'active', vehicle: 'Tesla Model 3', user: 'John Doe' },
  { id: 2, date: '2025-10-30', amount: 120, status: 'completed', vehicle: 'BMW i8', user: 'Jane Smith' },
  { id: 3, date: '2025-10-28', amount: 90, status: 'completed', vehicle: 'Audi e-tron', user: 'Mike Johnson' },
  { id: 4, date: '2025-10-25', amount: 110, status: 'completed', vehicle: 'Porsche Taycan', user: 'Sarah Williams' },
  { id: 5, date: '2025-10-20', amount: 85, status: 'completed', vehicle: 'Nissan Leaf', user: 'David Brown' },
];

const monthlyEarnings = [
  { month: 'Jul', earnings: 4500 },
  { month: 'Aug', earnings: 5200 },
  { month: 'Sep', earnings: 4800 },
  { month: 'Oct', earnings: 6100 },
  { month: 'Nov', earnings: 7300 },
];

const dailyRentals = [
  { day: 'Mon', rentals: 12 },
  { day: 'Tue', rentals: 19 },
  { day: 'Wed', rentals: 15 },
  { day: 'Thu', rentals: 24 },
  { day: 'Fri', rentals: 18 },
  { day: 'Sat', rentals: 22 },
  { day: 'Sun', rentals: 17 },
];

const StatsCard = ({ title, value, icon, trend, trendValue }: StatsCardProps) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
    ),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${trendColors[trend]} bg-opacity-20 ${trendColors[trend].replace('text-', 'bg-')}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <span className={`text-sm font-medium ${trendColors[trend]} flex items-center`}>
          {trendIcons[trend]}
          <span className="ml-1">{trendValue}</span>
        </span>
        <span className="text-xs text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeRentals] = useState(mockRentals.filter(rental => rental.status === 'active'));
  const [completedRentals] = useState(mockRentals.filter(rental => rental.status === 'completed'));
  const [totalEarnings] = useState(
    mockRentals
      .filter(rental => rental.status === 'completed')
      .reduce((sum, rental) => sum + rental.amount, 0)
  );

  const totalCommission = totalEarnings * 0.2;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Active Rentals"
            value={activeRentals.length}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            trend="up"
            trendValue="12%"
          />
          
          <StatsCard
            title="Completed Rentals"
            value={completedRentals.length}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            trend="up"
            trendValue="8%"
          />
          
          <StatsCard
            title="Total Earnings (Commission)"
            value={`$${totalCommission.toFixed(2)}`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            trend="up"
            trendValue="15%"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Earnings</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={2} name="Earnings ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Rentals (This Week)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRentals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rentals" fill="#3b82f6" name="Rentals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Rentals Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Rentals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{rental.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(rental.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.vehicle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rental.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${rental.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rental.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : rental.status === 'completed' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
