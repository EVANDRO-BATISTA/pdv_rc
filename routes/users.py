from flask import Blueprint, request, jsonify
from models import db
from models.user import User

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('', methods=['GET'])
def get_users():
    users = User.query.filter_by(active=True).all()
    return jsonify([u.to_dict() for u in users])

@bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

@bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()
    
    user = User(
        username=data['username'],
        name=data['name'],
        role=data.get('role', 'user')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']) and user.active:
        return jsonify(user.to_dict())
    
    return jsonify({'error': 'Invalid credentials'}), 401

@bp.route('/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    user.username = data.get('username', user.username)
    user.name = data.get('name', user.name)
    user.role = data.get('role', user.role)
    
    if 'password' in data:
        user.set_password(data['password'])
    
    db.session.commit()
    
    return jsonify(user.to_dict())

@bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    user.active = False
    db.session.commit()
    
    return '', 204
