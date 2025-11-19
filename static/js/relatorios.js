let currentReport = 'sales';

function showTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(`${tab}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    currentReport = tab;
}

async function generateSalesReport() {
    const startDate = document.getElementById('sales-start-date').value;
    const endDate = document.getElementById('sales-end-date').value;
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    try {
        const report = await api.get(`/api/reports/sales?${params}`);
        
        document.getElementById('sales-count').textContent = report.count;
        document.getElementById('sales-total').textContent = formatCurrency(report.total);
        document.getElementById('sales-average').textContent = formatCurrency(report.total / report.count || 0);
        
        const tbody = document.getElementById('sales-report-table');
        tbody.innerHTML = report.sales.map(sale => `
            <tr>
                <td>${formatDateTime(sale.createdAt)}</td>
                <td>#${sale.id}</td>
                <td>${sale.customer ? sale.customer.name : 'N/A'}</td>
                <td>${sale.seller ? sale.seller.name : 'N/A'}</td>
                <td>${sale.items.length}</td>
                <td>${formatCurrency(sale.total)}</td>
                <td>${formatPaymentMethod(sale.paymentMethod)}</td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error generating sales report:', error);
    }
}

async function generateCashReport() {
    const startDate = document.getElementById('cash-start-date').value;
    const endDate = document.getElementById('cash-end-date').value;
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    try {
        const report = await api.get(`/api/reports/cash?${params}`);
        
        document.getElementById('cash-entries').textContent = formatCurrency(report.entries);
        document.getElementById('cash-exits').textContent = formatCurrency(report.exits);
        document.getElementById('cash-balance-report').textContent = formatCurrency(report.balance);
        
        const tbody = document.getElementById('cash-report-table');
        tbody.innerHTML = report.transactions.map(t => `
            <tr>
                <td>${formatDateTime(t.createdAt)}</td>
                <td>${formatTransactionType(t.type)}</td>
                <td>${t.category || 'N/A'}</td>
                <td>${t.description || ''}</td>
                <td class="${['entry', 'opening'].includes(t.type) ? 'success' : 'danger'}">
                    ${formatCurrency(t.amount)}
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error generating cash report:', error);
    }
}

async function generateProductsReport() {
    try {
        const products = await api.get('/api/products');
        
        const totalValue = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);
        const lowStock = products.filter(p => p.stock <= p.minStock);
        
        document.getElementById('products-count').textContent = products.length;
        document.getElementById('stock-value').textContent = formatCurrency(totalValue);
        document.getElementById('low-stock-count').textContent = lowStock.length;
        
        const tbody = document.getElementById('products-report-table');
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.barcode}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td ${p.stock <= p.minStock ? 'class="danger"' : ''}>${p.stock}</td>
                <td>${formatCurrency(p.cost)}</td>
                <td>${formatCurrency(p.price)}</td>
                <td>${formatCurrency(p.cost * p.stock)}</td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error generating products report:', error);
    }
}

async function exportSalesReport() {
    const startDate = document.getElementById('sales-start-date').value;
    const endDate = document.getElementById('sales-end-date').value;
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    window.location.href = `/api/reports/sales/export?${params}`;
}

function printSalesReport() {
    window.print();
}

function printCashReport() {
    window.print();
}

function printProductsReport() {
    window.print();
}

function formatTransactionType(type) {
    const types = {
        'opening': 'Abertura',
        'closing': 'Fechamento',
        'entry': 'Entrada',
        'exit': 'Saída'
    };
    return types[type] || type;
}

function formatPaymentMethod(method) {
    const methods = {
        'cash': 'Dinheiro',
        'on-account': 'Fiado'
    };
    return methods[method] || method;
}

// Set default dates
const today = new Date().toISOString().split('T')[0];
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sales-start-date').value = today;
    document.getElementById('sales-end-date').value = today;
    document.getElementById('cash-start-date').value = today;
    document.getElementById('cash-end-date').value = today;
});
