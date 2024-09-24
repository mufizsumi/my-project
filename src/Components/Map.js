import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
    const [registrationData, setRegistrationData] = useState([]);
    const defaultCenter = [-29.8587, 31.0218]; // Default center if no valid data is found

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('registrationData')) || [];
        setRegistrationData(data);
    }, []);

    return (
        <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} className="map">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {registrationData.map((entry, index) => {
                // Check for valid latitude and longitude before creating a marker
                const lat = entry.lat !== null ? entry.lat : null;
                const lng = entry.lng !== null ? entry.lng : null;
                
                if (lat && lng) {
                    return (
                        <Marker key={index} position={[lat, lng]}>
                            <Popup>
                                {entry.name} {entry.surname}<br />{entry.city}, {entry.province}
                            </Popup>
                        </Marker>
                    );
                }
                return null; // Skip rendering if lat or lng is null
            })}
        </MapContainer>
    );
};

export default MapView;
