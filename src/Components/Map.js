import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapView = () => {
    const [registrationData, setRegistrationData] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('registrationData')) || [];
        setRegistrationData(data);
    }, []);

    return (
        <MapContainer center={[-30.5595, 22.9375]} zoom={5} style={{ height: "2vh", width: "2%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {registrationData.map((entry, index) => {
                const { lat, lng } = entry; 
                if (lat !== undefined && lng !== undefined) {
                    return (
                        <Marker key={index} position={[lat, lng]}>
                            <Popup>
                                <strong>{entry.name} {entry.surname}</strong><br />
                                {entry.address}
                            </Popup>
                        </Marker>
                    );
                } else {
                    console.warn(`Missing lat/lng for entry: ${JSON.stringify(entry)}`);
                    return null; 
                }
            })}
        </MapContainer>
    );
};

export default MapView;
