import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'; 

const MapView = () => {
    const [registrationData, setRegistrationData] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('registrationData')) || [];
        setRegistrationData(data);
    }, []);

    return (
        <MapContainer center={[-29.8587, 31.0218]} zoom={13} scrollWheelZoom={false} className="map">
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    {registrationData.map((entry, index) => (
        <Marker key={index} position={[entry.lat, entry.lng]}>
            <Popup>
                {entry.name} {entry.surname}<br />{entry.city}, {entry.province}
            </Popup>
        </Marker>
    ))}
</MapContainer>

    );
};

export default MapView;
