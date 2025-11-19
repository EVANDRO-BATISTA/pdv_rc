from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    CORS(app)

    # Initialize database
    from models import db
    db.init_app(app)

    # Import models
    from models.product import Product
    from models.sale import Sale
    from models.customer import Customer
    from models.seller import Seller
    from models.user import User
    from models.stock_movement import StockMovement
    from models.cash_transaction import CashTransaction
    from models.company import Company

    # Import routes
    from routes import products, sales, customers, sellers, users, stock, cash, company, reports

    # Register blueprints
    app.register_blueprint(products.bp)
    app.register_blueprint(sales.bp)
    app.register_blueprint(customers.bp)
    app.register_blueprint(sellers.bp)
    app.register_blueprint(users.bp)
    app.register_blueprint(stock.bp)
    app.register_blueprint(cash.bp)
    app.register_blueprint(company.bp)
    app.register_blueprint(reports.bp)

    # Main routes
    @app.route('/')
    def index():
        return render_template('login.html')

    @app.route('/dashboard')
    def dashboard():
        return render_template('dashboard.html')

    @app.route('/pdv')
    def pdv():
        return render_template('pdv.html')

    @app.route('/produtos')
    def produtos():
        return render_template('produtos.html')

    @app.route('/estoque')
    def estoque():
        return render_template('estoque.html')

    @app.route('/relatorios')
    def relatorios():
        return render_template('relatorios.html')

    @app.route('/caixa')
    def caixa():
        return render_template('caixa.html')

    @app.route('/configuracoes')
    def configuracoes():
        return render_template('configuracoes.html')
    
    # Create tables on first request
    with app.app_context():
        db.create_all()
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
