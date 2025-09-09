"use client";

interface KPICardsProps {
  data: {
    problemsSolved: number;
    applicationsSent: number;
    interviewRate: number;
    streak: number;
  };
}

export default function KPICards({ data }: KPICardsProps) {
  const cards = [
    {
      title: 'Problems Solved',
      value: data.problemsSolved,
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: '💻',
      description: 'Total problems completed'
    },
    {
      title: 'Applications Sent',
      value: data.applicationsSent,
      change: '+8.3%',
      changeType: 'increase' as const,
      icon: '📝',
      description: 'Job applications this week'
    },
    {
      title: 'Interview Rate',
      value: `${data.interviewRate}%`,
      change: '+5.2%',
      changeType: 'increase' as const,
      icon: '🎯',
      description: 'Success rate (interviews to offers)'
    },
    {
      title: 'Streak',
      value: `${data.streak} days`,
      change: '+2 days',
      changeType: 'increase' as const,
      icon: '🔥',
      description: 'Consecutive practice days'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">{card.icon}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                <p className="text-xs text-gray-400">{card.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
                <svg 
                  className={`w-4 h-4 ml-1 ${
                    card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`} 
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
      ))}
    </div>
  );
}
