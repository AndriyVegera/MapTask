import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { collection, getDocs, doc, setDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { db } from '../firebase/firebase';

interface MarkerData {
    id: number;
    position: { lat: number; lng: number };
    timestamp?: Date;
}

const mapContainerStyle: React.CSSProperties = {
    width: '90vw',
    height: '100vh',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '5px solid black',
};

const MapContent: React.FC = () => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [nextQuest, setNextQuest] = useState<number>(1);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'markers'));
                const data = snapshot.docs.map((doc) => ({
                    id: Number(doc.id.replace('Quest', '')),
                    position: {
                        lat: doc.data().location.latitude,
                        lng: doc.data().location.longitude,
                    },
                    timestamp: doc.data().timestamp.toDate(),
                }));
                setMarkers(data);

                // Update nextQuest based on the maximum id in the existing markers
                const maxId = data.length > 0 ? Math.max(...data.map((marker) => marker.id)) : 0;
                setNextQuest(maxId + 1);
            } catch (error) {
                console.error('Error fetching markers from Firebase:', error);
            }
        };

        fetchMarkers();
    }, []);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newMarker: MarkerData = {
                id: nextQuest,
                position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                timestamp: new Date(),
            };

            setMarkers([...markers, newMarker]);
            setNextQuest(nextQuest + 1);
        }
    };

    const handleMarkerDragEnd = (markerId: number, newPosition: google.maps.LatLngLiteral) => {
        const updatedMarkers = markers.map((marker) =>
            marker.id === markerId ? { ...marker, position: newPosition } : marker
        );
        setMarkers(updatedMarkers);
    };

    const handleDeleteMarker = (markerId: number) => {
        const updatedMarkers = markers.filter((marker) => marker.id !== markerId);
        setMarkers(updatedMarkers);
    };

    const handleDeleteAllMarkers = () => {
        setMarkers([]);
        // Do not reset nextQuest to 1 here
    };

    const handleSaveToFirebase = async () => {
        markers.forEach(async (marker) => {
            if (marker.position) {
                const docRef = doc(db, 'markers', `Quest${marker.id}`);
                await setDoc(docRef, {
                    location: new GeoPoint(marker.position.lat, marker.position.lng),
                    timestamp: serverTimestamp(),
                });
            }
        });
    };

    return (
        <LoadScript googleMapsApiKey={'AIzaSyDBdTX4lgk9yx_XNjYvWAnFnGmxCB-t2RI'}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={2}
                onClick={handleMapClick}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        draggable
                        onDragEnd={(event) => handleMarkerDragEnd(marker.id, event.latLng!.toJSON())}
                        onClick={() => handleDeleteMarker(marker.id)}
                        label={String(marker.id)}
                    />
                ))}
                <div className='buttons'>
                    <button className='saveButton' onClick={handleSaveToFirebase}>
                        Save to Firebase
                    </button>
                    <button className='deleteButton' onClick={handleDeleteAllMarkers}>
                        Delete All Markers
                    </button>
                </div>
            </GoogleMap>
        </LoadScript>
    );
};

export default MapContent;