# netflix_recommendation_system

# YouStream - Plateforme de Recommandation de Films et Séries

![netflix_logo](https://github.com/user-attachments/assets/549e0316-3d98-45d8-9886-a7e62bc7025c)


YouStream est une plateforme de streaming permettant aux utilisateurs de regarder des films et séries en illimité, avec des recommandations personnalisées basées sur leurs genres préférés.

## Fonctionnalités

- **Système de recommandation personnalisé** : Basé sur les préférences de genre des utilisateurs.
- **Gestion des utilisateurs** : Inscription, connexion, confirmation par email.
- **Liste de films et séries en vedette** : Présentation de contenus en fonction des genres populaires.
- **Interface utilisateur moderne et responsive** : Optimisée pour les appareils de bureau et mobiles.

## Captures d'écran

### Page d'accueil
![Capture d’écran 2024-09-30 à 19 47 06](https://github.com/user-attachments/assets/0ded867a-1503-4591-b6f4-367ed39946e9)

### Formulaire d'inscription
![Capture d’écran 2024-09-30 à 19 48 19](https://github.com/user-attachments/assets/8f5f4b5f-a1bd-4152-a18f-0d70e84a6abc)

### Page des prédictions
![Capture d’écran 2024-09-30 à 19 49 36](https://github.com/user-attachments/assets/7aa074c7-818c-4a13-b577-ababde19ca37)


## Prérequis

Avant de lancer l'application, assurez-vous d'avoir installé :

- [Python 3.x](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/en/download/)
- Une instance de MongoDB en local ou en ligne.

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Celiachelli/netflix_recommendation_system_v2.git
cd netflix_recommendation_system_v2

## 1. Frontend (React)

### a) Installation des dépendances

1. Allez dans le répertoire `frontend` :

   ```bash
   cd frontend
   npm install
   npm start

L’application frontend sera accessible sur http://localhost:3000.
## 2. Backend (Flask)
2. Allez dans le répertoire backend :
   cd backend

   python3 -m venv env
   source env/bin/activate
3.	Installez les dépendances avec pip :
   pip install -r requirements.txt


### c) Lancer le serveur Flask:
   python app.py

3. API

a) Inscription

	•	Endpoint : /api/register
	•	Méthode : POST
	•	Description : Permet aux utilisateurs de s’inscrire et envoie un email de confirmation.

b) Connexion

	•	Endpoint : /api/login
	•	Méthode : POST
	•	Description : Permet aux utilisateurs de se connecter après confirmation de leur adresse email.

c) Recommandations

	•	Endpoint : /api/recommend
	•	Méthode : POST
	•	Description : Renvoie des recommandations de films ou de séries en fonction du genre préféré de l’utilisateur.






   


