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
  const [bikeAds, setBikeAds] = useState<BikeAd[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image: ''
  });

  // Sample data - in a real app, this would come from an API
  useEffect(() => {
    const sampleAds: BikeAd[] = [
      {
        id: 1,
        title: 'Mountain Bike Pro',
        description: 'Perfect for off-road adventures. Well-maintained with new tires and brakes.',
        price: 450,
        location: 'Bole, Addis Ababa',
        image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        rating: 4.7,
        reviews: 24,
        available: true
      },
      {
        id: 2,
        title: 'City Cruiser',
        description: 'Comfortable ride for city commuting. Includes lock and helmet.',
        price: 300,
        location: 'Kazanchis, Addis Ababa',
        image: 'https://images.unsplash.com/photo-1507030584934-1b9e84df4de3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        rating: 4.5,
        reviews: 18,
        available: true
      },
      {
        id: 3,
        title: 'Electric Bike',
        description: 'Eco-friendly transportation with 50km range. Perfect for daily commutes.',
        price: 600,
        location: 'Megenagna, Addis Ababa',
        image: 'https://images.unsplash.com/photo-1558981806-1d6c1f04b5b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        rating: 4.8,
        reviews: 32,
        available: true
      }
    ];
    setBikeAds(sampleAds);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAd: BikeAd = {
      id: bikeAds.length + 1,
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      location: formData.location,
      image: formData.image || 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 0,
      reviews: 0,
      available: true
    };
    
    setBikeAds([newAd, ...bikeAds]);
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      image: ''
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Status Bar Area */}
      <div className="h-6 bg-white"></div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="font-bold text-gray-900 text-lg">Rent a Bike</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'View Listings' : 'Post Ad'}
          </button>
        </div>
      </header>

      <main className="px-4 py-4">
        {showForm ? (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Post Your Bike for Rent</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bike Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Mountain Bike Pro"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your bike and any important details"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB/day)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 450"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Bole, Addis Ababa"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/bike.jpg"
                  />
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Post Ad
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Available Bikes</h2>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Sort by: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {bikeAds.map((ad) => (
              <div key={ad.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-48 object-cover"
                  />
                  {!ad.available && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Rented Out
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded">
                    {ad.location}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                    <div className="text-lg font-bold text-blue-600">{ad.price} ETB<span className="text-xs font-normal text-gray-500">/day</span></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ad.description}</p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1">{ad.rating} ({ad.reviews})</span>
                    </div>
                    <button 
                      className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => navigate(`/bike/${ad.id}`)}
                    >
                      {ad.available ? 'Rent Now' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Navigation Footer */}
      <Navigation />
    </div>
  );
};

export default Rent;
