import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('App', () => {
  it('renders login page by default', () => {
    render(<App />);
    expect(screen.getByText(/CyberTwin-X Login/i)).toBeInTheDocument();
  });
});\n