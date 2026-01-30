import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { expect, within, userEvent } from 'storybook/test';
import { Card } from './card';

const meta: Meta<Card> = {
  title: 'Components/Card',
  component: Card,
  render: (args) => ({
    props: args,
  }),
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
    footer: { control: 'text' },
    elevated: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Card>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    content: 'This is the card content with some interesting information.',
    footer: 'Card footer',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify title is present
    const title = canvas.getByRole('heading', { level: 3 });
    await expect(title).toBeInTheDocument();
    await expect(title).toHaveTextContent('Card Title');
    
    // Verify content is present
    await expect(canvas.getByText(/This is the card content/)).toBeInTheDocument();
    
    // Verify footer is present
    await expect(canvas.getByText('Card footer')).toBeInTheDocument();
  },
};

export const WithoutTitle: Story = {
  args: {
    content: 'Card content without a title',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify no heading
    const headings = canvas.queryAllByRole('heading');
    await expect(headings).toHaveLength(0);
    
    // Verify content is present
    await expect(canvas.getByText(/Card content without a title/)).toBeInTheDocument();
  },
};

export const WithoutFooter: Story = {
  args: {
    title: 'Card without footer',
    content: 'This card has no footer section.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify title
    await expect(canvas.getByRole('heading')).toHaveTextContent('Card without footer');
    
    // Verify content
    await expect(canvas.getByText(/This card has no footer/)).toBeInTheDocument();
    
    // Verify no footer text (small element)
    const cardElement = canvasElement.querySelector('.card');
    const footerElement = cardElement?.querySelector('.card-footer');
    await expect(footerElement).toBeNull();
  },
};

export const Elevated: Story = {
  args: {
    title: 'Elevated Card',
    content: 'This card has elevation with a shadow.',
    elevated: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify elevated class
    const cardElement = canvasElement.querySelector('.card');
    await expect(cardElement).toHaveClass('card--elevated');
    
    // Verify content
    await expect(canvas.getByText(/This card has elevation/)).toBeInTheDocument();
  },
};

export const LongContent: Story = {
  args: {
    title: 'Card with Long Content',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    footer: 'Updated 2 hours ago',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify title
    await expect(canvas.getByRole('heading')).toBeInTheDocument();
    
    // Verify long content is present
    await expect(canvas.getByText(/Lorem ipsum dolor sit amet/)).toBeInTheDocument();
    await expect(canvas.getByText(/Updated 2 hours ago/)).toBeInTheDocument();
  },
};

export const MinimalCard: Story = {
  args: {
    content: 'Minimal card with only content.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify only content is present
    await expect(canvas.getByText('Minimal card with only content.')).toBeInTheDocument();
    
    // Verify no title
    const headings = canvas.queryAllByRole('heading');
    await expect(headings).toHaveLength(0);
    
    // Verify card element exists
    const cardElement = canvasElement.querySelector('.card');
    await expect(cardElement).toBeInTheDocument();
  },
};
