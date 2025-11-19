let salesData = [];
let productsData = [];

async function loadDashboard() {
    try {
        // Load sales
        const salesResponse = await api.get('/api/reports/sales');
        salesData = salesResponse.sales || [];
        
        // Calculate today's sales
        const today = new Date().toISOString().split('T')[0];
        const todaySales = salesData.filter(s => s.createdAt.startsWith(today));
        const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
        
        document.getElementById('today-sales').textContent = formatCurrency(todayTotal);
        document.getElementById('sales-change').textContent = `${todaySales.length} vendas`;
        
        // Load products
        productsData = await api.get('/api/products');
        document.getElementById('total-products').textContent = productsData.length;
        
        const lowStock = productsData.filter(p => p.stock <= p.minStock);
        document.getElementById('low-stock').textContent = `${lowStock.length} com estoque baixo`;
        
        // Load customers
        const customers = await api.get('/api/customers');
        document.getElementById('total-customers').textContent = customers.length;
        
        // Load cash balance
        const cashBalance = await api.get('/api/cash/balance');
        document.getElementById('cash-balance').textContent = formatCurrency(cashBalance.balance);
        
        // Load recent sales
        renderRecentSales();
        renderLowStockProducts();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function renderRecentSales() {
    const recentSales = salesData.slice(0, 10);
    const tbody = document.getElementById('recent-sales');
    
    tbody.innerHTML = recentSales.map(sale => `
        <tr>
            <td>${formatDateTime(sale.createdAt)}</td>
            <td>${sale.customer ? sale.customer.name : 'N/A'}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${formatPaymentMethod(sale.paymentMethod)}</td>
        </tr>
    `).join('');
}

function renderLowStockProducts() {
    const lowStock = productsData.filter(p => p.stock <= p.minStock).slice(0, 10);
    const tbody = document.getElementById('low-stock-products');
    
    tbody.innerHTML = lowStock.map(product => `
        <tr>
            <td>${product.name}</td>
            <td class="danger">${product.stock}</td>
            <td>${product.minStock}</td>
        </tr>
    `).join('');
}

function formatPaymentMethod(method) {
    const methods = {
        'cash': 'Dinheiro',
        'on-account': 'Fiado'
    };
    return methods[method] || method;
}

async function filterDashboard() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (startDate && endDate) {
        const params = new URLSearchParams({ startDate, endDate });
        const salesResponse = await api.get(`/api/reports/sales?${params}`);
        salesData = salesResponse.sales || [];
        renderRecentSales();
    }
}

// Set default dates to today
const today = new Date().toISOString().split('T')[0];
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-date').value = today;
    document.getElementById('end-date').value = today;
    loadDashboard();
});
