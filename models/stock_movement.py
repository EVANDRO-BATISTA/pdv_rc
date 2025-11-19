from models import db
from datetime import datetime

class StockMovement(db.Model):
    __tablename__ = 'stock_movements'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # 'entry' or 'exit'
    quantity = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    product = db.relationship('Product', backref='movements')
    user = db.relationship('User', backref='movements')
    
    def to_dict(self):
        return {
            'id': self.id,
            'productId': self.product_id,
            'type': self.type,
            'quantity': self.quantity,
            'reason': self.reason,
            'userId': self.user_id,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'product': self.product.to_dict() if self.product else None
        }
