import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia (for Tailwind and dark mode)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock localStorage
const localStorageMock = {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
  clear: () => {},
  length: 0,
  key: (index: number) => null,
};

global.localStorage = localStorageMock as Storage;

// Mock navigator.geolocation
const geolocationMock = {
  getCurrentPosition: (success: PositionCallback) => {
    success({
      coords: {
        latitude: 28.6139,
        longitude: 77.2090,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
  },
  watchPosition: () => 1,
  clearWatch: () => {},
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: geolocationMock,
  writable: true,
});

// Mock scrollIntoView (not available in jsdom)
Element.prototype.scrollIntoView = () => {};

// Mock speechSynthesis (for TTS features)
const mockSpeechSynthesis = {
  speak: () => {},
  cancel: () => {},
  pause: () => {},
  resume: () => {},
  getVoices: () => [],
  speaking: false,
  pending: false,
  paused: false,
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

// Mock SpeechRecognition (for voice input)
(window as any).SpeechRecognition = class {
  continuous = false;
  interimResults = false;
  lang = 'en-US';
  onstart = null;
  onresult = null;
  onerror = null;
  onend = null;
  start() {}
  stop() {}
  abort() {}
};

(window as any).webkitSpeechRecognition = (window as any).SpeechRecognition;
