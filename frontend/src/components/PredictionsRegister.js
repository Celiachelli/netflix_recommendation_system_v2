import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import netflixLogo from '../images/netflix_logo.png'; // Assure que le chemin est correct
import './PredictionsRegister.css';

const PredictionsRegister = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [filteredRecommendations, setFilteredRecommendations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('user_id');

        // Fetch recommendations
        axios.post('http://localhost:5001/api/recommend', { user_id: userId })
            .then(response => {
                setRecommendations(response.data.recommendations);
                setFilteredRecommendations(response.data.recommendations);
            })
            .catch(error => {
                console.error('Error fetching recommendations:', error);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_id');
        navigate('/');
    };

    // Handle search functionality
    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = recommendations.filter(movie => 
            movie.title.toLowerCase().includes(searchValue) || 
            movie.genre.toLowerCase().includes(searchValue)
        );
        setFilteredRecommendations(filtered);
    };

    const handleMoreInfo = (movie) => {
        setSelectedMovie(movie);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMovie(null);
    };

    return (
        <div className="predictions-page">
            {/* Header */}
            <header className="preheader">
                <img src={netflixLogo} alt="Netflix Logo" className="logo" /> {/* Updated logo */}
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Rechercher un film ou série..." 
                        value={searchTerm} 
                        onChange={handleSearch} 
                        className="search-bar"
                    />
                </div>
                <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
            </header>

            {/* Hero Section for the first recommendation */}
            {filteredRecommendations.length > 0 && (
                <section className="hero">
                    <div className="hero-content">
                        <h1>{filteredRecommendations[0].title}</h1>
                        <p>{filteredRecommendations[0].summary}</p>
                        <a href={filteredRecommendations[0].netflix_link} className="play-button" target="_blank" rel="noopener noreferrer">Regarder</a>
                        <button className="info-button" onClick={() => handleMoreInfo(filteredRecommendations[0])}>Voir Plus</button>
                    </div>
                    <div className="hero-image" style={{ backgroundImage: `url(${filteredRecommendations[0].image})` }}></div>
                </section>
            )}

            {/* Grid Layout for more recommendations */}
            <div className="recommendations-grid">
                <h2>Plus de recommandations</h2>
                <div className="grid">
                    {filteredRecommendations.slice(1).map((movie, index) => (
                        <div key={index} className="grid-item">
                            <img src={movie.image} alt={movie.title} />
                            <div className="grid-item-info">
                                <h3>{movie.title}</h3>
                                <p>{movie.genre}</p>
                                <div className="button-container">
                                    <button className="grid-play-button" onClick={() => window.open(movie.netflix_link, '_blank')}>Regarder</button>
                                    <button className="grid-info-button" onClick={() => handleMoreInfo(movie)}>Voir Plus</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for displaying more info */}
            {showModal && selectedMovie && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{selectedMovie.title}</h2>
                        <p>{selectedMovie.summary}</p>
                        <p><strong>Genre: </strong>{selectedMovie.genre}</p>
                        <img src={selectedMovie.image} alt={selectedMovie.title} className="modal-image" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PredictionsRegister;