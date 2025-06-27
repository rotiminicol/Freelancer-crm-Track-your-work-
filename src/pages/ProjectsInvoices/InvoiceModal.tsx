
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2 } from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceModalProps {
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ onClose }) => {
  const { clients, addInvoice, isDarkMode } = useApp();
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<'draft' | 'sent' | 'paid' | 'overdue'>('draft');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(items =>
      items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: generateId(),
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const getTotalAmount = () => {
    return lineItems.reduce((total, item) => total + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const selectedClient = clients.find(c => c.id === clientId);
    const total = getTotalAmount();
    
    addInvoice({
      clientId,
      clientName: selectedClient?.name || '',
      total,
      status,
      lineItems,
    });

    setLoading(false);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-xl rounded-2xl`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Create New Invoice
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Client
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Line Items
                </label>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={item.id} className={`p-4 border rounded-lg ${
                    isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-medium mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Description
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          required
                          className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="Item description"
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Qty
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                          step="0.01"
                          className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-medium mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Rate
                        </label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                          step="0.01"
                          className={`w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className={`block text-xs font-medium mb-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Amount
                          </label>
                          <div className={`px-3 py-2 text-sm border rounded ${
                            isDarkMode 
                              ? 'bg-gray-600 border-gray-500 text-gray-300' 
                              : 'bg-gray-100 border-gray-300 text-gray-700'
                          }`}>
                            {formatCurrency(item.amount)}
                          </div>
                        </div>
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className={`mt-4 p-4 border-t-2 ${
                isDarkMode ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Total:
                  </span>
                  <span className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </div>
                ) : (
                  'Create Invoice'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
