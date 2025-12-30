'use client';

import { useRouter } from 'next/navigation';
import { CityBuildLogo } from '@/components/ui';

export default function RoleSelection() {
  const router = useRouter();

  const roles = [
    {
      id: 'bank',
      label: 'Bank',
      icon: '🏦',
      description: 'Financial institution partner',
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:border-blue-500',
    },
    {
      id: 'owner',
      label: 'Owner',
      icon: '👤',
      description: 'Property or project owner',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:border-purple-500',
    },
    {
      id: 'contractor',
      label: 'General Contractor',
      icon: '👷',
      description: 'General contractor or construction company',
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:border-orange-500',
    },
    {
      id: 'subcontractor',
      label: 'Subcontractor',
      icon: '🔧',
      description: 'Specialized trade contractor',
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-200',
      hoverColor: 'hover:border-green-500',
    },
    {
      id: 'distributor',
      label: 'Distributor',
      icon: '📦',
      description: 'Material supplier or distributor',
      color: 'from-amber-500 to-yellow-500',
      borderColor: 'border-amber-200',
      hoverColor: 'hover:border-amber-500',
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    router.push(`/dashboard?role=${roleId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="hover:opacity-80 transition-opacity"
          >
            <CityBuildLogo size="md" showText={true} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-display-md text-primary mb-4">Select Your Role</h1>
            <p className="text-xl text-muted-foreground">
              Choose your role to access features and tools tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`group relative overflow-hidden rounded-2xl p-8 text-center transition-all duration-300 transform hover:scale-105 bg-card border-2 ${role.borderColor} ${role.hoverColor}`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <span className="text-4xl">{role.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {role.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>

                  {/* Arrow icon on hover */}
                  <div className="mt-6 flex justify-center">
                    <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                      →
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              Not sure which role fits you best?{' '}
              <button
                onClick={() => router.push('/#how-it-works')}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Learn more about each role
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
