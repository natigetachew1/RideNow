import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../component/Navigation';

interface BikeAd {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  available: boolean;
}

const Rent = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [bikes, setBikes] = useState<BikeAd[]>([]);

  // Sample bike data - replace with your actual data fetching logic
  useEffect(() => {
    // Example: Fetch bikes from an API
    // fetch('/api/bikes')
    //   .then(res => res.json())
    //   .then(data => setBikes(data));
    
    // Sample data for demonstration
    setBikes([
      {
        id: 1,
        title: 'Mountain Bike Pro',
        description: 'Perfect for off-road adventures',
        price: 25,
        location: 'Bahir Dar',
        image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        rating: 4.8,
        reviews: 124,
        available: true
      },
      {
        id: 2,
        title: 'City Commuter',
        description: 'Lightweight and fast for city rides',
        price: 15,
        location: 'Bahir Dar',
        image: 'https://images.unsplash.com/photo-1507030587104-dc22f3486b74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        rating: 4.5,
        reviews: 89,
        available: true
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Bikes</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            List Your Bike
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike) => (
            <div key={bike.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img 
                src={bike.image} 
                alt={bike.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{bike.title}</h2>
                <p className="text-gray-600">{bike.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold">ETB {bike.price}/hr</span>
                  <span className="text-sm text-gray-500">{bike.location}</span>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600">
                    {bike.rating} ({bike.reviews} reviews)
                  </span>
                </div>
                <button
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  disabled={!bike.available}
                >
                  {bike.available ? 'Rent Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">List Your Bike</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bike Title</label>
                  <input 
                    type="text" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    placeholder="e.g., Mountain Bike Pro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    rows={3}
                    placeholder="Describe your bike..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per hour (ETB)</label>
                  <input 
                    type="number" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    placeholder="e.g., 25"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    List Bike
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Rent;