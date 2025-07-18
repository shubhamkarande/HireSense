import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Zap, Target, CheckCircle, AlertCircle } from 'lucide-react';

const ResumeMatcher = () => {
  const [resume, setResume] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [matchedJobs, setMatchedJobs] = useState([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResume(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = () => {
    if (!resume.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis = {
        score: 85,
        strengths: [
          'Strong technical skills in React and JavaScript',
          'Excellent communication skills',
          'Remote work experience',
          'Project management experience'
        ],
        improvements: [
          'Add more specific metrics and achievements',
          'Include certifications or training',
          'Highlight leadership experience',
          'Add technical portfolio links'
        ],
        keywords: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Remote', 'Agile', 'Leadership']
      };

      const mockJobs = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          match: 95,
          salary: '$120,000 - $150,000',
          reason: 'Perfect match for React and JavaScript expertise'
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          company: 'WebSolutions',
          match: 88,
          salary: '$100,000 - $130,000',
          reason: 'Great fit for full-stack development skills'
        },
        {
          id: '3',
          title: 'Technical Lead',
          company: 'InnovateLabs',
          match: 82,
          salary: '$130,000 - $160,000',
          reason: 'Leadership and technical skills align well'
        }
      ];

      setAnalysis(mockAnalysis);
      setMatchedJobs(mockJobs);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Resume Matcher
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Upload your resume and get AI-powered job matches and optimization suggestions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Upload Your Resume
            </h2>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Resume File
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Drop your resume here or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            </div>

            {/* Text Area */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or Paste Your Resume Text
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!resume.trim() || isAnalyzing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Analyze & Match</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Analysis Results
            </h2>

            {analysis ? (
              <div className="space-y-6">
                {/* Score */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {analysis.score}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Resume Score</p>
                </div>

                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    Improvements
                  </h3>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Keywords */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Key Skills Found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Resume to Analyze
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get AI-powered insights and job matches based on your resume.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Matched Jobs */}
        {matchedJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="h-6 w-6 text-blue-600 mr-2" />
              Matched Jobs
            </h2>

            <div className="space-y-4">
              {matchedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
                      <p className="text-sm text-gray-500 mt-1">{job.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {job.match}%
                      </div>
                      <div className="text-sm text-gray-500">Match</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {job.salary}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeMatcher;