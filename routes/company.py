from flask import Blueprint, request, jsonify
from models import db
from models.company import Company
from werkzeug.utils import secure_filename
import os

bp = Blueprint('company', __name__, url_prefix='/api/company')

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('', methods=['GET'])
def get_company():
    company = Company.query.first()
    if not company:
        company = Company(name='Minha Empresa')
        db.session.add(company)
        db.session.commit()
    
    return jsonify(company.to_dict())

@bp.route('', methods=['PUT'])
def update_company():
    company = Company.query.first()
    if not company:
        company = Company()
        db.session.add(company)
    
    data = request.get_json()
    
    company.name = data.get('name', company.name)
    company.cnpj = data.get('cnpj', company.cnpj)
    company.phone = data.get('phone', company.phone)
    company.email = data.get('email', company.email)
    company.address = data.get('address', company.address)
    
    if 'logo' in data:
        company.logo = data['logo']
    
    db.session.commit()
    
    return jsonify(company.to_dict())

@bp.route('/logo', methods=['POST'])
def upload_logo():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        return jsonify({'path': f'/{filepath}'})
    
    return jsonify({'error': 'Invalid file type'}), 400
