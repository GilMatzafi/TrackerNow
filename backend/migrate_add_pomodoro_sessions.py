#!/usr/bin/env python3

import sqlite3
import os

def migrate_add_pomodoro_sessions():
    """Add pomodoro_sessions table to the database"""
    
    # Get the database path
    db_path = os.path.join(os.path.dirname(__file__), 'app.db')
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Create pomodoro_sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pomodoro_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                date VARCHAR NOT NULL,
                duration INTEGER NOT NULL,
                type VARCHAR NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 1,
                completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Create indexes for better performance
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id 
            ON pomodoro_sessions (user_id)
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_date 
            ON pomodoro_sessions (date)
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_date 
            ON pomodoro_sessions (user_id, date)
        ''')
        
        # Commit the changes
        conn.commit()
        print("✅ Successfully created pomodoro_sessions table and indexes")
        
    except Exception as e:
        print(f"❌ Error creating pomodoro_sessions table: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_add_pomodoro_sessions()
