from flask import Flask, request, jsonify, render_template
import sqlite3
import os
import random

app = Flask(__name__)
DB_PATH = 'confessions.db'

def init_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''CREATE TABLE confessions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        text TEXT NOT NULL
                    )''')
        conn.commit()
        conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/confess', methods=['POST'])
def confess():
    data = request.get_json()
    confession = data.get('confession', '').strip()
    if not confession:
        return jsonify({'error': 'Confession cannot be empty.'}), 400

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO confessions (text) VALUES (?)', (confession,))
    conn.commit()
    new_id = c.lastrowid

    # Get all confessions except the one just submitted
    c.execute('SELECT id, text FROM confessions WHERE id != ?', (new_id,))
    confessions = c.fetchall()
    conn.close()

    if confessions:
        random.shuffle(confessions)
        chosen = confessions[0][1]
    else:
        chosen = 'You are the first to confess! Come back later for more.'

    return jsonify({'received_confession': chosen})

@app.route('/confession_count')
def confession_count():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT COUNT(*) FROM confessions')
    count = c.fetchone()[0]
    conn.close()
    return jsonify({'count': count})

def delete_virus_confessions():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM confessions WHERE LOWER(text) LIKE ?", ('%virus%',))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    # Uncomment the next line to delete all confessions containing 'virus'
    # delete_virus_confessions()
    app.run(debug=True)
