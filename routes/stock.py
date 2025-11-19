from flask import Blueprint, request, jsonify
from models import db
from models.stock_movement import StockMovement
from models.product import Product

bp = Blueprint('stock', __name__, url_prefix='/api/stock')

@bp.route('/movements', methods=['GET'])
def get_movements():
    movements = StockMovement.query.order_by(StockMovement.created_at.desc()).all()
    return jsonify([m.to_dict() for m in movements])

@bp.route('/movements', methods=['POST'])
def create_movement():
    data = request.get_json()
    
    product = Product.query.get_or_404(data['productId'])
    
    # Update product stock
    if data['type'] == 'entry':
        product.stock += data['quantity']
    else:
        product.stock -= data['quantity']
    
    movement = StockMovement(
        product_id=data['productId'],
        type=data['type'],
        quantity=data['quantity'],
        reason=data.get('reason', ''),
        user_id=data.get('userId')
    )
    
    db.session.add(movement)
    db.session.commit()
    
    return jsonify(movement.to_dict()), 201
