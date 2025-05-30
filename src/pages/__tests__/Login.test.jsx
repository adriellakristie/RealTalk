import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Login from '../Login';

// Mock navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve())
}));

// Mock Firebase config
vi.mock('../../firebase', () => ({
  auth: {}
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('renders login form', () => {
    renderLogin();
    
    // Check if important elements are rendered
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('updates email input value', () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Email address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password input value', () => {
    renderLogin();
    
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput.value).toBe('password123');
  });

  it('shows loading state when submitting', async () => {
    renderLogin();
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton.textContent).toBe('Signing in...');
  });
}); 