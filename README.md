
# 💱 Painel Câmbio (Currency Dashboard)

Uma aplicação web moderna e de alta performance para conversão de moedas e análise de tendências históricas. O projeto consome a API Frankfurter para fornecer taxas de câmbio atualizadas e históricos desde 1999.

Desenvolvido com foco em **Performance**, **Experiência do Usuário (UX)** e **Código Limpo**.

---

## 🚀 Funcionalidades

- **Conversão em Tempo Real:** Suporte para mais de 30 moedas globais (USD, EUR, BRL, JPY, etc.).
- **Gráficos Interativos:** Visualização de dados históricos com **Chart.js**, incluindo funcionalidades de **Zoom** e **Pan**.
- **Análise de Tendências:**
  - **Modo Atual:** Indicadores de força da moeda (> 1.00 ou < 1.00).
  - **Modo Histórico:** Algoritmo que compara a cotação atual com a média dos últimos 30 dias para indicar estabilidade, alta ou queda.
- **Internacionalização (i18n):** Suporte completo para **Português** e **Inglês** (detectado automaticamente ou via menu).
- **Alta Performance:**
  - Cache inteligente (SessionStorage e Flask-Caching).
  - Algoritmo de *Downsampling* (LTTB) para renderizar milhares de pontos no gráfico sem travar o navegador.
- **Arquitetura Modular:** JavaScript refatorado em módulos (`main`, `chart-manager`, `utils`) para fácil manutenção.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.13**
- **Flask** (Web Framework)
- **Flask-Babel** (Tradução e i18n)
- **Requests** (Consumo de API externa)

### Frontend
- **HTML5 / CSS3**
- **JavaScript (ES6+)**
- **Bootstrap 5** (Layout Responsivo)
- **Chart.js** + **Chart.js Zoom Plugin** (Visualização de Dados)

---

## ⚙️ Pré-requisitos

Certifique-se de ter o **Python 3.10+** instalado em sua máquina.

## 📦 Instalação e Execução

1. **Clone o repositório:**
```bash
git clone https://github.com/DiogoAug16/painel-cambio.git
cd painel-cambio 
```

2. **Crie e ative um ambiente virtual:**
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate
```

3. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

4. **(opcional) Compile as traduções (Babel): Para garantir que os textos em Inglês/Português funcionem:**
```bash
pybabel compile -d translations
```

5. **Execute o projeto:**
```bash
python app.py
#ou usando flask
flask run
```

6. **Acesse no navegador: Abra http://127.0.0.1:5000 (ou a porta indicada no terminal).**

## 📂 Estrutura do Projeto

```bash
painel-cambio/
├── app.py                # Aplicação Flask Principal
├── babel.cfg             # Configuração do Babel
├── .gitignore            # Configuração de ignore do git
├── requirements.txt      # Dependências do Python
├── LICENSE               # Licença de distribuiçao do projeto
├── static/
│   ├── css/              # Estilos (Bootstrap customizado)
│   ├── images/           # Logos e Favicons
│   └── js/               # Scripts Modulares
│       ├── main.js       # Lógica principal
│       ├── chart-manager.js # Controle do Chart.js
│       └── utils.js      # Funções auxiliares e formatação
├── templates/            # Arquivos HTML (Jinja2)
│   ├── base.html
│   ├── home.html
│   ├── navbar.html
│   └── ...
└── translations/         # Arquivos de tradução (.po / .mo)
```

## 👨‍💻 Autor

Diogo
* **GitHub:** [github.com/DiogoAug16](https://github.com/DiogoAug16)

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.