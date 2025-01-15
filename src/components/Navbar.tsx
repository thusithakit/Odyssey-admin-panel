import React from 'react'
import { logout } from '../auth/auth';
import { useNavigate } from 'react-router-dom';
interface UserDetails {
    user: {
        id: string;
        username: string;
        role: string;
    }
}

function Navbar({ user }: UserDetails) {
    const navigate = useNavigate();
    function handleLogout() {
        logout();
        navigate('/login');
    }
    return (
        <nav className="navbar" role="navigation">
            <div className="container flex justify-between items-center p-5">
                <h1 className='text-blue-700 font-bold text-3xl'>ODYSSEY</h1>
                <div className="flex justify-items-end relative items-center gap-5">
                    <h2 className='w-full text-xl font-medium'>Welcome {user.username}!</h2>
                    <button className='logout mt-0' onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
