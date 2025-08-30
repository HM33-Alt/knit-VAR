# Dependency Visualizer IDE - Frontend

## Features
- Visualizes dependency graphs for Knit-based projects
- Highlights issues (circular/unnecessary dependencies)
- Provides suggestions for improvements
- Interactive UI: zoom, pan, drag, click for details, search
- Help modal and documentation

## Usage
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Access at `http://localhost:3000`

## API
- `GET /api/dependencies`: Fetches dependency graph data
- `GET /api/health`: Backend health check

## Assets & Libraries
- React
- TypeScript
- Custom SVG graph rendering

## Development
- Edit UI in `src/App.tsx`
- Customize styles and components as needed