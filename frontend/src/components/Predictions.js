import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Icons for like/dislike
import netflixLogo from '../images/netflix_logo.png';
import './Predictions.css';

const Predictions = () => {
    const [topRecommendation, setTopRecommendation] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [filteredRecommendations, setFilteredRecommendations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');

        if (!user_id) {
            navigate('/login');
            return;
        }

        axios.post('http://localhost:5001/api/recommend', { user_id })
            .then(response => {
                const recs = response.data.recommendations;
                if (recs && recs.length > 0) {
                    setTopRecommendation(recs[0]);
                    setRecommendations(recs);
                    setFilteredRecommendations(recs);
                }
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_genre');
        navigate('/');
    };

    const handleMoreInfo = (movie) => {
        setSelectedMovie(movie);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMovie(null);
    };

    // Gestion de la recherche
    const handleSearch = (e) => {
        const searchTermValue = e.target.value;
        setSearchTerm(searchTermValue);

        const filtered = recommendations.filter(movie =>
            movie.genre.toLowerCase().includes(searchTermValue.toLowerCase()) ||
            movie.title.toLowerCase().includes(searchTermValue.toLowerCase())
        );

        const uniqueFiltered = Array.from(new Set(filtered.map(movie => movie.title)))
            .map(title => filtered.find(movie => movie.title === title));

        setFilteredRecommendations(uniqueFiltered);
    };

    const handlePlay = (url) => {
        window.open(url, '_blank');
    };

    const handleLike = (movieId) => {
        const user_id = localStorage.getItem('user_id');
        axios.post('http://localhost:5001/api/like', { user_id, movieId })
            .then(() => {
                console.log("Liked the movie.");
            })
            .catch(error => console.error("Error liking the movie:", error));
    };

    const handleDislike = (movieId) => {
        const user_id = localStorage.getItem('user_id');
        axios.post('http://localhost:5001/api/dislike', { user_id, movieId })
            .then(() => {
                console.log("Disliked the movie.");
            })
            .catch(error => console.error("Error disliking the movie:", error));
    };

    return (
        <div className="predictions-page">
            <header className="main-header">
                <img src={netflixLogo} alt="Netflix Logo" className="header-logo" />
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Rechercher par genre ou titre..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-bar"
                    />
                </div>
                <div className="header-controls">
                    <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
                </div>
            </header>

            {topRecommendation ? (
                <div className="header">
                    <div className="header-overlay">
                        <h1>{topRecommendation.title}</h1>
                        <p>{topRecommendation.summary}</p>
                        <button className="play-button" onClick={() => handlePlay(topRecommendation.netflix_link)}>Regarder</button>
                        <button className="info-button" onClick={() => handleMoreInfo(topRecommendation)}>Plus d'infos</button>
                    </div>
                    <img src={topRecommendation.image} alt={topRecommendation.title} className="header-image" />
                </div>
            ) : (
                <p>Chargement des recommandations...</p>
            )}

            <div className="predictions-container">
                <h2>Films et Séries Recommandés pour Vous</h2>
                <div className="recommendations-list">
                    {filteredRecommendations.map((movie, index) => (
                        <div key={index} className="recommendation-item">
                            <img src={movie.image} alt={movie.title} className="recommendation-image" />
                            <div className="recommendation-details">
                                <h3>{movie.title}</h3>
                                <p>{movie.genre}</p>
                                <div className="button-container">
                                    <button className="play-button" onClick={() => handlePlay(movie.netflix_link)}>Regarder</button>
                                    <button className="info-button" onClick={() => handleMoreInfo(movie)}>Plus d'infos</button>
                                </div>
                                <div className="like-dislike-container">
                                    <FaThumbsUp className="like-icon" onClick={() => handleLike(movie._id)} />
                                    <FaThumbsDown className="dislike-icon" onClick={() => handleDislike(movie._id)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && selectedMovie && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="modal-body">
                            <div className="modal-text">
                                <h2>{selectedMovie.title}</h2>
                                <p>{selectedMovie.summary}</p>
                                <button className="play-button" onClick={() => handlePlay(selectedMovie.netflix_link)}>
                                    Regarder
                                </button>
                            </div>
                            <div className="modal-image-container">
                                <img src={selectedMovie.image} alt={selectedMovie.title} className="modal-image" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Predictions;