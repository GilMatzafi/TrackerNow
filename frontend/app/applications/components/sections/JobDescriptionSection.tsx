import { PencilIcon } from '@heroicons/react/24/outline';
import { Job } from '../../../types/job';

interface JobDescriptionSectionProps {
  job: Job;
}

export default function JobDescriptionSection({ job }: JobDescriptionSectionProps) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Job Description</h2>
        <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
          <PencilIcon className="w-6 h-6 text-gray-400" />
        </button>
      </div>
      
      <div className="prose prose-xl max-w-none">
        {job.position_description ? (
          <div className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.position_description}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}