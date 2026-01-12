import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapWithPin = ({ setPos, isMapOpen, setIsMapOpen, currentPos = {} }) => {
  const theme = useTheme();
  const { t } = useTranslation()
  const [userPosition, setUserPosition] = useState(null);
  const [position, setPosition] = useState(null);


  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (currentPos.latitude && currentPos.longitude) {
      setPosition({
        lat: Number(currentPos.latitude), lng: Number(currentPos.longitude)
      })
    } else {
      setPosition(null)
    }
  }, [currentPos])

  const Markers = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setPos(e.latlng)
        console.log(e.latlng)
      },
    });

    return position ? <Marker position={position} /> : null;
  };
  // Function to handle map centering
  // function CenterMap({ center }) {
  //   const map = useMap();
  //   map.setView(center, 13);
  //   return null;
  // }

  const getUserLocation = () => {
    if (isMapOpen) {
      setIsMapOpen(!isMapOpen)
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setIsMapOpen(true);
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        let message = '';
        switch (error.code) {
          case 1:
            message = 'Permission denied. Please allow location access.';
            break;
          case 2:
            message = 'Position unavailable. Try again later.';
            break;
          case 3:
            message = 'Request timed out. Please try again.';
            break;
          default:
            message = 'An unknown error occurred.';
        }
        setErrorMessage(`Error getting location: ${message}`);
        setIsLoading(false);
      }, {
      enableHighAccuracy: true, // ✅ Ask for best accuracy
      timeout: 10000,           // Optional: 10s timeout
      maximumAge: 0             // Don't use cached location
    }
    );
  };
  const fallbackPosition = { lat: 30.0444, lng: 31.2357 };
  return (
    <div style={{ width: '100%', zIndex: '50' }}>
      <Button
        variant="contained"
        fullWidth
        // onClick={() => setIsMapOpen(!isMapOpen)}
        onClick={getUserLocation}
        sx={{
          textTransform: "capitalize",
          backgroundColor: theme.palette.secondaryColor.main,
          color: "white",
          borderRadius: "10px",
          fontSize: "11px",
          height: "30px",
          "&:hover": { backgroundColor: theme.palette.secondaryColor.main },
        }}
      >
        <span className="icon-map-1" style={{ fontSize: "18px", marginRight: "6px" }}></span>

        {isLoading ? 'Detecting Location...' : isMapOpen ? "close" : t("pinYourLocation")}
      </Button>
      {/* {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )} */}
      {/* <button
        onClick={() => setIsMapOpen(!isMapOpen)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        {isMapOpen ? 'Close Map' : 'Open Map'}
      </button> */}

      {isMapOpen && (
        <div style={{ marginTop: '20px', height: '400px', width: '100%', display: 'flex', flexDirection: 'column' }}>
          <MapContainer
            center={position || userPosition || fallbackPosition}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            {/* <CenterMap center={userPosition} /> */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {/* {userPosition && <Marker position={userPosition} />} */}
            {/* {pins.map((pin, index) => (
              <Marker key={index} position={pin} >
                <Popup></Popup>
              </Marker>
            ))} */}
            <Markers />
          </MapContainer>

          {position && (
            <div style={{ marginTop: '10px' }}>
              <p>
                Latitude: {Number(position?.lat)?.toFixed(4)},
                Longitude: {Number(position?.lng)?.toFixed(4)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapWithPin;

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? (
      <div>Map failed to load</div>
    ) : (
      this.props.children
    );
  }
}

