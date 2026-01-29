# Angular 21 Workspace with Vitest and Storybook

This is an Angular 21 workspace with multiple applications, a shared library, Vitest for testing, and Storybook for component development.

## Workspace Structure

```
projects/
├── app1/              # First Angular application (with Storybook integration)
├── app2/              # Second Angular application
└── shared-lib/        # Shared component library
    └── src/lib/button/  # Example Button component
```

## Features

- **Angular 21**: Latest Angular version with standalone components
- **Two Applications**: `app1` and `app2` for demonstrating multi-app workspaces
- **Shared Library**: `shared-lib` containing reusable components
- **Vitest**: Modern, fast testing framework integrated with AnalogJS
- **Storybook**: Component development and documentation tool (v10.2.1)

## Available Scripts

### Building

```bash
# Build first application
npm run build -- app1

# Build second application
npm run build -- app2

# Build shared library
npm run build -- shared-lib
```

### Development Servers

```bash
# Serve app1
npm start -- app1

# Serve app2
npm start -- app2
```

### Testing with Vitest

```bash
# Run all tests
npm run test:vitest

# Test specific project
npm run test:vitest:app1
npm run test:vitest:app2
npm run test:vitest:lib
```

### Storybook

```bash
# Start Storybook development server
npm run storybook

# Build Storybook
npm run build:storybook
```

## Projects Configuration

### Applications (app1 & app2)
- Standard Angular applications with routing
- Configured for both development and production builds
- Vitest configured for each app independently

### Shared Library
- Built using ng-packagr
- Example Button component included
- Storybook stories for component documentation
- Vitest configuration for library testing

### Storybook Configuration
- Storybook is integrated using the Angular builder approach (recommended)
- Run using Angular CLI: `ng run app1:storybook` or npm script: `npm run storybook`
- Build using Angular CLI: `ng run app1:build-storybook`
- Stories pattern: `projects/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Uses `@storybook/angular:start-storybook` and `@storybook/angular:build-storybook` builders

## Vitest Configuration

Each project has its own `vite.config.ts` in its project directory:
- Uses `@analogjs/vite-plugin-angular` for Angular support
- JSdom environment for component testing
- Setup files use modern `setupTestBed()` function from `@analogjs/vitest-angular/setup-testbed`
- Configured with project-specific tsconfig including target `es2022`
- Tests can be run via npm scripts or Angular CLI with `@analogjs/vitest-angular:test` builder

### Test Setup Files
- `projects/app1/src/test-setup.ts`
- `projects/app2/src/test-setup.ts`
- `projects/shared-lib/src/test-setup.ts`

## Component Example

The shared library includes a Button component demonstrating:
- Input properties (`label`, `primary`, `size`)
- Output events (`onClick`)
- CSS styling with variants
- Storybook stories showing different states

## Dependencies

Key dependencies include:
- `@angular/core`: ^21.1.0
- `@analogjs/vite-plugin-angular`: ^2.2.3
- `@analogjs/vitest-angular`: ^2.2.3
- `vitest`: ^4.0.18
- `@storybook/angular`: ^10.2.1
- `vite`: ^7.3.1

## Notes

### Vitest Integration
Vitest configuration follows the AnalogJS integration approach using the modern `setupTestBed()` function:
- Zone.js setup via `@analogjs/vitest-angular/setup-zone`
- TestBed setup via `setupTestBed()` from `@analogjs/vitest-angular/setup-testbed`
- Proper tsconfig configuration with target `es2022` and required types
- Component testing capabilities

Tests can be run using npm scripts or the Angular CLI with the `@analogjs/vitest-angular:test` builder.

### Storybook Configuration
- Storybook v10.2.1 requires specific Angular builder configuration
- Project references app1 for base configuration
- Stories pattern: `projects/**/*.stories.@(js|jsx|mjs|ts|tsx)`

## Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the library** (if you want to use it in apps):
   ```bash
   npm run build -- shared-lib
   ```

3. **Start development** (choose one):
   ```bash
   npm start -- app1   # Run app1
   npm start -- app2   # Run app2
   npm run storybook  # Run Storybook
   ```

4. **Run tests**:
   ```bash
   npm run test:vitest:app1  # Test app1
   npm run test:vitest:lib   # Test library
   ```

## Project Structure in angular.json

The workspace is configured with:
- `app1`: Application project with build, serve, test (Vitest), storybook, and build-storybook targets
- `app2`: Application project with build, serve, and test (Vitest) targets
- `shared-lib`: Library project with build and test (Vitest) targets

This setup demonstrates best practices for:
- Multi-application workspaces
- Shared library development
- Modern testing with Vitest
- Component documentation with Storybook
- Angular 21 standalone components
