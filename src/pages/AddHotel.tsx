import React, { useState } from 'react'
import api from '../api/api';
import axios from 'axios';
import Loader from '../components/Loader';

interface Hotel {
    title: string;
    locationCity: string;
    locationCountry: string;
    locationMap: string;
    descriptionShort: string;
    descriptionLong: string;
    minSpend: string;
    imgUrl: string[];
    facilities: string[];
}

interface Room {
    hotelId: string;
    title: string;
    subtitle: string;
    facilities: string[];
    price: number;
    discountedPrice: number;
    avalCount: number;
    roomImg: string;
}

function AddHotel() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Hotel>({
        title: '',
        locationCity: '',
        locationCountry: '',
        locationMap: '',
        descriptionShort: '',
        descriptionLong: '',
        minSpend: '',
        imgUrl: [],
        facilities: []
    });
    const [roomData, setRoomData] = useState<Room>({
        hotelId: '',
        title: '',
        subtitle: '',
        facilities: [],
        price: 0,
        discountedPrice: 0,
        avalCount: 0,
        roomImg: ""
    })
    const [rooms, setRooms] = useState<Room[]>([]);
    const tokenStr = localStorage.getItem('authToken');
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dgjwzufmf/image/upload';
    const UPLOAD_PRESET = 'odyssey';

    function addHotelData(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    async function addDetails() {
        setLoading(true);
        try {
            const addHotel = await api.post(`/api/hotels/addHotel`, data, { headers: { "Authorization": `Bearer ${tokenStr}` } });
            const hotelId = addHotel.data.id;
            if (hotelId != null && rooms.length > 0) {
                const newRoomData = rooms.map((room) => ({ ...room, hotelId }));
                newRoomData.forEach(async (room) => {
                    await api.post(`/api/hotelRooms/addHotelRoom`, room, { headers: { "Authorization": `Bearer ${tokenStr}` } });
                });
                setRooms([]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setData({ title: '', locationCity: '', locationCountry: '', locationMap: '', descriptionShort: '', minSpend: '', descriptionLong: '', imgUrl: [], facilities: [] })
            setLoading(false);
        }
    }
    const addFacilities = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const inputValue = e.currentTarget.value;
            setData((prevData) => ({
                ...prevData,
                facilities: [...prevData.facilities, inputValue],
            }));
            e.currentTarget.value = '';
        }
    }
    const addRoomFacilities = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const inputValue = e.currentTarget.value;
            setRoomData((prevData) => ({
                ...prevData,
                facilities: [...prevData.facilities, inputValue],
            }));
            e.currentTarget.value = '';
        }
    }
    function addRoomData(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setRoomData({ ...roomData, [e.target.name]: e.target.value });
    }
    const addRoom = () => {
        setRooms([...rooms, roomData]);
        setRoomData({ hotelId: '', title: '', subtitle: '', facilities: [], price: 0, discountedPrice: 0, avalCount: 0, roomImg: "" });
        console.log(rooms, "Rooms");
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
            const imageUrl = response.data.secure_url;
            setData((prevData) => ({
                ...prevData,
                imgUrl: [...prevData.imgUrl, imageUrl],
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
        const newImages = data.imgUrl.filter((_img, i) => i !== index);
        setData({ ...data, imgUrl: newImages });
    }
    function deleteRoom(index: number) {
        const newRooms = rooms.filter((_room, i) => i !== index);
        setRooms(newRooms);
    }

    const deleteFacility = (index: number) => {
        const newFacilities = data.facilities.filter((_facility, i) => i !== index);
        setData((prevData) => ({
            ...prevData,
            facilities: newFacilities,
        }));
    }
    const deleteRoomFacility = (index: number) => {
        const newFacilities = roomData.facilities.filter((_facility, i) => i !== index);
        setRoomData((prevData) => ({
            ...prevData,
            facilities: newFacilities,
        }));
    }

    return (
        <div>
            {loading ? <Loader /> : (
                <div className='main-container'>
                    <h1>Add a New Hotel</h1>
                    <div className='form-group'>
                        <div className="form-grid">
                            <div className='form-item'>
                                <label htmlFor='title'>title</label>
                                <input type='text' id='title' name='title' value={data.title} onChange={(e) => addHotelData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='locationCity'>City</label>
                                <input type='text' id='locationCity' name='locationCity' value={data.locationCity} onChange={(e) => addHotelData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='locationCountry'>Country</label>
                                <input type='text' id='locationCountry' name='locationCountry' value={data.locationCountry} onChange={(e) => addHotelData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='locationMap'>Google Maps Location Link</label>
                                <input type='text' id='locationMap' name='locationMap' value={data.locationMap} onChange={(e) => addHotelData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='descriptionShort'>Short Description</label>
                                <input type='text' id='descriptionShort' name='descriptionShort' value={data.descriptionShort} onChange={(e) => addHotelData(e)} />
                            </div>
                            <div className='form-item'>
                                <label htmlFor='minSpend'>Minimum Spending Amount</label>
                                <input type='number' min={0} id='minSpend' name='minSpend' value={data.minSpend} onChange={(e) => addHotelData(e)} />
                            </div>
                        </div>
                        <div className='form-item'>
                            <label htmlFor='descriptionLong'>Description</label>
                            <textarea id='descriptionLong' name='descriptionLong' value={data.descriptionLong} onChange={(e) => addHotelData(e)}></textarea>
                        </div>
                        <div className="form-item">
                            {data.imgUrl.length < 5 && (
                                <div>
                                    <label htmlFor='image'>Upload Image</label>
                                    <input type='file' id='image' name='image' accept='image/*' onChange={handleImageUpload} />
                                </div>
                            )}
                            {data.imgUrl.length >= 5 && <p className='warning'>Maximum 5 images allowed.Delete Already uploaded images to add more.</p>}
                        </div>
                        <div className="form-item">
                            <h3>Uploaded Images</h3>
                            <div className="image-preview">
                                {data.imgUrl.map((url, index) => (
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
                        <div className="form-item">
                            <label htmlFor="facilities">Facilities</label>
                            <div className="facilities">
                                {data.facilities.length != 0 && data.facilities.map((facility, index) => (
                                    <div className="facility" key={index}>
                                        <p>{facility}</p>
                                        <span onClick={() => deleteFacility(index)}>+</span>
                                    </div>
                                ))}
                            </div>
                            <input type="text" name="facilities" id="hotelFacilities" onKeyDown={(e) => addFacilities(e)} />
                        </div>
                        <div className="form-item">
                            <h2>Add Room Types You Offer</h2>
                            <div className="room-details">
                                <div className="add-room-details">
                                    <div className="room-detail">
                                        <label htmlFor="title">Room Type</label>
                                        <input type="text" name="title" id="roomTitle" value={roomData.title} onChange={(e) => addRoomData(e)} />
                                    </div>
                                    <div className="room-detail">
                                        <label htmlFor="subtitle">Small Description</label>
                                        <input type="text" name="subtitle" id="roomSubTitle" value={roomData.subtitle} onChange={(e) => addRoomData(e)} />
                                    </div>
                                    <div className="room-details">
                                        <label htmlFor="facilities">Facilities</label>
                                        <div className="facilities">
                                            {roomData.facilities.length != 0 && roomData.facilities.map((facility, index) => (
                                                <div className="facility" key={index}>
                                                    <p>{facility}</p>
                                                    <span onClick={() => deleteRoomFacility(index)}>+</span>
                                                </div>
                                            ))}
                                        </div>
                                        <input type="text" name="facilities" id="hotelfacilities" onKeyDown={(e) => addRoomFacilities(e)} />
                                    </div>
                                    <div className="room-details">
                                        <label htmlFor="price">Price</label>
                                        <input type="number" name="price" min={0} id="price" value={roomData.price} onChange={(e) => addRoomData(e)} />
                                    </div>
                                    <div className="room-details">
                                        <label htmlFor="discountedPrice">Discounted Room Price</label>
                                        <input type="number" name="discountedPrice" min={0} max={roomData.price - 1} id="discountedPrice" value={roomData.discountedPrice} onChange={(e) => addRoomData(e)} />
                                    </div>
                                    <div className="room-details">
                                        <label htmlFor="avalCount">Available Room Count</label>
                                        <input type="number" name="avalCount" min={0} id="avalCount" value={roomData.avalCount} onChange={(e) => addRoomData(e)} />
                                    </div>
                                </div>
                                <button onClick={addRoom}>Add Room Type</button>
                                <div className="rooms">
                                    {rooms.length != 0 && rooms.map((room, index) => (
                                        <div className="room" key={index}>
                                            <h3>{room.title}</h3>
                                            <p>{room.subtitle}</p>
                                            <p>Price: {room.price}</p>
                                            <p>Discounted Price: {room.discountedPrice}</p>
                                            <p>Available Rooms: {room.avalCount}</p>
                                            <div className="facilities">
                                                {room.facilities.length != 0 && room.facilities.map((facility, index) => (
                                                    <div className="facility" key={index}>
                                                        <p>{facility}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className='delete-icon' onClick={() => deleteRoom(index)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 30 30">
                                                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={addDetails}>Add New Hotel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddHotel
