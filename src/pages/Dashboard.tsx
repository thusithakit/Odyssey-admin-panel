import React, { useEffect, useState } from 'react'
import { logout } from '../auth/auth'
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';
import CountCard from '../components/CountCard';
import Loader from '../components/Loader';

interface UserDetails {
    id: string;
    username: string;
    role: string;
}

function Dashboard() {
    // const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [resturents, setResturents] = useState([]);
    const [users, setUsers] = useState([]);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const getHotels = async (tokenStr: String) => {
        try {
            setLoading(true)
            const response = await api.get(`/api/hotels/getAllHotels`, { headers: { "Authorization": `Bearer ${tokenStr}` } });
            setHotels(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const getResturents = async (tokenStr: String) => {
        try {
            setLoading(true)
            const response = await api.get(`/api/restaurant/getAllRestaurant`, { headers: { "Authorization": `Bearer ${tokenStr}` } });
            setResturents(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const getUsers = async (tokenStr: String) => {
        try {
            setLoading(true)
            const response = await api.get(`/api/users/getAllUsers`, { headers: { "Authorization": `Bearer ${tokenStr}` } });
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const getTours = async (tokenStr: String) => {
        try {
            setLoading(true)
            const response = await api.get(`/api/tours/getAllTours`, { headers: { "Authorization": `Bearer ${tokenStr}` } });
            setTours(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const tokenStr = localStorage.getItem('authToken');
        if (userId && tokenStr) {
            getHotels(tokenStr);
            getResturents(tokenStr);
            getUsers(tokenStr);
            getTours(tokenStr);
        }
    }, [])

    return (
        <>
            <div className='dashboard'>
                <h1>Current Stats</h1>
                {loading ? <Loader /> : (
                    <div className="cards">
                        <CountCard title='Total Hotels' count={hotels.length} details={hotels} apiName='hotels' />
                        <CountCard title='Total Restaurants' count={resturents.length} details={resturents} apiName='restaurants' />
                        <CountCard title='Total Tours' count={tours.length} details={tours} apiName='tours' />
                        <CountCard title='Total Users' count={users.length} details={users} apiName='users' />
                    </div>
                )}
            </div>
        </>
    )
}

export default Dashboard
