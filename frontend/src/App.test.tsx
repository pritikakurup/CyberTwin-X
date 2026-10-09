import { render, screen } from '@testing-library/react';
import App from './App';
import Register from './pages/Register';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('CyberTwin-X Frontend Application Suite', () => {
  it('1. Renders login page by default when unauthenticated', () => {
    localStorage.clear();
    render(<App />);
    expect(screen.getByText(/CyberTwin-X SOC/i)).toBeInTheDocument();
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Console/i })).toBeInTheDocument();
  });

  it('2. Renders registration form correctly', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText(/CyberTwin-X Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register Account/i })).toBeInTheDocument();
  });
});
