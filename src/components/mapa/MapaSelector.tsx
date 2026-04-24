import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapaSelectorProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (coords: { latitude: number; longitude: number }) => void;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapClickHandler({ onChange }: Pick<MapaSelectorProps, "onChange">) {
  useMapEvents({
    click(event) {
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

export function MapaSelector({
  latitude,
  longitude,
  onChange,
}: MapaSelectorProps) {
  const defaultPosition: [number, number] = [-23.2642, -47.2992]; // Itu/SP
  const markerPosition: [number, number] | null =
    latitude && longitude ? [latitude, longitude] : null;

  return (
    <div className="mapa-selector">
      <label className="form-label">Marcar localização no mapa</label>

      <div className="mapa-box">
        <MapContainer
          center={markerPosition || defaultPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="mapa-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onChange={onChange} />

          {markerPosition && <Marker position={markerPosition} icon={markerIcon} />}
        </MapContainer>
      </div>

      {latitude && longitude && (
        <p className="mapa-coords">
          Localização selecionada: {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </p>
      )}
    </div>
  );
}