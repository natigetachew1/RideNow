import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navigation from '../component/Navigation';

// Fix for default marker icons not showing
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
// @ts-ignore
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Status = 'available' | 'inUse' | 'maintenance';

interface Vehicle {
  _id: string;
  name: string;
  vehicleType: string;
  model: string;
  pricePerHour: number;
  status: 'forRent' | 'forDelivery' | 'available';
  location: {
    lat: number;
    lng: number;
  };
  description?: string;
}

interface LocationResponse {
  lat: number;
  lng: number;
}

const statusIcons: Record<string, Icon> = {
  forRent: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  forDelivery: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  available: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  inUse: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  maintenance: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

const statusInfo = {
  forRent: { text: 'Available for Rent', color: 'text-green-600', badge: 'bg-green-100 text-green-800' },
  forDelivery: { text: 'Available for Delivery', color: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
  available: { text: 'Available', color: 'text-green-600', badge: 'bg-green-100 text-green-800' },
  inUse: { text: 'In Use', color: 'text-red-600', badge: 'bg-red-100 text-red-800' },
  maintenance: { text: 'Maintenance', color: 'text-orange-600', badge: 'bg-orange-100 text-orange-800' },
};

// Component to update map center when user location changes
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

const MapPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingVehicles, setFetchingVehicles] = useState(false);

  // Default fallback location (Bahir Dar)
  const defaultPosition: [number, number] = [11.6000, 37.3833];

  // Fetch vehicles from backend based on user location
  const fetchVehiclesNearby = async (lat: number, lng: number) => {
    try {
      setFetchingVehicles(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          radius: 10, // radius in kilometers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load nearby vehicles');
    } finally {
      setFetchingVehicles(false);
    }
  };

  // Alternative: Fetch all vehicles and filter by distance (if no nearby endpoint)
  const fetchAllVehicles = async () => {
    try {
      setFetchingVehicles(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/locations', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles');
    } finally {
      setFetchingVehicles(false);
    }
  };

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setUserLocation(defaultPosition);
      setLoading(false);
      // Fetch vehicles for default location
      fetchAllVehicles();
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const userPos: [number, number] = [latitude, longitude];
        
        setUserLocation(userPos);
        setError(null);
        
        // Fetch vehicles near user location
        await fetchVehiclesNearby(latitude, longitude);
        setLoading(false);
      },
      async (err) => {
        console.error('Error getting location:', err);
        setError('Unable to retrieve your location. Using default location.');
        setUserLocation(defaultPosition);
        
        // Fetch vehicles for default location
        await fetchAllVehicles();
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Function to refresh location and vehicles
  const refreshLocation = async () => {
    if (!navigator.geolocation) return;

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const userPos: [number, number] = [latitude, longitude];
        
        setUserLocation(userPos);
        setError(null);
        
        // Fetch vehicles near new location
        await fetchVehiclesNearby(latitude, longitude);
        setLoading(false);
      },
      async (err) => {
        setError('Failed to refresh location');
        await fetchAllVehicles();
        setLoading(false);
      }
    );
  };

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter vehicles by distance from user (if needed)
  const getNearbyVehicles = (vehicles: Vehicle[], userLat: number, userLng: number, maxDistance: number = 10) => {
    return vehicles.filter(vehicle => 
      calculateDistance(userLat, userLng, vehicle.location.lat, vehicle.location.lng) <= maxDistance
    );
  };

  const availableVehicles = vehicles.filter(vehicle => 
    vehicle.status === 'forRent' || vehicle.status === 'forDelivery' || vehicle.status === 'available'
  );

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b z-10">
          <Navigation />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Getting your location and vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navigation bar at the top */}
      <div className="bg-white shadow-sm border-b z-10">
        <Navigation />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col p-4">
        {/* Location status and controls */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Find Vehicles Near You</h1>
            {error && (
              <p className="text-orange-600 text-sm mt-1">{error}</p>
            )}
            {userLocation && (
              <p className="text-gray-600 text-sm">
                Your location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refreshLocation}
              disabled={loading || fetchingVehicles}
              className="btn-primary text-sm px-3 py-2 disabled:opacity-50"
            >
              {fetchingVehicles ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Map container with fixed height */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4" style={{ height: '60vh' }}>
          <MapContainer
            center={userLocation || defaultPosition}
            zoom={13}
            style={{ 
              width: '100%',
              height: '100%'
            }}
            className="map-container"
            maxZoom={18}
            minZoom={12}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User location marker */}
            {userLocation && (
              <Marker 
                position={userLocation}
                icon={new Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                })}
              >
                <Popup>
                  <div className="text-center">
                    <strong>You are here</strong>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Vehicle markers */}
            {vehicles.map((vehicle) => (
              <Marker 
                key={vehicle._id} 
                position={[vehicle.location.lat, vehicle.location.lng]}
                icon={statusIcons[vehicle.status] || statusIcons.available}
              >
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Type:</span>
                        <p>{vehicle.vehicleType}</p>
                      </div>
                      <div>
                        <span className="font-medium">Model:</span>
                        <p>{vehicle.model}</p>
                      </div>
                      <div>
                        <span className="font-medium">Price:</span>
                        <p>{vehicle.pricePerHour} ETB/hr</p>
                      </div>
                    </div>
                    {vehicle.description && (
                      <p className="text-sm text-gray-600">{vehicle.description}</p>
                    )}
                    <div className={`text-xs px-2 py-1 rounded-full ${statusInfo[vehicle.status]?.badge || statusInfo.available.badge}`}>
                      {statusInfo[vehicle.status]?.text || 'Available'}
                    </div>
                    <button className="w-full btn-primary text-sm py-2">
                      Book Now
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Update map center when user location changes */}
            {userLocation && <MapUpdater center={userLocation} />}
          </MapContainer>
        </div>

        {/* Vehicle list */}
        <div className="p-4 bg-white rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Available Vehicles</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {availableVehicles.length} available
              </span>
              {fetchingVehicles && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              )}
            </div>
          </div>
          
          {availableVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableVehicles.map((vehicle) => (
                <div key={vehicle._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                        vehicle.status === 'forRent' || vehicle.status === 'available' ? 'bg-green-500' :
                        vehicle.status === 'forDelivery' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{vehicle.vehicleType} • {vehicle.model}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm font-medium text-primary-600">
                            {vehicle.pricePerHour} ETB/hr
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            statusInfo[vehicle.status]?.badge || 'bg-gray-100 text-gray-800'
                          }`}>
                            {statusInfo[vehicle.status]?.text || vehicle.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-3 btn-primary text-sm py-2">
                    Reserve Vehicle
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {fetchingVehicles ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span>Loading vehicles...</span>
                </div>
              ) : (
                'No available vehicles in your area. Try refreshing your location.'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;