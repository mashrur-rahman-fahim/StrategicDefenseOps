'use client';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/auth';
import Layout from '@/components/layout';

export default function Assign() {
  const { user } = useAuth({ middleware: 'auth' });
  const [role, setRole] = useState(null);
  const [managerEmail, setManagerEmail] = useState('');
  const [operatorEmail, setOperatorEmail] = useState('');
  const [viewerEmail, setViewerEmail] = useState('');
  const [operatorManagerEmail, setOperatorManagerEmail] = useState('');
  const [viewerManagerEmail, setViewerManagerEmail] = useState('');

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (user) {
      setRole(user.role_id);
    }
  }, [user]);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    let timer;
    if (toast.show) {
      timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [toast]);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const assignRole = async (roleType) => {
    try {
      let payload = {};
      let endpoint = '';

      if (roleType === 'manager') {
        endpoint = '/api/manager-assign';
        payload = { managerEmail };
      } else if (roleType === 'operator') {
        endpoint = '/api/operator-assign';
        payload = { operatorEmail, managerEmail: operatorManagerEmail };
      } else if (roleType === 'viewer') {
        endpoint = '/api/viewer-assign';
        payload = { viewerEmail, managerEmail: viewerManagerEmail };
      }

      const response = await axios.post(endpoint, payload);

      showToast(
        response.data.message || `Successfully assigned ${roleType} role`,
        'success'
      );

      // Clear input fields after assignment
      if (roleType === 'manager') setManagerEmail('');
      if (roleType === 'operator') {
        setOperatorEmail('');
        setOperatorManagerEmail('');
      }
      if (roleType === 'viewer') {
        setViewerEmail('');
        setViewerManagerEmail('');
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || `Failed to assign ${roleType} role`,
        'error'
      );
    }
  };

  // Toast notification component
  const Toast = () => {
    if (!toast.show) return null;

    const bgColor = toast.type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
      <div
        className={`fixed top-15 right-10 ${bgColor} text-white py-2 px-4 rounded-md shadow-lg z-50 flex items-center justify-between max-w-md`}
      >
        <div className="flex items-center">
          {toast.type === 'success' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
        <button
          onClick={() => setToast({ ...toast, show: false })}
          className="ml-4 text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <Layout>
      {/* Toast notification */}
      <Toast />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Info Panel */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="bg-white text-blue-600 rounded-full p-1 w-8 h-8 inline-flex items-center justify-center mr-3">
              {user?.id}
            </span>
            <span className="mr-2">Role:</span>
            <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full">
              {user?.role_id === 1
                ? 'Admin'
                : user?.role_id === 2
                  ? 'Manager'
                  : user?.role_id === 3
                    ? 'Operator'
                    : 'Viewer'}
            </span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Manager Assignment Card */}
          {role === 1 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Assign Manager
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      placeholder="Manager Email"
                    />
                  </div>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                    onClick={() => assignRole('manager')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    Assign Manager
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Operator Assignment Card */}
          {(role === 1 || role === 2) && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Assign Operator
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      value={operatorEmail}
                      onChange={(e) => setOperatorEmail(e.target.value)}
                      placeholder="Operator Email"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      value={operatorManagerEmail}
                      onChange={(e) => setOperatorManagerEmail(e.target.value)}
                      placeholder="Manager Email"
                    />
                  </div>
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                    onClick={() => assignRole('operator')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    Assign Operator
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Viewer Assignment Card */}
          {(role === 1 || role === 2) && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg md:col-span-2">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Assign Viewer
                </h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-4">
                    <label className="text-sm font-medium text-gray-700">
                      Viewer Information
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        value={viewerEmail}
                        onChange={(e) => {
                          setViewerEmail(e.target.value);
                          // Auto-fill Manager Email only if empty
                          if (!viewerManagerEmail) {
                            setViewerManagerEmail(e.target.value);
                          }
                        }}
                        placeholder="Viewer Email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <label className="text-sm font-medium text-gray-700">
                      Manager Information
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        value={viewerManagerEmail}
                        onChange={(e) => setViewerManagerEmail(e.target.value)}
                        placeholder="Manager Email"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                    onClick={() => assignRole('viewer')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    Assign Viewer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
