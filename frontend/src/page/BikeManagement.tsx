import { useState } from 'react';
import { PencilIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Bike {
  id: string;
  ownerName: string;
  bikeName: string;
  pricePerHour: number;
  status: 'active' | 'unverified';
  lastRented: string;
  totalRides: number;
  rating: number;
}

interface EditBikeModalProps {
  bike: Bike | null;
  onClose: () => void;
  onSave: (updatedBike: Bike) => void;
}

const EditBikeModal = ({ bike, onClose, onSave }: EditBikeModalProps) => {
  const [formData, setFormData] = useState<Omit<Bike, 'id' | 'status' | 'totalRides' | 'rating'>>(
    bike || {
      ownerName: '',
      bikeName: '',
      pricePerHour: 0,
      lastRented: new Date().toISOString().split('T')[0],
    }
  );

  if (!bike) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: bike.id, status: bike.status, totalRides: bike.totalRides, rating: bike.rating });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Edit Bike Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bike Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.bikeName}
              onChange={(e) => setFormData({ ...formData, bikeName: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full p-2 border rounded"
              value={formData.pricePerHour}
              onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BikeManagement = () => {
  // Mock data
  const [bikes, setBikes] = useState<Bike[]>([
    {
      id: '1',
      ownerName: 'John Doe',
      bikeName: 'Honda CBR 600RR',
      pricePerHour: 25.99,
      status: 'active',
      lastRented: '2025-10-30',
      totalRides: 12,
      rating: 4.8,
    },
    {
      id: '2',
      ownerName: 'Sarah Smith',
      bikeName: 'Yamaha MT-07',
      pricePerHour: 22.5,
      status: 'unverified',
      lastRented: '2025-10-28',
      totalRides: 8,
      rating: 3.2,
    },
    {
      id: '3',
      ownerName: 'Mike Johnson',
      bikeName: 'Kawasaki Ninja 400',
      pricePerHour: 20.0,
      status: 'active',
      lastRented: '2025-11-01',
      totalRides: 15,
      rating: 4.9,
    },
  ]);

  const [editingBike, setEditingBike] = useState<Bike | null>(null);

  const toggleVerification = (id: string) => {
    setBikes(bikes.map(bike => 
      bike.id === id 
        ? { ...bike, status: bike.status === 'active' ? 'unverified' : 'active' } 
        : bike
    ));
  };

  const handleSaveBike = (updatedBike: Bike) => {
    setBikes(bikes.map(bike => bike.id === updatedBike.id ? updatedBike : bike));
    setEditingBike(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bike Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bikes..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bike Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Hour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Rented
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bikes.map((bike) => (
                <tr key={bike.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{bike.ownerName}</div>
                    <div className="text-sm text-gray-500">{bike.totalRides} rides • ⭐ {bike.rating}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{bike.bikeName}</div>
                    <div className="text-sm text-gray-500">ID: {bike.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${bike.pricePerHour.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bike.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bike.status.charAt(0).toUpperCase() + bike.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bike.lastRented).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingBike(bike)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit bike"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleVerification(bike.id)}
                        className={bike.status === 'active' 
                          ? "text-yellow-600 hover:text-yellow-900" 
                          : "text-green-600 hover:text-green-900"}
                        title={bike.status === 'active' ? 'Mark as Unverified' : 'Mark as Active'}
                      >
                        {bike.status === 'active' ? (
                          <XCircleIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingBike && (
        <EditBikeModal
          bike={editingBike}
          onClose={() => setEditingBike(null)}
          onSave={handleSaveBike}
        />
      )}
    </div>
  );
};

export default BikeManagement;
