from flask import Blueprint, request, jsonify
from models import db
from models.sale import Sale
from models.product import Product
from datetime import datetime
import json

bp = Blueprint('sales', __name__, url_prefix='/api/sales')

@bp.route('', methods=['GET'])
def get_sales():
    sales = Sale.query.filter_by(cancelled=False).order_by(Sale.created_at.desc()).all()
    return jsonify([s.to_dict() for s in sales])

@bp.route('/<int:id>', methods=['GET'])
def get_sale(id):
    sale = Sale.query.get_or_404(id)
    return jsonify(sale.to_dict())

@bp.route('', methods=['POST'])
def create_sale():
    data = request.get_json()
    
    # Update stock for each item
    items = data['items']
    for item in items:
        product = Product.query.get(item['productId'])
        if product:
            product.stock -= item['quantity']
    
    sale = Sale(
        items=json.dumps(items),
        total=data['total'],
        payment_method=data['paymentMethod'],
        seller_id=data.get('sellerId'),
        customer_id=data.get('customerId'),
        discount=data.get('discount', 0)
    )
    
    db.session.add(sale)
    db.session.commit()
    
    return jsonify(sale.to_dict()), 201

@bp.route('/<int:id>/cancel', methods=['POST'])
def cancel_sale(id):
    sale = Sale.query.get_or_404(id)
    
    if sale.cancelled:
        return jsonify({'error': 'Sale already cancelled'}), 400
    
    # Restore stock for each item
    items = json.loads(sale.items)
    for item in items:
        product = Product.query.get(item['productId'])
        if product:
            product.stock += item['quantity']
    
    sale.cancelled = True
    sale.cancelled_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify(sale.to_dict())
