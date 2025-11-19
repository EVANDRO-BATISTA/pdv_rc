from flask import Blueprint, request, jsonify
from models import db
from models.seller import Seller

bp = Blueprint('sellers', __name__, url_prefix='/api/sellers')

@bp.route('', methods=['GET'])
def get_sellers():
    sellers = Seller.query.filter_by(active=True).all()
    return jsonify([s.to_dict() for s in sellers])

@bp.route('/<int:id>', methods=['GET'])
def get_seller(id):
    seller = Seller.query.get_or_404(id)
    return jsonify(seller.to_dict())

@bp.route('', methods=['POST'])
def create_seller():
    data = request.get_json()
    
    seller = Seller(
        name=data['name'],
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        cpf=data.get('cpf', ''),
        commission=data.get('commission', 0)
    )
    
    db.session.add(seller)
    db.session.commit()
    
    return jsonify(seller.to_dict()), 201

@bp.route('/<int:id>', methods=['PUT'])
def update_seller(id):
    seller = Seller.query.get_or_404(id)
    data = request.get_json()
    
    seller.name = data.get('name', seller.name)
    seller.email = data.get('email', seller.email)
    seller.phone = data.get('phone', seller.phone)
    seller.cpf = data.get('cpf', seller.cpf)
    seller.commission = data.get('commission', seller.commission)
    seller.active = data.get('active', seller.active)
    
    db.session.commit()
    
    return jsonify(seller.to_dict())

@bp.route('/<int:id>', methods=['DELETE'])
def delete_seller(id):
    seller = Seller.query.get_or_404(id)
    seller.active = False
    db.session.commit()
    
    return '', 204
