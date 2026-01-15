# Electron Playground

A clean and minimal Electron playground project for various feature POCs (Proof of Concepts). This project demonstrates multiple UI architecture patterns for building desktop applications with Electron and React.

## UI Architecture Overview

This project showcases three different approaches to building Electron UIs:

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Playground                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                           ┌─────────────────┐               │
│                           │      web        │               │
│                           │                 │               │
│                           │  Pure Web UI    │               │
│                           │  Lib / Webapp   │───► Browser   │
│                           └─────────────────┘               │
│                                   │                         │
│                               imports                       │
│                                   │                         │
│                                   ↓                         │
│  ┌──────────────────┐  ┌─────────────────────────┐          │
│  │   electron-ui    │  │  electron-use-web-ui    │          │
│  │                  │  │                         │          │
│  │   Standalone     │  │   Electron Wrapper      │          │
│  │   Electron UI    │  │   for Web UI            │          │
│  └──────────────────┘  └─────────────────────────┘          │
│          │                        │                         │
│      renders in              renders in                     │
│          │                        │                         │
│          └───────────┬────────────┘                         │
│                      │                                      │
│           Choose UI Implementation                          │
│                      │                                      │
│                      ↓                                      │
│           ┌──────────────────────┐                          │
│           │   Electron Window    │                          │
│           └──────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

### 1. `electron-ui` - Standalone Electron UI

A traditional Electron renderer implementation built specifically for desktop applications.

- **Purpose**: Standard Electron UI with direct IPC communication
- **Use Case**: Features that are Electron-specific and don't need web compatibility
- **Architecture**: Monolithic UI built directly for Electron

### 2. `electron-use-web-ui` - Electron Wrapper for Web UI

A thin Electron adapter layer that wraps the shared web UI, implementing the native contracts interface.

- **Purpose**: Reuses the web UI within Electron by providing platform-specific implementations
- **Use Case**: Maximum code sharing between web and desktop applications
- **Architecture**: Implements `NativeContracts` interface to bridge web UI with Electron APIs

**Architecture Diagram:**

```
┌──────────────────────────────────────────────────────────┐
│            electron-use-web-ui                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  ElectronNativeAdapter                         │      │
│  │  (implements NativeContracts)                  │      │
│  │                                                │      │
│  │  • setTitle() ────→ window.electronAPI         │      │
│  │  • calculateSum() ─→ window.electronAPI        │      │
│  │  • onUpdateTimer() → window.electronAPI        │      │
│  │  • onBeforeQuit() ─→ window.electronAPI        │      │
│  └────────────────────────────────────────────────┘      │
│                       │                                  │
│                       │injects                           │
│                       ↓                                  │
│  ┌────────────────────────────────────────────────┐      │
│  │  App Component (from @mono/web)                │      │
│  │                                                │      │
│  │  Uses NativeContracts interface                │      │
│  └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

### 3. `web` - Pure Web UI with Abstraction Layer

A standalone web application that defines abstract native contracts, allowing both web and Electron implementations.

- **Purpose**: Platform-agnostic UI that can run in both browser and Electron
- **Use Case**: Building once and deploying everywhere (web + desktop)
- **Architecture**: Uses dependency injection pattern with `NativeContracts` interface
- **Exports**: Library package that can be consumed by other projects

**Architecture Diagram:**

```
┌────────────────────────────────────────────────────────────┐
│                    @mono/web                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────┐  ┌───────────────────────┐         │
│  │ WebNativeAdapter   │  │ ElectronNativeAdapter │         │
│  │                    │  │ (in electron-use-     │         │
│  │ • Browser APIs     │  │  web-ui)              │         │
│  │ • document.title   │  │                       │         │
│  │ • setTimeout       │  │ • Electron APIs       │         │
│  │ • window.close()   │  │ • window.electronAPI  │         │
│  └────────────────────┘  └───────────────────────┘         │
│           │                       │                        │
│           └───────────┬───────────┘                        │
│                       │ implements                         │
│                       ↓                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │  NativeContracts Interface (Abstract)            │      │
│  │                                                  │      │
│  │  • setTitle(title: string): void                 │      │
│  │  • calculateSum(a, b): Promise<number>           │      │
│  │  • onUpdateTimer(callback): () => void           │      │
│  │  • onBeforeQuit(callback): () => void            │      │
│  │  • confirmQuit(confirmed: boolean): void         │      │
│  └──────────────────────────────────────────────────┘      │
│                       ↑                                    │
│                       │                                    │
│                       │                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │  App Component                                   │      │
│  │                                                  │      │
│  │  Accepts nativeAdapter via props                 │      │
│  │  Platform-agnostic business logic                │      │
│  └──────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────┘
```

## Project Structure

```
electron-playground/
├── pkg/
│   ├── desktop/                        # Electron desktop package
│   │   ├── src/
│   │   │   ├── main/                   # Electron main process
│   │   │   │   ├── main.ts             # Main process entry point
│   │   │   │   ├── preload.ts          # Preload script for IPC
│   │   │   │   └── pathResolver.ts     # Path resolution utilities
│   │   │   ├── ui/
│   │   │   │   ├── electron-ui/        # Standalone Electron UI
│   │   │   │   │   ├── src/
│   │   │   │   │   │   ├── App.tsx     # Electron-specific UI
│   │   │   │   │   │   └── main.tsx    # Entry point
│   │   │   │   │   └── package.json    # @mono/electron-ui
│   │   │   │   └── electron-use-web-ui/ # Electron wrapper for web UI
│   │   │   │       ├── src/
│   │   │   │       │   └── main.tsx    # ElectronNativeAdapter setup
│   │   │   │       └── package.json    # @mono/electron-use-web-ui
│   │   │   └── types.d.ts              # Shared TypeScript definitions
│   │   ├── package.json                # @mono/desktop
│   │   └── tsconfig.json               # Desktop TypeScript configuration
│   └── web/                            # Pure web UI package
│       ├── src/
│       │   ├── App.tsx                 # Platform-agnostic UI
│       │   ├── main.tsx                # Web entry point
│       │   ├── lib-export.tsx          # Library exports
│       │   └── native/
│       │       ├── native-contracts.ts         # Interface definition
│       │       └── adapters/
│       │           └── web-native-adapter.ts   # Web implementation
│       ├── package.json                # @mono/web
│       ├── vite.config.ts              # Supports both app and library builds
│       └── dist-lib/                   # Built library output
├── dist/                               # Build output directory
└── package.json                        # Root workspace configuration
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

