# Electron Playground

A clean and minimal Electron playground project for various feature POCs (Proof of Concepts). This project combines Electron with React (via Vite) to create a modern desktop application development environment.

## Project Structure

```
electron-playground/
├── src/
│   ├── main/                # Electron main process
│   │   ├── main.ts          # Main process entry point
│   │   ├── preload.ts       # Preload script for IPC
│   │   └── pathResolver.ts  # Path resolution utilities
│   ├── ui/                  # Electron renderer
│   │   └── react-ui/        # React frontend (Vite)
│   │       ├── src/
│   │       │   ├── App.tsx  # Main React component
│   │       │   └── main.tsx # React entry point
│   │       └── ...
│   └── types.d.ts           # Shared TypeScript definitions
├── dist/                    # Build output directory
├── package.json             # Root package.json (workspace root)
└── tsconfig.json            # TypeScript configuration
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Installation

Install dependencies for both the root project and the React UI workspace:

```bash
npm install
```

## Development

### 1. Start the React UI Development Server

The React UI uses Vite's hot module replacement (HMR) for fast development:

```bash
npm run dev:react-ui
```

This will start the Vite dev server at `http://localhost:5173/`.

### 2. Build Electron Main Process

Whenever you make changes to the main process code (files in [src/main/](src/main/)), rebuild it:

```bash
npm run build:electron
```

For continuous development, use watch mode:

```bash
npm run watch:electron
```

### 3. Start Electron Application

Launch the Electron application:

```bash
npm run start:electron
```

The app will load the React UI from the Vite dev server when running in development mode.

## Build

To build the entire project for production:

```bash
npm run build
```

This command will:
1. Build the React UI (output to `dist/ui/react-ui/`)
2. Compile TypeScript for the main process (output to `dist/main/`)

The build configuration is defined in:
- [vite.config.ts](src/ui/react-ui/vite.config.ts) for the React UI
- [tsconfig.json](tsconfig.json) for the main process

## Key Technologies

- **Electron**: Desktop application framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **npm workspaces**: Monorepo management

## Architecture Notes

### Path Resolution
The [`pathResolver.ts`](src/main/pathResolver.ts) module handles path resolution for different resources:
- [`getAppUiPath()`](src/main/pathResolver.ts): Returns the UI directory path
- [`getReactUiPath()`](src/main/pathResolver.ts): Returns the React UI HTML path
- [`getPreloadPath()`](src/main/pathResolver.ts): Returns the preload script path

**Note**: Do not change the location of [src/main/pathResolver.ts](src/main/pathResolver.ts) as it relies on relative paths.

### Development vs Production

The main process ([src/main/main.ts](src/main/main.ts)) detects the environment:
- **Development**: Loads UI from `http://localhost:5173/` (Vite dev server)
- **Production**: Loads UI from the built `index.html` file

## TypeScript Configuration

The project uses three TypeScript configurations:

1. **[tsconfig.json](tsconfig.json)**: Main process configuration (Node.js environment)
2. **[src/ui/react-ui/tsconfig.app.json](src/ui/react-ui/tsconfig.app.json)**: React UI app configuration (browser environment)
3. **[src/ui/react-ui/tsconfig.node.json](src/ui/react-ui/tsconfig.node.json)**: React UI build tools configuration (Node.js environment)

## License

ISC

## Contributing

This is a playground project for POCs. Feel free to experiment and extend it for your needs.