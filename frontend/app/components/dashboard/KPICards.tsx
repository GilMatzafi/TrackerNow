"use client";

import { BookIcon, EnvelopeIcon, TargetIcon, FireIcon } from './KPIIcons';

interface KPICardsProps {
  data: {
    problemsSolved: number;
    applicationsSent: number;
    interviewRate: number;
    streak: number;
  };
}

export default function KPICards({ data }: KPICardsProps) {

  // Main featured card (Problems Solved) - larger and more prominent
  const featuredCard = {
    title: 'Problems Solved',
    value: data.problemsSolved,
    change: '+12.5%',
    changeType: 'increase' as const,
    icon: BookIcon,
    description: 'Total problems completed',
    isFeatured: true,
    iconColor: '#3B82F6', // Blue for problems
    iconBg: '#DBEAFE'
  };

  // Smaller cards for other metrics
  const smallCards = [
    {
      title: 'Applications Sent',
      value: data.applicationsSent,
      change: '+8.3%',
      changeType: 'increase' as const,
      icon: EnvelopeIcon,
      description: 'Job applications this week',
      isFeatured: false,
      iconColor: '#10B981', // Green for applications
      iconBg: '#D1FAE5'
    },
    {
      title: 'Interview Rate',
      value: `${data.interviewRate}%`,
      change: '+5.2%',
      changeType: 'increase' as const,
      icon: TargetIcon,
      description: 'Success rate (interviews to offers)',
      isFeatured: false,
      iconColor: '#F59E0B', // Orange for interview rate
      iconBg: '#FEF3C7'
    },
    {
      title: 'Streak',
      value: `${data.streak} days`,
      change: '+2 days',
      changeType: 'increase' as const,
      icon: FireIcon,
      description: 'Consecutive practice days',
      isFeatured: false,
      iconColor: '#EF4444', // Red for streak
      iconBg: '#FEE2E2'
    }
  ];

  interface CardData {
    title: string;
    value: string | number;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    isFeatured: boolean;
    iconColor: string;
    iconBg: string;
  }

  const CardComponent = ({ card, index }: { card: CardData; index: number }) => {
    const IconComponent = card.icon;
    
    return (
      <div 
        className={`bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 ${
          card.isFeatured 
            ? 'p-8' 
            : 'p-6'
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Header with icon and title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div 
              className={`rounded-xl flex items-center justify-center ${
                card.isFeatured ? 'w-14 h-14' : 'w-12 h-12'
              }`}
              style={{ backgroundColor: card.iconBg }}
            >
              <IconComponent 
                className={`${card.isFeatured ? 'w-7 h-7' : 'w-6 h-6'}`}
                style={{ color: card.iconColor }}
              />
            </div>
            <div>
              <h3 
                className={`font-semibold ${
                  card.isFeatured ? 'text-lg' : 'text-base'
                }`}
                style={{ color: '#374151' }}
              >
                {card.title}
              </h3>
              <p className={`text-gray-500 ${
                card.isFeatured ? 'text-sm' : 'text-xs'
              }`}>
                {card.description}
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Value and change indicator */}
        <div className="flex items-end justify-between">
          <div>
            <p 
              className={`font-bold ${
                card.isFeatured ? 'text-4xl' : 'text-3xl'
              }`}
              style={{ color: '#374151' }}
            >
              {card.value}
            </p>
            <div className="flex items-center mt-3">
              <span className={`font-medium ${
                card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              } ${card.isFeatured ? 'text-base' : 'text-sm'}`}>
                {card.change}
              </span>
              <svg 
                className={`ml-2 ${
                  card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                } ${card.isFeatured ? 'w-5 h-5' : 'w-4 h-4'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {card.changeType === 'increase' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Featured card - Problems Solved (larger) */}
      <CardComponent card={featuredCard} index={0} />
      
      {/* Small cards */}
      {smallCards.map((card, index) => (
        <CardComponent key={index + 1} card={card} index={index + 1} />
      ))}
    </div>
  );
}
