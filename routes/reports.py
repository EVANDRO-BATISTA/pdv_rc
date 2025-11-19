from flask import Blueprint, request, jsonify, send_file
from models import db
from models.sale import Sale
from models.product import Product
from models.cash_transaction import CashTransaction
from datetime import datetime
import csv
import io

bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@bp.route('/sales', methods=['GET'])
def sales_report():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    
    query = Sale.query.filter_by(cancelled=False)
    
    if start_date:
        start = datetime.fromisoformat(start_date)
        query = query.filter(Sale.created_at >= start)
    
    if end_date:
        end = datetime.fromisoformat(end_date)
        query = query.filter(Sale.created_at <= end)
    
    sales = query.order_by(Sale.created_at.desc()).all()
    
    return jsonify({
        'sales': [s.to_dict() for s in sales],
        'total': sum(s.total for s in sales),
        'count': len(sales)
    })

@bp.route('/sales/export', methods=['GET'])
def export_sales():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    
    query = Sale.query.filter_by(cancelled=False)
    
    if start_date:
        start = datetime.fromisoformat(start_date)
        query = query.filter(Sale.created_at >= start)
    
    if end_date:
        end = datetime.fromisoformat(end_date)
        query = query.filter(Sale.created_at <= end)
    
    sales = query.order_by(Sale.created_at.desc()).all()
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['Data', 'Vendedor', 'Cliente', 'Total', 'Pagamento'])
    
    for sale in sales:
        writer.writerow([
            sale.created_at.strftime('%d/%m/%Y %H:%M'),
            sale.seller.name if sale.seller else 'N/A',
            sale.customer.name if sale.customer else 'N/A',
            f'R$ {sale.total:.2f}',
            sale.payment_method
        ])
    
    output.seek(0)
    
    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'vendas_{datetime.now().strftime("%Y%m%d")}.csv'
    )

@bp.route('/cash', methods=['GET'])
def cash_report():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    
    query = CashTransaction.query
    
    if start_date:
        start = datetime.fromisoformat(start_date)
        query = query.filter(CashTransaction.created_at >= start)
    
    if end_date:
        end = datetime.fromisoformat(end_date)
        query = query.filter(CashTransaction.created_at <= end)
    
    transactions = query.order_by(CashTransaction.created_at.desc()).all()
    
    entries = sum(t.amount for t in transactions if t.type in ['opening', 'entry'])
    exits = sum(t.amount for t in transactions if t.type in ['exit', 'closing'])
    
    return jsonify({
        'transactions': [t.to_dict() for t in transactions],
        'entries': entries,
        'exits': exits,
        'balance': entries - exits
    })
