# Task Manager Frontend

A modern task management application built with Next.js, React, and Tailwind CSS.

## Features

- User authentication (login/register)
- Role-based access (Admin/User)
- Create, read, update, and delete tasks
- Responsive design
- Real-time task management

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend API**: Node.js/Express (hosted on Vercel)
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd task-manager-frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env.local file for local development
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:7008" > .env.local
```

4. Run the development server
```bash
npm run dev
```

https://task-mangement-ivory-one.vercel.app/v1/api/users/login

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://task-mangement-ivory-one.vercel.app
```

### Environment Variable Usage

- **Development**: Use `http://localhost:7008` for local backend
- **Production**: Use `https://task-mangement-ivory-one.vercel.app` for production backend

### Setting Environment Variables on Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variable:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://task-mangement-ivory-one.vercel.app`
   - **Environment**: Production, Preview, Development

## Deployment

This project is configured for deployment on Vercel.

### Deploy to Vercel

1. Install Vercel CLI (optional)
```bash
npm i -g vercel
```

2. Deploy using Vercel CLI
```bash
vercel
```

Or deploy directly from GitHub:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Vercel will automatically deploy on every push

## API Endpoints

The frontend communicates with the following API endpoints:

- `POST /v1/api/users/login` - User login
- `POST /v1/api/users/register` - User registration
- `GET /v1/api/tasks/my-tasks` - Get user's tasks
- `GET /v1/api/tasks/all-tasks` - Get all tasks (admin only)
- `POST /v1/api/tasks/create` - Create new task
- `PUT /v1/api/tasks/:id` - Update task
- `DELETE /v1/api/tasks/:id` - Delete task

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── admin/             # Admin dashboard
│   └── user/              # User dashboard
├── src/
│   └── api/               # API configuration
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is private and proprietary.
