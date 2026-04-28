import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Loader2, Cloud, Sun, CloudRain, Droplets, Wind, Eye } from 'lucide-react';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  visibility: number;
  forecast: {
    day: string;
    temp: number;
    condition: string;
  }[];
}

const LandingWeatherSection = () => {
  const [searchCity, setSearchCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    city: 'Delhi',
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    rainfall: 2.5,
    visibility: 8,
    forecast: [
      { day: 'Today', temp: 28, condition: 'Partly Cloudy' },
      { day: 'Tomorrow', temp: 30, condition: 'Sunny' },
      { day: 'Thu', temp: 25, condition: 'Rainy' },
      { day: 'Fri', temp: 27, condition: 'Cloudy' }
    ]
  });

  const popularCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Jaipur'];

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="h-6 w-6 text-sun" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-muted-foreground" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-accent" />;
      default: return <Sun className="h-6 w-6 text-primary" />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 30) return 'text-sun';
    if (temp < 15) return 'text-accent';
    return 'text-primary';
  };

  const handleCitySearch = async (city: string) => {
    if (!city.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData: WeatherData = {
        city: city,
        temperature: Math.floor(Math.random() * 15) + 20,
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        rainfall: Math.random() * 20,
        visibility: Math.floor(Math.random() * 5) + 5,
        forecast: [
          { day: 'Today', temp: Math.floor(Math.random() * 15) + 20, condition: 'Partly Cloudy' },
          { day: 'Tomorrow', temp: Math.floor(Math.random() * 15) + 20, condition: 'Sunny' },
          { day: 'Thu', temp: Math.floor(Math.random() * 15) + 20, condition: 'Rainy' },
          { day: 'Fri', temp: Math.floor(Math.random() * 15) + 20, condition: 'Cloudy' }
        ]
      };
      
      setWeatherData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCitySearch(searchCity);
    setSearchCity('');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-accent/5 via-transparent to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Check Weather Conditions
          </h2>
          <p className="text-xl text-muted-foreground">
            Get real-time weather updates for better farming decisions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Weather Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter city name..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Popular cities:</p>
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

          {/* Weather Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Weather</span>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{weatherData.city}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                  <span className="text-muted-foreground">Loading weather...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Weather */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      {getWeatherIcon(weatherData.condition)}
                      <div>
                        <div className={`text-3xl font-bold ${getTemperatureColor(weatherData.temperature)}`}>
                          {weatherData.temperature}°C
                        </div>
                        <div className="text-sm text-muted-foreground">{weatherData.condition}</div>
                      </div>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <Droplets className="h-4 w-4 text-accent mx-auto" />
                      <div className="text-sm font-medium">{weatherData.humidity}%</div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                    </div>
                    <div className="space-y-1">
                      <Wind className="h-4 w-4 text-primary mx-auto" />
                      <div className="text-sm font-medium">{weatherData.windSpeed} km/h</div>
                      <div className="text-xs text-muted-foreground">Wind</div>
                    </div>
                    <div className="space-y-1">
                      <Eye className="h-4 w-4 text-crop mx-auto" />
                      <div className="text-sm font-medium">{weatherData.visibility} km</div>
                      <div className="text-xs text-muted-foreground">Visibility</div>
                    </div>
                  </div>

                  {/* Forecast */}
                  <div>
                    <h4 className="font-medium mb-3">4-Day Forecast</h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {weatherData.forecast.map((day, index) => (
                        <div key={index} className="space-y-2 p-2 rounded-lg bg-muted/50">
                          <div className="text-xs font-medium">{day.day}</div>
                          {getWeatherIcon(day.condition)}
                          <div className="text-sm font-medium">{day.temp}°C</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agricultural Advisory */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Weather-Based Farming Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">☀️ Sunny Weather</h4>
                <p className="text-sm text-muted-foreground">
                  Perfect for harvesting and field preparation. Ensure adequate irrigation for crops.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <h4 className="font-semibold text-accent mb-2">🌧️ Rainy Weather</h4>
                <p className="text-sm text-muted-foreground">
                  Good for sowing seeds. Check drainage systems and monitor for pest diseases.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-crop/10 border border-crop/20">
                <h4 className="font-semibold text-crop mb-2">🌥️ Cloudy Weather</h4>
                <p className="text-sm text-muted-foreground">
                  Ideal conditions for transplanting. Monitor humidity levels for disease prevention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LandingWeatherSection;