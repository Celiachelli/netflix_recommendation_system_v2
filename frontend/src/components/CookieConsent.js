// src/components/CookieConsent.js
import React, { useState } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(true);

    const handleAccept = () => {
        // Logic to accept cookies
        setIsVisible(false);
    };

    const handleRefuse = () => {
        // Logic to refuse cookies
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-consent">
            <p>Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme. Veuillez accepter ou refuser les cookies.</p>
            <div className="cookie-consent-buttons">
                <button onClick={handleAccept} className="cookie-button accept">Accepter</button>
                <button onClick={handleRefuse} className="cookie-button refuse">Refuser</button>
            </div>
        </div>
    );
};

export default CookieConsent;