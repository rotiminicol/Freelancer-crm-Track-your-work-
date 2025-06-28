import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Calendar, DollarSign, Briefcase, FileText } from 'lucide-react';
import ProjectModal from './ProjectModal';
import InvoiceModal from './InvoiceModal';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const ProjectsInvoices = () => {
  const { projects, invoices, clients, isDarkMode, loading, error } = useApp();
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices'>('projects');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const getStatusColor = (status: string, type: 'project' | 'invoice') => {
    if (type === 'project') {
      switch (status) {
        case 'active':
          return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'completed':
          return 'bg-green-50 text-green-700 border-green-200';
        case 'on-hold':
          return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        default:
          return 'bg-gray-50 text-gray-700 border-gray-200';
      }
    } else {
      switch (status) {
        case 'paid':
          return 'bg-green-50 text-green-700 border-green-200';
        case 'sent':
          return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'draft':
          return 'bg-gray-50 text-gray-700 border-gray-200';
        case 'overdue':
          return 'bg-red-50 text-red-700 border-red-200';
        default:
          return 'bg-gray-50 text-gray-700 border-gray-200';
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

  if (loading) return <div className="flex justify-center items-center h-64 text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Projects & Invoices</h1>
              <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your projects and track your invoices</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button onClick={() => setIsProjectModalOpen(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />New Project
              </Button>
              <Button onClick={() => setIsInvoiceModalOpen(true)} size="lg" variant="secondary">
                <Plus className="h-5 w-5 mr-2" />New Invoice
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-8 overflow-x-auto">
            <Button
              onClick={() => setActiveTab('projects')}
              variant={activeTab === 'projects' ? 'default' : 'outline'}
              className="rounded-lg px-6 py-3"
            >
              <Briefcase className="h-5 w-5 mr-2" />Projects ({projects.length})
            </Button>
            <Button
              onClick={() => setActiveTab('invoices')}
              variant={activeTab === 'invoices' ? 'default' : 'outline'}
              className="rounded-lg px-6 py-3"
            >
              <FileText className="h-5 w-5 mr-2" />Invoices ({invoices.length})
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {activeTab === 'projects' ? (
              <>
                <Card className="glass-effect border border-blue-100">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{projectStats.total}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border border-green-100">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{projectStats.active}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border border-purple-100">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{projectStats.completed}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Done</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border border-yellow-100">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <DollarSign className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(projectStats.totalValue)}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Value</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="glass-effect border border-green-100">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{invoiceStats.total}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border border-blue-100">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{invoiceStats.paid}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Paid</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border border-yellow-100">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <FileText className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{invoiceStats.pending}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect border border-purple-100">
                  <CardContent className="flex items-center p-6">
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(invoiceStats.totalValue)}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Value</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Content */}
          {activeTab === 'projects' ? (
            <Card className="glass-effect border border-gray-100">
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No projects yet.</div>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between py-4">
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</p>
                          <p className="text-sm text-gray-500">{clients.find(c => c.id === project.clientId)?.name || 'Unknown Client'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status, 'project')}`}>{project.status}</span>
                          <span className="text-sm font-semibold">{formatCurrency(project.amount)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-effect border border-gray-100">
              <CardHeader>
                <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {invoices.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No invoices yet.</div>
                  ) : (
                    invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between py-4">
                        <div>
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{clients.find(c => c.id === invoice.clientId)?.name || 'Unknown Client'}</p>
                          <p className="text-sm text-gray-500">{formatDate(invoice.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status, 'invoice')}`}>{invoice.status}</span>
                          <span className="text-sm font-semibold">{formatCurrency(invoice.total)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {isProjectModalOpen && <ProjectModal onClose={() => setIsProjectModalOpen(false)} />}
          {isInvoiceModalOpen && <InvoiceModal onClose={() => setIsInvoiceModalOpen(false)} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectsInvoices;
