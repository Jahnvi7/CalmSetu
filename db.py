# db.py - CalmSetu Database Manager
import sqlite3
import hashlib
from datetime import datetime, timedelta

DB_PATH = "calmsetu.db"

class CalmSetuDB:
    def __init__(self):
        self.db_path = DB_PATH
        self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        return sqlite3.connect(self.db_path)
    
    def init_database(self):
        """Initialize all required tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # User sessions for mood tracking
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT,
                initial_mood TEXT,
                final_mood TEXT,
                session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                conversation_summary TEXT,
                message_count INTEGER DEFAULT 0
            );
        """)
        
        # User preferences for personalization
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                user_email TEXT PRIMARY KEY,
                likes TEXT,
                dislikes TEXT,
                mood_history TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users (email)
            );
        """)
        
        # Chat messages for analytics
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT,
                user_message TEXT,
                ai_response TEXT,
                mood_detected TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                session_id INTEGER,
                FOREIGN KEY (session_id) REFERENCES user_sessions (id)
            );
        """)
        
        conn.commit()
        conn.close()
        print("✅ Database initialized with all tables!")
    
    # ==========================================
    # 👥 USER MANAGEMENT
    # ==========================================
    
    def get_all_users(self):
        """Get all registered users"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, email, created_at 
            FROM users 
            ORDER BY created_at DESC
        """)
        users = cursor.fetchall()
        conn.close()
        return users
    
    def get_user_by_email(self, email):
        """Get specific user by email"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, name, email, created_at 
            FROM users 
            WHERE email = ?
        """, (email,))
        user = cursor.fetchone()
        conn.close()
        return user
    
    def delete_user(self, email):
        """Delete user and all related data"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Delete in order (foreign key constraints)
        cursor.execute("DELETE FROM chat_messages WHERE user_email = ?", (email,))
        cursor.execute("DELETE FROM user_sessions WHERE user_email = ?", (email,))
        cursor.execute("DELETE FROM user_preferences WHERE user_email = ?", (email,))
        cursor.execute("DELETE FROM users WHERE email = ?", (email,))
        
        conn.commit()
        deleted_count = cursor.rowcount
        conn.close()
        
        return deleted_count > 0
    
    # ==========================================
    # 💬 CHAT & SESSION ANALYTICS
    # ==========================================
    
    def get_user_sessions(self, email=None, limit=10):
        """Get user sessions with mood data"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if email:
            cursor.execute("""
                SELECT id, user_email, initial_mood, final_mood, 
                       session_date, conversation_summary, message_count
                FROM user_sessions 
                WHERE user_email = ?
                ORDER BY session_date DESC 
                LIMIT ?
            """, (email, limit))
        else:
            cursor.execute("""
                SELECT id, user_email, initial_mood, final_mood, 
                       session_date, conversation_summary, message_count
                FROM user_sessions 
                ORDER BY session_date DESC 
                LIMIT ?
            """, (limit,))
        
        sessions = cursor.fetchall()
        conn.close()
        return sessions
    
    def get_chat_messages(self, email=None, limit=20):
        """Get recent chat messages"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if email:
            cursor.execute("""
                SELECT user_message, ai_response, mood_detected, timestamp
                FROM chat_messages 
                WHERE user_email = ?
                ORDER BY timestamp DESC 
                LIMIT ?
            """, (email, limit))
        else:
            cursor.execute("""
                SELECT user_email, user_message, ai_response, mood_detected, timestamp
                FROM chat_messages 
                ORDER BY timestamp DESC 
                LIMIT ?
            """, (limit,))
        
        messages = cursor.fetchall()
        conn.close()
        return messages
    
    def get_mood_analytics(self, email=None, days=7):
        """Get mood trends for analytics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        date_filter = datetime.now() - timedelta(days=days)
        
        if email:
            cursor.execute("""
                SELECT DATE(session_date) as date, 
                       initial_mood, 
                       COUNT(*) as count
                FROM user_sessions 
                WHERE user_email = ? AND session_date >= ?
                GROUP BY DATE(session_date), initial_mood
                ORDER BY date DESC
            """, (email, date_filter))
        else:
            cursor.execute("""
                SELECT DATE(session_date) as date, 
                       initial_mood, 
                       COUNT(*) as count
                FROM user_sessions 
                WHERE session_date >= ?
                GROUP BY DATE(session_date), initial_mood
                ORDER BY date DESC
            """, (date_filter,))
        
        analytics = cursor.fetchall()
        conn.close()
        return analytics
    
    # ==========================================
    # 🔧 UTILITY FUNCTIONS
    # ==========================================
    
    def add_sample_data(self):
        """Add sample data for testing"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Sample user
        sample_email = "demo@calmsetu.com"
        sample_password = hashlib.sha256("demo123".encode()).hexdigest()
        
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO users (name, email, password) 
                VALUES (?, ?, ?)
            """, ("Demo User", sample_email, sample_password))
            
            # Sample session
            cursor.execute("""
                INSERT INTO user_sessions 
                (user_email, initial_mood, final_mood, conversation_summary, message_count) 
                VALUES (?, ?, ?, ?, ?)
            """, (sample_email, "stressed", "calm", "User shared work stress, provided breathing exercises", 5))
            
            # Sample preferences
            cursor.execute("""
                INSERT OR REPLACE INTO user_preferences 
                (user_email, likes, dislikes) 
                VALUES (?, ?, ?)
            """, (sample_email, "music, nature, reading", "loud noises, crowds"))
            
            conn.commit()
            print("✅ Sample data added successfully!")
            
        except Exception as e:
            print(f"❌ Error adding sample data: {e}")
        
        conn.close()
    
    def get_database_stats(self):
        """Get overall database statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        stats = {}
        
        # User count
        cursor.execute("SELECT COUNT(*) FROM users")
        stats['total_users'] = cursor.fetchone()[0]
        
        # Session count
        cursor.execute("SELECT COUNT(*) FROM user_sessions")
        stats['total_sessions'] = cursor.fetchone()[0]
        
        # Message count
        cursor.execute("SELECT COUNT(*) FROM chat_messages")
        stats['total_messages'] = cursor.fetchone()[0]
        
        # Most common mood
        cursor.execute("""
            SELECT initial_mood, COUNT(*) as count 
            FROM user_sessions 
            WHERE initial_mood IS NOT NULL
            GROUP BY initial_mood 
            ORDER BY count DESC 
            LIMIT 1
        """)
        mood_result = cursor.fetchone()
        stats['most_common_mood'] = mood_result[0] if mood_result else "None"
        
        # Recent activity (last 24 hours)
        cursor.execute("""
            SELECT COUNT(*) FROM user_sessions 
            WHERE session_date >= datetime('now', '-1 day')
        """)
        stats['recent_sessions'] = cursor.fetchone()[0]
        
        conn.close()
        return stats
    
    def backup_database(self, backup_path=None):
        """Create database backup"""
        if not backup_path:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = f"calmsetu_backup_{timestamp}.db"
        
        try:
            import shutil
            shutil.copy2(self.db_path, backup_path)
            print(f"✅ Database backed up to: {backup_path}")
            return backup_path
        except Exception as e:
            print(f"❌ Backup failed: {e}")
            return None

# ==========================================
# 🖥️ COMMAND LINE INTERFACE
# ==========================================

def main():
    """Interactive database manager"""
    db = CalmSetuDB()
    
    print("🌿 CalmSetu Database Manager")
    print("=" * 40)
    
    while True:
        print("\nChoose an option:")
        print("1. 👥 View all users")
        print("2. 📊 Database statistics") 
        print("3. 💬 Recent chat sessions")
        print("4. 📈 Mood analytics")
        print("5. 🔍 Search user by email")
        print("6. 🗑️  Delete user")
        print("7. 📋 Add sample data")
        print("8. 💾 Backup database")
        print("9. 🚪 Exit")
        
        choice = input("\nEnter choice (1-9): ").strip()
        
        if choice == '1':
            print("\n👥 All Users:")
            users = db.get_all_users()
            if users:
                print(f"{'ID':<5} {'Name':<20} {'Email':<30} {'Created':<20}")
                print("-" * 75)
                for user in users:
                    print(f"{user[0]:<5} {user[1]:<20} {user[2]:<30} {user[3]:<20}")
            else:
                print("No users found.")
        
        elif choice == '2':
            print("\n📊 Database Statistics:")
            stats = db.get_database_stats()
            for key, value in stats.items():
                print(f"{key.replace('_', ' ').title()}: {value}")
        
        elif choice == '3':
            print("\n💬 Recent Sessions:")
            sessions = db.get_user_sessions(limit=10)
            if sessions:
                for session in sessions:
                    print(f"User: {session[1]}")
                    print(f"Mood: {session[2]} → {session[3] or 'ongoing'}")
                    print(f"Date: {session[4]}")
                    print(f"Summary: {session[5] or 'No summary'}")
                    print("-" * 50)
            else:
                print("No sessions found.")
        
        elif choice == '4':
            email = input("Enter user email (or press Enter for all users): ").strip()
            email = email if email else None
            print(f"\n📈 Mood Analytics:")
            analytics = db.get_mood_analytics(email=email)
            if analytics:
                print(f"{'Date':<12} {'Mood':<15} {'Count':<10}")
                print("-" * 37)
                for row in analytics:
                    print(f"{row[0]:<12} {row[1]:<15} {row[2]:<10}")
            else:
                print("No mood data found.")
        
        elif choice == '5':
            email = input("Enter email to search: ").strip()
            user = db.get_user_by_email(email)
            if user:
                print(f"\n🔍 User Found:")
                print(f"ID: {user[0]}")
                print(f"Name: {user[1]}")
                print(f"Email: {user[2]}")
                print(f"Created: {user[3]}")
            else:
                print("User not found.")
        
        elif choice == '6':
            email = input("Enter email to delete (⚠️ WARNING: This will delete all user data): ").strip()
            confirm = input(f"Are you sure you want to delete {email}? (yes/no): ").strip().lower()
            if confirm == 'yes':
                if db.delete_user(email):
                    print("✅ User deleted successfully!")
                else:
                    print("❌ User not found or deletion failed.")
            else:
                print("Deletion cancelled.")
        
        elif choice == '7':
            db.add_sample_data()
        
        elif choice == '8':
            backup_path = db.backup_database()
            if backup_path:
                print(f"Backup created: {backup_path}")
        
        elif choice == '9':
            print("👋 Goodbye!")
            break
        
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main()