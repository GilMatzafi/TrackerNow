#!/usr/bin/env python3

import sqlite3
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

def migrate_add_onboarding_tasks():
    """Add onboarding_tasks table to the database"""
    
    # Connect to the database
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    try:
        # Create the onboarding_tasks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS onboarding_tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR NOT NULL,
                description VARCHAR,
                due_date DATETIME,
                completed BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        print("✅ Created onboarding_tasks table successfully")
        
        # Commit the changes
        conn.commit()
        
    except Exception as e:
        print(f"❌ Error creating onboarding_tasks table: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_add_onboarding_tasks()
