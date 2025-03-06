import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import ListItem from '../components/ListItem';
import ConfirmationModal from '../modals/ConfirmationModal';
import Loader from '../components/Loader';


function ListView() {
    const navigate = useNavigate();
    const { apiName } = useParams<{ apiName: string }>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [id, setId] = useState('');
    const tokenStr = localStorage.getItem('authToken');
    const apiEndPoints: { [key: string]: string } = {
        hotels: '/api/hotels/getAllHotels',
        restaurants: '/api/restaurant/getAllRestaurant',
        users: '/api/users/getAllUsers',
        tours: '/api/tours/getAllTours'
    };
    const deleteApiEndPoints: { [key: string]: string } = {
        hotels: '/api/hotels/deleteHotel/',
        restaurants: '/api/restaurant/deleteRestaurant/',
        users: '/api/users/',
        tours: '/api/tours/deleteTour/'
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            if (apiName && apiEndPoints[apiName]) {
                const response = await api.get(apiEndPoints[apiName], { headers: { "Authorization": `Bearer ${tokenStr}` } });
                if (apiName === 'users') {
                    const filteredData = response.data.filter((user: any) => user.role !== 'SUPER_ADMIN');
                    setData(filteredData.filter((user: any) => user.id !== localStorage.getItem('userId')));
                } else {
                    setData(response.data);
                }
            } else {
                console.log('Invalid API name');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    async function handleDelete(id: string) {
        try {
            if (apiName && apiEndPoints[apiName]) {
                await api.delete(`${deleteApiEndPoints[apiName]}${id}`, { headers: { "Authorization": `Bearer ${tokenStr}` } });
                const newData = [...data];
                newData.splice(newData.findIndex((item: any) => item.id === id), 1);
                setData(newData);
                setModal(false);
            } else {
                console.log('Invalid API name');
            }

        } catch (error) {
            console.log(error);
        }
    }
    function handleEdit(id: string) {
        navigate(`/edit/${apiName}/${id}`);
    }
    useEffect(() => {
        fetchData();
    }, [apiName]);
    function handleModalOpen(id: string): void {
        setId(id);
        setModal(true);
    }

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className="title-sec">
                        <h2 className='title'>View {apiName}</h2>
                        <button onClick={() => navigate(`/add/${apiName}`)}>Add {apiName}</button>
                    </div>
                    <div className='list-set'>
                        {data.map((item, index) => (
                            <ListItem key={index} item={item} apiName={apiName || ''} handleModalOpen={(id) => handleModalOpen(id)} handleEdit={(id) => handleEdit(id)} />
                        ))}
                    </div>
                    <ConfirmationModal modal={modal} handleDelete={(id) => handleDelete(id)} id={id} setModal={setModal} />
                </div>
            )}
        </div>
    )
}

export default ListView
