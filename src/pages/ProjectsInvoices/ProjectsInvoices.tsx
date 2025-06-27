
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Calendar, DollarSign, Briefcase, FileText } from 'lucide-react';
import ProjectModal from './ProjectModal';
import InvoiceModal from './InvoiceModal';

const ProjectsInvoices = () => {
  const { projects, invoices, clients, isDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices'>('projects');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const getStatusColor = (status: string, type: 'project' | 'invoice') => {
    if (type === 'project') {
      switch (status) {
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'completed':
          return 'bg-blue-100 text-blue-800';
        case 'on-hold':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'paid':
          return 'bg-green-100 text-green-800';
        case 'sent':
          return 'bg-blue-100 text-blue-800';
        case 'draft':
          return 'bg-gray-100 text-gray-800';
        case 'overdue':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const totalValue = projects.reduce((sum, p) => sum + p.amount, 0);
    
    return { total, active, completed, totalValue };
  };

  const getInvoiceStats = () => {
    const total = invoices.length;
    const paid = invoices.filter(i => i.status === 'paid').length;
    const pending = invoices.filter(i => i.status === 'sent').length;
    const totalValue = invoices.reduce((sum, i) => sum + i.total, 0);
    
    return { total, paid, pending, totalValue };
  };

  const projectStats = getProjectStats();
  const invoiceStats = getInvoiceStats();

  return (
    <div className={`p-4 lg:p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Projects & Invoices
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your projects and track your invoices
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Invoice
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : isDarkMode
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Briefcase className="h-5 w-5 inline mr-2" />
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'invoices'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : isDarkMode
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="h-5 w-5 inline mr-2" />
            Invoices ({invoices.length})
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {activeTab === 'projects' ? (
            <>
              <div className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {projectStats.total}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Projects
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {projectStats.active}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Active Projects
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {projectStats.completed}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Completed
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(projectStats.totalValue)}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Value
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {invoiceStats.total}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Invoices
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {invoiceStats.paid}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Paid
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {invoiceStats.pending}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Pending
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } rounded-xl p-6 border shadow-sm`}>
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(invoiceStats.totalValue)}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Value
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        {activeTab === 'projects' ? (
          <div className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl border shadow-sm overflow-hidden`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Projects
              </h3>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className={`h-12 w-12 mx-auto ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                } mb-4`} />
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No projects yet
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                  Get started by creating your first project
                </p>
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Project
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Client
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Amount
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Status
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {projects.map((project) => (
                      <tr key={project.id} className={`${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      } transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {project.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {project.clientName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {formatCurrency(project.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getStatusColor(project.status, 'project')
                          }`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(project.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl border shadow-sm overflow-hidden`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Invoices
              </h3>
            </div>
            
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className={`h-12 w-12 mx-auto ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                } mb-4`} />
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  No invoices yet
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                  Create and send your first invoice
                </p>
                <button
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Invoice
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Invoice
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Client
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Total
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Status
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      } uppercase tracking-wider`}>
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className={`${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      } transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                INV-{invoice.id.slice(-6).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            {invoice.clientName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {formatCurrency(invoice.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            getStatusColor(invoice.status, 'invoice')
                          }`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(invoice.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        {isProjectModalOpen && (
          <ProjectModal onClose={() => setIsProjectModalOpen(false)} />
        )}
        
        {isInvoiceModalOpen && (
          <InvoiceModal onClose={() => setIsInvoiceModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default ProjectsInvoices;
