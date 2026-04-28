import { useNavigate } from "react-router-dom";
import {
  Award,
  Cloud,
  CloudRain,
  MessageCircle,
  Sun,
  Thermometer,
  TrendingUp,
  Wind,
} from "lucide-react";

import ChatBox from "@/components/ChatBox";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const Dashboard = () => {
  const { user } = useAuth();
  const { copy } = useLanguage();
  const navigate = useNavigate();
  const dashboardCopy = copy.dashboard;

  const todayWeather = {
    temperature: 28,
    condition: dashboardCopy.weatherCondition,
    humidity: 65,
    windSpeed: 12,
  };

  const quickStats = [
    {
      title: dashboardCopy.quickStats.weatherTitle,
      value: `${todayWeather.temperature}°C`,
      description: todayWeather.condition,
      icon: <Thermometer className="h-6 w-6 text-accent" />,
      trend: dashboardCopy.quickStats.weatherTrend,
    },
    {
      title: dashboardCopy.quickStats.queriesTitle,
      value: "23",
      description: dashboardCopy.quickStats.queriesDescription,
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      trend: dashboardCopy.quickStats.queriesTrend,
    },
    {
      title: dashboardCopy.quickStats.schemesTitle,
      value: "8",
      description: dashboardCopy.quickStats.schemesDescription,
      icon: <Award className="h-6 w-6 text-earth" />,
      trend: dashboardCopy.quickStats.schemesTrend,
    },
    {
      title: dashboardCopy.quickStats.healthTitle,
      value: "85%",
      description: dashboardCopy.quickStats.healthDescription,
      icon: <TrendingUp className="h-6 w-6 text-crop" />,
      trend: dashboardCopy.quickStats.healthTrend,
    },
  ];

  const recentAlerts = [
    {
      message: dashboardCopy.alerts.rain,
      time: dashboardCopy.alerts.timeTwoHours,
    },
    {
      message: dashboardCopy.alerts.scheme,
      time: dashboardCopy.alerts.timeOneDay,
    },
    {
      message: dashboardCopy.alerts.advisory,
      time: dashboardCopy.alerts.timeTwoDays,
    },
  ];

  const farmerName = user?.name || dashboardCopy.defaultFarmer;
  const district = user?.district || dashboardCopy.defaultDistrict;
  const state = user?.state || dashboardCopy.defaultState;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            {dashboardCopy.greeting(farmerName)}
          </h1>
          <p className="text-muted-foreground">{dashboardCopy.subtitle}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>
              {dashboardCopy.locationLabel}: {district}, {state}
            </span>
            <span>
              {dashboardCopy.emailLabel}: {user?.email || "-"}
            </span>
            <span>
              {dashboardCopy.phoneLabel}: {user?.phone || "-"}
            </span>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <Card key={stat.title} className="border-border/60 transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-lg bg-muted/50 p-2">{stat.icon}</div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mb-1 text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mb-1 text-sm text-muted-foreground">{stat.description}</p>
                  <p className="text-xs text-crop">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>{dashboardCopy.aiAssistantTitle}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ChatBox />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{dashboardCopy.quickActionsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/weather")}
                >
                  <Cloud className="mr-2 h-4 w-4" />
                  {dashboardCopy.actionWeather}
                </Button>

                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/schemes")}
                >
                  <Award className="mr-2 h-4 w-4" />
                  {dashboardCopy.actionSchemes}
                </Button>

                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate("/mandi-prices")}
                >
                  <Cloud className="mr-2 h-4 w-4" />
                  {dashboardCopy.actionMandi}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-sun" />
                  <span>{dashboardCopy.weatherCardTitle}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{todayWeather.temperature}°C</span>
                    <span className="text-muted-foreground">{todayWeather.condition}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CloudRain className="h-4 w-4 text-accent" />
                      <span>
                        {todayWeather.humidity}% {dashboardCopy.humidityLabel}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {todayWeather.windSpeed} km/h {dashboardCopy.windLabel}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    {dashboardCopy.forecastButton}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{dashboardCopy.recentAlertsTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={`${alert.time}-${alert.message}`} className="border-l-4 border-primary/20 pl-4">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  ))}

                  <Button variant="ghost" size="sm" className="w-full">
                    {dashboardCopy.viewAllAlerts}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
