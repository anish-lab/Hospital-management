from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app) 

DB_FILE = 'hospital.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            patient_id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            age INTEGER,
            phone TEXT
        )
    ''')
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.json
    
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO patients (patient_id, full_name, age, phone)
            VALUES (?, ?, ?, ?)
        ''', (data['patient_id'], data['full_name'], data['age'], data['phone']))
        
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Patient record saved successfully!"}), 201
    
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "Patient ID already exists."}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/patients', methods=['GET'])
def get_patients():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM patients")
    rows = cursor.fetchall()
    conn.close()
    
    patients = []
    for row in rows:
        patients.append({
            "patient_id": row[0],
            "full_name": row[1],
            "age": row[2],
            "phone": row[3]
        })
        
    return jsonify(patients), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
