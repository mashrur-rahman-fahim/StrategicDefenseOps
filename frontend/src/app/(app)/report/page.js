'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { FaRegStopCircle, FaCopy, FaEdit, FaTrash, FaMagic, FaSyncAlt, FaClipboardList, FaCogs, FaFileAlt } from 'react-icons/fa';
import Layout from '@/components/layout';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';

const MarkdownComponents = {
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => <th className="px-6 py-3 bg-indigo-700 text-white text-left text-xs font-semibold uppercase tracking-wider">{children}</th>,
  td: ({ children }) => <td className="px-6 py-4 whitespace-nowrap text-sm">{children}</td>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-indigo-700 mt-6 mb-3">{children}</h2>,
  p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
  code: ({ children }) => (
    <code className="px-2 py-1 bg-gray-100 rounded-md font-mono text-sm">{children}</code>
  ),
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
};

export default function ReportGenerator() {
  const { user } = useAuth({ middleware: 'auth' });
  const [operations, setOperations] = useState([]);
  const [selectedOperationId, setSelectedOperationId] = useState('');
  const [reportType, setReportType] = useState('');
  const [operationStatus, setOperationStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const [stopped, setStopped] = useState(false);
  const [existingReport, setExistingReport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    report_name: '',
    report_summary: '',
    report_details: ''
  });

  useEffect(() => {
    const fetchExistingReport = async () => {
      if (selectedOperationId) {
        try {
          const response = await axios.get(`/api/view-report/${selectedOperationId}`);
          setExistingReport(response.data);
        } catch (error) {
          if (error.response?.status === 404) {
            setExistingReport(null);
          } else {
            console.error('Error fetching report:', error);
          }
        }
      }
    };
    fetchExistingReport();
  }, [selectedOperationId]);

  useEffect(() => {
    const fetchCompletedOperations = async () => {
      try {
        const response = await axios.get('/api/get-all-operations');
        const completedOps = response.data[1].filter(
          (op) => op.status === 'completed'
        );
        setOperations(completedOps);
      } catch (err) {
        console.error('Error fetching operations:', err);
      }
    };
    fetchCompletedOperations();
  }, []);

  const generateReport = async () => {
    if (!selectedOperationId || !operationStatus) {
      alert('Please select an operation and set its status');
      return;
    }

    setMessages([]);
    setLoading(true);
    setStopped(false);
    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.post(
        `/api/generate-report/${selectedOperationId}`,
        {
          report_type: reportType,
          operation_status: operationStatus,
        },
        {
          signal: abortControllerRef.current.signal,
          onDownloadProgress: (progressEvent) => {
            const chunk = progressEvent.event?.target?.responseText || 
            progressEvent.currentTarget?.response || 
            progressEvent.target?.response || 
            "";
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              
              if (lastMessage?.sender === 'bot') {
                lastMessage.text = chunk;
                return [...newMessages];
              }
              return [
                ...newMessages,
                { sender: 'bot', text: chunk },
              ];
            });
          }
        }
      );

      const reportResponse = await axios.get(`/api/view-report/${selectedOperationId}`);
      setExistingReport(reportResponse.data);
    } catch (error) {
      if (error.name === 'AbortError' || stopped) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: '\n\n**Report generation stopped**' },
        ]);
      } else {
        console.error('Generation error:', error);
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: '## ❌ Error\nFailed to generate report. Please try again.' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const stopReportGeneration = () => {
    setStopped(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/edit-report/${selectedOperationId}`,
        editFormData
      );
      setExistingReport(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update report');
    }
  };

  const handleDeleteReport = async () => {
    if (window.confirm('Are you sure you want to delete this report permanently?')) {
      try {
        await axios.delete(`/api/delete-report/${selectedOperationId}`);
        setExistingReport(null);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
      }
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(existingReport.report_details);
    // Could add toast notification here
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, existingReport]);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Operation Report Generator
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Operations Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                  <div className="flex items-center">
                    <FaClipboardList className="text-white text-xl mr-2" />
                    <h3 className="text-xl font-bold text-white">Completed Operations</h3>
                  </div>
                </div>
                <div className="p-5 max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {operations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No completed operations found</p>
                      </div>
                    ) : (
                      operations.map((op) => (
                        <div 
                          key={op.id}
                          onClick={() => {
                            setSelectedOperationId(op.id);
                            setReportType('post_operation');
                          }}
                          className={`
                            cursor-pointer rounded-xl p-4 transition-all duration-200
                            ${selectedOperationId === op.id 
                              ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md' 
                              : 'bg-gray-50 border border-gray-200 hover:shadow-md hover:-translate-y-1'
                            }
                          `}
                        >
                          <h4 className="font-medium text-gray-900">{op.name}</h4>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            <span>
                              {new Date(op.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Configuration Panel */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                  <div className="flex items-center">
                    <FaCogs className="text-white text-xl mr-2" />
                    <h3 className="text-xl font-bold text-white">Report Configuration</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Type
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={reportType}
                          readOnly
                          className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Operation Outcome
                      </label>
                      <select
                        value={operationStatus}
                        onChange={(e) => setOperationStatus(e.target.value)}
                        disabled={loading}
                        className="block w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="">Select outcome</option>
                        <option value="success">Successful</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Panel */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <FaFileAlt className="text-white text-xl mr-2" />
                    <h3 className="text-xl font-bold text-white">
                      {existingReport?.report_name || 'Generated Report'}
                    </h3>
                  </div>
                  {existingReport && (
                    <button
                      onClick={handleCopyReport}
                      className="flex items-center px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <FaCopy className="mr-1.5" />
                      Copy
                    </button>
                  )}
                </div>
                <div
                  className="relative p-6 bg-gray-50"
                  style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto' }}
                  ref={chatHistoryRef}
                >
                  {existingReport ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      components={MarkdownComponents}
                    >
                      {existingReport.report_details}
                    </ReactMarkdown>
                  ) : messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className="animate-fade-in bg-white rounded-xl shadow-sm p-5 mb-4"
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkMath, remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                          components={MarkdownComponents}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p className="text-center">Select an operation and configure settings to generate a report</p>
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 font-medium">Generating Report...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={generateReport}
                  disabled={loading || !selectedOperationId || !operationStatus}
                  className={`
                    flex-1 flex items-center justify-center px-6 py-3.5 rounded-xl shadow-lg font-medium text-white 
                    ${loading || !selectedOperationId || !operationStatus
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transform transition hover:-translate-y-1'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <span className="mr-2 h-5 w-5 rounded-full animate-spin border-2 border-white border-t-transparent"></span>
                      Generating...
                    </>
                  ) : existingReport ? (
                    <>
                      <FaSyncAlt className="mr-2" />
                      Regenerate
                    </>
                  ) : (
                    <>
                      <FaMagic className="mr-2" />
                      Generate Report
                    </>
                  )}
                </button>

                {loading && (
                  <button
                    onClick={stopReportGeneration}
                    className="px-6 py-3.5 rounded-xl shadow-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform transition hover:-translate-y-1 flex items-center"
                  >
                    <FaRegStopCircle className="mr-2" />
                    Stop
                  </button>
                )}
              </div>

              {/* Admin Actions */}
              {existingReport && (
                <div className="flex flex-wrap gap-4">
                  {user?.role_id <= 2 && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditFormData({
                          report_name: existingReport.report_name,
                          report_summary: existingReport.report_summary,
                          report_details: existingReport.report_details,
                        });
                      }}
                      className="px-6 py-3.5 rounded-xl shadow-lg font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transform transition hover:-translate-y-1 flex items-center"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </button>
                  )}
                  {user?.role_id <= 1 && (
                    <button
                      onClick={handleDeleteReport}
                      className="px-6 py-3.5 rounded-xl shadow-lg font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform transition hover:-translate-y-1 flex items-center"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-screen overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <FaEdit className="text-white text-xl mr-2" />
                <h3 className="text-xl font-bold text-white">Edit Report</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Name
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editFormData.report_name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        report_name: e.target.value,
                      }))
                    }
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Executive Summary
                  </label>
                  <textarea
                    className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                    value={editFormData.report_summary}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        report_summary: e.target.value,
                      }))
                    }
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Report (Markdown Supported)
                  </label>
                  <textarea
                    className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    rows="12"
                    value={editFormData.report_details}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        report_details: e.target.value,
                      }))
                    }
                  />
                </div>
              
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-lg border border-gray-300 font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </Layout>
  );
}