#!/usr/bin/env python
"""
Database connection test script.
This script tests the database connection using the Django settings.
It can be run directly without needing to start the Django server.
"""

import os
import sys
import time
import psycopg2
import django
from django.db import connections
from django.db.utils import OperationalError

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agritrade.settings')
django.setup()

def check_direct_connection():
    """Check PostgreSQL connection directly using psycopg2"""
    from django.conf import settings
    
    db_settings = settings.DATABASES['default']
    
    if db_settings['ENGINE'] != 'django.db.backends.postgresql':
        print("Not using PostgreSQL, skipping direct connection test")
        return False
        
    conn_params = {
        'dbname': db_settings['NAME'],
        'user': db_settings['USER'],
        'password': db_settings['PASSWORD'],
        'host': db_settings['HOST'],
        'port': db_settings['PORT'],
    }
    
    try:
        print(f"Attempting direct connection to PostgreSQL at {conn_params['host']}:{conn_params['port']}...")
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        cursor.close()
        conn.close()
        print(f"Success! PostgreSQL version: {version[0]}")
        return True
    except Exception as e:
        print(f"Direct connection error: {e}")
        return False

def check_django_connection():
    """Check PostgreSQL connection using Django's connection manager"""
    try:
        print("Attempting Django connection...")
        connection = connections['default']
        connection.ensure_connection()
        if connection.is_usable():
            print(f"Success! Django can connect to the database: {connection.settings_dict['NAME']} on {connection.settings_dict['HOST']}")
            
            # Check if there are any tables
            cursor = connection.cursor()
            cursor.execute("""
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_schema = 'public';
            """)
            table_count = cursor.fetchone()[0]
            print(f"Found {table_count} tables in the database")
            return True
        else:
            print("Django reports the connection is not usable")
            return False
    except OperationalError as e:
        print(f"Django connection error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def print_env_settings():
    """Print the environment settings for debugging"""
    print("\nEnvironment Settings:")
    print(f"IN_DOCKER: {os.environ.get('IN_DOCKER', 'Not set')}")
    print(f"USE_POSTGRES: {os.environ.get('USE_POSTGRES', 'Not set')}")
    print(f"DB_NAME: {os.environ.get('DB_NAME', 'Not set')}")
    print(f"DB_USER: {os.environ.get('DB_USER', 'Not set')}")
    print(f"DB_HOST: {os.environ.get('DB_HOST', 'Not set')}")
    print(f"DB_PORT: {os.environ.get('DB_PORT', 'Not set')}")
    
    # Don't print the password for security reasons
    print(f"DB_PASSWORD: {'*' * len(os.environ.get('DB_PASSWORD', ''))}")
    
    # Print Django settings
    from django.conf import settings
    print("\nDjango Database Settings:")
    db_settings = settings.DATABASES['default']
    print(f"ENGINE: {db_settings['ENGINE']}")
    print(f"NAME: {db_settings['NAME']}")
    print(f"USER: {db_settings['USER']}")
    print(f"HOST: {db_settings['HOST']}")
    print(f"PORT: {db_settings['PORT']}")
    print(f"PASSWORD: {'*' * len(db_settings['PASSWORD'])}")

def main():
    """Main function to run tests"""
    print("=== Database Connection Test ===")
    print_env_settings()
    
    print("\nTesting direct PostgreSQL connection...")
    direct_success = check_direct_connection()
    
    print("\nTesting Django connection...")
    django_success = check_django_connection()
    
    print("\n=== Summary ===")
    print(f"Direct PostgreSQL connection: {'✅ Success' if direct_success else '❌ Failed'}")
    print(f"Django connection: {'✅ Success' if django_success else '❌ Failed'}")
    
    return 0 if direct_success and django_success else 1

if __name__ == "__main__":
    sys.exit(main()) 