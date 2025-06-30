# SnippetShare

A beautiful, full-stack code snippet sharing application built with React, TypeScript, and Supabase. Save, organize, and share your code snippets with syntax highlighting and powerful search capabilities.

![SnippetShare](https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

- **📝 Create & Edit Snippets** - Rich code editor with syntax highlighting
- **🔍 Smart Search** - Search by title, content, or filter by programming language
- **🌐 Public/Private Sharing** - Control snippet visibility
- **🎨 Syntax Highlighting** - Support for 20+ programming languages
- **📱 Responsive Design** - Beautiful UI that works on all devices
- **⚡ Real-time Updates** - Powered by Supabase for instant synchronization
- **🔒 Secure** - Row-level security with Supabase
- **📋 One-Click Copy** - Copy code snippets to clipboard instantly

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Syntax Highlighting**: React Syntax Highlighter with Prism
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify (or any static hosting)

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd snippet-share
npm install
```

### 2. Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration script from `supabase/migrations/20250629121510_floating_hill.sql`

This will create:
- The `snippets` table with all required columns
- Row Level Security policies
- Performance indexes

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app running!

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

## 🎯 Usage

### Creating Snippets

1. Click the "New Snippet" button in the header
2. Fill in the title, select a programming language
3. Paste or type your code
4. Toggle public/private visibility
5. Save your snippet

### Searching & Filtering

- Use the search bar to find snippets by title or content
- Filter by programming language using the dropdown
- Results update in real-time as you type

### Managing Snippets

- **Edit**: Click the edit icon on any snippet card
- **Delete**: Click the trash icon (with confirmation)
- **Copy**: Click the copy icon to copy code to clipboard
- **Preview**: Toggle between edit and preview modes in the modal

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Supported Languages

The app supports syntax highlighting for:

- JavaScript/TypeScript
- Python
- Java
- C/C++/C#
- Go, Rust, PHP, Ruby
- Swift, Kotlin, Scala
- HTML, CSS, SQL
- Bash, PowerShell
- JSON, YAML, XML

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public/Private snippets** with proper access control
- **Environment variables** for sensitive configuration
- **Input validation** and sanitization

## 🚀 Deployment

### Netlify (Recommended)

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Enable automatic deployments from your Git repository

### Other Platforms

The app generates static files and can be deployed to:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the beautiful icons
- [Prism](https://prismjs.com) for syntax highlighting

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

Made with ❤️ and lots of ☕