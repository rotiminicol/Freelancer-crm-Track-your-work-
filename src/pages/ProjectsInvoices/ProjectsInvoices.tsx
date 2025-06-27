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
          return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        case 'completed':
          return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'on-hold':
          return 'bg-amber-100 text-amber-800 border border-amber-200';
        default:
          return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    } else {
      switch (status) {
        case 'paid':
          return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        case 'sent':
          return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'draft':
          return 'bg-gray-100 text-gray-800 border border-gray-200';
        case 'overdue':
          return 'bg-red-100 text-red-800 border border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border border-gray-200';
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0 animate-slide-in-down">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
                Projects & Invoices
              </h1>
              <p className={`mt-2 text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your projects and track your invoices
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Project
              </button>
              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Invoice
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-8 overflow-x-auto animate-fade-in">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600 shadow-md'
              }`}
            >
              <Briefcase className="h-5 w-5 mr-3" />
              Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                activeTab === 'invoices'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-2xl'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-emerald-600 shadow-md'
              }`}
            >
              <FileText className="h-5 w-5 mr-3" />
              Invoices ({invoices.length})
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-scale-in">
            {activeTab === 'projects' ? (
              <>
                <div className={`${
                  isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                } rounded-3xl p-4 sm:p-6 border shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {projectStats.total}
                      </p>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${
                  isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                } rounded-3xl p-4 sm:p-6 border shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {projectStats.active}
                      </p>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Active
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${
                  isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                } rounded-3xl p-4 sm:p-6 border shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {projectStats.completed}
                      </p>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Done
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${
                  isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                } rounded-3xl p-4 sm:p-6 border shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className={`text-sm sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(projectStats.totalValue)}
                      </p>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Value
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`${
                  isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                } rounded-3xl p-4 sm:p-6 border shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {invoiceStats.total}
                      </p>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${
                  isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                } rounded-3xl p-4 sm:p-6 border shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg">
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {invoiceStats.paid}
                      </p>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Paid
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${
                  isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                } rounded-3xl p-4 sm:p-6 border shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className={`text-xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {invoiceStats.pending}
                      </p>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Pending
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${
                  isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
                } rounded-3xl p-4 sm:p-6 border shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="flex items-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg">
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className={`text-sm sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(invoiceStats.totalValue)}
                      </p>
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Value
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
              isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
            } rounded-3xl border shadow-2xl backdrop-blur-sm animate-slide-in-up`}>
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Projects
                </h3>
              </div>
              
              {projects.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Briefcase className={`h-16 w-16 mx-auto ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  } mb-6`} />
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No projects yet
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-8 text-lg`}>
                    Get started by creating your first project
                  </p>
                  <button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 font-semibold"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Project
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden">
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {projects.map((project) => (
                        <div key={project.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <Briefcase className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-lg font-semibold truncate ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {project.title}
                                </h4>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {project.clientName}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                  <span className={`text-xl font-bold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {formatCurrency(project.amount)}
                                  </span>
                                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                    getStatusColor(project.status, 'project')
                                  }`}>
                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <tr>
                          <th className={`px-6 py-4 text-left text-sm font-semibold ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } uppercase tracking-wider`}>
                            Project
                          </th>
                          <th className={`px-6 py-4 text-left text-sm font-semibold ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } uppercase tracking-wider`}>
                            Client
                          </th>
                          <th className={`px-6 py-4 text-left text-sm font-semibold ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } uppercase tracking-wider`}>
                            Amount
                          </th>
                          <th className={`px-6 py-4 text-left text-sm font-semibold ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          } uppercase tracking-wider`}>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${
                        isDarkMode ? 'bg-gray-800/80' : 'bg-white'
                      } divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {projects.map((project) => (
                          <tr key={project.id} className={`${
                            isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                          } transition-all duration-200`}>
                            <td className="px-6 py-5">
                              <div className="flex items-center">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                  <Briefcase className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                  <div className={`text-lg font-semibold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {project.title}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {project.clientName}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className={`text-lg font-semibold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {formatCurrency(project.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-xl ${
                                getStatusColor(project.status, 'project')
                              }`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={`${
              isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-100'
            } rounded-3xl border shadow-2xl backdrop-blur-sm animate-slide-in-up`}>
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Invoices
                </h3>
              </div>
              
              {invoices.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <FileText className={`h-16 w-16 mx-auto ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  } mb-6`} />
                  <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No invoices yet
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-8 text-lg`}>
                    Create and send your first invoice
                  </p>
                  <button
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 font-semibold"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Invoice
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <tr>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        } uppercase tracking-wider`}>
                          Invoice
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        } uppercase tracking-wider hidden sm:table-cell`}>
                          Client
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        } uppercase tracking-wider`}>
                          Total
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        } uppercase tracking-wider`}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${
                      isDarkMode ? 'bg-gray-800/80' : 'bg-white'
                    } divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className={`${
                          isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                        } transition-all duration-200`}>
                          <td className="px-6 py-5">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                <FileText className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className={`text-lg font-semibold ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  INV-{invoice.id.slice(-6).toUpperCase()}
                                </div>
                                <div className={`text-sm sm:hidden ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {invoice.clientName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 hidden sm:table-cell">
                            <div className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                              {invoice.clientName}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className={`text-lg font-semibold ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {formatCurrency(invoice.total)}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-xl ${
                              getStatusColor(invoice.status, 'invoice')
                            }`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
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
    </div>
  );
};

export default ProjectsInvoices;
