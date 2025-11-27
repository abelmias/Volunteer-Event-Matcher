import { Injectable } from '@angular/core';
import * as L from 'leaflet';

/**
 * Map Service
 * Handles all map-related operations using Leaflet library
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  /**
   * Initialize a Leaflet map
   * @param containerId - ID of the HTML element to mount the map
   * @param latitude - Center latitude
   * @param longitude - Center longitude
   * @param zoom - Zoom level (default 13)
   * @returns Leaflet map instance
   */
  initializeMap(containerId: string, latitude: number, longitude: number, zoom: number = 13): L.Map {
    const map = L.map(containerId).setView([latitude, longitude], zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    return map;
  }

  /**
   * Add a marker to the map
   * @param map - Leaflet map instance
   * @param latitude - Marker latitude
   * @param longitude - Marker longitude
   * @param title - Marker title/popup text
   * @param icon - Custom icon (optional)
   * @returns Leaflet marker instance
   */
  addMarker(
    map: L.Map,
    latitude: number,
    longitude: number,
    title: string,
    icon?: L.Icon
  ): L.Marker {
    const marker = L.marker([latitude, longitude], { icon }).addTo(map);
    marker.bindPopup(title);
    return marker;
  }

  /**
   * Add multiple markers to the map
   * @param map - Leaflet map instance
   * @param locations - Array of location objects with lat, lng, and title
   * @returns Array of Leaflet marker instances
   */
  addMultipleMarkers(
    map: L.Map,
    locations: Array<{ lat: number; lng: number; title: string }>
  ): L.Marker[] {
    return locations.map(location =>
      this.addMarker(map, location.lat, location.lng, location.title)
    );
  }

  /**
   * Create a custom icon for markers
   * @param color - Icon color (default 'blue')
   * @param iconName - Icon name (default 'info-sign')
   * @returns Leaflet icon instance
   */
  createCustomIcon(color: string = 'blue', iconName: string = 'info-sign'): L.Icon {
    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  /**
   * Fit map bounds to show all markers
   * @param map - Leaflet map instance
   * @param markers - Array of markers
   */
  fitBounds(map: L.Map, markers: L.Marker[]): void {
    if (markers.length === 0) return;

    const group = new L.FeatureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }

  /**
   * Calculate distance between two coordinates in kilometers
   * @param lat1 - First latitude
   * @param lon1 - First longitude
   * @param lat2 - Second latitude
   * @param lon2 - Second longitude
   * @returns Distance in kilometers
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   * @param degrees - Angle in degrees
   * @returns Angle in radians
   */
  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get user's current location
   * @returns Promise with user's coordinates
   */
  getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser'));
      }
    });
  }

  /**
   * Add a circle to the map (for radius visualization)
   * @param map - Leaflet map instance
   * @param latitude - Center latitude
   * @param longitude - Center longitude
   * @param radiusMeters - Radius in meters
   * @param color - Circle color (default 'blue')
   * @returns Leaflet circle instance
   */
  addCircle(
    map: L.Map,
    latitude: number,
    longitude: number,
    radiusMeters: number,
    color: string = 'blue'
  ): L.Circle {
    return L.circle([latitude, longitude], {
      color: color,
      fillColor: color,
      fillOpacity: 0.2,
      radius: radiusMeters
    }).addTo(map);
  }

  /**
   * Add a polyline to the map (for routes)
   * @param map - Leaflet map instance
   * @param coordinates - Array of [lat, lng] coordinates
   * @param color - Line color (default 'blue')
   * @returns Leaflet polyline instance
   */
  addPolyline(
    map: L.Map,
    coordinates: Array<[number, number]>,
    color: string = 'blue'
  ): L.Polyline {
    return L.polyline(coordinates, {
      color: color,
      weight: 3,
      opacity: 0.7,
      smoothFactor: 1.0
    }).addTo(map);
  }

  /**
   * Remove all layers from map except tiles
   * @param map - Leaflet map instance
   */
  clearMap(map: L.Map): void {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
  }

  /**
   * Destroy map instance
   * @param map - Leaflet map instance
   */
  destroyMap(map: L.Map): void {
    map.remove();
  }
}
