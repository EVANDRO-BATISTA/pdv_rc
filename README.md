# Sistema PDV - Flask

Sistema de Ponto de Venda (PDV) completo desenvolvido com Flask e SQLite.

## Funcionalidades

- PDV (Ponto de Venda) com carrinho de compras
- Gestão de Produtos e Estoque
- Controle de Vendas e Clientes
- Controle de Caixa (entradas e saídas)
- Relatórios detalhados (vendas, caixa, produtos)
- Configurações de empresa, vendedores e usuários
- Dashboard com estatísticas em tempo real

## Instalação

1. Clone o repositório

2. Crie um ambiente virtual:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
\`\`\`

3. Instale as dependências:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Inicialize o banco de dados:
\`\`\`bash
python init_db.py
\`\`\`

## Execução

### Opção 1: Usando Flask CLI (recomendado)
\`\`\`bash
flask run
\`\`\`

### Opção 2: Usando Python diretamente
\`\`\`bash
python app.py
\`\`\`

O sistema estará disponível em `http://localhost:5000`

## Credenciais Padrão

- Usuário: admin
- Senha: admin123

## Estrutura do Projeto

\`\`\`
├── app.py                  # Aplicação principal Flask
├── config.py              # Configurações do Flask
├── init_db.py             # Script de inicialização do banco
├── requirements.txt       # Dependências Python
├── .flaskenv             # Variáveis de ambiente Flask
├── models/               # Modelos SQLAlchemy
├── routes/               # Rotas da API
├── templates/            # Templates HTML (Jinja2)
└── static/              # Arquivos estáticos (CSS, JS)
\`\`\`

## Tecnologias

- Flask 3.0
- SQLAlchemy (ORM)
- SQLite (Banco de dados)
- Jinja2 (Templates)
- JavaScript Vanilla
- CSS customizado com tema amarelo
