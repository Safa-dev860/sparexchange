// components/LocationMap.js
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationMap = ({ onSelect }) => {
  const [position, setPosition] = React.useState([34.0, 9.0]); // Default to Tunisia's center

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  React.useEffect(() => {
    map.setView(position, 7); // Set initial zoom level
  }, [position, map]);

  return (
    <MapContainer
      center={position}
      zoom={7}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position}>
        <Popup>
          Latitude: {position[0].toFixed(4)}
          <br />
          Longitude: {position[1].toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
