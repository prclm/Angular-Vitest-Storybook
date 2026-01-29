# Angular 21 Workspace with Vitest and Storybook

This is an Angular 21 workspace configured with multiple applications, a shared library, Vitest for testing, and Storybook for component development.

## Project Structure

- **app1**: First Angular application
- **app2**: Second Angular application  
- **shared**: Shared component library
- **storybook**: Separate Storybook project for component documentation

## Technologies

- **Angular 21**: Latest version of Angular framework
- **Vitest**: Modern, fast unit testing framework
- **Storybook 8**: Component development and documentation tool
- **@analogjs/vitest-angular**: Angular integration for Vitest

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Servers

Run application 1:
```bash
npm start -- --project=app1
```

Run application 2:
```bash
npm start -- --project=app2
```

Run Storybook:
```bash
npm run storybook
```

### Testing

Run all tests:
```bash
npm test
```

Run tests for a specific project:
```bash
npm run test:app1
npm run test:app2
npm run test:shared
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with UI:
```bash
npm run test:ui
```

### Building

Build all projects:
```bash
npm run build
```

Build Storybook:
```bash
npm run build-storybook
```

## Vitest Configuration

Each project has its own `vitest.config.ts` file:
- `/vitest.config.ts` - Root configuration
- `/projects/app1/vitest.config.ts` - App1 tests
- `/projects/app2/vitest.config.ts` - App2 tests
- `/projects/shared/vitest.config.ts` - Library tests
- `/.storybook/vitest.config.ts` - Storybook tests

Test setup files are located at:
- `/projects/app1/src/test-setup.ts`
- `/projects/app2/src/test-setup.ts`
- `/projects/shared/src/test-setup.ts`
- `/.storybook/test-setup.ts`

## Storybook Configuration

Storybook is configured as a separate project in `angular.json` under the "storybook" key.

Configuration files:
- `/.storybook/main.ts` - Main Storybook configuration
- `/.storybook/preview.ts` - Preview configuration

### Known Limitations

**Storybook 8 + Angular 21 Compatibility**: As of January 2026, Storybook 8 does not officially support Angular 21. The setup uses `--legacy-peer-deps` to install dependencies. The build process may require additional configuration or updates when official support is available.

To work around this, components in the shared library use inline templates and styles instead of external files for better compatibility with both Vitest and Storybook.

## Example Component

The shared library includes a Button component demonstrating:
- Component with inputs and outputs
- Unit tests with Vitest
- Storybook stories

Location: `/projects/shared/src/lib/button/`

## Project Configuration

The workspace is configured in `angular.json` with:
- Two applications (app1, app2)
- One shared library (shared)
- One Storybook project (storybook)

Each project can be built, served, and tested independently.
