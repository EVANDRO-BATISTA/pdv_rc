from models import db
from datetime import datetime

class Company(db.Model):
    __tablename__ = 'company'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    cnpj = db.Column(db.String(18))
    phone = db.Column(db.String(50))
    email = db.Column(db.String(200))
    address = db.Column(db.String(500))
    logo = db.Column(db.String(500))  # Path to logo file
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'cnpj': self.cnpj,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'logo': self.logo,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
