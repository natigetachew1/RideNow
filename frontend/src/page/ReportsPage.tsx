import { useState } from 'react';
import { ExclamationTriangleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon as BanIcon } from '@heroicons/react/24/solid';

const ReportStatus = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed'
} as const;

type ReportStatusType = typeof ReportStatus[keyof typeof ReportStatus];
type ReportType = 'bike' | 'user';

interface Report {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: ReportStatusType;
  item: {
    id: string;
    name: string;
    image?: string;
    details: string;
  };
}

const ReportsPage = () => {
  // Mock data for reports
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'RPT-001',
      type: 'bike',
      title: 'Damaged Bike',
      description: 'Reported damage to the rear wheel and brakes.',
      reportedBy: 'user123',
      reportedAt: '2025-10-30T14:30:00Z',
      status: 'pending',
      item: {
        id: 'BIKE-456',
        name: 'Yamaha MT-07',
        details: 'Last rented on Oct 28, 2025',
      },
    },
    {
      id: 'RPT-002',
      type: 'user',
      title: 'Inappropriate Behavior',
      description: 'User was reported for aggressive behavior towards other users.',
      reportedBy: 'user456',
      reportedAt: '2025-10-29T09:15:00Z',
      status: 'pending',
      item: {
        id: 'USER-789',
        name: 'John Smith',
        details: 'Member since Jan 2025',
      },
    },
    {
      id: 'RPT-003',
      type: 'bike',
      title: 'Mechanical Issues',
      description: 'Engine makes unusual noise and has trouble starting.',
      reportedBy: 'user789',
      reportedAt: '2025-10-28T16:45:00Z',
      status: 'resolved',
      item: {
        id: 'BIKE-123',
        name: 'Honda CBR 600RR',
        details: 'Currently in service',
      },
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<ReportStatusType>(ReportStatus.PENDING);

  const handleResolve = (id: string) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status: 'resolved' } : report
    ));
  };

  const handleDismiss = (id: string) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status: 'dismissed' } : report
    ));
  };

  const handleBanUser = (reportId: string) => {
    // In a real app, this would call an API to ban the user
    const report = reports.find(r => r.id === reportId);
    if (report?.type === 'user') {
      alert(`User ${report.item.name} has been banned.`);
      handleResolve(reportId);
    }
  };

  const filteredReports = reports.filter(report => report.status === activeTab);

  const getStatusBadge = (status: ReportStatusType) => {
    const statusClasses = {
      [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [ReportStatus.RESOLVED]: 'bg-green-100 text-green-800',
      [ReportStatus.DISMISSED]: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const openReportDetails = (report: Report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Notifications</h2>
          <p className="text-sm text-gray-500">Review and manage reported issues</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {Object.values(ReportStatus).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as ReportStatus)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({reports.filter(r => r.status === tab).length})
            </button>
          ))}
        </nav>
      </div>

      {/* Reports List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} reports</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no {activeTab} reports to display.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <li key={report.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          {report.type === 'bike' ? (
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          ) : (
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer" onClick={() => openReportDetails(report)}>
                            {report.title}
                          </h3>
                          <span className="ml-2">{getStatusBadge(report.status)}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Reported by {report.reportedBy} • {new Date(report.reportedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResolve(report.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Resolve
                          </button>
                          {report.type === 'user' && (
                            <button
                              onClick={() => handleBanUser(report.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <BanIcon className="h-3 w-3 mr-1" />
                              Ban User
                            </button>
                          )}
                          <button
                            onClick={() => handleDismiss(report.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <XMarkIcon className="h-3 w-3 mr-1" />
                            Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{report.description}</p>
                    <div className="mt-1 text-sm text-gray-500">
                      {report.type === 'bike' ? 'Bike' : 'User'}: {report.item.name} • {report.item.details}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Report Details Modal */}
      {showDetails && selectedReport && (
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowDetails(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {selectedReport.title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedReport.description}
                    </p>
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900">
                        {selectedReport.type === 'bike' ? 'Bike Details' : 'User Details'}
                      </h4>
                      <dl className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-500">ID:</dt>
                          <dd className="text-gray-900">{selectedReport.item.id}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-500">Name:</dt>
                          <dd className="text-gray-900">{selectedReport.item.name}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-500">Status:</dt>
                          <dd>{getStatusBadge(selectedReport.status)}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-500">Reported On:</dt>
                          <dd className="text-gray-900">{new Date(selectedReport.reportedAt).toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-500">Reported By:</dt>
                          <dd className="text-gray-900">{selectedReport.reportedBy}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                {selectedReport.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                      onClick={() => {
                        handleResolve(selectedReport.id);
                        setShowDetails(false);
                      }}
                    >
                      Mark as Resolved
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setShowDetails(false)}
                    >
                      Close
                    </button>
                  </>
                )}
                {selectedReport.status !== 'pending' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    onClick={() => setShowDetails(false)}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
