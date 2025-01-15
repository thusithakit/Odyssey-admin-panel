import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router'
import api from '../api/api';

interface userProps {
    id: string;
    username: string;
    role: string;
}

function Layout() {
    const [user, setUser] = useState<userProps>({ id: '', username: '', role: '' });
    const tokenStr = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        const getUserDetails = async (userId: String, tokenStr: String) => {
            try {
                const response = await api.get(`/api/users/${userId}`, { headers: { "Authorization": `Bearer ${tokenStr}` } });
                setUser({ ...user, ...response.data });
            } catch (error) {
                console.log(error);
            }
        }
        if (userId && tokenStr) {
            getUserDetails(userId, tokenStr);
        }
    }, []);
    return (
        <>
            <Navbar user={user} />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout
