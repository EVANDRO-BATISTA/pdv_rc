let transactions = [];

async function loadTransactions() {
    try {
        transactions = await api.get('/api/cash/transactions');
        renderTransactions();
        calculateTotals();
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

function renderTransactions() {
    const tbody = document.getElementById('transactions-table');
    
    tbody.innerHTML = transactions.map(t => `
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
}

function calculateTotals() {
    const entries = transactions
        .filter(t => ['opening', 'entry'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);
    
    const exits = transactions
        .filter(t => ['exit', 'closing'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);
    
    document.getElementById('total-entries').textContent = formatCurrency(entries);
    document.getElementById('total-exits').textContent = formatCurrency(exits);
    document.getElementById('current-balance').textContent = formatCurrency(entries - exits);
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

function openTransactionModal() {
    document.getElementById('transaction-modal').classList.add('active');
}

function closeTransactionModal() {
    document.getElementById('transaction-modal').classList.remove('active');
    document.getElementById('transaction-form').reset();
}

document.getElementById('transaction-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const transaction = {
        type: document.getElementById('transaction-type').value,
        category: document.getElementById('transaction-category').value,
        amount: parseFloat(document.getElementById('transaction-amount').value),
        description: document.getElementById('transaction-description').value
    };
    
    try {
        await api.post('/api/cash/transactions', transaction);
        closeTransactionModal();
        loadTransactions();
    } catch (error) {
        alert('Erro ao salvar transação');
    }
});

document.addEventListener('DOMContentLoaded', loadTransactions);
