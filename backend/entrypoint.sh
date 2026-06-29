#!/bin/bash

# Set default values for environment variables if not set
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
PORT=${PORT:-8000}  # For platforms that provide a PORT variable (like Render/Railway)

# Install netcat if not available
if ! command -v nc &> /dev/null; then
    echo "netcat not found, installing..."
    apt-get update && apt-get install -y netcat-openbsd
fi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."

# Try to connect to PostgreSQL with timeout
RETRIES=20
until nc -z ${DB_HOST} ${DB_PORT} || [ $RETRIES -eq 0 ]; do
  echo "Waiting for PostgreSQL server at ${DB_HOST}:${DB_PORT}, $((RETRIES--)) remaining attempts..."
  sleep 3
done

if [ $RETRIES -eq 0 ]; then
  echo "PostgreSQL server not available, continuing anyway as it might be available later"
else
  echo "PostgreSQL started"
fi

# Create staticfiles directory if it doesn't exist
mkdir -p /app/static
mkdir -p /app/media

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Create a superuser if not exists
echo "Ensuring admin user exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('Admin user created');
else:
    print('Admin user already exists');
"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server
echo "Starting server..."
if [ "${DEBUG}" = "True" ]; then
  exec python manage.py runserver 0.0.0.0:${PORT}
else
  exec gunicorn agritrade.wsgi:application --bind 0.0.0.0:${PORT}
fi 