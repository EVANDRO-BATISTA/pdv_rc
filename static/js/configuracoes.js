function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${tab}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    if (tab === 'users') loadUsers();
    if (tab === 'sellers') loadSellers();
}

async function loadCompany() {
    try {
        const company = await api.get('/api/company');
        
        document.getElementById('company-name').value = company.name || '';
        document.getElementById('company-cnpj').value = company.cnpj || '';
        document.getElementById('company-phone').value = company.phone || '';
        document.getElementById('company-email').value = company.email || '';
        document.getElementById('company-address').value = company.address || '';
        
        if (company.logo) {
            document.getElementById('logo-preview').innerHTML = 
                `<img src="${company.logo}" style="max-width: 200px; margin-top: 1rem;">`;
        }
    } catch (error) {
        console.error('Error loading company:', error);
    }
}

document.getElementById('company-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const company = {
        name: document.getElementById('company-name').value,
        cnpj: document.getElementById('company-cnpj').value,
        phone: document.getElementById('company-phone').value,
        email: document.getElementById('company-email').value,
        address: document.getElementById('company-address').value
    };
    
    try {
        await api.put('/api/company', company);
        alert('Configurações salvas com sucesso!');
    } catch (error) {
        alert('Erro ao salvar configurações');
    }
});

async function loadUsers() {
    const users = await api.get('/api/users');
    const tbody = document.getElementById('users-table');
    
    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${u.name}</td>
            <td>${u.username}</td>
            <td>${u.role}</td>
            <td>${u.active ? 'Ativo' : 'Inativo'}</td>
            <td>
                <button onclick="deleteUser(${u.id})" class="btn btn-danger">Excluir</button>
            </td>
        </tr>
    `).join('');
}

async function loadSellers() {
    const sellers = await api.get('/api/sellers');
    const tbody = document.getElementById('sellers-table');
    
    tbody.innerHTML = sellers.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.cpf || 'N/A'}</td>
            <td>${s.phone || 'N/A'}</td>
            <td>${s.commission}%</td>
            <td>
                <button onclick="deleteSeller(${s.id})" class="btn btn-danger">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function openUserModal() {
    document.getElementById('user-modal').classList.add('active');
}

function closeUserModal() {
    document.getElementById('user-modal').classList.remove('active');
}

function openSellerModal() {
    document.getElementById('seller-modal').classList.add('active');
}

function closeSellerModal() {
    document.getElementById('seller-modal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', loadCompany);
