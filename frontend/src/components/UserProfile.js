// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        axios.get(`http://localhost:5001/api/user/${userId}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data', error);
            });
    }, []);

    const deleteUserAccount = () => {
        const userId = localStorage.getItem('user_id');
        axios.delete(`http://localhost:5001/api/user/${userId}`)
            .then(() => {
                localStorage.removeItem('user_id');
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error deleting user account', error);
            });
    };

    return (
        <div className="user-profile">
            {user && (
                <>
                    <h2>{user.firstName} {user.lastName}</h2>
                    <p>Email: {user.email}</p>
                    <button onClick={deleteUserAccount}>Supprimer mon compte</button>
                </>
            )}
        </div>
    );
};

export default UserProfile;