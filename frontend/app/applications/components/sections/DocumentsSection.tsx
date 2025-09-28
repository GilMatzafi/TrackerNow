import { Job } from '../../../types/job';

interface DocumentsSectionProps {
  job: Job;
}

export default function DocumentsSection({ job }: DocumentsSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Documents</h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-lg font-semibold text-gray-600 mb-3">
            Resume/CV
          </label>
          {job.cv ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-lg font-semibold text-green-800">{job.cv}</p>
                  <p className="text-sm text-green-600">Resume uploaded successfully</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <div className="space-y-3">
                <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-500">No resume uploaded</span>
                </div>
                <p className="text-base text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-lg font-semibold text-gray-600 mb-3">
            Cover Letter
          </label>
          {job.cover_letter ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-lg font-semibold text-green-800">{job.cover_letter}</p>
                  <p className="text-sm text-green-600">Cover letter uploaded successfully</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <div className="space-y-3">
                <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-500">No cover letter uploaded</span>
                </div>
                <p className="text-base text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}