### Running Different UI Modes

#### Option 1: Standalone Electron UI (`electron-ui`)

Start the Electron-specific UI development server:

```bash
npm run dev:electron-ui
```

This will start the Vite dev server at `http://localhost:5173/`.

#### Option 2: Electron with Shared Web UI (`electron-use-web-ui`)

Start the Electron wrapper for the shared web UI:

```bash
npm run dev:electron-use-web-ui
```

This mode demonstrates code reusability between web and Electron platforms.

#### Option 3: Pure Web UI (`web`)

Run the web UI standalone in a browser:

```bash
npm run dev:web
```

This runs the platform-agnostic UI with the web adapter implementation.

### Building the Electron Main Process

Whenever you make changes to the main process code (files in [pkg/desktop/src/main/](pkg/desktop/src/main/)), rebuild it:

```bash
npm run build:desktop
```

For continuous development, use watch mode:

```bash
npm run watch:desktop
```

### Starting the Electron Application

After starting one of the UI dev servers above, launch the Electron application:

```bash
npm run start:desktop
```

**Note**: In [pkg/desktop/src/main/main.ts](pkg/desktop/src/main/main.ts), update the development URL to match your chosen UI mode:
- `http://localhost:5173/` for `electron-ui`
- `http://localhost:5174/` for `electron-use-web-ui` (if running on different port)
- `http://localhost:5175/` for `web` (if running on different port)

## Build

### Production Build

To build the entire project for production:

```bash
npm run build
```

This command will:
1. Build the `@mono/desktop` package (Electron main process) (output to `pkg/desktop/dist/main/`)
2. Build the `electron-ui` (output to `dist/ui/electron-ui/`)
3. Build the `web` UI application (output to `dist/ui/web/`)
4. Build the `web` UI as a library (output to `pkg/web/dist-lib/`)
5. Build `electron-use-web-ui` (output to `dist/ui/electron-use-web-ui/`)

### Individual Build Commands

Build specific parts of the project:

```bash
# Build Electron main process only (via @mono/desktop package)
npm run build:desktop

# Build electron-ui only
npm run build:electron-ui

# Build web UI application
npm run build:web

# Build web UI as a library (for consumption by other projects)
npm run build:lib:web

# Build electron-use-web-ui
npm run build:electron-use-web-ui
```

### Build Configurations

- Desktop package (Electron main process): [pkg/desktop/tsconfig.json](pkg/desktop/tsconfig.json)
- `electron-ui`: [pkg/desktop/src/ui/electron-ui/vite.config.ts](pkg/desktop/src/ui/electron-ui/vite.config.ts)
- `web`: [pkg/web/vite.config.ts](pkg/web/vite.config.ts) (supports both app and library mode)
- `electron-use-web-ui`: [pkg/desktop/src/ui/electron-use-web-ui/vite.config.ts](pkg/desktop/src/ui/electron-use-web-ui/vite.config.ts)

## Key Technologies

- **Electron**: Desktop application framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **npm workspaces**: Monorepo management

## Architecture Notes

