import { useState } from 'react';

interface SkillsSidebarProps {
  // We can make this configurable later, for now using the same hardcoded data
}

export default function SkillsSidebar({}: SkillsSidebarProps) {
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(true);

  const hardSkills = [
    { name: 'Plumbing', count: 3 },
    { name: 'Installation', count: 2 },
    { name: 'Problem Solving', count: 1 },
    { name: 'Career Development', count: 1 },
    { name: 'Drainage Systems', count: 1 },
    { name: 'Plumbing Codes', count: 1 },
    { name: 'Blueprints', count: 1 },
    { name: 'Safety Standards', count: 1 },
    { name: 'Mechanical Installations', count: 1 }
  ];

  const softSkills = [
    'Independently',
    'Innovation',
    'Innovative',
    'Problem Solving',
    'Professionalism',
    'Teamwork',
    'Communication',
    'Leadership',
    'Adaptability'
  ];

  return (
    <div className="space-y-6">
      {/* Hard Skills */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Hard Skills</h3>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-lg font-semibold text-gray-600">On</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {hardSkills.slice(0, isSkillsExpanded ? hardSkills.length : 6).map((skill, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">{skill.name}</span>
              <div className="flex items-center space-x-3">
                <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${(skill.count / 3) * 100}%` }}
                  ></div>
                </div>
                <span className="text-base text-gray-500 w-6 font-semibold">{skill.count}</span>
              </div>
            </div>
          ))}
          
          {!isSkillsExpanded && (
            <button
              onClick={() => setIsSkillsExpanded(true)}
              className="text-lg text-blue-600 hover:text-blue-800 font-semibold"
            >
              Show all {hardSkills.length}
            </button>
          )}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Soft Skills</h3>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-lg font-semibold text-gray-600">On</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {softSkills.slice(0, isSkillsExpanded ? softSkills.length : 6).map((skill, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-700">{skill}</span>
              <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-3/4"></div>
              </div>
            </div>
          ))}
          
          {!isSkillsExpanded && (
            <button
              onClick={() => setIsSkillsExpanded(true)}
              className="text-lg text-blue-600 hover:text-blue-800 font-semibold"
            >
              Show all {softSkills.length}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
