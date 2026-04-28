import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WeatherCard from "@/components/WeatherCard";
import { Search, MapPin, Loader2 } from "lucide-react";
import axios from "axios";

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  forecast: {
    day: string;
    temp: number;
    condition: string;
  }[];
}

const Weather = () => {
  const [searchCity, setSearchCity] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Meerut, UP");
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // ✅ WeatherAPI Key (only the key string, not full URL)
  const API_KEY = "320261588b1749ce85b124505252404";

  // Fetch weather data
  const fetchWeatherData = async (city: string) => {
    try {
      setIsLoading(true);

      // Current + 5-day forecast
      const res = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
          city
        )}&days=5&aqi=yes&alerts=no`
      );

      const data = res.data;

      const finalData: WeatherData = {
        city: data.location.name,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        rainfall: data.current.precip_mm,
        visibility: data.current.vis_km,
        sunrise: data.forecast.forecastday[0].astro.sunrise,
        sunset: data.forecast.forecastday[0].astro.sunset,
        forecast: data.forecast.forecastday.map((day: any) => ({
          day: new Date(day.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          temp: Math.round(day.day.avgtemp_c),
          condition: day.day.condition.text,
        })),
      };

      setWeatherData(finalData);
      setCurrentLocation(data.location.name);
    } catch (error) {
      console.error("API error:", error);
      alert("City not found or API error!");
    } finally {
      setIsLoading(false);
    }
  };

  const popularCities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Ahmedabad",
    "Indore",
    "Patna",
  ];

  const handleCitySearch = (city: string) => {
    if (!city.trim()) return;
    fetchWeatherData(city);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get(
              `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=5&aqi=yes&alerts=no`
            );
            const cityName = res.data.location.name;
            fetchWeatherData(cityName);
          } catch (err) {
            console.error("Error getting location weather:", err);
            alert("Could not fetch weather for your location.");
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access denied or unavailable.");
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCitySearch(searchCity);
    setSearchCity("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Weather Information
          </h1>
          <p className="text-muted-foreground">
            Get real-time weather updates and agricultural advisories for your
            location
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Weather</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex space-x-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter city name (e.g., Delhi, Mumbai, Jaipur...)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
            </form>

            {/* Popular Cities */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Popular cities:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((city) => (
                  <Button
                    key={city}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCitySearch(city)}
                    disabled={isLoading}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Location Display */}
        {weatherData && (
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Showing weather for:{" "}
              <span className="font-semibold text-foreground">
                {currentLocation}
              </span>
            </span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <span className="text-lg text-muted-foreground">
                Fetching weather data...
              </span>
            </CardContent>
          </Card>
        )}

        {/* Weather Data */}
        {!isLoading && weatherData && <WeatherCard weather={weatherData} />}

        {/* Agricultural Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Seasonal Farming Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-crop/10 border border-crop/20">
                <h4 className="font-semibold text-crop mb-2">
                  🌱 Winter Season (Rabi)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Perfect time for wheat, barley, and mustard cultivation.
                  Ensure proper irrigation scheduling.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-sun/10 border border-sun/20">
                <h4 className="font-semibold text-sun mb-2">
                  ☀️ Summer Season
                </h4>
                <p className="text-sm text-muted-foreground">
                  Focus on water conservation. Suitable for summer crops like
                  watermelon and fodder crops.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <h4 className="font-semibold text-accent mb-2">
                  🌧️ Monsoon Season (Kharif)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Ideal for rice, cotton, and sugarcane. Monitor rainfall and
                  ensure proper drainage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Weather;
