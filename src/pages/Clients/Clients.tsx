
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import ClientModal from './ClientModal';

const Clients = () => {
  const { clients, deleteClient, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(clientId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`p-4 lg:p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Clients
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your client relationships
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl p-6 border shadow-sm`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {clients.length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Clients
                </p>
              </div>
            </div>
          </div>

          <div className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl p-6 border shadow-sm`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredClients.length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Filtered Results
                </p>
              </div>
            </div>
          </div>

          <div className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl p-6 border shadow-sm`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {clients.filter(c => {
                    const createdDate = new Date(c.createdAt);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return createdDate > weekAgo;
                  }).length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  New This Week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <div className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl p-12 border shadow-sm text-center`}>
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Phone className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {searchTerm ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first client'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Client
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {client.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Added {formatDate(client.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className={`p-2 rounded-lg ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <Edit className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className={`h-4 w-4 mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {client.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className={`h-4 w-4 mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {client.phone}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Status
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Client Modal */}
        {isModalOpen && (
          <ClientModal
            client={editingClient}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default Clients;
