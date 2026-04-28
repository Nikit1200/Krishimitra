import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Search,
  Filter,
  Award,
  Calendar,
  CreditCard,
  ExternalLink,
  Users,
  Target,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  category: string;
  eligibility: string[];
  amount: string;
  deadline: string;
  status: 'active' | 'upcoming' | 'expired';
  applicants: number;
  successRate: number;
  url: string;
}

const Schemes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const schemes: Scheme[] = [
    {
      id: '1',
      name: 'PM-KISAN Samman Nidhi',
      nameHindi: 'प्रधानमंत्री किसान सम्मान निधि',
      description:
        'Direct benefit transfer of ₹6,000 per year in three instalments for eligible cultivable landholding farmer families. The 22nd instalment was released on 13 March 2026.',
      category: 'Financial Support',
      eligibility: ['Cultivable landholding farmer family', 'Aadhaar-seeded bank account', 'eKYC and land seeding completed'],
      amount: '₹6,000/year',
      deadline: 'Ongoing in 2026',
      status: 'active',
      applicants: 93200000,
      successRate: 94,
      url: 'https://pmkisan.gov.in/',
    },
    {
      id: '2',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
      description:
        'Crop insurance against pre-sowing to post-harvest losses. Farmer premium remains capped at 2% for Kharif, 1.5% for Rabi, and 5% for annual commercial or horticulture crops.',
      category: 'Insurance',
      eligibility: ['Farmers growing notified crops in participating states or UTs', 'Loanee and non-loanee farmers can apply', 'Enrollment must be completed before the season cutoff'],
      amount: 'Premium capped at 1.5%-5%',
      deadline: 'Seasonal, state-wise',
      status: 'active',
      applicants: 41900000,
      successRate: 86,
      url: 'https://pmfby.gov.in/',
    },
    {
      id: '3',
      name: 'Kisan Credit Card',
      nameHindi: 'किसान क्रेडिट कार्ड',
      description:
        'Affordable working capital and allied activity credit through banks. For 2025-26, the crop loan limit under MISS was raised to ₹5 lakh and collateral-free credit to ₹2 lakh.',
      category: 'Credit',
      eligibility: ['Owner cultivators, tenant farmers, oral lessees, and sharecroppers', 'Available through commercial, regional rural, and cooperative banks', 'KYC, land, and crop details required'],
      amount: 'Up to ₹5,00,000',
      deadline: 'Ongoing',
      status: 'active',
      applicants: 77200000,
      successRate: 88,
      url: 'https://fasalrin.gov.in/',
    },
    {
      id: '4',
      name: 'PM-KUSUM',
      nameHindi: 'पीएम-कुसुम योजना',
      description:
        'Solar pump and feeder solarization support for farmers under Components A, B, and C. The current scheme period runs till 31 March 2026.',
      category: 'Technology',
      eligibility: ['Farmer, FPO, cooperative, panchayat, or water user association as per component', 'State nodal agency approval required', 'Land or irrigation asset availability as per project type'],
      amount: 'Up to 60% subsidy',
      deadline: 'Till 2026-03-31',
      status: 'active',
      applicants: 2177369,
      successRate: 89,
      url: 'https://mnre.gov.in/en/pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum/',
    },
    {
      id: '5',
      name: 'Paramparagat Krishi Vikas Yojana',
      nameHindi: 'परंपरागत कृषि विकास योजना',
      description:
        'Cluster-based organic farming support with assistance for inputs, certification, and marketing. Current support is ₹31,500 per hectare over 3 years.',
      category: 'Sustainable Agriculture',
      eligibility: ['Farmers enrolled in approved organic clusters', 'Participatory Guarantee System or state-approved certification route', 'Commitment to chemical-free farming for the cluster period'],
      amount: '₹31,500/hectare for 3 years',
      deadline: 'Cluster-based rollout in 2026',
      status: 'active',
      applicants: 2530000,
      successRate: 91,
      url: 'https://pgsindia-ncof.gov.in/pkvy/Index.aspx',
    },
  ];

  const categories = ['all', ...Array.from(new Set(schemes.map((scheme) => scheme.category)))];
  const statuses = ['all', 'active', 'upcoming', 'expired'];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.nameHindi.includes(searchTerm) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || scheme.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || scheme.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-crop text-crop-foreground';
      case 'upcoming':
        return 'bg-accent text-accent-foreground';
      case 'expired':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'upcoming':
        return <Clock className="h-4 w-4" />;
      case 'expired':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Government Schemes for Farmers</h1>
          <p className="text-muted-foreground">
            Discover and apply for government schemes and subsidies designed to support farmers
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schemes by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">Showing {filteredSchemes.length} of {schemes.length} schemes</p>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Schemes Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-1 text-lg">{scheme.name}</CardTitle>
                    <p className="mb-2 text-sm text-muted-foreground">{scheme.nameHindi}</p>
                    <Badge variant="secondary" className="mb-2">
                      {scheme.category}
                    </Badge>
                  </div>
                  <Badge className={`${getStatusColor(scheme.status)} flex items-center space-x-1`}>
                    {getStatusIcon(scheme.status)}
                    <span className="capitalize">{scheme.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">{scheme.description}</p>

                {/* Key Info */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-sm font-semibold">{scheme.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-earth" />
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-semibold">{scheme.deadline}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Applicants</p>
                      <p className="text-sm font-semibold">{scheme.applicants.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-crop" />
                    <div>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="text-sm font-semibold">{scheme.successRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="mb-4">
                  <p className="mb-2 text-sm font-semibold">Eligibility:</p>
                  <div className="flex flex-wrap gap-1">
                    {scheme.eligibility.map((criteria, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {criteria}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={() => window.open(scheme.url, '_blank')}>
                    <Award className="mr-2 h-4 w-4" />
                    Apply Now
                  </Button>
                  <Button variant="outline" onClick={() => window.open(scheme.url, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredSchemes.length === 0 && (
          <Card className="py-12 text-center">
            <CardContent>
              <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No schemes found</h3>
              <p className="mb-4 text-muted-foreground">
                Try adjusting your search terms or filters to find relevant schemes.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Schemes;
