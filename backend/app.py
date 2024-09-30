from flask import Flask, request, jsonify, url_for
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail, Message
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

# Configuration de MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/netflix_recommendation"
mongo = PyMongo(app)
bcrypt = Bcrypt(app)

# Configuration Flask-Mail pour Gmail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'celiakabyle26@gmail.com'  # Votre email Gmail
app.config['MAIL_PASSWORD'] = 'dvgklprujstbxasx'  # Remplacez par votre mot de passe d'application
app.config['MAIL_DEFAULT_SENDER'] = 'celiakabyle26@gmail.com'  # L'adresse email de l'expéditeur

mail = Mail(app)

# Fonction d'envoi de l'email de confirmation
def send_confirmation_email(user):
    token = str(user['_id'])  # Utilisation de l'ID utilisateur comme token
    confirm_url = url_for('confirm_email', token=token, _external=True)
    msg = Message('Confirmez votre email', recipients=[user['email']])
    msg.body = f"Bonjour {user['firstName']},\n\nMerci de vous être inscrit ! Veuillez cliquer sur le lien suivant pour confirmer votre inscription : {confirm_url}\n\nMerci !"
    mail.send(msg)

# Route pour l'enregistrement
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    # Vérification des champs manquants
    if 'firstName' not in data or 'lastName' not in data or 'email' not in data or 'password' not in data or 'genre' not in data:
        return jsonify({"error": "Missing fields"}), 400

    # Vérification de la validité du mot de passe et de l'email
    if len(data['password']) < 8:
        return jsonify({"error": "Password too short"}), 400
    if '@' not in data['email']:
        return jsonify({"error": "Invalid email address"}), 400

    # Hash du mot de passe
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Enregistrement de l'utilisateur
    user_id = mongo.db.users.insert_one({
        'firstName': data['firstName'],
        'lastName': data['lastName'],
        'email': data['email'],
        'password': hashed_password,
        'genre': data['genre'],
        'confirmed': False  # Utilisateur non confirmé tant qu'il n'a pas cliqué sur le lien
    }).inserted_id

    # Envoi de l'email de confirmation
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    send_confirmation_email(user)

    return jsonify({"msg": "User created. Please confirm your email.", "id": str(user_id)}), 201

# Route pour confirmer l'email
@app.route('/api/confirm/<token>', methods=['GET'])
def confirm_email(token):
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(token)})
        if not user:
            return jsonify({"error": "Invalid confirmation token."}), 400

        # Mise à jour de l'utilisateur comme confirmé
        mongo.db.users.update_one({"_id": ObjectId(token)}, {"$set": {"confirmed": True}})
        return jsonify({"msg": "Email confirmed successfully!"}), 200

    except Exception as e:
        return jsonify({"error": "Confirmation failed."}), 400

# Route pour le login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({'email': data['email']})

    if user and bcrypt.check_password_hash(user['password'], data['password']):
        if not user.get('confirmed', False):
            return jsonify({"error": "Email not confirmed"}), 403

        return jsonify({"msg": "Login successful", "id": str(user['_id']), "genre": user['genre']}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Route pour récupérer des films
@app.route('/api/movies', methods=['GET'])
def get_movies():
    movies = mongo.db.movies.find({'Series or Movie': 'Movie'}).limit(10)
    movie_list = []
    for movie in movies:
        movie_list.append({
            'title': movie['Title'],
            'genre': movie['Genre'],
            'image': movie['Image'],
            'summary': movie['Summary']
        })
    return jsonify({"movies": movie_list})

# Route pour récupérer des séries
@app.route('/api/series', methods=['GET'])
def get_series():
    series = mongo.db.movies.find({'Series or Movie': 'Series'}).limit(10)
    series_list = []
    for serie in series:
        series_list.append({
            'title': serie['Title'],
            'genre': serie['Genre'],
            'image': serie['Image'],
            'summary': serie['Summary']
        })
    return jsonify({"series": series_list})

# Route pour les recommandations de films en fonction du genre
@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = data['user_id']
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    
    if user:
        genre = user['genre']
        recommendations = mongo.db.movies.find({"Genre": {"$regex": genre, "$options": "i"}})
        recommendation_list = [{
            "title": movie['Title'],
            "genre": movie['Genre'],
            "summary": movie['Summary'],
            "image": movie['Image'],
            "netflix_link": movie.get('Netflix Link', '#')  # Ajout du lien Netflix
        } for movie in recommendations]
        return jsonify({"recommendations": recommendation_list})
    else:
        return jsonify({"error": "User not found"}), 404

# Route pour aimer un film ou une série
@app.route('/api/like', methods=['POST'])
def like_movie():
    data = request.get_json()
    user_id = data['user_id']
    movie_id = data['movieId']
    
    mongo.db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$addToSet': {'liked_movies': movie_id}}  # Ajoute le film s'il n'est pas déjà aimé
    )
    
    return jsonify({"msg": "Movie liked!"}), 200

# Route pour ne pas aimer un film ou une série
@app.route('/api/dislike', methods=['POST'])
def dislike_movie():
    data = request.get_json()
    user_id = data['user_id']
    movie_id = data['movieId']
    
    mongo.db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$addToSet': {'disliked_movies': movie_id}}  # Ajoute le film s'il n'est pas déjà dans la liste des dislikes
    )
    
    return jsonify({"msg": "Movie disliked!"}), 200

if __name__ == '__main__':
    app.run(port=5001, debug=True)