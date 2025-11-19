let products = [];
let movements = [];

async function loadData() {
    products = await api.get('/api/products');
    movements = await api.get('/api/stock/movements');
    renderStock();
    renderMovements();
}

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${tab}-tab`).classList.add('active');
    event.target.classList.add('active');
}

function renderStock() {
    const tbody = document.getElementById('stock-table');
    
    tbody.innerHTML = products.map(p => {
        const status = p.stock <= p.minStock ? 
            '<span class="danger">Estoque Baixo</span>' : 
            '<span class="success">OK</span>';
        
        return `
            <tr>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td class="${p.stock <= p.minStock ? 'danger' : ''}">${p.stock}</td>
                <td>${p.minStock}</td>
                <td>${status}</td>
            </tr>
        `;
    }).join('');
}

function renderMovements() {
    const tbody = document.getElementById('movements-table');
    
    tbody.innerHTML = movements.map(m => `
        <tr>
            <td>${formatDateTime(m.createdAt)}</td>
            <td>${m.product ? m.product.name : 'N/A'}</td>
            <td>${m.type === 'entry' ? 'Entrada' : 'Saída'}</td>
            <td class="${m.type === 'entry' ? 'success' : 'danger'}">${m.quantity}</td>
            <td>${m.reason || ''}</td>
        </tr>
    `).join('');
}

function openMovementModal() {
    const select = document.getElementById('movement-product');
    select.innerHTML = '<option value="">Selecione...</option>' +
        products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    
    document.getElementById('movement-modal').classList.add('active');
}

function closeMovementModal() {
    document.getElementById('movement-modal').classList.remove('active');
    document.getElementById('movement-form').reset();
}

document.getElementById('movement-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const movement = {
        productId: parseInt(document.getElementById('movement-product').value),
        type: document.getElementById('movement-type').value,
        quantity: parseInt(document.getElementById('movement-quantity').value),
        reason: document.getElementById('movement-reason').value
    };
    
    try {
        await api.post('/api/stock/movements', movement);
        closeMovementModal();
        loadData();
    } catch (error) {
        alert('Erro ao salvar movimentação');
    }
});

document.addEventListener('DOMContentLoaded', loadData);
