# Free Deployment Options for Agritrade

This guide covers how to deploy the Agritrade platform on various free hosting platforms that don't require a credit card.

## Option 1: Render.com (Recommended)

Render.com offers a free tier for web services and databases, making it ideal for deploying the complete Agritrade stack.

### Preparation

1. Create a free account on [Render.com](https://render.com)
2. Ensure your project is in a Git repository (GitHub, GitLab, etc.)

### Deploying Using render.yaml (Easiest)

1. Add the `render.yaml` file to your project (already created)
2. Connect your Git repository to Render
3. Click "Blueprint" and select your repository
4. Render will automatically set up all services defined in the render.yaml file

### Manual Deployment (Alternative)

#### Step 1: Set up PostgreSQL Database

1. From your Render dashboard, go to **New > PostgreSQL**
2. Name: `agritrade-db`
3. Select the Free Plan
4. Click **Create Database**
5. Note the connection details provided

#### Step 2: Deploy Backend

1. From your Render dashboard, go to **New > Web Service**
2. Connect your Git repository
3. Name: `agritrade-backend`
4. Environment: `Docker`
5. Build Command: Leave empty (uses Dockerfile)
6. Start Command: `/app/entrypoint.sh`
7. Set the following environment variables:
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `*.onrender.com,localhost,127.0.0.1`
   - `CORS_ALLOWED_ORIGINS`: `https://agritrade-frontend.onrender.com,http://localhost:3000`
   - `IN_DOCKER`: `True`
   - `USE_POSTGRES`: `True`
   - `DB_NAME`: [Your DB name from step 1]
   - `DB_USER`: [Your DB user from step 1]
   - `DB_PASSWORD`: [Your DB password from step 1]
   - `DB_HOST`: [Your DB host from step 1]
   - `DB_PORT`: [Your DB port from step 1]
   - `SECRET_KEY`: [Generate a random string]
8. Click **Create Web Service**

#### Step 3: Deploy Frontend

1. From your Render dashboard, go to **New > Web Service**
2. Connect your Git repository
3. Name: `agritrade-frontend`
4. Environment: `Docker`
5. Leave defaults for remaining options 
6. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: `https://agritrade-backend.onrender.com`
7. Click **Create Web Service**

## Option 2: Railway.app

Railway.app is another platform offering a free tier without requiring credit card information.

### Steps

1. Create an account on [Railway.app](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database from the dashboard
4. Deploy your backend:
   - Click **New Service > GitHub Repo**
   - Connect your repository
   - Navigate to the Settings tab, and set the same environment variables as in the Render.com setup
   - Set the build command to `cd backend && python manage.py migrate && python manage.py collectstatic --noinput`
   - Set the start command to `cd backend && gunicorn agritrade.wsgi:application --bind 0.0.0.0:$PORT`
5. Deploy your frontend:
   - Click **New Service > GitHub Repo** (same repository)
   - In Settings, set `ROOT_DIRECTORY` to `/` and `NEXT_PUBLIC_API_URL` to your backend URL
   - Set build command to `npm install && npm run build`
   - Set start command to `npm start`

## Option 3: Vercel (Frontend) + Supabase (Backend Database)

This combination offers generous free tiers but requires separating the frontend and backend deployments.

### Step 1: Supabase Setup (Database)

1. Create an account on [Supabase](https://supabase.com)
2. Create a new project
3. Note the database connection details

### Step 2: Backend Options

Choose one of these options for your Django backend:

#### A. PythonAnywhere (Free Tier)

1. Create an account at [PythonAnywhere](https://www.pythonanywhere.com)
2. Set up a new web app using Django
3. Upload your backend code
4. Configure environment variables to connect to your Supabase database
5. Update CORS settings to allow requests from your frontend

#### B. Render.com (Single Service)

Deploy just the backend as described in Option 1, but change the database connection to use your Supabase database.

### Step 3: Vercel (Frontend)

1. Create an account on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set the root directory to the project root (where package.json is located)
4. Add the following environment variable:
   - `NEXT_PUBLIC_API_URL`: URL of your backend service
5. Deploy

## Testing Your Deployment

After deployment, verify:

1. The frontend loads correctly
2. You can register and log in
3. The marketplace displays products
4. You can add items to cart
5. All images load properly (using our FallbackImage component)

## Troubleshooting

### Database Connection Issues

- Double-check connection strings and credentials
- Ensure database service is running and accepting connections

### CORS Issues

- Verify CORS_ALLOWED_ORIGINS includes your frontend domain
- Check for proper protocol (http vs https)

### Static Files Not Loading

- Run `python manage.py collectstatic` if deploying Django manually
- Check if the static files directory is properly served

### Deployment Fails

- Check logs in the platform's dashboard
- Verify that all required environment variables are set
- Make sure your Dockerfiles are correctly configured 