import React, { useState } from 'react'
import api from '../api/api';
import Loader from '../components/Loader';

interface User {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
    address: string
}

function AddUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<User>({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "REGULAR_USER",
        address: ""
    });
    const tokenStr = localStorage.getItem('authToken');
    const addUser = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    const selectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData({ ...data, role: e.target.value });
    };

    const addDetails = async () => {
        setLoading(true);
        try {
            if (data.username === "" || data.firstName === "" || data.lastName === "" || data.email === "" || data.password === "") {
                alert('Please fill all the fields');
                return;
            }
            await api.post(`/api/users/register`, data, { headers: { "Authorization": `Bearer ${tokenStr}` } });
        } catch (error) {
            console.log(error);
            if ((error as any).status === 409) {
                setError('Username already exists');
            }
        } finally {
            setData({
                username: "",
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "REGULAR_USER",
                address: ""
            })
            setLoading(false);
        }
    }
    return (
        <div>
            {loading ? <Loader /> : (
                <div className='main-container'>
                    <h1>Add a New User</h1>
                    <div className='form-group'>
                        <div className="form-grid">
                            <div className='form-item'>
                                <label htmlFor='firstName'>First Name</label>
                                <input type='text' id='firstName' name='firstName' value={data.firstName} onChange={(e) => addUser(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='lastName'>Last Name</label>
                                <input type='text' id='lastName' name='lastName' value={data.lastName} onChange={(e) => addUser(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='username'>Username</label>
                                <input type='text' id='username' name='username' value={data.username} onChange={(e) => addUser(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='email'>Email</label>
                                <input type='email' id='email' name='email' value={data.email} onChange={(e) => addUser(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='password'>Password</label>
                                <input type='password' id='password' name='password' value={data.password} onChange={(e) => addUser(e)} />
                            </div>
                        </div>
                        <div className="form-item">
                            <label htmlFor="role">Select User Role</label>
                            <select name="role" id="role" value={data.role} onChange={selectUser}>
                                <option value="ADMIN">Admin</option>
                                <option value="REGULAR_USER">Regular User</option>
                            </select>
                        </div>
                        <div className="form-item">
                            <label htmlFor="address">Address</label>
                            <textarea name="address" id="address" value={data.address} onChange={(e) => addUser(e)}></textarea>
                        </div>
                        {error && <div className='error'>{error}</div>}
                        <button onClick={addDetails}>Add New User</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddUser
