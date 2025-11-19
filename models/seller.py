from models import db
from datetime import datetime

class Seller(db.Model):
    __tablename__ = 'sellers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200))
    phone = db.Column(db.String(50))
    cpf = db.Column(db.String(14), unique=True)
    commission = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'cpf': self.cpf,
            'commission': self.commission,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'active': self.active
        }
