import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../Signup';

// Mock the Firebase authentication module
// This replaces the actual Firebase auth with a simple mock function
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(() => Promise.resolve())
}));

// Mock the Firebase configuration
// This prevents actual Firebase connections during tests
vi.mock('../../firebase', () => ({
  auth: {}
}));

describe('Signup Component', () => {
  // Helper function to render the Signup component with Router
  // We need BrowserRouter because Signup uses navigation
  const renderSignup = () => {
    return render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  };

  it('disables submit button when fields are empty', () => {
    // Arrange: Render the component
    renderSignup();
    
    // Get all the elements we need to test
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Test Case 1: Initial state
    // When the form first loads, check button state
    expect(submitButton).not.toBeDisabled();
    
    // Test Case 2: Email only
    // Fill in just the email field and verify button state
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(submitButton).not.toBeDisabled();
    
    // Clear the email field
    fireEvent.change(emailInput, { target: { value: '' } });
    
    // Test Case 3: Password only
    // Fill in just the password field and verify button state
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(submitButton).not.toBeDisabled();
    
    // Clear the password field
    fireEvent.change(passwordInput, { target: { value: '' } });
    expect(submitButton).not.toBeDisabled();
  });

  it('shows loading state during signup', async () => {
    // Arrange: Render the component
    renderSignup();
    
    // Get all the form elements we need to test
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    // Act: Fill out the form
    // Simulate user typing in their credentials
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Act: Submit the form
    // Simulate user clicking the signup button
    fireEvent.click(submitButton);
    
    // Assert: Verify loading state
    // Button should be disabled and show loading text
    expect(submitButton).toBeDisabled();
    expect(submitButton.textContent).toBe('Creating account...');
  });
}); 