import { useNavigate } from 'react-router-dom';
import Button from '../component/Button';

const Home = () => {
    const navigate = useNavigate();
    return(
        <div className='w-full h-[100vh] flex flex-col items-center justify-between'>
            <div className="w-full bg-red-300 h-[33%] flex items-center justify-center" >
                <div className="w-[20vh] h-[40vw] bg-white rounded-[50%] " >
                    
                </div>
            </div>
            <div className="w-full bg-green-300 h-[33%]">

            </div>
            <div className="w-full h-[33%] flex items-center justify-center ">
                <div className="w-full h-[70%] flex flex-col items-center justify-around" >
                <Button 
                    className="w-[80%] h-15 bg-blue-600 text-blue-400 text-center rounded-md text-white py-4 "
                    btnTex="Get Started"
                    onClick={() => navigate('/signup')}
                />
                <Button 
                    className="w-[80%] h-15 border border-blue-400 text-center rounded-md text-blue-600 py-4"
                    btnTex="Log in"
                />
                </div>

            </div>
        </div>
    );
}

export default Home;