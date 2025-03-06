import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { login } from '../auth/auth';
import api from '../api/api';

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);

    const getCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token, userId } = await login(credentials.username, credentials.password); // Call the login function
            localStorage.setItem('authToken', token); // Save the token
            localStorage.setItem('userId', userId);
            getUserType(userId);
            // navigate('/'); // Redirect to the dashboard
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };
    const getUserType = async (userId: string) => {
        try {
            const response = await api.get(`/api/users/${userId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('authToken')}` } });
            const userType = response.data.role;
            if (userType === 'SUPER_ADMIN' || userType === 'ADMIN') {
                navigate('/');
            }
            else {
                setError('You are not authorized to login. Please Login with Admin Credentials');
            }
        } catch (err: any) {
            console.log(err);
        }
    }

    return (
        <div className='container flex flex-col align-middle justify-center gap-10 w-[600px]'>
            <div className="img-sec w-full flex flex-col  justify-center content-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-[10px] p-10">
                <h2 className='relative text-center font-bold text-3xl text-white'>Login</h2>
            </div>
            <div className='relative w-full'>
                <div className='relative grid gap-[10px] mb-[30px]'>
                    <label htmlFor="username" className='font-semibold text-xl'>Username</label>
                    <input type="text" name="username" id="username" placeholder='Enter Your Username' value={credentials.username} onChange={(e) => getCredentials(e)} />
                </div>
                <div>
                    <label htmlFor="password" className='font-semibold text-xl'>Password</label>
                    <input type="password" name="password" id="password" placeholder='Enter Your Password' value={credentials.password} onChange={(e) => getCredentials(e)} />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button onClick={handleLogin}>Log In</button>
            </div>
        </div>
    );
}

export default Login
