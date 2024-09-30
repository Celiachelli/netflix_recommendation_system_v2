import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import utilisateurIcon from '../images/utilisateur.png'; // Adapte le chemin en fonction de la localisation du fichier


const Login = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5001/api/login', { email, password })
            .then(response => {
                if (response.data && response.data.id) {
                    localStorage.setItem('user_id', response.data.id);
                    console.log('User ID stored:', response.data.id);
                    closeModal();
                    navigate('/Predictions');
                } else {
                    console.error('Login failed: No user ID returned');
                }
            })
            .catch(error => {
                console.error('Error during login:', error.response ? error.response.data : error.message);
            });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                <img src={utilisateurIcon} alt="user icon" className="login-icon" />                    <h2>Login</h2>
                </div>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <a href="/">Forgot Password?</a>
            </div>
        </div>
    );
};

export default Login;