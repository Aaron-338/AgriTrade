# Agritrade - Connecting Farmers and Buyers in Lesotho

Agritrade is a web platform designed to connect farmers with buyers in Lesotho, providing a digital marketplace for agricultural products.

## Project Structure

The project is built using a modern stack:

- **Frontend**: Next.js (React framework with TypeScript)
- **Backend**: Django REST API 
- **Database**: PostgreSQL

## Features

- User authentication and role-based access (farmers, buyers, admins)
- Product marketplace with search and filter capabilities
- Farmer profiles and product listings
- Order management system
- Interactive UI with responsive design
- RESTful API for all operations

## Local Development

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) 18+ (for development outside Docker)
- [Python](https://www.python.org/) 3.10+ (for development outside Docker)

### Running Locally

The easiest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/yourusername/agritrade.git
cd agritrade

# Start all services
docker-compose up -d

# Apply migrations (first time setup)
docker-compose exec backend python manage.py migrate

# Create a superuser (first time setup)
docker-compose exec backend python manage.py createsuperuser
```

The services will be available at:
- Frontend: http://localhost:4000
- Backend API: http://localhost:8001
- Database: PostgreSQL running on port 5432

### Running Services Individually

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Deployment

### Free Deployment Options

For detailed instructions on deploying to free platforms without requiring a credit card, see the [FREE_DEPLOYMENT.md](./FREE_DEPLOYMENT.md) file.

Options include:
- Render.com (recommended)
- Railway.app
- Vercel (frontend) + Supabase/PythonAnywhere (backend)

### Docker Deployment

For detailed instructions on deploying using Docker, see the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

## Fixing Image Issues

If you're encountering issues with Unsplash images (404 errors), you may need to:

1. Update the image URLs in the database or source code
2. Check if the images are accessible from your network
3. Consider using alternative image sources or placeholder images
4. Run the provided script: `node fix-unsplash-images.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- **Molapo Letsie** - Student ID: 202100013
- **Mosotho Mohau** - Student ID: 202101670

National University of Lesotho "# Agritrade" 
