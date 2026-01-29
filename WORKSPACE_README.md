# Angular 21 Workspace with Vitest and Storybook

This is an Angular 21 workspace with multiple applications, a shared library, Vitest for testing, and Storybook for component development.

## Workspace Structure

```
projects/
├── app1/              # First Angular application
├── app2/              # Second Angular application
├── shared-lib/        # Shared component library
│   └── src/lib/button/  # Example Button component
└── storybook/         # Storybook project (separate in angular.json)
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

### Storybook Project
- Storybook is configured via the `.storybook/` directory
- Run using npm scripts: `npm run storybook` or `npm run build:storybook`
- Stories pattern: `projects/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Note: Storybook v10 has compatibility issues with Angular 21 that may require additional configuration

## Vitest Configuration

Each project has its own `vite.config.ts` in its project directory:
- Uses `@analogjs/vite-plugin-angular` for Angular support
- JSdom environment for component testing
- Setup files for TestBed initialization
- Configured with project-specific tsconfig
- Note: While configuration is in place, TestBed initialization may need additional setup for Angular 21

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
Vitest configuration is in place following the AnalogJS integration approach which is designed to provide:
- Zone.js setup for Angular
- TestBed support
- Component testing capabilities

Note: The configuration files are created but may require additional fine-tuning for full Angular 21 compatibility.

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
- `app1`: Application project with build, serve, test, and vitest targets
- `app2`: Application project with build, serve, test, and vitest targets
- `shared-lib`: Library project with build, test, and vitest targets
- `storybook`: Separate project with build and serve targets for Storybook

This setup demonstrates best practices for:
- Multi-application workspaces
- Shared library development
- Modern testing with Vitest
- Component documentation with Storybook
- Angular 21 standalone components
