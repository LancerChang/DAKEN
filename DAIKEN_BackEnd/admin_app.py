from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object('admin_config.Config')
mysql = MySQL(app)
CORS(app)

from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.data_routes import data_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(data_bp, url_prefix='/api/data')

@app.route('/')
def index():
    return 'Hello, World!'
