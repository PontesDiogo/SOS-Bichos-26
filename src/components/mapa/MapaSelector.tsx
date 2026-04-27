import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
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

function ChangeMapCenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);

  return null;
}

export function MapaSelector({
  latitude,
  longitude,
  onChange,
}: MapaSelectorProps) {
  const defaultPosition: [number, number] = [-23.2642, -47.2992]; // Itu/SP

  const [center, setCenter] = useState<[number, number]>(defaultPosition);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const markerPosition: [number, number] | null =
    latitude !== null && longitude !== null ? [latitude, longitude] : null;

  useEffect(() => {
    usarLocalizacaoAtual(false);
  }, []);

  function usarLocalizacaoAtual(deveMarcarNoMapa = true) {
    if (!navigator.geolocation) {
      setLocationError("Seu navegador não suporta geolocalização.");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCenter([coords.latitude, coords.longitude]);

        if (deveMarcarNoMapa) {
          onChange(coords);
        }

        setLocationLoading(false);
      },
      () => {
        setLocationError(
          "Não foi possível acessar sua localização. Você ainda pode marcar manualmente no mapa."
        );
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  return (
    <div className="mapa-selector">
      <div className="mapa-selector__header">
        <label className="form-label">Marcar localização no mapa</label>

        <button type="button" onClick={() => usarLocalizacaoAtual(true)}>
          {locationLoading ? "Localizando..." : "Usar minha localização"}
        </button>
      </div>

      <div className="mapa-box">
        <MapContainer
          center={markerPosition || center}
          zoom={13}
          scrollWheelZoom={true}
          className="mapa-container"
        >
          <ChangeMapCenter center={markerPosition || center} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onChange={onChange} />

          {markerPosition && (
            <Marker position={markerPosition} icon={markerIcon} />
          )}
        </MapContainer>
      </div>

      {latitude !== null && longitude !== null && (
        <p className="mapa-coords">
          Localização selecionada: {latitude.toFixed(5)},{" "}
          {longitude.toFixed(5)}
        </p>
      )}

      {locationError && <p className="form-error">{locationError}</p>}
    </div>
  );
}