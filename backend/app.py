import arrow
import json
from datetime import datetime, timedelta, timezone
from flask import Flask, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('YOUR CREDENTIALS FILE LOCATION')

firebase_admin.initialize_app(cred, {
    'databaseURL': 'YOUR DATABASE URL'
})

taxi1ref = db.reference('/Taxi1')
taxi2ref = db.reference('/Taxi2')
taxi3ref = db.reference('/Taxi3')
taxi4ref = db.reference('/Taxi4')

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:POSTGRES-USERNAME@localhost/DBNAME'
app.config["JWT_SECRET_KEY"] = "my-secret-jwt-token"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

jwt = JWTManager(app)
db = SQLAlchemy(app)


class Hesap_bilgileri(db.Model):
    __tablename__ = 'hesap_bilgileri'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(20))
    password = db.Column(db.String(20))
    login_time = db.Column(db.DateTime)
    logout_time = db.Column(db.DateTime)

    def __init__(self, email, password, login_time, logout_time):
        self.email = email
        self.password = password
        self.login_time = login_time
        self.logout_time = logout_time


@app.route("/ping")
def ping():
    return jsonify({"test": "it's work"}), 200


@app.route("/logout", methods=["POST"])
def logout():
    user_email = request.json['email']
    now = arrow.now().format('HH:mm:ss')
    user = Hesap_bilgileri.query.filter_by(
        email=user_email).update(dict(logout_time=now))
    db.session.commit()
    db.session.flush()
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/login", methods=["POST"])
def login():
    user_email = request.json['email']
    user_password = request.json['password']
    user = Hesap_bilgileri.query.filter_by(email=user_email)
    all_user = db.session.query(Hesap_bilgileri)
    for result in all_user:
        if result.email == user_email and result.password == user_password:
            now = arrow.now().format('HH:mm:ss')
            user.update(dict(login_time=now))
            db.session.commit()
            db.session.flush()
            access_token = create_access_token(identity=user_email)
            response = {"access_token": access_token, "user_email": user_email}
            return response
    return {"msg": "Wrong email or password"}, 401


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(hours=3))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response


@app.route('/update_jwt_token', methods=['GET'])
def update_jwt():
    exp_timestamp = get_jwt()["exp"]
    now = datetime.now(timezone.utc)
    target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
    if target_timestamp > exp_timestamp:
        access_token = create_access_token(identity=get_jwt_identity())
        return jsonify({"access_token": access_token}), 200
    else:
        return json({"msg": "access token doesn't expired"}), 200


@app.route('/get_taxi/<email>/<taxi_id>', methods=['GET'])
@jwt_required()
def get_one_taxi(email, taxi_id):

    user_exist = Hesap_bilgileri.query.filter_by(email=email)
    if(user_exist and email == "yusuf@gmail.com"):
        if(taxi_id == "1"):
            return jsonify(taxi1ref.get())
        if(taxi_id == "2"):
            return jsonify(taxi3ref.get())
    if(user_exist and email == "deniz@gmail.com"):
        if(taxi_id == "1"):
            return jsonify(taxi2ref.get())
        if(taxi_id == "2"):
            return jsonify(taxi4ref.get())
    return {"status": "wrong user or taxi id"}, 200


@app.route('/get_all_taxi/<email>', methods=['GET'])
@jwt_required()
def get_all_taxi(email):
    user_exist = Hesap_bilgileri.query.filter_by(email=email)
    all_taxi = []
    if(user_exist and email == "yusuf@gmail.com"):
        all_taxi = taxi1ref.get() + taxi3ref.get()
        return jsonify(all_taxi)
    if(user_exist and email == "deniz@gmail.com"):
        all_taxi = taxi2ref.get() + taxi4ref.get()
        return jsonify(all_taxi)
    return {"status": "wrong user or taxi id"}, 200


@app.route('/add_admin', methods=['GET'])
def create_admin():
    email = "deniz@gmail.com"
    password = 123456789
    create_time = arrow.now().format('HH:mm:ss')
    admin = Hesap_bilgileri(email=email, password=password,
                            login_time=create_time, logout_time=create_time)
    db.session.add(admin)
    db.session.commit()
    db.session.flush()
    return {"status": "successfully added"}, 200


if __name__ == '__main__':
    app.secret_key = 'super secret key'
    app.run(debug=True, port=8000)
