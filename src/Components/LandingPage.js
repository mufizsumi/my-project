import React from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';  
import Logo from '../logo/logo.png'
const LandingPage = () => {
    const landingPageURL = "https://your-live-url.com/registration";

    return (
        <div className="container1">
            <img src={Logo} alt="Logo" className="logo" />
            <h1>Welcome to Our Project</h1>
            <p>Join us to stay connected with the best services in your area.</p>

            <div className='button-container'>
            <Link to="/registration" className="button">Register Now</Link>
            </div>
            <h2>Scan the QR code to visit us!</h2>

            <div className="button-container">
                <QRCodeCanvas value={landingPageURL} size={150} />
            </div>
        </div>
    );
};

export default LandingPage;
