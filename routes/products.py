from flask import Blueprint, request, jsonify
from models import db
from models.product import Product
from datetime import datetime

bp = Blueprint('products', __name__, url_prefix='/api/products')

@bp.route('', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

@bp.route('', methods=['POST'])
def create_product():
    data = request.get_json()
    
    product = Product(
        name=data['name'],
        barcode=data['barcode'],
        category=data['category'],
        price=data['price'],
        cost=data.get('cost', 0),
        stock=data.get('stock', 0),
        min_stock=data.get('minStock', 0),
        supplier=data.get('supplier', '')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@bp.route('/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    product.name = data.get('name', product.name)
    product.barcode = data.get('barcode', product.barcode)
    product.category = data.get('category', product.category)
    product.price = data.get('price', product.price)
    product.cost = data.get('cost', product.cost)
    product.stock = data.get('stock', product.stock)
    product.min_stock = data.get('minStock', product.min_stock)
    product.supplier = data.get('supplier', product.supplier)
    product.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify(product.to_dict())

@bp.route('/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    
    return '', 204
