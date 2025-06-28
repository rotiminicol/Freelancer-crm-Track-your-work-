import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

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
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 },
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
      { id: generateId(), description: '', quantity: 1, rate: 0, amount: 0 },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-2xl glass-effect border border-gray-100 p-0">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-lg">Create New Invoice</CardTitle>
          <Button onClick={onClose} size="icon" variant="ghost">
            <X className="h-5 w-5 text-gray-400" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
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
                <label className="text-sm font-medium">Line Items</label>
                <Button type="button" onClick={addLineItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />Add Item
                </Button>
              </div>
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                      className={`w-16 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                    <input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={e => updateLineItem(item.id, 'rate', Number(e.target.value))}
                      className={`w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                    <span className="w-20 text-right text-sm font-medium">{formatCurrency(item.amount)}</span>
                    <Button type="button" onClick={() => removeLineItem(item.id)} size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <span className="text-lg font-semibold">Total: {formatCurrency(getTotalAmount())}</span>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Invoice'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceModal;
