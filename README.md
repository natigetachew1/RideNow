# RideNow - Bike and Scooter Rental Platform

RideNow is a modern bike and scooter rental platform that connects vehicle owners with renters. The platform features user authentication, vehicle management, payment processing, and real-time location tracking.

## Features

- **User Authentication**
  - User registration and login
  - Role-based access control (Admin, Vehicle Owner, Renter)
  - JWT-based authentication
  - KYC verification for vehicle owners

- **Vehicle Management**
  - List and manage vehicles for rent
  - Real-time vehicle tracking
  - Vehicle availability and status updates
  - Search and filter vehicles by location and type

- **Booking System**
  - Real-time booking management
  - Trip history and tracking
  - Booking status updates

- **Payments**
  - Secure payment processing with Chapa
  - Wallet system for users
  - Transaction history

- **Admin Dashboard**
  - User management
  - Vehicle approval system
  - Analytics and reporting

## 🏗️ Tech Stack

### Frontend
- React 19 with TypeScript
- React Router for navigation
- TailwindCSS for styling
- React Leaflet for maps
- Axios for API requests
- React Hook Form for form handling

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Chapa payment integration

### Face Verification (KYC)
- Python with Django
- Face recognition for identity verification
- Document verification

## 🛠️ Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB
- Python (for face verification)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CHAPA_SECRET_KEY=your_chapa_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_CHAPA_PUBLIC_KEY=your_chapa_public_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Face Verification Setup

1. Navigate to the face_verification directory:
   ```bash
   cd face_verification
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

## 🌐 API Documentation

The API documentation is available at `/api-docs` when the backend server is running.

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CHAPA_SECRET_KEY=your_chapa_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_CHAPA_PUBLIC_KEY=your_chapa_public_key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- [Daniel Abera](https://github.com/dani-dina) (dani-dina)
- [Natnael Getachew](https://github.com/natigetachew1)
- [Abiyu Misganaw](https://github.com/Abiyu-Dev) (Abiyu_Misganaw)
- [Z3r0](https://github.com/0bskuru5) (0bskuru5)

## 🏆 Hackathon

This project was developed during the 24-hour BiT Hackathon at BiTEC (Business Incubation and Techno-Entrepreneurship Center) of Bahir Dar Institute of Technology (BiT).

## 🙏 Acknowledgments

- All contributors who have helped shape this project
- Open source libraries and tools used in this project
