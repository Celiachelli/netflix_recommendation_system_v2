// src/components/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Modal from './Modal';
import Register from './Register';
import Login from './Login';
import CookieConsent from './CookieConsent';
import netflixLogo from '../images/netflix_logo.png'; // Assurez-vous de remplacer par le logo YouStream si disponible

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5001/api/movies')
            .then(response => {
                setMovies(response.data.movies);
            })
            .catch(error => {
                console.error('There was an error fetching the movies!', error);
            });

        axios.get('http://localhost:5001/api/series')
            .then(response => {
                setSeries(response.data.series);
            })
            .catch(error => {
                console.error('There was an error fetching the series!', error);
            });
    }, []);

    const openRegisterModal = () => {
        setShowRegisterModal(true);
    };

    const closeRegisterModal = () => {
        setShowRegisterModal(false);
    };

    const openLoginModal = () => {
        setShowLoginModal(true);
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    return (
        <div className="home-container">
            <CookieConsent />
            <div className="home-header">
                <img src={netflixLogo} alt="YouStream Logo" className="home-logo" />
                <div className="home-buttons">
                    <button onClick={openLoginModal} className="home-button">S'identifier</button>
                    <button onClick={openRegisterModal} className="home-button">S'enregistrer</button>
                </div>
            </div>
            <div className="home-content">
            <h1 className="home-title">Films et séries en illimité,<br /> et bien plus sur YouStream</h1>
                <p className="home-description">Où que vous soyez. Annulez à tout moment. Prêt à découvrir YouStream ? Une diversité de films et séries rien que pour vous.</p>
            </div>
            <div className="movie-list-container">
                <h2 className="featured-title">Films en vedette</h2>
                <div className="movie-list">
                    {movies.map((movie, index) => (
                        <div key={index} className="movie-item">
                            <img src={movie.image} alt={movie.title} className="movie-image" />
                            <div className="movie-details">
                                <div className="movie-title">{movie.title}</div>
                                <div className="movie-genres">
                                    {movie.genre.split(', ').map((genre, index) => (
                                        <span key={index} className="movie-genre">{genre}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="movie-list-container">
                <h2 className="featured-title">Séries en vedette</h2>
                <div className="movie-list">
                    {series.map((serie, index) => (
                        <div key={index} className="movie-item">
                            <img src={serie.image} alt={serie.title} className="movie-image" />
                            <div className="movie-details">
                                <div className="movie-title">{serie.title}</div>
                                <div className="movie-genres">
                                    {serie.genre.split(', ').map((genre, index) => (
                                        <span key={index} className="movie-genre">{genre}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal show={showRegisterModal} handleClose={closeRegisterModal}>
                <Register closeModal={closeRegisterModal} />
            </Modal>
            <Modal show={showLoginModal} handleClose={closeLoginModal}>
                <Login closeModal={closeLoginModal} />
            </Modal>
            <div className="footer">
                <a href="/privacy-policy">Politique de confidentialité</a>
                <a href="/terms-conditions">Conditions d'utilisation</a>
            </div>
        </div>
    );
};

export default Home;