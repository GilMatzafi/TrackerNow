"use client";

import { useState, useEffect } from 'react';
import { 
  StarIcon, 
  MapPinIcon, 
  ClockIcon, 
  PencilIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Custom launch animation styles
const launchModalStyles = `
  @keyframes launchModal {
    0% {
      transform: scale(0.3) translateY(60px) rotateX(10deg);
      opacity: 0;
      filter: blur(2px);
    }
    20% {
      transform: scale(0.6) translateY(30px) rotateX(5deg);
      opacity: 0.4;
      filter: blur(1px);
    }
    40% {
      transform: scale(0.85) translateY(10px) rotateX(2deg);
      opacity: 0.7;
      filter: blur(0.5px);
    }
    60% {
      transform: scale(1.02) translateY(-3px) rotateX(-1deg);
      opacity: 0.9;
      filter: blur(0px);
    }
    80% {
      transform: scale(0.99) translateY(1px) rotateX(0.5deg);
      opacity: 1;
      filter: blur(0px);
    }
    100% {
      transform: scale(1) translateY(0) rotateX(0deg);
      opacity: 1;
      filter: blur(0px);
    }
  }
`;

interface Job {
  id: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  note?: string;
  tags?: string[];
  status?: string;
  appliedDate?: string;
  interviewTime?: string;
  companyLogo?: string;
  isReferral?: boolean;
  referrerName?: string;
  companyDescription?: string;
  positionDescription?: string;
  cv?: string;
  contacts?: Contact[];
}

interface Contact {
  id: string;
  type: string;
  name: string;
  email: string;
  linkedin: string;
}

interface JobDetailPageProps {
  job: Job;
  onClose: () => void;
  onEdit?: (job: Job) => void;
}

export default function JobDetailPage({ job, onClose, onEdit }: JobDetailPageProps) {
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
  const [guidanceProgress, setGuidanceProgress] = useState(0);
  const [isStarred, setIsStarred] = useState(false);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(true);

  // Add launch animation styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = launchModalStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  const guidanceSteps = [
    {
      id: 1,
      title: 'Review the Job Position details',
      description: 'Look through the highlighted skills and keywords to see if the job matches your experience',
      completed: false
    },
    {
      id: 2,
      title: 'Check company culture fit',
      description: 'Research the company values and work environment',
      completed: false
    },
    {
      id: 3,
      title: 'Prepare your application',
      description: 'Tailor your resume and cover letter to match the job requirements',
      completed: false
    }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-2xl w-full max-w-7xl mx-4 max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
        style={{
          animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
        }}
      >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-lg font-medium"
          >
            ← Back to Applications
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsStarred(!isStarred)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isStarred ? (
                <StarIconSolid className="w-6 h-6 text-yellow-500" />
              ) : (
                <StarIcon className="w-6 h-6 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => onEdit?.(job)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Job
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {job.position}
                  </h1>
                  <div className="flex items-center space-x-4 text-lg text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-5 h-5" />
                      <span>{job.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-5 h-5" />
                      <span>Saved {job.appliedDate || 'recently'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-6 h-6 text-gray-300" />
                  ))}
                </div>
              </div>

              {job.isReferral && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Referral Opportunity
                    </span>
                  </div>
                  {job.referrerName && (
                    <p className="text-green-700 mt-1">
                      Referred by: {job.referrerName}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Guidance Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <button
                onClick={() => setIsGuidanceExpanded(!isGuidanceExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Guidance {guidanceProgress}% complete
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Follow these steps to improve your application
                  </p>
                </div>
                {isGuidanceExpanded ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isGuidanceExpanded && (
                <div className="mt-6 space-y-4">
                  {guidanceSteps.map((step) => (
                    <div key={step.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={(e) => {
                          const newSteps = guidanceSteps.map(s => 
                            s.id === step.id ? { ...s, completed: e.target.checked } : s
                          );
                          const completed = newSteps.filter(s => s.completed).length;
                          setGuidanceProgress(Math.round((completed / newSteps.length) * 100));
                        }}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Job Description</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <PencilIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Join our dynamic team at {job.company} in an environment that fosters 
                  <span className="bg-yellow-100 px-1 rounded">teamwork</span>, 
                  <span className="bg-yellow-100 px-1 rounded">nurtures career development</span>, 
                  <span className="bg-yellow-100 px-1 rounded">celebrates diversity</span>, and 
                  <span className="bg-yellow-100 px-1 rounded">rewards innovation</span>. 
                  We offer competitive compensation and excellent employee programs.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Position Summary</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We are seeking a skilled professional for immediate hire, focusing on projects, 
                  installations, and commercial service work.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Interpret <span className="bg-yellow-100 px-1 rounded">blueprints</span> to determine the layout for systems, including fixture placement and routing.</li>
                  <li>Execute precise cuts in walls and floors for accommodation.</li>
                  <li>Conduct thorough testing of systems for leaks using various methods, ensuring readiness for inspections.</li>
                  <li>Commit to the highest <span className="bg-yellow-100 px-1 rounded">safety standards</span> and company protocols.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Qualifications</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Certified professional with proven experience.</li>
                  <li>Proven experience in both residential and commercial tasks.</li>
                  <li>Professionalism in service work, with a strong sense of respect and courtesy.</li>
                  <li>Knowledgeable in <span className="bg-yellow-100 px-1 rounded">mechanical installations</span> and familiar with local codes.</li>
                  <li>Possession of a valid driver's license.</li>
                  <li>Strong mathematical and <span className="bg-yellow-100 px-1 rounded">problem solving</span> abilities.</li>
                  <li>Capable of working <span className="bg-yellow-100 px-1 rounded">independently</span> with little oversight and as part of a <span className="bg-yellow-100 px-1 rounded">team</span>.</li>
                  <li>Must own some tools/equipment and be able to manage the physical demands.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Skills Sidebar */}
          <div className="space-y-6">
            {/* Hard Skills */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Hard Skills</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">On</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {hardSkills.slice(0, isSkillsExpanded ? hardSkills.length : 6).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${(skill.count / 3) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-4">{skill.count}</span>
                    </div>
                  </div>
                ))}
                
                {!isSkillsExpanded && (
                  <button
                    onClick={() => setIsSkillsExpanded(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Show all {hardSkills.length}
                  </button>
                )}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Soft Skills</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">On</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {softSkills.slice(0, isSkillsExpanded ? softSkills.length : 6).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{skill}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-3/4"></div>
                    </div>
                  </div>
                ))}
                
                {!isSkillsExpanded && (
                  <button
                    onClick={() => setIsSkillsExpanded(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Show all {softSkills.length}
                  </button>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Company:</span>
                  <p className="text-sm text-gray-900">{job.company}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <p className="text-sm text-gray-900">{job.status || 'Saved'}</p>
                </div>
                {job.salary && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Salary:</span>
                    <p className="text-sm text-gray-900">{job.salary}</p>
                  </div>
                )}
                {job.appliedDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Applied:</span>
                    <p className="text-sm text-gray-900">{job.appliedDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
