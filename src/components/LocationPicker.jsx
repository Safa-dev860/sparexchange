import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define the SVG marker icon
const svgIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
    <path fill="#FF0000" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
`;

// Create a Leaflet icon from the SVG
const customMarkerIcon = L.divIcon({
  html: svgIcon,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  className: "",
});

const LocationPicker = ({ initialLocation, onSelect, onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation?.lat && initialLocation?.lng
      ? [initialLocation.lat, initialLocation.lng]
      : null
  );

  // Component to handle map click events
  const MapClickHandler = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]);
      },
    });
    return null;
  };

  const handleConfirm = async () => {
    if (selectedLocation) {
      const [lat, lng] = selectedLocation;

      try {
        // Fetch city name using Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        console.log("City data:", data);
        const city = data.display_name || "Unknown Location";

        // Pass the selected location and city name to the parent component
        onSelect({ lat, lng, city });
        onClose();
      } catch (error) {
        console.error("Error fetching city name:", error);
        // Fallback to coordinates if city name cannot be fetched
        onSelect({ lat, lng, city: "Unknown Location" });
        onClose();
      }
    }
  };

  return (
    <div>
      <MapContainer
        center={[33.8869, 9.5375]} // Center on Tunisia
        zoom={6} // Zoom level to show all of Tunisia
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {selectedLocation && (
          <Marker position={selectedLocation} icon={customMarkerIcon} />
        )}
      </MapContainer>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          type="button"
          onClick={handleConfirm}
          className="p-2 bg-green-500 text-white rounded-lg"
          disabled={!selectedLocation} // Disable if no location is selected
        >
          Confirm Location
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2 bg-red-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
