import { 
  DocumentArrowUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface DocumentsSectionFormProps {
  resumeFile: File | null;
  coverLetterFile: File | null;
  resumeInputRef: React.RefObject<HTMLInputElement | null>;
  coverLetterInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (file: File, type: 'resume' | 'coverLetter') => void;
}

export default function DocumentsSectionForm({ 
  resumeFile,
  coverLetterFile,
  resumeInputRef,
  coverLetterInputRef,
  handleFileUpload
}: DocumentsSectionFormProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-3xl font-semibold text-gray-900 flex items-center mb-8">
        <div className="p-2 bg-teal-100 rounded-lg mr-4">
          <DocumentArrowUpIcon className="w-6 h-6 text-teal-600" />
        </div>
        Documents
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Resume/CV
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resume')}
              className="hidden"
            />
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-lg text-gray-600">
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Upload resume
              </button>
              <span className="ml-1">or drag and drop</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
            {resumeFile && (
              <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                {resumeFile.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Cover Letter
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              ref={coverLetterInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'coverLetter')}
              className="hidden"
            />
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-lg text-gray-600">
              <button
                type="button"
                onClick={() => coverLetterInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Upload cover letter
              </button>
              <span className="ml-1">or drag and drop</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
            {coverLetterFile && (
              <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                {coverLetterFile.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
