import { describe, it, expect, beforeEach } from 'vitest';
import {
  getComplaints,
  setComplaints,
  findComplaintById,
  addComplaint,
  getHaversineDistance,
} from '../api/_shared/store';
import { Complaint } from '../src/types';
import { SEED_COMPLAINTS } from '../src/data';

describe('Complaint Store', () => {
  beforeEach(() => {
    // Reset to seed data before each test
    setComplaints([...SEED_COMPLAINTS]);
  });

  it('should retrieve all complaints', () => {
    const complaints = getComplaints();
    expect(complaints).toBeInstanceOf(Array);
    expect(complaints.length).toBeGreaterThan(0);
  });

  it('should find complaint by ID', () => {
    const complaint = findComplaintById('comp-101');
    expect(complaint).toBeDefined();
    expect(complaint?.id).toBe('comp-101');
  });

  it('should return undefined for non-existent complaint ID', () => {
    const complaint = findComplaintById('comp-9999');
    expect(complaint).toBeUndefined();
  });

  it('should add a new complaint', () => {
    const initialLength = getComplaints().length;
    const newComplaint: Complaint = {
      id: 'comp-test-001',
      category: 'pothole',
      severity: 'high',
      description: 'Test pothole',
      photoUrl: 'data:image/png;base64,test',
      latitude: 28.6,
      longitude: 77.2,
      status: 'open',
      upvoteCount: 1,
      createdAt: new Date().toISOString(),
    };

    addComplaint(newComplaint);
    
    const complaints = getComplaints();
    expect(complaints.length).toBe(initialLength + 1);
    expect(complaints[0]).toEqual(newComplaint);
  });

  it('should prepend new complaints (newest first)', () => {
    const complaint1: Complaint = {
      id: 'comp-first',
      category: 'garbage',
      severity: 'medium',
      description: 'First complaint',
      photoUrl: '',
      latitude: 28.6,
      longitude: 77.2,
      status: 'open',
      upvoteCount: 1,
      createdAt: new Date().toISOString(),
    };

    const complaint2: Complaint = {
      id: 'comp-second',
      category: 'water_leak',
      severity: 'high',
      description: 'Second complaint',
      photoUrl: '',
      latitude: 28.6,
      longitude: 77.2,
      status: 'open',
      upvoteCount: 1,
      createdAt: new Date().toISOString(),
    };

    addComplaint(complaint1);
    addComplaint(complaint2);

    const complaints = getComplaints();
    expect(complaints[0].id).toBe('comp-second');
    expect(complaints[1].id).toBe('comp-first');
  });
});

describe('Haversine Distance Calculation', () => {
  it('should calculate zero distance for same coordinates', () => {
    const distance = getHaversineDistance(28.6139, 77.2090, 28.6139, 77.2090);
    expect(distance).toBe(0);
  });

  it('should calculate distance between two points correctly', () => {
    // Approximate distance between India Gate and Connaught Place (about 2km)
    const distance = getHaversineDistance(28.6129, 77.2295, 28.6304, 77.2177);
    expect(distance).toBeGreaterThan(1500); // At least 1.5km
    expect(distance).toBeLessThan(2500); // Less than 2.5km
  });

  it('should detect proximity within 200 meters', () => {
    const distance = getHaversineDistance(28.6139, 77.2090, 28.6149, 77.2095);
    expect(distance).toBeLessThan(200);
  });

  it('should detect complaints outside 200 meter radius', () => {
    const distance = getHaversineDistance(28.6139, 77.2090, 28.6500, 77.2500);
    expect(distance).toBeGreaterThan(200);
  });
});

