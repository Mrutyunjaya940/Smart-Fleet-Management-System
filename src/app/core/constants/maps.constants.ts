// =====================================================
// Google Maps API Key — update this with your key
// Get one at: https://console.cloud.google.com
// Enable: Maps JavaScript API + Directions API
// =====================================================
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

export const DEFAULT_MAP_CENTER = { lat: 20.2961, lng: 85.8245 }; // Bhubaneswar
export const DEFAULT_MAP_ZOOM = 13;

export const MAP_STYLES_DARK: any[] = [
  { elementType: 'geometry',         stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'road',             elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road',             elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'water',            elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water',            elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
  { featureType: 'poi',              stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',          stylers: [{ visibility: 'off' }] }
];

export const MAP_STYLES_LIGHT: any[] = [
  { featureType: 'poi',     stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road',    elementType: 'geometry', stylers: [{ color: '#f8f8f8' }] },
  { featureType: 'road',    elementType: 'geometry.stroke', stylers: [{ color: '#e0e0e0' }] }
];
