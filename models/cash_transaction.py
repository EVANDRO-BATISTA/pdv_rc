from models import db
from datetime import datetime

class CashTransaction(db.Model):
    __tablename__ = 'cash_transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)  # 'opening', 'closing', 'entry', 'exit'
    category = db.Column(db.String(100))  # 'fuel', 'supplies', 'sales', etc.
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='cash_transactions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'category': self.category,
            'amount': self.amount,
            'description': self.description,
            'userId': self.user_id,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
