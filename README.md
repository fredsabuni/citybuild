# CityBuild MVP - Construction Marketplace

A Next.js web application that serves as a construction marketplace connecting building material suppliers, contractors, and subcontractors.

## Features

- **Mobile-First Design**: Responsive interface optimized for touch devices
- **Theme Support**: Light/dark mode with smooth transitions
- **Role-Based Access**: Different interfaces for GCs, Subcontractors, Suppliers, and Banks
- **Reusable Components**: Widget-based architecture for rapid development
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Basic UI components
│   ├── widgets/        # Reusable widget components
│   └── layout/         # Layout components
├── lib/                # Utilities and context
├── types/              # TypeScript type definitions
├── data/               # Mock data for development
└── hooks/              # Custom React hooks
```

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Context + useState
- **UI Components**: Headless UI + custom reusable widgets
- **Icons**: Heroicons
- **TypeScript**: Full type safety
- **Development**: Hot reload, ESLint, Prettier

## Theme System

The application includes a comprehensive theme system supporting light and dark modes:

- CSS variables for consistent theming
- Automatic system preference detection
- Manual theme toggle
- Smooth transitions between themes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Mock Data

The application uses mock data for development located in `src/data/`:
- `mockUsers.ts` - Sample users with different roles
- `mockProjects.ts` - Sample projects and bids

## Next Steps

This foundation provides:
1. ✅ Next.js 14 project with TypeScript
2. ✅ Tailwind CSS with theme system
3. ✅ Project structure and mock data
4. ✅ Basic landing page with theme toggle

Ready for implementing:
- Core reusable widget components
- Layout system with left-sliding navigation
- Authentication and role management UI
- Role-specific dashboards
- Project and bidding interfaces

## License

MIT License