import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import utilisateurIcon from '../images/utilisateur.png'; // Assurez-vous que l'image est bien située ici
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        genre: 'Action' // Genre par défaut
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        let validationErrors = {};

        if (!validateEmail(formData.email)) {
            validationErrors.email = "L'adresse email n'est pas valide.";
        }

        if (!validatePassword(formData.password)) {
            validationErrors.password = "Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/register', formData);
            if (response.data) {
                localStorage.setItem('user_id', response.data.id);
                localStorage.setItem('user_genre', formData.genre);
                navigate('/predictionsregister'); // Redirection après l'inscription
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
        }
    };

    return (
        <div className="register-container">
            <div className="form-wrapper">
                <div className="form-header">
                    <img src={utilisateurIcon} alt="Icône utilisateur" className="form-icon" />
                    <h2 className="form-title">S'inscrire</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Prénom"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Nom"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}

                    <select name="genre" value={formData.genre} onChange={handleChange}>
                        <option value="Action">Action</option>
                        <option value="Comédie">Comédie</option>
                        <option value="Drame">Drame</option>
                        <option value="Horreur">Horreur</option>
                        <option value="Romance">Romance</option>
                        <option value="Sci-Fi">Science-fiction</option>
                        <option value="Documentaire">Documentaire</option>
                    </select>

                    <div className="button-container">
                        <button type="submit" className="register-button">S'inscrire</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;