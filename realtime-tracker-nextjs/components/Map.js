// components/Map.js
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';

// Fix for default Leaflet icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = () => {
  const mapRef = useRef(null);
  const markers = useRef({});
  const socket = useRef(null);

  useEffect(() => {
    console.log("Map component useEffect triggered.");

    if (!mapRef.current) {
      console.log("Initializing Leaflet map...");
      mapRef.current = L.map('map').setView([0, 0], 2); // Start zoomed out
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
      console.log("Map initialized.");
    }

    // Use a single instance of the socket client
    if (!socket.current) {
        console.log("Setting up socket connection...");
        socket.current = io();

        socket.current.on('receive-location', (data) => {
            const { id, latitude, longitude } = data;
            const position = [latitude, longitude];
            console.log(`Received location for ID ${id}:`, position);
    
            if (markers.current[id]) {
                markers.current[id].setLatLng(position);
            } else {
                markers.current[id] = L.marker(position).addTo(mapRef.current);
            }
        });
    }


    if (navigator.geolocation) {
        console.log("Setting up geolocation watch...");
        navigator.geolocation.watchPosition(
            // Success Callback
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`Geolocation success! Sending location: ${latitude}, ${longitude}`);
                socket.current.emit('send-location', { latitude, longitude });
                mapRef.current.setView([latitude, longitude], 16);
            },
            // Error Callback
            (error) => {
                console.error("Geolocation error:", error);
                alert(`Error getting location: ${error.message}`);
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        console.log("Disconnecting socket.");
        socket.current.disconnect();
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default Map;