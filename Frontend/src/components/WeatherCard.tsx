import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  Sunrise,
  Sunset,
  Sprout 
} from 'lucide-react';

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

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-8 w-8 text-sun" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="h-8 w-8 text-muted-foreground" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="h-8 w-8 text-accent" />;
      default:
        return <Sun className="h-8 w-8 text-sun" />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 35) return 'text-destructive';
    if (temp > 25) return 'text-sun';
    return 'text-accent';
  };

  // Best Crop Recommendation based on temperature and weather
  const getBestCrop = () => {
    const { temperature, condition, rainfall } = weather;

    if (temperature > 35) {
      return {
        crop: "Cotton, Pearl Millet (Bajra), Sorghum (Jowar)",
        note: "High temperatures are ideal for cotton, bajra, and jowar. Ensure regular irrigation and monitor for heat stress."
      };
    }
    if (temperature > 28 && temperature <= 35) {
      if (rainfall > 10 || condition.toLowerCase().includes("rain")) {
        return {
          crop: "Paddy (Rice), Sugarcane, Maize",
          note: "Warm and rainy weather is suitable for paddy, sugarcane, and maize. Ensure proper drainage."
        };
      }
      return {
        crop: "Maize, Soybean, Groundnut",
        note: "Warm weather is suitable for maize, soybean, and groundnut. Monitor soil moisture."
      };
    }
    if (temperature > 20 && temperature <= 28) {
      return {
        crop: "Paddy (Rice), Sugarcane, Pulses",
        note: "Moderate temperatures with possible rainfall are good for paddy, sugarcane, and pulses."
      };
    }
    if (temperature <= 20) {
      return {
        crop: "Wheat, Mustard, Barley, Peas",
        note: "Cool weather is best for wheat, mustard, barley, and peas. Prepare for rabi sowing."
      };
    }
    // Fallback
    return {
      crop: "Millets, Pulses",
      note: "General conditions are suitable for millets and pulses."
    };
  };

  return (
    <div className="space-y-6">
      {/* Main Weather Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Weather in {weather.city}</span>
            <Badge variant="secondary">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Weather */}
            <div className="flex items-center space-x-4">
              {getWeatherIcon(weather.condition)}
              <div>
                <div className={`text-4xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                  {weather.temperature}°C
                </div>
                <p className="text-muted-foreground capitalize">{weather.condition}</p>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="font-semibold">{weather.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                  <p className="font-semibold">{weather.windSpeed} km/h</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CloudRain className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Rainfall</p>
                  <p className="font-semibold">{weather.rainfall} mm</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <p className="font-semibold">{weather.visibility} km</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sun Times */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-around">
              <div className="flex items-center space-x-2">
                <Sunrise className="h-4 w-4 text-sun" />
                <div>
                  <p className="text-sm text-muted-foreground">Sunrise</p>
                  <p className="font-semibold">{weather.sunrise}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sunset className="h-4 w-4 text-earth" />
                <div>
                  <p className="text-sm text-muted-foreground">Sunset</p>
                  <p className="font-semibold">{weather.sunset}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>3-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">{day.day}</p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <p className={`text-lg font-bold ${getTemperatureColor(day.temp)}`}>
                  {day.temp}°C
                </p>
                <p className="text-xs text-muted-foreground capitalize">{day.condition}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Crop Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sprout className="h-5 w-5 text-crop" />
            <span>Best Crop Recommendation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 rounded-lg bg-crop/10 border border-crop/20">
            <p className="text-sm">
              <strong>Recommended Crops:</strong> {getBestCrop().crop}<br />
              <strong>Advice:</strong> {getBestCrop().note}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Agricultural Advisory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sprout className="h-5 w-5 text-crop" />
            <span>Agricultural Advisory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weather.rainfall > 10 && (
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm">🌧️ <strong>Heavy Rain Alert:</strong> Avoid fertilizer application today. Ensure proper drainage in fields.</p>
              </div>
            )}
            {weather.temperature > 35 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm">🌡️ <strong>Heat Wave:</strong> Increase irrigation frequency. Provide shade for livestock.</p>
              </div>
            )}
            {weather.windSpeed > 25 && (
              <div className="p-3 rounded-lg bg-muted border">
                <p className="text-sm">💨 <strong>High Winds:</strong> Secure greenhouse structures. Delay spray applications.</p>
              </div>
            )}
            <div className="p-3 rounded-lg bg-crop/10 border border-crop/20">
              <p className="text-sm">🌱 <strong>General Advice:</strong> Current conditions are suitable for land preparation and sowing of rabi crops.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherCard;