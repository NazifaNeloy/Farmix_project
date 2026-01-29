import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, useMap, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

// District Coordinates Dictionary (All 64 Districts of Bangladesh)
const DISTRICT_COORDS = {
    // Dhaka Division
    'Dhaka': [23.8103, 90.4125], 'Gazipur': [24.0023, 90.4264], 'Kishoreganj': [24.4260, 90.7700],
    'Manikganj': [23.8644, 90.0047], 'Munshiganj': [23.5422, 90.5305], 'Narayanganj': [23.6238, 90.5000],
    'Narsingdi': [23.9322, 90.7154], 'Tangail': [24.2513, 89.9167], 'Faridpur': [23.6071, 89.8429],
    'Gopalganj': [23.0051, 89.8266], 'Madaripur': [23.1641, 90.1897], 'Rajbari': [23.7574, 89.6254],
    'Shariatpur': [23.2423, 90.4348],

    // Chittagong Division
    'Chittagong': [22.3569, 91.7832], 'Brahmanbaria': [23.9571, 91.1119], 'Comilla': [23.4607, 91.1809],
    'Chandpur': [23.2321, 90.6631], 'Cox\'s Bazar': [21.4272, 92.0058], 'Feni': [23.0186, 91.3966],
    'Khagrachhari': [23.1193, 91.9847], 'Lakshmipur': [22.9447, 90.8282], 'Noakhali': [22.8724, 91.0973],
    'Rangamati': [22.6533, 92.1789], 'Bandarban': [22.1953, 92.2184],

    // Rajshahi Division
    'Rajshahi': [24.3636, 88.6241], 'Bogura': [24.8481, 89.3730], 'Joypurhat': [25.1023, 89.0276],
    'Naogaon': [24.7936, 88.9426], 'Natore': [24.4206, 89.0006], 'Chapainawabganj': [24.5965, 88.2775],
    'Pabna': [24.0063, 89.2496], 'Sirajganj': [24.4534, 89.7008],

    // Khulna Division
    'Khulna': [22.8456, 89.5403], 'Bagerhat': [22.6516, 89.7859], 'Chuadanga': [23.6402, 88.8418],
    'Jashore': [23.1664, 89.2081], 'Jhenaidah': [23.5450, 89.1726], 'Kushtia': [23.9013, 89.1205],
    'Magura': [23.4873, 89.4199], 'Meherpur': [23.7622, 88.6318], 'Narail': [23.1725, 89.5127],
    'Satkhira': [22.7185, 89.0705],

    // Barisal Division
    'Barisal': [22.7010, 90.3535], 'Barguna': [22.1515, 90.1261], 'Bhola': [22.6859, 90.6482],
    'Jhalokati': [22.6406, 90.1987], 'Patuakhali': [22.3596, 90.3299], 'Pirojpur': [22.5841, 89.9720],

    // Sylhet Division
    'Sylhet': [24.8949, 91.8687], 'Habiganj': [24.3749, 91.4155], 'Moulvibazar': [24.4829, 91.7774],
    'Sunamganj': [25.0658, 91.3950],

    // Rangpur Division
    'Rangpur': [25.7439, 89.2752], 'Dinajpur': [25.6217, 88.6355], 'Gaibandha': [25.3288, 89.5295],
    'Kurigram': [25.8054, 89.6361], 'Lalmonirhat': [25.9165, 89.4532], 'Nilphamari': [25.9318, 88.8561],
    'Panchagarh': [26.3411, 88.5542], 'Thakurgaon': [26.0337, 88.4617],

    // Mymensingh Division
    'Mymensingh': [24.7471, 90.4203], 'Jamalpur': [24.9375, 89.9378], 'Netrokona': [24.8709, 90.7279],
    'Sherpur': [25.0205, 90.0153]
};

// Component to update map center dynamically
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
};

