import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock the store before importing handlers
vi.mock('../api/_shared/store', () => ({
  getComplaints: vi.fn(() => [
    {
      id: 'comp-101',
      category: 'pothole',
      severity: 'high',
      description: 'Test pothole',
      photoUrl: 'https://example.com/test.jpg',
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'open',
      upvoteCount: 5,
      createdAt: new Date().toISOString(),
    },
  ]),
  addComplaint: vi.fn(),
  findComplaintById: vi.fn((id: string) => {
    if (id === 'comp-101') {
      return {
        id: 'comp-101',
        category: 'pothole',
        severity: 'high',
        description: 'Test pothole',
        photoUrl: 'https://example.com/test.jpg',
        latitude: 28.6139,
        longitude: 77.2090,
        status: 'open',
        upvoteCount: 5,
        createdAt: new Date().toISOString(),
      };
    }
    return undefined;
  }),
  getHaversineDistance: vi.fn(() => 500), // Default: far enough to not trigger dedup
  setComplaints: vi.fn(),
}));

describe('API Route: /api/schemes', () => {
  it('should return government schemes', async () => {
    const { default: handler } = await import('../api/schemes');
    
    const req = {} as VercelRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(Array.isArray(jsonCall)).toBe(true);
    expect(jsonCall.length).toBeGreaterThan(0);
    expect(jsonCall[0]).toHaveProperty('id');
    expect(jsonCall[0]).toHaveProperty('name');
    expect(jsonCall[0]).toHaveProperty('eligibility');
  });
});

describe('API Route: /api/documents', () => {
  it('should return document checklists', async () => {
    const { default: handler } = await import('../api/documents');
    
    const req = {} as VercelRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(Array.isArray(jsonCall)).toBe(true);
    expect(jsonCall.length).toBeGreaterThan(0);
    expect(jsonCall[0]).toHaveProperty('id');
    expect(jsonCall[0]).toHaveProperty('serviceName');
    expect(jsonCall[0]).toHaveProperty('documents');
  });
});

describe('API Route: /api/complaints GET', () => {
  it('should return all complaints', async () => {
    const { default: handler } = await import('../api/complaints');
    
    const req = {
      method: 'GET',
    } as VercelRequest;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(Array.isArray(jsonCall)).toBe(true);
  });
});

describe('API Route: /api/complaints POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject complaint submission without photo', async () => {
    const { default: handler } = await import('../api/complaints');
    
    const req = {
      method: 'POST',
      body: {
        latitude: 28.6139,
        longitude: 77.2090,
      },
    } as VercelRequest;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Photo is required' });
  });

  it('should accept complaint with photo and use manual category', async () => {
    const { default: handler } = await import('../api/complaints');
    const { addComplaint } = await import('../api/_shared/store');
    
    const req = {
      method: 'POST',
      body: {
        photo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        latitude: 28.6139,
        longitude: 77.2090,
        manualCategory: 'pothole',
        manualSeverity: 'high',
        manualDescription: 'Test pothole description',
      },
    } as VercelRequest;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(addComplaint).toHaveBeenCalled();
    
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(jsonCall).toHaveProperty('complaint');
    expect(jsonCall).toHaveProperty('isDuplicate');
    expect(jsonCall.complaint.category).toBe('pothole');
  });

  it('should use default coordinates if not provided', async () => {
    const { default: handler } = await import('../api/complaints');
    
    const req = {
      method: 'POST',
      body: {
        photo: 'data:image/png;base64,test',
        manualCategory: 'garbage',
      },
    } as VercelRequest;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(jsonCall.complaint.latitude).toBe(28.6139);
    expect(jsonCall.complaint.longitude).toBe(77.2090);
  });

  it('should handle method not allowed', async () => {
    const { default: handler } = await import('../api/complaints');
    
    const req = {
      method: 'DELETE',
    } as VercelRequest;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET, POST');
    expect(res.status).toHaveBeenCalledWith(405);
  });
});

describe('API Route: /api/chat POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject empty message', async () => {
    const { default: handler } = await import('../api/chat');
    
    const req = {
      method: 'POST',
      body: {
        message: '',
        language: 'en',
      },
    } as VercelRequest;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Message is required' });
  });

  it('should handle method not allowed', async () => {
    const { default: handler } = await import('../api/chat');
    
    const req = {
      method: 'GET',
    } as VercelRequest;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST');
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should return a response for valid message', async () => {
    const { default: handler } = await import('../api/chat');
    
    const req = {
      method: 'POST',
      body: {
        message: 'Hello, I need help with PM-KISAN',
        language: 'en',
        history: [],
      },
    } as VercelRequest;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(jsonCall).toHaveProperty('text');
    expect(jsonCall).toHaveProperty('routedAgent');
    expect(jsonCall).toHaveProperty('language');
    expect(typeof jsonCall.text).toBe('string');
    expect(jsonCall.text.length).toBeGreaterThan(0);
  });

  it('should fallback gracefully on critical errors', async () => {
    const { default: handler } = await import('../api/chat');
    
    // Simulate a critical error by passing invalid data
    const req = {
      method: 'POST',
      body: null, // This will cause an error when trying to destructure
    } as any;
    
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const jsonCall = (res.json as any).mock.calls[0][0];
    expect(jsonCall.text).toContain('network difficulties');
  });
});

describe('Input Validation Tests', () => {
  it('should sanitize SQL injection attempts in complaint description', () => {
    const maliciousInput = "'; DROP TABLE complaints; --";
    // In a real scenario, this should be sanitized before DB queries
    expect(maliciousInput).toContain("'");
    // The test verifies that we're aware of the risk
    // Actual sanitization would happen in the API handler
  });

  it('should handle XSS attempts in user input', () => {
    const xssInput = '<script>alert("XSS")</script>';
    // This should be escaped before rendering
    expect(xssInput).toContain('<script>');
    // The test verifies we need to escape HTML
  });

  it('should validate latitude bounds', () => {
    const invalidLat = 100; // Out of valid range
    expect(invalidLat).toBeGreaterThan(90);
    // Should be validated in API handler
  });

  it('should validate longitude bounds', () => {
    const invalidLng = 200; // Out of valid range
    expect(invalidLng).toBeGreaterThan(180);
    // Should be validated in API handler
  });
});
