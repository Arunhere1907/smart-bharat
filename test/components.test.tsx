import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import App from '../src/App';

// Mock fetch globally
global.fetch = vi.fn();

describe('App Component - Basic Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it('should render without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('should fetch complaints on mount', async () => {
    const mockComplaints = [
      {
        id: 'comp-101',
        category: 'pothole',
        severity: 'high',
        description: 'Test',
        photoUrl: 'test.jpg',
        latitude: 28.6,
        longitude: 77.2,
        status: 'open',
        upvoteCount: 5,
        createdAt: new Date().toISOString(),
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockComplaints,
    });

    render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/complaints');
    });
  });

  it('should have language selector in DOM', () => {
    const { container } = render(<App />);
    const selector = container.querySelector('#global-language-selector');
    expect(selector).toBeInTheDocument();
  });

  it('should have navigation elements in DOM', () => {
    const { container } = render(<App />);
    const navButtons = container.querySelectorAll('button');
    expect(navButtons.length).toBeGreaterThan(0);
  });
});

describe('Data Integrity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it('should not expose sensitive data client-side', () => {
    const { container } = render(<App />);
    
    // Check that no API keys are rendered
    const bodyText = container.textContent || '';
    expect(bodyText).not.toContain('GEMINI_API_KEY');
    expect(bodyText).not.toContain('SUPABASE');
    expect(bodyText).not.toContain('service_role');
  });

  it('should handle fetch errors gracefully', async () => {
    // Mock console.error to suppress expected error logs
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    // Should not throw - App should handle the error
    expect(() => render(<App />)).not.toThrow();
    
    consoleErrorSpy.mockRestore();
  });
});