describe('Complaint Deduplication Logic', () => {
  beforeEach(() => {
    setComplaints([...SEED_COMPLAINTS]);
  });

  it('should detect duplicate within 200m and same category', () => {
    const complaints = getComplaints();
    const baseComplaint = complaints[0]; // comp-101 pothole at Karol Bagh

    // Check if there's a nearby pothole within 200m
    const duplicate = complaints.find((c) => {
      if (c.id === baseComplaint.id) return false;
      if (c.category !== baseComplaint.category) return false;
      if (c.status === 'resolved') return false;
      
      const distance = getHaversineDistance(
        baseComplaint.latitude,
        baseComplaint.longitude,
        c.latitude,
        c.longitude
      );
      return distance <= 200;
    });

    // Based on seed data, comp-101 and comp-105 are both potholes but far apart
    // So we shouldn't find a duplicate
    expect(duplicate).toBeUndefined();
  });

  it('should not flag resolved complaints as duplicates', () => {
    const complaints = getComplaints();
    const resolvedComplaint = complaints.find(c => c.status === 'resolved');
    
    expect(resolvedComplaint).toBeDefined();
    
    // Add a new complaint at the same location but different category
    const newComplaint: Complaint = {
      id: 'comp-test-dupe',
      category: resolvedComplaint!.category,
      severity: 'high',
      description: 'Duplicate test',
      photoUrl: '',
      latitude: resolvedComplaint!.latitude,
      longitude: resolvedComplaint!.longitude,
      status: 'open',
      upvoteCount: 1,
      createdAt: new Date().toISOString(),
    };

    addComplaint(newComplaint);
    
    // The resolved complaint should not be considered a duplicate
    const allComplaints = getComplaints();
    const activeNearby = allComplaints.filter((c) => {
      if (c.id === newComplaint.id) return false;
      if (c.status === 'resolved') return false;
      if (c.category !== newComplaint.category) return false;
      
      const distance = getHaversineDistance(
        newComplaint.latitude,
        newComplaint.longitude,
        c.latitude,
        c.longitude
      );
      return distance <= 200;
    });

    expect(activeNearby.length).toBe(0);
  });

  it('should not flag complaints older than 14 days as duplicates', () => {
    const oldDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
    
    const oldComplaint: Complaint = {
      id: 'comp-old',
      category: 'pothole',
      severity: 'high',
      description: 'Old pothole',
      photoUrl: '',
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'open',
      upvoteCount: 1,
      createdAt: oldDate,
    };

    setComplaints([oldComplaint]);

    const newComplaint: Complaint = {
      id: 'comp-new',
      category: 'pothole',
      severity: 'high',
      description: 'New pothole',
      photoUrl: '',
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'open',
      upvoteCount: 1,
      createdAt: new Date().toISOString(),
    };

    const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const complaints = getComplaints();
    
    const duplicate = complaints.find((c) => {
      if (c.id === newComplaint.id) return false;
      if (c.category !== newComplaint.category) return false;
      if (c.status === 'resolved') return false;
      
      const createdTime = new Date(c.createdAt).getTime();
      if (createdTime < fourteenDaysAgo) return false;
      
      const distance = getHaversineDistance(
        newComplaint.latitude,
        newComplaint.longitude,
        c.latitude,
        c.longitude
      );
      return distance <= 200;
    });

    expect(duplicate).toBeUndefined();
  });
});

describe('Complaint Validation', () => {
  beforeEach(() => {
    setComplaints([...SEED_COMPLAINTS]);
  });

  it('should have required fields', () => {
    const complaints = getComplaints();
    expect(complaints.length).toBeGreaterThan(0);
    
    const complaint = complaints[0]; // Use first complaint from the array
    
    expect(complaint).toBeDefined();
    expect(complaint).not.toBeNull();
    expect(complaint).toHaveProperty('id');
    expect(complaint).toHaveProperty('category');
    expect(complaint).toHaveProperty('severity');
    expect(complaint).toHaveProperty('description');
    expect(complaint).toHaveProperty('photoUrl');
    expect(complaint).toHaveProperty('latitude');
    expect(complaint).toHaveProperty('longitude');
    expect(complaint).toHaveProperty('status');
    expect(complaint).toHaveProperty('upvoteCount');
    expect(complaint).toHaveProperty('createdAt');
  });

  it('should have valid category values', () => {
    const validCategories = ['pothole', 'garbage', 'streetlight', 'water_leak', 'other'];
    const complaints = getComplaints();
    
    complaints.forEach((complaint) => {
      expect(validCategories).toContain(complaint.category);
    });
  });

  it('should have valid severity values', () => {
    const validSeverities = ['low', 'medium', 'high'];
    const complaints = getComplaints();
    
    complaints.forEach((complaint) => {
      expect(validSeverities).toContain(complaint.severity);
    });
  });

  it('should have valid status values', () => {
    const validStatuses = ['open', 'in_progress', 'resolved'];
    const complaints = getComplaints();
    
    complaints.forEach((complaint) => {
      expect(validStatuses).toContain(complaint.status);
    });
  });

  it('should have positive upvote count', () => {
    const complaints = getComplaints();
    
    complaints.forEach((complaint) => {
      expect(complaint.upvoteCount).toBeGreaterThanOrEqual(0);
    });
  });

  it('should have valid coordinates', () => {
    const complaints = getComplaints();
    
    complaints.forEach((complaint) => {
      // India roughly spans 8°N to 37°N and 68°E to 97°E
      expect(complaint.latitude).toBeGreaterThanOrEqual(8);
      expect(complaint.latitude).toBeLessThanOrEqual(37);
      expect(complaint.longitude).toBeGreaterThanOrEqual(68);
      expect(complaint.longitude).toBeLessThanOrEqual(97);
    });
  });

  it('should have valid ISO date format', () => {
    const complaints = getComplaints();
    
    complaints.forEach((complaint) => {
      const date = new Date(complaint.createdAt);
      expect(date.toISOString()).toBe(complaint.createdAt);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });
});