### Native Contracts Pattern

The `web` package introduces an abstraction layer through the `NativeContracts` interface, enabling platform-agnostic code:

```typescript
// Native contracts interface definition
interface NativeContracts {
  setTitle: (title: string) => void;
  calculateSum: (a: number, b: number) => Promise<number>;
  onUpdateTimer: (callback: (value: Date) => void) => () => void;
  onBeforeQuit: (callback: () => void) => () => void;
  confirmQuit: (userConfirmed: boolean) => void;
}
```

**Implementations:**

1. **WebNativeAdapter** ([pkg/web/src/native/adapters/web-native-adapter.ts](pkg/web/src/native/adapters/web-native-adapter.ts))
   - Uses browser APIs (document.title, setTimeout, window.close)
   - Suitable for running in standard web browsers

2. **ElectronNativeAdapter** ([pkg/desktop/src/ui/electron-use-web-ui/src/main.tsx](pkg/desktop/src/ui/electron-use-web-ui/src/main.tsx))
   - Uses Electron IPC APIs (window.electronAPI)
   - Bridges web UI with Electron's main process capabilities

### Path Resolution

The [pathResolver.ts](pkg/desktop/src/main/pathResolver.ts) module handles path resolution for different UI modes:
- `getUiPath()`: Returns the path to `electron-ui` HTML file
- `getReuseWebUiPath()`: Returns the path to `electron-use-web-ui` HTML file
- `getPreloadPath()`: Returns the preload script path

**Note**: Do not change the location of [pkg/desktop/src/main/pathResolver.ts](pkg/desktop/src/main/pathResolver.ts) as it relies on relative paths.

### Development vs Production

The main process ([pkg/desktop/src/main/main.ts](pkg/desktop/src/main/main.ts)) detects the environment:
- **Development**: Loads UI from Vite dev server (e.g., `http://localhost:5173/`)
- **Production**: Loads UI from the built `index.html` file

Choose which UI to load by configuring the path in the main process.

### Library Export Pattern

The `web` package can be built as a library for reuse in other projects:

```typescript
// Exported from @mono/web
export { App };
export type { NativeContracts };
```

**Usage in consuming projects:**

```typescript
import { App, type NativeContracts } from '@mono/web';

// Implement the native contracts for your platform
class CustomNativeAdapter implements NativeContracts {
  // ... implement methods
}

// Use the shared UI with your adapter
<App nativeAdapter={new CustomNativeAdapter()} />
```

## TypeScript Configuration

The project uses multiple TypeScript configurations for different packages:

### Desktop Package
- [pkg/desktop/tsconfig.json](pkg/desktop/tsconfig.json): Node.js environment configuration for Electron main process

### UI Packages
Each UI package has its own TypeScript configuration:

1. **electron-ui**:
   - [pkg/desktop/src/ui/electron-ui/tsconfig.app.json](pkg/desktop/src/ui/electron-ui/tsconfig.app.json): Browser environment
   - [pkg/desktop/src/ui/electron-ui/tsconfig.node.json](pkg/desktop/src/ui/electron-ui/tsconfig.node.json): Build tools

2. **web**:
   - [pkg/web/tsconfig.app.json](pkg/web/tsconfig.app.json): Browser environment
   - [pkg/web/tsconfig.node.json](pkg/web/tsconfig.node.json): Build tools

3. **electron-use-web-ui**:
   - [pkg/desktop/src/ui/electron-use-web-ui/tsconfig.app.json](pkg/desktop/src/ui/electron-use-web-ui/tsconfig.app.json): Browser environment
   - [pkg/desktop/src/ui/electron-use-web-ui/tsconfig.node.json](pkg/desktop/src/ui/electron-use-web-ui/tsconfig.node.json): Build tools

## Use Cases and Benefits

### When to Use Each Approach

| Approach | Use Case | Benefits | Trade-offs |
|----------|----------|----------|------------|
| **electron-ui** | Electron-only features, desktop-first apps | Direct access to Electron APIs, simpler architecture | No code sharing with web |
| **electron-use-web-ui** | Multi-platform apps, maximum code reuse | Write once, deploy everywhere; shared business logic | Additional abstraction layer |
| **web** | Web-first apps that can be wrapped in Electron | Can run standalone in browsers; easily testable | Requires adapter implementations |

### Architecture Benefits

1. **Code Reusability**: The `web` package can be shared across multiple platforms
2. **Testability**: The adapter pattern makes testing easier by allowing mock implementations
3. **Flexibility**: Easy to switch between different UI modes during development
4. **Separation of Concerns**: Clear boundaries between platform-specific and platform-agnostic code
5. **Scalability**: New platforms can be added by implementing the `NativeContracts` interface

## License

ISC

## Contributing

This is a playground project for POCs. Feel free to experiment and extend it for your needs.
