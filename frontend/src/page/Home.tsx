import { useNavigate } from 'react-router-dom';
import Button from '../component/Button';

const Home = () => {
    const navigate = useNavigate();
    
    return(
        <div className='w-full h-screen flex flex-col items-center justify-between bg-gradient-to-b from-white to-blue-50'>
            {/* Header Section */}
            <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 h-1/3 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-white text-center">Welcome to<br/>Your App</h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full h-1/3 flex items-center justify-center px-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-gray-800">Get Started</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Join thousands of users who are already using our platform to achieve their goals.
                    </p>
                </div>
            </div>

            {/* Button Section */}
            <div className="w-full h-1/3 flex items-center justify-center px-8 pb-8">
                <div className="w-full max-w-md space-y-4">
                    <Button 
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        btnTex="Get Started"
                        onClick={() => navigate('/signup')}
                    />
                    <Button 
                        className="w-full h-14 border-2 border-blue-500 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md"
                        btnTex="Log in"
                        onClick={() => navigate('/login')}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;