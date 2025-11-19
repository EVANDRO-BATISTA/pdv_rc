from models import db
from datetime import datetime
import json

class Sale(db.Model):
    __tablename__ = 'sales'
    
    id = db.Column(db.Integer, primary_key=True)
    items = db.Column(db.Text, nullable=False)  # JSON string
    total = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    discount = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    cancelled = db.Column(db.Boolean, default=False)
    cancelled_at = db.Column(db.DateTime, nullable=True)
    
    seller = db.relationship('Seller', backref='sales')
    customer = db.relationship('Customer', backref='sales')
    
    def to_dict(self):
        return {
            'id': self.id,
            'items': json.loads(self.items),
            'total': self.total,
            'paymentMethod': self.payment_method,
            'sellerId': self.seller_id,
            'customerId': self.customer_id,
            'discount': self.discount,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'cancelled': self.cancelled,
            'cancelledAt': self.cancelled_at.isoformat() if self.cancelled_at else None,
            'seller': self.seller.to_dict() if self.seller else None,
            'customer': self.customer.to_dict() if self.customer else None
        }
