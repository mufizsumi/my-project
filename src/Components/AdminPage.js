import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Admin.css';
import Logo from '../logo/logo.png';

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

    return (
        <div className="admin-page">
            <img src={Logo} alt="Logo" className="logo" />
            <h1>Admin Page</h1>

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
                    <h2>Registration Data</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Province</th>
                                <th>City</th>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={downloadExcel}>Download Excel</button>
                </div>

                <div className="map-container">
                    <MapContainer center={[-30.5595, 22.9375]} zoom={5} style={{ height: "500px", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {filteredData.map((entry, index) => {
                            if (entry.lat && entry.lng) {
                                return (
                                    <Marker key={index} position={[entry.lat, entry.lng]}>
                                        <Popup>
                                            <strong>{entry.name} {entry.surname}</strong><br />
                                            {entry.address}, {entry.city}, {entry.province}
                                        </Popup>
                                    </Marker>
                                );
                            }
                            return null;
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
