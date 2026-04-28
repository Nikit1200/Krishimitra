// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { User, Phone, MapPin, Mail } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';

// const ProfileCard = () => {
//   const { user } = useAuth();

//   return (
//     <div className="min-h-screen bg-background py-8">
//       <div className="max-w-3xl mx-auto px-4">
//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <User className="h-6 w-6 text-primary" />
//               <span>Profile Information</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center space-x-3">
//               <User className="h-8 w-8 text-muted-foreground" />
//               <div>
//                 <div className="text-sm text-muted-foreground">Name</div>
//                 <div className="font-medium text-foreground">{user?.name || 'No name'}</div>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <Phone className="h-6 w-6 text-muted-foreground" />
//               <div>
//                 <div className="text-sm text-muted-foreground">Phone</div>
//                 <div className="font-medium text-foreground">{user?.phone || 'No phone'}</div>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <Mail className="h-6 w-6 text-muted-foreground" />
//               <div>
//                 <div className="text-sm text-muted-foreground">Email</div>
//                 <div className="font-medium text-foreground">{user?.email || 'No email'}</div>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <MapPin className="h-6 w-6 text-muted-foreground" />
//               <div>
//                 <div className="text-sm text-muted-foreground">Address</div>
//                 <div className="font-medium text-foreground">
//                   {user?.district || 'District'}, {user?.state || 'State'}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ProfileCard;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, MapPin, Mail, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="shadow-lg relative">
          {/* Header with X button */}
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-6 w-6 text-primary" />
              <span>Profile Information</span>
            </CardTitle>

            {/* X Button (top-right corner) */}
            <button
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-destructive transition"
            >
              <X className="h-5 w-5" />
            </button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium text-foreground">
                  {user?.name || 'No name'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium text-foreground">
                  {user?.phone || 'No phone'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium text-foreground">
                  {user?.email || 'No email'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="font-medium text-foreground">
                  {user?.district || 'District'}, {user?.state || 'State'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCard;

