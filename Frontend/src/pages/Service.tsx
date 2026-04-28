import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sprout, 
  MessageCircle, 
  Cloud, 
  Award, 
  Calculator,
  TrendingUp,
  Brain,
  BarChart3
} from 'lucide-react';

const Service = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-crop/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="text-primary">Our</span> Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Explore our comprehensive suite of agricultural services designed to help you 
              make informed decisions and maximize your farming potential.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Link to={service.link}>
                      {service.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with agricultural expertise 
              to provide you with the most accurate and actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Get personalized recommendations based on advanced machine learning algorithms 
                and agricultural data analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-crop text-crop-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multilingual Support</h3>
              <p className="text-muted-foreground">
                Access our services in Hindi, English, and other regional languages 
                for better understanding and usability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-muted-foreground">
                Join thousands of farmers who have increased their yields and profitability 
                using our comprehensive agricultural services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-crop text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Choose any of our services to begin your journey towards smarter, 
            more profitable farming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/dashboard">Access Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Service;
