#!/usr/bin/env python3

import sqlite3
import sys
import os

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def migrate():
    """Add timer_settings table"""
    db_path = "app.db"
    
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found!")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create timer_settings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS timer_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                focus_session INTEGER NOT NULL DEFAULT 25,
                short_break INTEGER NOT NULL DEFAULT 5,
                long_break INTEGER NOT NULL DEFAULT 15,
                long_break_after INTEGER NOT NULL DEFAULT 4,
                sound_enabled BOOLEAN NOT NULL DEFAULT 1,
                pause_start_sound BOOLEAN NOT NULL DEFAULT 1,
                focus_break_sound BOOLEAN NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        
        # Create index on user_id for faster lookups
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_timer_settings_user_id 
            ON timer_settings (user_id)
        """)
        
        conn.commit()
        print("✅ Timer settings table created successfully!")
        
        # Check if table was created
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='timer_settings'")
        if cursor.fetchone():
            print("✅ Timer settings table exists")
        else:
            print("❌ Timer settings table was not created")
            return False
            
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating timer settings table: {e}")
        if 'conn' in locals():
            conn.close()
        return False

if __name__ == "__main__":
    success = migrate()
    if success:
        print("🎉 Migration completed successfully!")
    else:
        print("💥 Migration failed!")
        sys.exit(1)
