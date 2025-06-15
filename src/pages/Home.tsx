
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  History, 
  Compass, 
  User, 
  Sun, 
  Moon,
  MapPin,
  Calendar,
  Star
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const Home = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const menuCards = [
    {
      title: "Plan New Trip",
      description: "Create a personalized itinerary with AI",
      icon: Plus,
      color: "from-travel-500 to-travel-600",
      path: "/plan"
    },
    {
      title: "Past Trips",
      description: "View your travel history and memories",
      icon: History,
      color: "from-emerald-500 to-emerald-600",
      path: "/past-trips"
    },
    {
      title: "Explore",
      description: "Discover trending destinations",
      icon: Compass,
      color: "from-sunset-500 to-sunset-600",
      path: "/explore"
    },
    {
      title: "Profile",
      description: "Manage your account and preferences",
      icon: User,
      color: "from-purple-500 to-purple-600",
      path: "/profile"
    }
  ];

  const recentTrips = [
    { destination: "Paris, France", date: "Dec 2023", rating: 5 },
    { destination: "Tokyo, Japan", date: "Nov 2023", rating: 4 },
    { destination: "Bali, Indonesia", date: "Oct 2023", rating: 5 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-50 via-blue-50 to-sunset-50">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-travel-500 to-travel-600 rounded-xl flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-travel-600 to-sunset-500 bg-clip-text text-transparent">
              TripPlanner
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <Avatar className="h-10 w-10 ring-2 ring-travel-200">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-travel-500 text-white">JP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, John! 👋
          </h2>
          <p className="text-gray-600 text-lg">Ready for your next adventure?</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Menu Cards */}
          <motion.div 
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {menuCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="travel-card cursor-pointer h-full group"
                    onClick={() => navigate(card.path)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Recent Trips */}
            <Card className="travel-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trips</h3>
                <div className="space-y-3">
                  {recentTrips.map((trip, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{trip.destination}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <Calendar size={12} />
                          {trip.date}
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(trip.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-travel-600 hover:text-travel-700">
                  View All Trips
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="travel-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Countries Visited</span>
                    <span className="font-semibold text-travel-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cities Explored</span>
                    <span className="font-semibold text-travel-600">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Miles Traveled</span>
                    <span className="font-semibold text-travel-600">45,230</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
