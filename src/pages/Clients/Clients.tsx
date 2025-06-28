import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import ClientModal from './ClientModal';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const Clients = () => {
  const { clients, loading, error, addClient, updateClient, deleteClient, isDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  if (loading) return <div className="flex justify-center items-center h-64 text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

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
            <h1 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Clients</h1>
            <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your client relationships</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center" size="lg">
            <Plus className="h-5 w-5 mr-2" />Add Client
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors`}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="flex items-center p-6 glass-effect border border-blue-100">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{clients.length}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Clients</p>
            </div>
          </Card>
          <Card className="flex items-center p-6 glass-effect border border-green-100">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{filteredClients.length}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Filtered Results</p>
            </div>
          </Card>
          <Card className="flex items-center p-6 glass-effect border border-purple-100">
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <Plus className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{clients.filter(c => {
                const createdDate = new Date(c.createdAt);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return createdDate > weekAgo;
              }).length}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>New This Week</p>
            </div>
          </Card>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <Card className="glass-effect text-center p-12 border border-gray-100">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Phone className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchTerm ? 'No clients found' : 'No clients yet'}</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>{searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first client'}</p>
            {!searchTerm && (
              <Button onClick={() => setIsModalOpen(true)} className="inline-flex items-center" size="lg">
                <Plus className="h-5 w-5 mr-2" />Add Your First Client
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="p-6 glass-effect border border-gray-100 hover:shadow-card transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Added {formatDate(client.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleEdit(client)} size="icon" variant="outline" className="hover:bg-primary/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(client.id)} size="icon" variant="outline" className="hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{client.email}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{client.phone}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {isModalOpen && (
          <ClientModal client={editingClient} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default Clients;
