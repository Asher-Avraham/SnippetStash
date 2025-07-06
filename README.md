# SnippetShare

A beautiful, full-stack code snippet sharing application built with React and TypeScript. Save, organize, and share your code snippets with syntax highlighting and powerful search capabilities.

![SnippetShare](https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

- **📝 Create & Edit Snippets** - Rich code editor with syntax highlighting
- **🔍 Smart Search** - Search by title, content, or filter by programming language
- **🌐 Public/Private Sharing** - Control snippet visibility
- **🎨 Syntax Highlighting** - Support for 20+ programming languages
- **📱 Responsive Design** - Beautiful UI that works on all devices
- **📋 One-Click Copy** - Copy code snippets to clipboard instantly

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, PostgreSQL
- **Testing**: Jest, Cypress
- **Syntax Highlighting**: React Syntax Highlighter with Prism
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Docker

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/snippet-share.git
cd snippet-share
```

### 2. Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```
2.  Update the `.env` file with your PostgreSQL credentials.

### 3. Install Dependencies

```bash
npm install
cd backend && npm install && cd ..
```

### 4. Database Setup

The application uses a PostgreSQL database. The `init.sql` file in the `backend` directory contains the necessary SQL to create the `snippets` table.

### 5. Start the Application

The application can be started using Docker Compose:

```bash
docker-compose up -d
```

The frontend will be available at `http://localhost` and the backend at `http://localhost:3000`.

## 🧪 Testing

### Frontend Unit Tests

Frontend unit tests use Jest and React Testing Library.

```bash
npm test
```

### Backend Unit Tests

Backend unit tests use Jest and Supertest.

```bash
cd backend
npm test
```

### End-to-End (E2E) Tests

E2E tests use Cypress.

1.  Make sure the application is running (`docker-compose up -d`).
2.  Open the Cypress test runner:

```bash
npm run cypress:open
```

## 📊 Database Schema

The application uses a single `snippets` table with the following structure:

```sql
CREATE TABLE snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  language text NOT NULL,
  is_public boolean DEFAULT false,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run frontend unit tests
- `npm run cypress:open` - Open Cypress test runner

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.
