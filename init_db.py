from app import app
from models import db
from models.product import Product
from models.sale import Sale
from models.customer import Customer
from models.seller import Seller
from models.user import User
from models.stock_movement import StockMovement
from models.cash_transaction import CashTransaction
from models.company import Company

def init_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create default admin user if not exists
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                name='Administrador',
                role='admin',
                active=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
        
        # Create default company if not exists
        company = Company.query.first()
        if not company:
            company = Company(
                name='Minha Empresa',
                cnpj='00.000.000/0000-00',
                phone='(00) 0000-0000',
                email='contato@empresa.com',
                address='Rua Exemplo, 123'
            )
            db.session.add(company)
        
        db.session.commit()
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_database()
