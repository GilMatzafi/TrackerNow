#!/usr/bin/env python3
"""
Migration script to add pomodoros table to the database.
Run this script to create the pomodoros table in your existing database.
"""

import sqlite3
import os
from pathlib import Path

def migrate_add_pomodoros():
    """Add pomodoros table to the database"""
    
    # Get the database path
    db_path = Path(__file__).parent / "app.db"
    
    if not db_path.exists():
        print(f"Database file not found at {db_path}")
        return False
    
    # Create backup
    backup_path = db_path.with_suffix('.db.backup_pomodoros')
    print(f"Creating backup at {backup_path}")
    
    # Connect to database
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    try:
        # Check if pomodoros table already exists
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='pomodoros'
        """)
        
        if cursor.fetchone():
            print("Pomodoros table already exists. Skipping migration.")
            return True
        
        # Create pomodoros table
        print("Creating pomodoros table...")
        cursor.execute("""
            CREATE TABLE pomodoros (
                id INTEGER NOT NULL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                pomodoro_type VARCHAR(50) NOT NULL DEFAULT 'WORK',
                duration_minutes INTEGER NOT NULL DEFAULT 25,
                status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
                started_at DATETIME,
                completed_at DATETIME,
                paused_duration_seconds INTEGER NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users (id)
            )
        """)
        
        # Create indexes
        print("Creating indexes...")
        cursor.execute("CREATE INDEX ix_pomodoros_id ON pomodoros (id)")
        cursor.execute("CREATE INDEX ix_pomodoros_user_id ON pomodoros (user_id)")
        cursor.execute("CREATE INDEX ix_pomodoros_status ON pomodoros (status)")
        cursor.execute("CREATE INDEX ix_pomodoros_is_active ON pomodoros (is_active)")
        
        # Commit changes
        conn.commit()
        print("✅ Pomodoros table created successfully!")
        
        # Create backup after successful migration
        import shutil
        shutil.copy2(db_path, backup_path)
        print(f"✅ Backup created at {backup_path}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
        return False
        
    finally:
        conn.close()

if __name__ == "__main__":
    print("Starting Pomodoro migration...")
    success = migrate_add_pomodoros()
    
    if success:
        print("🎉 Migration completed successfully!")
    else:
        print("💥 Migration failed!")
        exit(1)
