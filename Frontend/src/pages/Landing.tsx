import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingWeatherSection from '@/components/LandingWeatherSection';
import { Sprout, MessageCircle, Cloud, Award, Users, Smartphone, Calculator, TrendingUp, Brain, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/farmer-hero.jpg';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Advisory',
      description: 'Get instant answers to your farming questions in Hindi and English with voice support.',
    },
    {
      icon: <Cloud className="h-8 w-8 text-accent" />,
      title: 'Live Weather Updates',
      description: 'Real-time weather data, forecasts, and agricultural advisories for your location.',
    },
    {
      icon: <Award className="h-8 w-8 text-earth" />,
      title: 'Government Schemes',
      description: 'Stay updated with the latest government schemes and subsidies for farmers.',
    },
    {
      icon: <Smartphone className="h-8 w-8 text-crop" />,
      title: 'Mobile Friendly',
      description: 'Use our platform on any device, optimized for smartphones and tablets.',
    },
  ];

  const services = [
    {
      icon: <Sprout className="h-8 w-8 text-primary" />,
      title: 'Soil Information',
      description: 'Access a detailed guide on different soil types and their suitable crops.',
      buttonText: 'Learn More',
      link: '/soil-info'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Crop Recommendation',
      description: 'Get the best crop suggestions based on soil, climate, and season for maximum yield.',
      buttonText: 'Go to Services',
      link: '/crop-recommendation'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Fertilizer Information',
      description: 'Access details on fertilizers, their usage, and soil compatibility.',
      buttonText: 'Learn More',
      link: '/fertilizer-info'
    },
    {
      icon: <Calculator className="h-8 w-8 text-primary" />,
      title: 'Fertilizer Recommendation',
      description: 'Optimize fertilizer usage for healthier crops and cost efficiency.',
      buttonText: 'Go to Services',
      link: '/fertilizer-recommendation'
    },
    {
      icon: <Cloud className="h-8 w-8 text-primary" />,
      title: 'Weather Forecast',
      description: 'Check past, current, and future weather forecasts for any location.',
      buttonText: 'Learn More',
      link: '/weather'
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: 'Agrobot',
      description: 'Interact with our AI-powered chatbot in multiple languages, including Hindi and English.',
      buttonText: 'Go to Services',
      link: '/dashboard'
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: 'AI What-If Simulator',
      description: 'Explore different agricultural scenarios with our AI-powered simulator. Get bilingual insights and actionable recommendations.',
      buttonText: 'Try the Simulator',
      link: '/simulator'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Crop Yield Prediction',
      description: 'Estimate your crop yield based on area, rainfall, and other key factors.',
      buttonText: 'Predict Yield',
      link: '/yield-prediction'
    }
  ];

  const handleServiceClick = (link: string) => {
    if (user) {
      // User is logged in, navigate to the service
      if (link === '/weather' || link === '/dashboard') {
        navigate(link);
      } else {
        // For other services, navigate to services page
        navigate('/services');
      }
    } else {
      // User is not logged in, show toast and redirect to login
      toast({
        title: 'Login Required',
        description: 'Please login to access our services.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-crop/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                <span className="text-primary">AI-Powered</span>
                <br />
                Farming Assistant
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Get expert agricultural advice, weather updates, and government scheme information 
                in your language. Empowering farmers with modern technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/login">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">10,000+ Farmers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sprout className="h-5 w-5 text-crop" />
                  <span className="text-sm text-muted-foreground">Available in Hindi</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Farmers using modern technology"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and information 
              modern farmers need to increase productivity and profitability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our comprehensive suite of agricultural services designed to help you 
              make informed decisions and maximize your farming potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <Button 
                    onClick={() => handleServiceClick(service.link)}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {service.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How FarmAssist Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to get expert farming advice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up & Login</h3>
              <p className="text-muted-foreground">
                Create your account with basic details like name, location, and farming interests.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-crop text-crop-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Ask Questions</h3>
              <p className="text-muted-foreground">
                Type, speak, or upload images to get instant AI-powered farming advice.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Expert Advice</h3>
              <p className="text-muted-foreground">
                Receive personalized recommendations, weather updates, and scheme information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <LandingWeatherSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-crop text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers who are already using FarmAssist to increase 
            their crop yields and farm profitability.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/login">Start Your Journey Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;