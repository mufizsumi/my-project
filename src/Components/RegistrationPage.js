import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../logo/logo.png';

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
        fireService: ''
    });
     
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const geocodeAddress = (address) => {
        return { lat: -30.5595, lng: 22.9375 };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const existingData = JSON.parse(localStorage.getItem('registrationData')) || [];
        
        const { address } = formData;
        const { lat, lng } = geocodeAddress(address); 

        const newEntry = { ...formData, lat, lng };
        existingData.push(newEntry);
        localStorage.setItem('registrationData', JSON.stringify(existingData));
        setFormData({ name: '', surname: '', mobile: '', email: '', address: '', industry: '', serviceProvider: '', vehicleTracking: '', fireService: '' });
        navigate('/admin');
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
        </div>
    );
};

export default RegistrationPage;
