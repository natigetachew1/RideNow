import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface Location {
  id: number;
  name: string;
  type: string;
  price: number;
  status: Status;
  position: [number, number];
}

const locations: Location[] = [
  {
    id: 1,
    name: 'Electric Bike #123',
    type: 'Electric Bike',
    price: 50,
    status: 'available',
    position: [11.6000, 37.3833],  // Bahir Dar coordinates
  },
  {
    id: 2,
    name: 'Mountain Bike #456',
    type: 'Mountain Bike',
    price: 40,
    status: 'inUse',
    position: [11.6100, 37.3933],  // Near Bahir Dar
  },
  {
    id: 3,
    name: 'Scooter #789',
    type: 'Electric Scooter',
    price: 35,
    status: 'maintenance',
    position: [11.5900, 37.3733],  // Near Bahir Dar
  },
];

const statusIcons: Record<Status, Icon> = {
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
  available: { text: 'Available', color: 'text-green-600' },
  inUse: { text: 'In Use', color: 'text-red-600' },
  maintenance: { text: 'Maintenance', color: 'text-orange-600' },
};

const MapPage: React.FC = () => {
  // Bahir Dar coordinates
  const centerPosition: [number, number] = [11.6000, 37.3833];
  const zoomLevel = 13;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navigation bar at the top */}
      <div className="bg-white shadow-sm border-b z-10">
        <Navigation />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col p-4">
        {/* Map container with fixed height */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ height: '60vh' }}>
          <MapContainer
            center={centerPosition}
            zoom={zoomLevel}
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
            
            {locations.map((location) => (
              <Marker 
                key={location.id} 
                position={location.position}
                icon={statusIcons[location.status]}
              >
                <Popup>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm">{location.type}</p>
                    <p className="text-sm font-medium">{location.price} ETB/hr</p>
                    <p className={`text-sm ${statusInfo[location.status].color} font-medium`}>
                      {statusInfo[location.status].text}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Bike list */}
        <div className="mt-4 p-4 bg-white rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Available Bikes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {locations.map((bike) => (
              <div key={bike.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    bike.status === 'available' ? 'bg-green-500' : 
                    bike.status === 'inUse' ? 'bg-red-500' : 'bg-orange-500'
                  }`} />
                  <div>
                    <h3 className="font-medium">{bike.name}</h3>
                    <p className="text-sm text-gray-600">{bike.type} • {bike.price} ETB/hr</p>
                    <span className={`text-xs font-medium ${statusInfo[bike.status].color}`}>
                      {statusInfo[bike.status].text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage; 