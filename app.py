from flask import Flask, jsonify, render_template, request, session
from flask_babel import Babel, gettext as _
import requests
from datetime import date

app = Flask(__name__)
app.secret_key = "chave_super_secreta"  # Necessário para sessions

app.config['BABEL_DEFAULT_LOCALE'] = 'pt'
app.config['BABEL_SUPPORTED_LOCALES'] = ['pt', 'en']

def get_locale():
    # 1. Se o usuário passou ?lang=xx, usa e salva na sessão
    lang = request.args.get('lang')
    if lang in ['pt', 'en']:
        session['lang'] = lang
    
    # 2. Se já tem na sessão, usa
    if session.get('lang'):
        return session.get('lang')
    
    # 3. Tenta descobrir pelo navegador do usuário ou usa o padrão
    return request.accept_languages.best_match(['pt', 'en'])

babel = Babel(app, locale_selector=get_locale)

EARLIEST_DATE = "1999-01-04"
TODAY = date.today().isoformat()

@app.route('/')
def index():
    return render_template('home.html')

@app.route("/funcionalidades")
def funcionalidades():
    return render_template("funcionalidades.html")

@app.route("/sobre")
def sobre():
    return render_template("sobre.html")

@app.route('/rates/<base>')
def rates(base):
    url = f"https://api.frankfurter.app/latest?from={base.upper()}"
    r = requests.get(url)
    return jsonify(r.json())

@app.route('/history-all/<base>')
def history_all(base):
    from_date = request.args.get("from")
    to_date = request.args.get("to")
    
    url = f"https://api.frankfurter.app/{from_date}..{to_date}?from={base.upper()}"
    
    r = requests.get(url)
    if r.status_code != 200:
        return jsonify({"error": "Failed fetching data"}), 400
        
    return jsonify(r.json())

@app.route('/history/<base>/<target>')
def history(base, target):
    from_date = request.args.get("from", EARLIEST_DATE)
    to_date = request.args.get("to", TODAY)

    url = f"https://api.frankfurter.app/{from_date}..{to_date}?from={base.upper()}&to={target.upper()}"
    r = requests.get(url)
    if r.status_code != 200:
        return jsonify({"error": "Failed fetching data"}), 400

    data = r.json()
    return jsonify({
        "base": base.upper(),
        "target": target.upper(),
        "rates": data.get("rates", {})
    })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
