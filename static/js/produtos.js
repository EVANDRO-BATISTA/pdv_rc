let products = [];
let editingId = null;

async function loadProducts() {
    products = await api.get('/api/products');
    renderProducts();
}

function renderProducts() {
    const tbody = document.getElementById('products-table');
    
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.barcode}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${formatCurrency(p.price)}</td>
            <td class="${p.stock <= p.minStock ? 'danger' : ''}">${p.stock}</td>
            <td>
                <button onclick="editProduct(${p.id})" class="btn btn-secondary">Editar</button>
                <button onclick="deleteProduct(${p.id})" class="btn btn-danger">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function openProductModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Novo Produto';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

async function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingId = id;
    document.getElementById('modal-title').textContent = 'Editar Produto';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-barcode').value = product.barcode;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-cost').value = product.cost;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-min-stock').value = product.minStock;
    document.getElementById('product-supplier').value = product.supplier || '';
    
    document.getElementById('product-modal').classList.add('active');
}

async function deleteProduct(id) {
    if (!confirm('Deseja excluir este produto?')) return;
    
    try {
        await api.delete(`/api/products/${id}`);
        loadProducts();
    } catch (error) {
        alert('Erro ao excluir produto');
    }
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const product = {
        name: document.getElementById('product-name').value,
        barcode: document.getElementById('product-barcode').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        cost: parseFloat(document.getElementById('product-cost').value) || 0,
        stock: parseInt(document.getElementById('product-stock').value) || 0,
        minStock: parseInt(document.getElementById('product-min-stock').value) || 0,
        supplier: document.getElementById('product-supplier').value
    };
    
    try {
        if (editingId) {
            await api.put(`/api/products/${editingId}`, product);
        } else {
            await api.post('/api/products', product);
        }
        
        closeProductModal();
        loadProducts();
    } catch (error) {
        alert('Erro ao salvar produto');
    }
});

document.addEventListener('DOMContentLoaded', loadProducts);
