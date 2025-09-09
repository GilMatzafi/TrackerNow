#!/usr/bin/env python3
"""
Migration script to update the problems table with new fields.
Run this script to migrate existing data to the new schema.
"""

import sqlite3
import json
from pathlib import Path

def migrate_problems():
    db_path = Path(__file__).parent / "app.db"
    
    if not db_path.exists():
        print("Database file not found. Creating new database...")
        return
    
    # Backup the database
    backup_path = db_path.with_suffix('.db.backup')
    print(f"Creating backup at {backup_path}")
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if the new columns already exist
        cursor.execute("PRAGMA table_info(problems)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'name' in columns and 'topics' in columns:
            print("Migration already completed.")
            return
        
        # Create backup
        cursor.execute(f"ATTACH DATABASE '{backup_path}' AS backup")
        cursor.execute("CREATE TABLE backup.problems AS SELECT * FROM problems")
        cursor.execute("DETACH DATABASE backup")
        
        # Drop the old table
        cursor.execute("DROP TABLE IF EXISTS problems")
        
        # Create the new table with all fields
        cursor.execute("""
            CREATE TABLE problems (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                topics JSON NOT NULL DEFAULT '[]',
                difficulty VARCHAR(20) NOT NULL,
                link VARCHAR(500),
                time_minutes INTEGER,
                notes TEXT
            )
        """)
        
        # If there was existing data, try to migrate it
        try:
            cursor.execute("SELECT * FROM backup.problems")
            old_data = cursor.fetchall()
            
            if old_data:
                print(f"Migrating {len(old_data)} existing records...")
                for row in old_data:
                    # Assuming old format: id, title, difficulty
                    old_id, old_title, old_difficulty = row
                    
                    # Migrate to new format
                    cursor.execute("""
                        INSERT INTO problems (id, name, topics, difficulty, link, time_minutes, notes)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        old_id,
                        old_title,  # title -> name
                        json.dumps(["General"]),  # default topic
                        old_difficulty,
                        None,  # link
                        None,  # time_minutes
                        None   # notes
                    ))
                
                print("Migration completed successfully!")
            else:
                print("No existing data to migrate.")
                
        except sqlite3.OperationalError:
            print("No existing data found.")
        
        conn.commit()
        print("Database migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_problems()
