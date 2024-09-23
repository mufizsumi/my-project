import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Admin.css';
import Logo from '../logo/logo.png';

// Placeholder for map marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const AdminPage = () => {
    const [registrationData, setRegistrationData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        surname: '',
        email: '',
        province: '',
        city: '',
    });

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('registrationData')) || [];
        setRegistrationData(data);
        setFilteredData(data);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const applyFilters = () => {
        const filtered = registrationData.filter(entry => {
            return (
                (filters.name === '' || entry.name.includes(filters.name)) &&
                (filters.surname === '' || entry.surname.includes(filters.surname)) &&
                (filters.email === '' || entry.email.includes(filters.email)) &&
                (filters.province === '' || entry.province.includes(filters.province)) &&
                (filters.city === '' || entry.city.includes(filters.city))
            );
        });
        setFilteredData(filtered);
    };

    const downloadExcel = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        const header = Object.keys(registrationData[0] || {}).join(",") + "\n";
        csvContent += header;
    
        registrationData.forEach(entry => {
            const row = Object.values(entry).join(",") + "\n";
            csvContent += row;
        });
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "registration_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sendWhatsApp = (entry) => {
        const phoneNumber = entry.mobile.startsWith("+") ? entry.mobile : `+${entry.mobile}`;
        const message = `Hello ${entry.name}, we have some important updates for you!`;
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };

    const sendEmail = (entry) => {
        const email = entry.email;
        const subject = `Important updates for ${entry.name}`;
        const body = `Hello ${entry.name},\n\nWe wanted to inform you about some important updates.`;
        const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoURL, '_blank');
    };

    const sendSMS = (entry) => {
        const phoneNumber = entry.mobile.startsWith("+") ? entry.mobile : `+${entry.mobile}`;
        const message = `Hello ${entry.name}, we have some important updates for you!`;
        const smsURL = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
        window.open(smsURL, '_blank');
    };

    return (
        <>
            <img src={Logo} alt="Logo" className="logo" />
            <div className="admin-page">
                <div className="filters">
                    <h2>Filter Registrations</h2>
                    <input type="text" name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
                    <input type="text" name="surname" placeholder="Surname" value={filters.surname} onChange={handleFilterChange} />
                    <input type="email" name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
                    <input type="text" name="province" placeholder="Province" value={filters.province} onChange={handleFilterChange} />
                    <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleFilterChange} />
                    <button onClick={applyFilters}>Apply Filters</button>
                </div>

                <div className="content">
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>Email</th>
                                    <th>Province</th>
                                    <th>City</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.name}</td>
                                        <td>{entry.surname}</td>
                                        <td>{entry.email}</td>
                                        <td>{entry.province}</td>
                                        <td>{entry.city}</td>
                                        <td>
                                            <button onClick={() => sendWhatsApp(entry)}>Send WhatsApp</button>
                                            <button onClick={() => sendEmail(entry)}>Send Email</button>
                                            <button onClick={() => sendSMS(entry)}>Send SMS</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={downloadExcel}>Download Excel</button>
                    </div>

                    <div className="map-container">
                        <MapContainer center={[-29.8587, 31.0218]} zoom={13} scrollWheelZoom={false} className="map">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {filteredData.map((entry, index) => (
                                <Marker
                                    key={index}
                                    position={[entry.latitude || -29.8587, entry.longitude || 31.0218]}
                                >
                                    <Popup>
                                        {entry.name} {entry.surname}<br />{entry.city}, {entry.province}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
