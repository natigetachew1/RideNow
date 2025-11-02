import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./page/Home";
import Signup from './page/Signup';
import Login from './page/Login';
import KYCVerification from './page/KYCVerification';
import Dashboard from './page/Dashboard';

function App() {
  return (
    <Router>
      <div className="w-full h-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/kyc-verification" element={<KYCVerification />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
