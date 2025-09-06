import sqlite3

# Connect (will create file if it doesn't exist)
conn = sqlite3.connect("calmsetu.db")
cursor = conn.cursor()

# Create a table example
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT
)
""")

conn.commit()
conn.close()
