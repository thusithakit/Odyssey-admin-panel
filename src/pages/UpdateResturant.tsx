import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../api/api';
import axios from 'axios';
import Loader from '../components/Loader';

interface Resturant {
    title: string;
    location_city: string;
    location_country: string;
    location_map: string;
    description: string;
    image_url: string[];
    facilities: string[];
}

function UpdateResturant() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Resturant>({
        title: '',
        location_city: '',
        location_country: '',
        location_map: '',
        description: '',
        image_url: [],
        facilities: []
    });
    const tokenStr = localStorage.getItem('authToken');
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dgjwzufmf/image/upload';
    const UPLOAD_PRESET = 'odyssey';

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/restaurant/getRestaurantById/${id}`, { headers: { "Authorization": `Bearer ${tokenStr}` } });
            setData(response.data);
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, [id]);
    function updateRestaurantData(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    async function updateDetails() {
        setLoading(true);
        try {
            await api.put(`/api/restaurant/updateRestaurant/${id}`, data, { headers: { "Authorization": `Bearer ${tokenStr}` } });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            alert('Please select an image to upload.');
            return;
        }

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            setLoading(true);
            const response = await axios.post(CLOUDINARY_URL, formData);
            const image_url = response.data.secure_url;
            setData((prevData) => ({
                ...prevData,
                image_url: [...prevData.image_url, image_url],
            }));
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        } finally {
            setLoading(false);
        }
    };

    function deleteImage(index: number) {
        console.log(index);
        const newImages = data.image_url.filter((_img, i) => i !== index);
        setData({ ...data, image_url: newImages });
    }

    return (
        <div>
            {loading ? <Loader /> : (
                <div className='main-container'>
                    <h1>Edit Restaurant Details</h1>
                    <div className='form-group'>
                        <div className="form-grid">
                            <div className='form-item'>
                                <label htmlFor='title'>title</label>
                                <input type='text' id='title' name='title' value={data.title} onChange={(e) => updateRestaurantData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='location_city'>City</label>
                                <input type='text' id='location_city' name='location_city' value={data.location_city} onChange={(e) => updateRestaurantData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='location_country'>Country</label>
                                <input type='text' id='location_country' name='location_country' value={data.location_country} onChange={(e) => updateRestaurantData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='location_map'>Google Maps Location Link</label>
                                <input type='text' id='location_map' name='location_map' value={data.location_map} onChange={(e) => updateRestaurantData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='description'>Short Description</label>
                                <input type='text' id='description' name='description' value={data.description} onChange={(e) => updateRestaurantData(e)} />
                            </div>
                        </div>
                        <div className="form-item">
                            {data.image_url.length < 5 && (
                                <div>
                                    <label htmlFor='image'>Upload Image</label>
                                    <input type='file' id='image' name='image' accept='image/*' onChange={handleImageUpload} />
                                </div>
                            )}
                            {data.image_url.length >= 5 && <p className='warning'>Maximum 5 images allowed.Delete Already uploaded images to add more.</p>}
                        </div>
                        <div className="form-item">
                            <h3>Uploaded Images</h3>
                            <div className="image-preview">
                                {data.image_url.map((url, index) => (
                                    <div className='image' key={index}>
                                        <img src={url} alt={`Uploaded ${index}`} />
                                        <button className='delete-icon' onClick={() => deleteImage(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 30 30">
                                                <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={updateDetails}>Update Details</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UpdateResturant
