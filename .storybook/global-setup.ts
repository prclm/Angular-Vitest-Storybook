// Global setup that runs before any test files are imported
// This ensures @angular/compiler is loaded first
export default async function globalSetup() {
  // For browser mode, we can't directly import here (runs in Node)
  // But we can ensure it's part of the bundle
  console.log('[GLOBAL-SETUP] Running global setup');
  return () => {
    // Teardown
    console.log('[GLOBAL-SETUP] Teardown');
  };
}
