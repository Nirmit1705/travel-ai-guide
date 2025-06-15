
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar as CalendarIcon,
  Heart,
  DollarSign,
  Clock,
  Sparkles
} from "lucide-react";

const TripForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    destination: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    interests: [] as string[],
    budget: [1000],
    startTime: "09:00",
    endTime: "18:00"
  });

  const interests = [
    "Adventure", "Culture", "Food", "History", "Nature", "Shopping", 
    "Nightlife", "Art", "Museums", "Beach", "Mountains", "Architecture"
  ];

  const steps = [
    {
      title: "Where do you want to go?",
      subtitle: "Tell us your dream destination",
      icon: MapPin,
      field: "destination"
    },
    {
      title: "When do you want to start?",
      subtitle: "Choose your departure date",
      icon: CalendarIcon,
      field: "startDate"
    },
    {
      title: "When do you want to return?",
      subtitle: "Choose your return date",
      icon: CalendarIcon,
      field: "endDate"
    },
    {
      title: "What interests you?",
      subtitle: "Select your travel preferences",
      icon: Heart,
      field: "interests"
    },
    {
      title: "What's your budget?",
      subtitle: "Set your spending range",
      icon: DollarSign,
      field: "budget"
    },
    {
      title: "Daily schedule preference?",
      subtitle: "When do you like to start and end your day?",
      icon: Clock,
      field: "time"
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to results with form data
      navigate('/results', { state: formData });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.destination.trim() !== "";
      case 1: return formData.startDate !== null;
      case 2: return formData.endDate !== null;
      case 3: return formData.interests.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input
              placeholder="e.g., Paris, France"
              value={formData.destination}
              onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              className="text-lg h-12"
              autoFocus
            />
          </div>
        );

      case 1:
        return (
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-64 h-12 text-left font-normal"
                >
                  {formData.startDate ? (
                    format(formData.startDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick your start date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 2:
        return (
          <div className="flex justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-64 h-12 text-left font-normal"
                >
                  {formData.endDate ? (
                    format(formData.endDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick your end date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                  disabled={(date) => date < (formData.startDate || new Date())}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interests.map((interest) => (
              <motion.div
                key={interest}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer p-3 text-sm transition-all duration-200 ${
                    formData.interests.includes(interest)
                      ? "bg-travel-500 hover:bg-travel-600"
                      : "hover:bg-travel-50 hover:border-travel-300"
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Badge>
              </motion.div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-travel-600">${formData.budget[0]}</p>
              <p className="text-gray-500">Total budget</p>
            </div>
            <Slider
              value={formData.budget}
              onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
              max={10000}
              min={100}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>$100</span>
              <span>$10,000+</span>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-travel-50 via-blue-50 to-sunset-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="travel-card min-h-[400px]">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div>
              {/* Step Header */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-travel-500 to-travel-600 rounded-full mb-4">
                  {React.createElement(steps[currentStep].icon, { 
                    className: "text-white", 
                    size: 24 
                  })}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h2>
                <p className="text-gray-600">
                  {steps[currentStep].subtitle}
                </p>
              </motion.div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={20} />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 travel-button"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Sparkles size={20} />
                    Generate Trip
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={20} />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TripForm;
