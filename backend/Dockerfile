FROM python:3.10-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev netcat-openbsd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy project
COPY . /app/

# Make sure the entrypoint script is executable
RUN chmod +x /app/entrypoint.sh

# Command to run on container start
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Set the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"] 