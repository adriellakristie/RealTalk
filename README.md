# RealTalk - A Social Media Platform

A modern social media platform built with React, Firebase, and Tailwind CSS where users can quickly share their thoughts and connect with others.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)
- [Deployment](#deployment)

## Features
- User authentication (signup/login)
- Real-time post updates
- Responsive design
- Protected routes
- Modern UI with gradient accents

## Tech Stack
- **Frontend**: React.js with Vite
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **Routing**: React Router v6

## Architecture

### Frontend Architecture
- Component-based structure for reusability
- Context API for global state management
- Custom hooks for shared logic
- Protected route system for authentication

### Data Architecture
```
users/
  ├── userId
  │   ├── displayName
  │   ├── email
  │   └── createdAt
posts/
  ├── postId
  │   ├── content
  │   ├── authorId
  │   ├── createdAt
  │   └── updatedAt
```

### Key Design Decisions
- **Authentication**: Firebase Authentication for a secure and reliable way to handle user accounts
- **State Management**: React built-in Context API for simple state management
- **Real-time Updates**: Firestore listeners used for instant data sync
- **Performance**: Lazy loading and optimized queries to keep the app responsive
- **Security**: Firebase security rules and input validation

## Project Structure
```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Main application pages
  ├── contexts/      # React contexts (auth, etc.)
  ├── hooks/         # Custom React hooks
  └── firebase.js    # Firebase configuration
```

## Getting Started

### Prerequisites
- Node.js and npm
- Firebase account
- Git

### Installation
1. Clone the repository:
```bash
git clone https://github.com/your-username/realtalk.git
cd RealTalk
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
- Create a Firebase project
- Enable Authentication and Firestore
- Add configuration to `src/firebase.js`

4. Start the development server:
```bash
npm run dev
```

## Future Plans
- Add comment functionality
- Implement likes and sharing
- Add user profiles
- Add image upload support
- Add search functionality
- Add dark mode support

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Deployment

This project is configured for deployment with Vercel. To deploy:

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and sign up/login with your GitHub account
3. Click "Import Project"
4. Select your repository
5. Configure your project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

The project will automatically deploy and you'll get a production URL.

### Automatic Deployments

- The project is set up with GitHub Actions for CI/CD
- Every push to main will trigger:
  - Linting checks
  - Unit tests
  - Build verification
- Vercel will automatically deploy successful builds
- Preview deployments are created for pull requests

### Environment Variables

Make sure to configure these environment variables in Vercel:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
