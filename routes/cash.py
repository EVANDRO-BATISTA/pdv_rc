from flask import Blueprint, request, jsonify
from models import db
from models.cash_transaction import CashTransaction
from datetime import datetime

bp = Blueprint('cash', __name__, url_prefix='/api/cash')

@bp.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = CashTransaction.query.order_by(CashTransaction.created_at.desc()).all()
    return jsonify([t.to_dict() for t in transactions])

@bp.route('/transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    
    transaction = CashTransaction(
        type=data['type'],
        category=data.get('category', ''),
        amount=data['amount'],
        description=data.get('description', ''),
        user_id=data.get('userId')
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify(transaction.to_dict()), 201

@bp.route('/balance', methods=['GET'])
def get_balance():
    transactions = CashTransaction.query.all()
    
    balance = 0
    for t in transactions:
        if t.type in ['opening', 'entry']:
            balance += t.amount
        elif t.type in ['exit', 'closing']:
            balance -= t.amount
    
    return jsonify({'balance': balance})
