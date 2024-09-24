import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../logo/logo.png';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        province: '',
        industry: '',
        serviceProvider: '',
        vehicleTracking: '',
        fireService: '',
        lat: null,
        lng: null,
    });

    const [location, setLocation] = useState(null); // State to hold the geocoded location
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const geocodeAddress = async (address) => {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=5e395f7aeb5d4b5cadf48e0555bd1142`);
        const data = await response.json();
        if (data.results.length > 0) {
            return { lat: data.results[0].geometry.lat, lng: data.results[0].geometry.lng };
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data before geocoding:', formData);
        const locationData = await geocodeAddress(formData.address);
        
        if (locationData) {
            const newEntry = { ...formData, ...locationData };
            const existingData = JSON.parse(localStorage.getItem('registrationData')) || [];
            existingData.push(newEntry);
            localStorage.setItem('registrationData', JSON.stringify(existingData));
            setFormData({
                name: '',
                surname: '',
                mobile: '',
                email: '',
                address: '',
                city: '',
                province: '',
                industry: '',
                serviceProvider: '',
                vehicleTracking: '',
                fireService: '',
                lat: null,
                lng: null,
            });

            // Set the location to state to trigger map rendering
            setLocation(locationData);
            // Navigate to admin page after a short delay to allow the map to render
            setTimeout(() => navigate('/admin'), 3000);
        } else {
            console.log('Geocoding failed for address:', formData.address);
        }
    };

    return (
        <div className="container1">
            <img src={Logo} alt="Logo" className="logo" />
            <h1>Registration Form</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Surname:</label>
                <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />

                <label>Mobile:</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>City:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />

                <label>Province:</label>
                <input type="text" name="province" value={formData.province} onChange={handleChange} required />

                <label>Residential Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />

                <label>Industry:</label>
                <input type="text" name="industry" value={formData.industry} onChange={handleChange} required />

                <label>Security Company:</label>
                <input type="text" name="serviceProvider" value={formData.serviceProvider} onChange={handleChange} required />

                <label>Car Tracking Company:</label>
                <input type="text" name="vehicleTracking" value={formData.vehicleTracking} onChange={handleChange} required />

                <label>Fire Service:</label>
                <input type="text" name="fireService" value={formData.fireService} onChange={handleChange} required />

                <button className="button" type="submit">Submit</button>
            </form>

            {location && ( // Render the map if location is available
                <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} className="map">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[location.lat, location.lng]}>
                        <Popup>
                            {formData.name} {formData.surname}<br />{formData.city}, {formData.province}
                        </Popup>
                    </Marker>
                </MapContainer>
            )}
        </div>
    );
};

export default RegistrationPage;
