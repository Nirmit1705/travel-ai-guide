
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { 
  MapPin, 
  Clock, 
  Star, 
  Cloud, 
  Home,
  Calendar,
  DollarSign,
  Heart,
  Share2,
  Download
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;

  // Mock data - in real app, this would come from API
  const [tripData] = useState({
    destination: formData?.destination || "Paris, France",
    coordinates: [48.8566, 2.3522] as [number, number],
    weather: { temp: 22, condition: "Sunny", humidity: 65 },
    hotels: [
      { name: "Le Meurice", price: 450, rating: 5, location: "1st Arrondissement" },
      { name: "Hotel des Grands Boulevards", price: 280, rating: 4.5, location: "2nd Arrondissement" },
      { name: "Hotel Malte Opera", price: 180, rating: 4, location: "2nd Arrondissement" }
    ],
    itinerary: [
      {
        day: 1,
        date: "March 15, 2024",
        activities: [
          {
            time: "09:00 AM",
            title: "Eiffel Tower Visit",
            description: "Start your Paris adventure with the iconic Eiffel Tower. Take the elevator to the top for breathtaking views.",
            duration: "2 hours",
            coordinates: [48.8584, 2.2945],
            type: "Sightseeing"
          },
          {
            time: "12:00 PM",
            title: "Seine River Cruise",
            description: "Enjoy a relaxing boat ride along the Seine, passing by Notre-Dame and other landmarks.",
            duration: "1.5 hours",
            coordinates: [48.8566, 2.3522],
            type: "Activity"
          },
          {
            time: "02:30 PM", 
            title: "Louvre Museum",
            description: "Explore the world's largest art museum and see the Mona Lisa.",
            duration: "3 hours",
            coordinates: [48.8606, 2.3376],
            type: "Culture"
          },
          {
            time: "07:00 PM",
            title: "French Dinner at Le Comptoir du Relais",
            description: "Experience authentic French cuisine in the heart of Saint-Germain.",
            duration: "2 hours",
            coordinates: [48.8502, 2.3439],
            type: "Food"
          }
        ]
      },
      {
        day: 2,
        date: "March 16, 2024",
        activities: [
          {
            time: "10:00 AM",
            title: "Montmartre & Sacré-Cœur",
            description: "Explore the artistic neighborhood of Montmartre and visit the beautiful basilica.",
            duration: "3 hours",
            coordinates: [48.8867, 2.3431],
            type: "Sightseeing"
          },
          {
            time: "02:00 PM",
            title: "Latin Quarter Walking Tour",
            description: "Discover the historic Latin Quarter with its narrow streets and cafés.",
            duration: "2 hours",
            coordinates: [48.8506, 2.3444],
            type: "Culture"
          },
          {
            time: "05:00 PM",
            title: "Shopping at Champs-Élysées",
            description: "Stroll down the famous avenue and enjoy some retail therapy.",
            duration: "2 hours",
            coordinates: [48.8698, 2.3076],
            type: "Shopping"
          }
        ]
      }
    ]
  });

  const allLocations = tripData.itinerary.flatMap(day => 
    day.activities.map(activity => ({
      ...activity,
      position: activity.coordinates as [number, number]
    }))
  );

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No trip data found</h2>
          <Button onClick={() => navigate('/plan')}>Plan a Trip</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-50 via-blue-50 to-sunset-50">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/home')}
              className="flex items-center gap-2"
            >
              <Home size={20} />
              Home
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Your Trip to {tripData.destination}</h1>
              <p className="text-sm text-gray-600">AI-Generated Itinerary</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 size={16} />
              Share
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="text-travel-600" size={20} />
                    Trip Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapContainer
                      center={tripData.coordinates}
                      zoom={12}
                      style={{ height: '100%', width: '100%' }}
                      className="rounded-lg"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {allLocations.map((location, index) => (
                        <Marker key={index} position={location.position}>
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold">{location.title}</h3>
                              <p className="text-sm text-gray-600">{location.time}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-travel-600" size={20} />
                    Daily Itinerary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {tripData.itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="space-y-4">
                      <div className="flex items-center gap-3 pb-2 border-b">
                        <div className="w-8 h-8 bg-travel-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {day.day}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Day {day.day}</h3>
                          <p className="text-sm text-gray-600">{day.date}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 ml-6">
                        {day.activities.map((activity, actIndex) => (
                          <motion.div
                            key={actIndex}
                            className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            whileHover={{ x: 5 }}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Clock className="text-travel-600" size={16} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {activity.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {activity.time}
                                </span>
                                <span>{activity.duration}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="text-travel-600" size={20} />
                    Weather
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {tripData.weather.temp}°C
                    </div>
                    <p className="text-travel-600 mb-2">{tripData.weather.condition}</p>
                    <p className="text-sm text-gray-600">Humidity: {tripData.weather.humidity}%</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hotel Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="text-travel-600" size={20} />
                    Recommended Hotels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tripData.hotels.map((hotel, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{hotel.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-400 fill-current" size={14} />
                          <span className="text-sm">{hotel.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{hotel.location}</p>
                      <p className="text-sm font-semibold text-travel-600">${hotel.price}/night</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Trip Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="travel-card">
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-semibold">${formData.budget?.[0] || 1000}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{tripData.itinerary.length} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activities</span>
                    <span className="font-semibold">
                      {tripData.itinerary.reduce((acc, day) => acc + day.activities.length, 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.interests?.map((interest: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
