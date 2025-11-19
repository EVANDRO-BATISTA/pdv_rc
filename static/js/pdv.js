let cart = [];
let products = [];
let sellers = [];
let customers = [];

async function loadData() {
    products = await api.get('/api/products');
    sellers = await api.get('/api/sellers');
    customers = await api.get('/api/customers');
    
    const sellerSelect = document.getElementById('seller-select');
    sellerSelect.innerHTML = '<option value="">Selecione...</option>' +
        sellers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    const customerSelect = document.getElementById('customer-select');
    customerSelect.innerHTML = '<option value="">Nenhum</option>' +
        customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

async function searchProduct() {
    const barcode = document.getElementById('barcode-input').value;
    const product = products.find(p => p.barcode === barcode);
    
    if (product) {
        addToCart(product);
        document.getElementById('barcode-input').value = '';
    } else {
        alert('Produto não encontrado');
    }
}

function addToCart(product) {
    const existing = cart.find(item => item.productId === product.id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById('cart-items');
    
    cartDiv.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>${item.name}</div>
            <div>${item.quantity}x ${formatCurrency(item.price)}</div>
            <button onclick="removeFromCart(${index})">X</button>
        </div>
    `).join('');
    
    calculateTotal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountPercent = parseFloat(document.getElementById('discount-input').value) || 0;
    const discount = subtotal * (discountPercent / 100);
    const total = subtotal - discount;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('discount').textContent = formatCurrency(discount);
    document.getElementById('total').textContent = formatCurrency(total);
}

async function completeSale() {
    if (cart.length === 0) {
        alert('Carrinho vazio');
        return;
    }
    
    const sellerId = document.getElementById('seller-select').value;
    if (!sellerId) {
        alert('Selecione um vendedor');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountPercent = parseFloat(document.getElementById('discount-input').value) || 0;
    const discount = subtotal * (discountPercent / 100);
    
    const sale = {
        items: cart,
        total: subtotal - discount,
        paymentMethod: document.getElementById('payment-method').value,
        sellerId: parseInt(sellerId),
        customerId: document.getElementById('customer-select').value || null,
        discount
    };
    
    try {
        await api.post('/api/sales', sale);
        alert('Venda realizada com sucesso!');
        cancelSale();
    } catch (error) {
        alert('Erro ao realizar venda');
    }
}

function cancelSale() {
    cart = [];
    renderCart();
    document.getElementById('discount-input').value = '0';
    document.getElementById('customer-select').value = '';
}

document.getElementById('barcode-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProduct();
    }
});

document.getElementById('discount-input').addEventListener('input', calculateTotal);

document.addEventListener('DOMContentLoaded', loadData);
