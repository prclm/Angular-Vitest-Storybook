import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within, userEvent } from 'storybook/test';
import { Button } from './button';

const meta: Meta<Button> = {
  title: 'Components/Button',
  component: Button,
  render: (args) => ({
    props: args,
  }),
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    primary: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // Verify button exists and has correct text
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Primary Button');
    
    // Verify primary button has correct classes
    await expect(button).toHaveClass('button--primary');
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    primary: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Secondary Button');
    
    // Verify secondary button has correct classes
    await expect(button).toHaveClass('button--secondary');
    await expect(button).not.toHaveClass('button--primary');
  },
};

export const Large: Story = {
  args: {
    label: 'Large Button',
    size: 'large',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Large Button');
    
    // Verify large size class
    await expect(button).toHaveClass('button--large');
  },
};

export const Small: Story = {
  args: {
    label: 'Small Button',
    size: 'small',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Small Button');
    
    // Verify small size class
    await expect(button).toHaveClass('button--small');
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Button',
    size: 'medium',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Medium Button');
    await expect(button).toHaveClass('button--medium');
  },
};

export const PrimaryLarge: Story = {
  args: {
    label: 'Primary Large',
    primary: true,
    size: 'large',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('button--primary');
    await expect(button).toHaveClass('button--large');
  },
};

export const PrimarySmall: Story = {
  args: {
    label: 'Primary Small',
    primary: true,
    size: 'small',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('button--primary');
    await expect(button).toHaveClass('button--small');
  },
};
