import React from 'react';
import './ConfirmationPage.css'; // Assurez-vous que le chemin est correct

const ConfirmationPage = () => {
  return (
    <div className="confirmation-container">
      <h1>Confirmation réussie !</h1>
      <p>Votre email a bien été confirmé. Vous pouvez maintenant accéder à toutes nos fonctionnalités.</p>
      <a href="/" className="button">Retour à l'accueil</a>
      <p className="footer-text">Merci d'avoir rejoint notre communauté Netflix !</p>
    </div>
  );
};

export default ConfirmationPage;