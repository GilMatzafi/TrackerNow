#!/usr/bin/env python3

import sqlite3
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

def migrate_add_avatar_seed():
    """Add avatar_seed column to users table"""
    
    # Connect to the database
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    try:
        # Check if avatar_seed column already exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'avatar_seed' not in columns:
            # Add avatar_seed column
            cursor.execute('''
                ALTER TABLE users ADD COLUMN avatar_seed VARCHAR
            ''')
            print("✅ Added avatar_seed column to users table successfully")
        else:
            print("✅ avatar_seed column already exists in users table")
        
        # Commit the changes
        conn.commit()
        
    except Exception as e:
        print(f"❌ Error adding avatar_seed column: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_add_avatar_seed()
