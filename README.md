# Trip Planner (trip-spotterai)

A full-stack trip planning application that takes trip details as inputs and outputs routes with ELD (Electronic Logging Device) tracking capabilities.

## Project Structure

- **Frontend**: React + TypeScript + Vite + Tailwind CSS (using Bun)
- **Backend**: Django + Django REST Framework (using Docker)

## Quick Start

### Backend Setup (Docker)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a `.env` file from `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your settings (optional for development)

4. Start the backend with Docker:
   ```bash
   docker compose up --build
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup (Bun + Vite)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies using Bun:

   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun dev
   ```

The frontend will be available at `http://localhost:5173`

## Environment Variables

### Backend (.env)

```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## License

MIT