const CommunityMap = () => {
    const { userData } = useAuth();
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState([23.8103, 90.4125]); // Default: Dhaka
    const [loading, setLoading] = useState(true);

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter([latitude, longitude]);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not get your location. Please check browser permissions.");
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        const initializeMap = async () => {
            setLoading(true);

            // 1. Determine Center based on User Profile
            let userDistrict = null;
            if (userData?.location) {
                const locationParts = userData.location.split(',').map(s => s.trim());
                for (const part of locationParts) {
                    // Case-insensitive check
                    const match = Object.keys(DISTRICT_COORDS).find(key => key.toLowerCase() === part.toLowerCase());
                    if (match) {
                        userDistrict = match;
                        setCenter(DISTRICT_COORDS[match]);
                        break;
                    }
                }
            }

            // If no district found from profile, try browser geolocation automatically once
            if (!userDistrict && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCenter([position.coords.latitude, position.coords.longitude]);
                    },
                    (err) => console.log("Auto-location failed:", err)
                );
            }

            // 2. Fetch Data & Generate Markers
            try {
                const q = query(collection(db, 'batches'), limit(50));
                const querySnapshot = await getDocs(q);
                const fetchedMarkers = [];

                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();

                        // Try to find coordinates
                        let batchLat = center[0];
                        let batchLng = center[1];
                        const locString = data.storageLocation || data.location || data.division || '';
                        const locParts = locString.split(',').map(s => s.trim());

                        let found = false;
                        for (const part of locParts) {
                            const match = Object.keys(DISTRICT_COORDS).find(key => key.toLowerCase() === part.toLowerCase());
                            if (match) {
                                batchLat = DISTRICT_COORDS[match][0];
                                batchLng = DISTRICT_COORDS[match][1];
                                found = true;
                                break;
                            }
                        }

                        // Jitter for visual separation
                        const jitter = 0.02;
                        const lat = batchLat + (Math.random() - 0.5) * jitter;
                        const lng = batchLng + (Math.random() - 0.5) * jitter;

                        // Determine Risk Color
                        const isHighRisk = data.riskLevel === 'Critical' || data.riskLevel === 'High' || data.status === 'Critical';

                        fetchedMarkers.push({
                            id: doc.id,
                            lat,
                            lng,
                            crop: data.cropType || data.crop || 'Crop',
                            risk: isHighRisk ? 'High' : 'Safe',
                            color: isHighRisk ? '#EF4444' : '#22C55E' // Red vs Green
                        });
                    });
                }

                // 3. Generate Mock Neighbors (10-15)
                const mockMarkers = [];
                const mockCount = Math.floor(Math.random() * 6) + 10;

                for (let i = 0; i < mockCount; i++) {
                    const lat = center[0] + (Math.random() - 0.5) * 0.08;
                    const lng = center[1] + (Math.random() - 0.5) * 0.08;
                    const isHighRisk = Math.random() > 0.7; // 30% chance of high risk
                    const crops = ['Paddy', 'Wheat', 'Potato', 'Corn', 'Mustard', 'Vegetables'];
                    const randomCrop = crops[Math.floor(Math.random() * crops.length)];

                    mockMarkers.push({
                        id: `mock-${i}`,
                        lat,
                        lng,
                        crop: randomCrop,
                        risk: isHighRisk ? 'High' : 'Safe',
                        color: isHighRisk ? '#EF4444' : '#22C55E',
                        isSimulation: true
                    });
                }

                setMarkers([...fetchedMarkers, ...mockMarkers]);

            } catch (error) {
                console.error("Error fetching map data:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeMap();
    }, [userData, center[0], center[1]]);

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
            {loading && (
                <div className="absolute inset-0 bg-gray-100/80 z-[1000] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            )}

            <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="w-full h-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={center} />

                {markers.map((marker) => (
                    <CircleMarker
                        key={marker.id}
                        center={[marker.lat, marker.lng]}
                        pathOptions={{
                            color: marker.color,
                            fillColor: marker.color,
                            fillOpacity: 0.7,
                            weight: 2
                        }}
                        radius={10}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div className="text-center">
                                <span className="font-bold block">{marker.crop}</span>
                                <span className={`text-xs ${marker.risk === 'High' ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                                    Risk: {marker.risk}
                                </span>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-[400] text-xs border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>High Risk (উচ্চ ঝুঁকি)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Safe (নিরাপদ)</span>
                </div>
            </div>

            {/* Locate Me Button */}
            <button
                onClick={handleLocateMe}
                className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md z-[400] hover:bg-gray-50 transition-colors"
                title="Use My Location"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                    <crosshairs cx="12" cy="12" r="10"></crosshairs>
                    <line x1="22" y1="12" x2="18" y2="12"></line>
                    <line x1="6" y1="12" x2="2" y2="12"></line>
                    <line x1="12" y1="6" x2="12" y2="2"></line>
                    <line x1="12" y1="22" x2="12" y2="18"></line>
                </svg>
            </button>
        </div>
    );
};

export default CommunityMap;
