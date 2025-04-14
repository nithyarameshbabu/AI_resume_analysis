import React, { useState } from 'react';
import { Upload, Briefcase, Users, Percent, ChevronRight } from 'lucide-react';
import { analyzeResume } from './api/resumeApi';
import { AnalysisResult } from './types';

interface ResumeAnalysis extends AnalysisResult {
  fileName: string;
  timestamp: number;
}

function App() {
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError('');
      
      try {
        const results = await analyzeResume(file);
        const newAnalysis: ResumeAnalysis = {
          ...results,
          fileName: file.name,
          timestamp: Date.now()
        };
        
        setAnalyses(prev => [newAnalysis, ...prev]);
      } catch (err) {
        setError('Error analyzing resume. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
        if (event.target) {
          event.target.value = ''; // Reset file input
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Resume Matcher</h1>
          <p className="mt-2 text-gray-600">Upload your resume to find your perfect match</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-center">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, or TXT (MAX. 10MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </label>
          </div>
          {error && (
            <p className="mt-4 text-center text-red-600">{error}</p>
          )}
        </div>

        {/* Analysis Results */}
        {analyses.map((analysis, index) => (
          <div key={analysis.timestamp} className={`mb-12 ${index > 0 ? 'pt-12 border-t border-gray-200' : ''}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Analysis for {analysis.fileName}</h2>
              <p className="text-sm text-gray-500">
                Analyzed on {new Date(analysis.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skills Analysis */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Percent className="w-6 h-6 mr-2 text-blue-600" />
                  <h2 className="text-xl font-semibold">Skills Analysis</h2>
                </div>
                <div className="space-y-4">
                  {analysis.extractedSkills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <span className="text-sm text-gray-600">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Overall Match</span>
                      <span className="text-2xl font-bold text-blue-600">{analysis.overallMatch}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Matches */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
                  <h2 className="text-xl font-semibold">Top Company Matches</h2>
                </div>
                <div className="space-y-4">
                  {analysis.matchedCompanies.map((company) => (
                    <div key={company.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-500">
                          {company.requiredSkills.join(" • ")}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-blue-600 mr-2">
                          {company.matchPercentage}%
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alumni Matches */}
              <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  <h2 className="text-xl font-semibold">Alumni with Similar Profiles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysis.matchedAlumni.map((alumni) => (
                    <div key={alumni.name} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{alumni.name}</h3>
                          <p className="text-sm text-gray-600">{alumni.role}</p>
                          <p className="text-sm text-gray-500">{alumni.company}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {alumni.skills.join(" • ")}
                          </p>
                        </div>
                        <span className="text-lg font-semibold text-blue-600">
                          {alumni.matchPercentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;