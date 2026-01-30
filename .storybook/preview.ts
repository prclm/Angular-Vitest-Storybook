import type { Preview } from '@analogjs/storybook-angular';
import { render, renderToCanvas } from '@analogjs/storybook-angular/testing';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

// Export render functions so they're included in project annotations
export { render, renderToCanvas };

export default preview;
