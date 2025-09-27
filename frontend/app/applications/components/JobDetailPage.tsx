"use client";

import { useState, useEffect } from 'react';
import { 
  StarIcon, 
  MapPinIcon, 
  ClockIcon, 
  PencilIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Job, Contact } from '../../types/job';

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


interface JobDetailPageProps {
  job: Job;
  onClose: () => void;
  onEdit?: (job: Job) => void;
  isAddingNewJob?: boolean;
}

export default function JobDetailPage({ job, onClose, onEdit, isAddingNewJob = false }: JobDetailPageProps) {
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
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-7xl mx-4 max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'launchModal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          zIndex: 10000
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
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
            {isAddingNewJob && (
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Adding New Job
              </span>
            )}
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
                  <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    {isAddingNewJob ? 'New Job Application' : job.position}
                  </h1>
                  <div className="flex items-center space-x-6 text-xl text-gray-600 mb-6">
                    <div className="flex items-center space-x-3">
                      <MapPinIcon className="w-6 h-6" />
                      <span className="font-semibold">
                        {isAddingNewJob ? 'Add location...' : (job.location || 'Location not specified')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="w-6 h-6" />
                      <span className="font-semibold">
                        {isAddingNewJob ? 'Just created' : `Saved ${job.applied_date || 'recently'}`}
                      </span>
                    </div>
                  </div>
                  
                  {/* Job Details */}
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="w-6 h-6 text-gray-500" />
                      <span className="text-lg font-semibold text-gray-900">
                        {isAddingNewJob ? 'Add company name...' : job.company}
                      </span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center space-x-3">
                        <CurrencyDollarIcon className="w-6 h-6 text-gray-500" />
                        <span className="text-lg font-semibold text-gray-900">{job.salary}</span>
                      </div>
                    )}
                    {job.applied_date && (
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="w-6 h-6 text-gray-500" />
                        <span className="text-lg font-semibold text-gray-900">{job.applied_date}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-8 h-8 text-gray-300" />
                  ))}
                </div>
              </div>
            </div>

            {/* Company Overview */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Company Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">About {job.company}</h3>
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    {job.company_description || `Join our dynamic team at ${job.company} in an environment that fosters teamwork, nurtures career development, celebrates diversity, and rewards innovation. We offer competitive compensation and excellent employee programs.`}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-lg text-gray-700 font-medium">Industry-leading technology solutions</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-lg text-gray-700 font-medium">Innovative and collaborative culture</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-lg text-gray-700 font-medium">Professional growth opportunities</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-lg text-gray-700 font-medium">Competitive benefits package</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Details</h3>
                  <div className="space-y-5">
                    <div>
                      <span className="text-lg font-semibold text-gray-600">Company Size:</span>
                      <p className="text-xl text-gray-900 font-medium">500-1000 employees</p>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-gray-600">Founded:</span>
                      <p className="text-xl text-gray-900 font-medium">2010</p>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-gray-600">Industry:</span>
                      <p className="text-xl text-gray-900 font-medium">Technology</p>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-gray-600">Website:</span>
                      <a href="#" className="text-xl text-blue-600 hover:text-blue-800 font-medium">www.{job.company.toLowerCase()}.com</a>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-gray-600">Headquarters:</span>
                      <p className="text-xl text-gray-900 font-medium">{job.location || 'San Francisco, CA'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Job Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Job Description</h2>
                <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                  <PencilIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="prose prose-xl max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  Join our dynamic team at {job.company} in an environment that fosters 
                  <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">teamwork</span>, 
                  <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">nurtures career development</span>, 
                  <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">celebrates diversity</span>, and 
                  <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">rewards innovation</span>. 
                  We offer competitive compensation and excellent employee programs.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">Position Summary</h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  We are seeking a skilled professional for immediate hire, focusing on projects, 
                  installations, and commercial service work.
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-3 text-xl text-gray-700">
                  <li>Interpret <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">blueprints</span> to determine the layout for systems, including fixture placement and routing.</li>
                  <li>Execute precise cuts in walls and floors for accommodation.</li>
                  <li>Conduct thorough testing of systems for leaks using various methods, ensuring readiness for inspections.</li>
                  <li>Commit to the highest <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">safety standards</span> and company protocols.</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-10">Qualifications</h3>
                <ul className="list-disc list-inside space-y-3 text-xl text-gray-700">
                  <li>Certified professional with proven experience.</li>
                  <li>Proven experience in both residential and commercial tasks.</li>
                  <li>Professionalism in service work, with a strong sense of respect and courtesy.</li>
                  <li>Knowledgeable in <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">mechanical installations</span> and familiar with local codes.</li>
                  <li>Possession of a valid driver's license.</li>
                  <li>Strong mathematical and <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">problem solving</span> abilities.</li>
                  <li>Capable of working <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">independently</span> with little oversight and as part of a <span className="bg-yellow-100 px-2 py-1 rounded font-semibold">team</span>.</li>
                  <li>Must own some tools/equipment and be able to manage the physical demands.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Skills Sidebar */}
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

            {/* Contact Person */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Person</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-lg font-semibold text-gray-600 mb-3">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Contact person name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-600 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-600 mb-3">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-600 mb-3">
                    Role
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg">
                    <option value="">Select role</option>
                    <option value="HR">HR</option>
                    <option value="Technical">Technical</option>
                    <option value="Manager">Manager</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resume/CV Upload */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Resume/CV</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-lg font-semibold text-gray-600 mb-3">
                    Upload Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <div className="space-y-3">
                      <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="text-lg text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" />
                        </label>
                        <span className="pl-1">or drag and drop</span>
                      </div>
                      <p className="text-base text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-600 mb-3">
                    Cover Letter
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your cover letter here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
