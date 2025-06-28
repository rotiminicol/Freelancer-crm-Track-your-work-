import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../lib/api';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  amount: number;
  clientId: string;
  clientName: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
}

interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  lineItems: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Activity {
  id: string;
  message: string;
  timestamp: string;
  type: 'client' | 'project' | 'invoice';
}

interface AppContextType {
  user: User | null;
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  activities: Activity[];
  isAuthenticated: boolean;
  isDarkMode: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  toggleTheme: () => void;
  getTotalEarnings: () => number;
  getTotalClients: () => number;
  getActiveProjects: () => number;
  getAllActivities: () => Activity[];
  getUpcomingDeadlines: () => Array<{
    id: string;
    title: string;
    type: 'project' | 'invoice';
    deadline: string;
    clientName: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data after login
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [clientRes, projectRes, invoiceRes, activityRes, me] = await Promise.all([
        api.getClients(),
        api.getProjects(),
        api.getInvoices(),
        api.getActivityLogs(),
        api.getMe(),
      ]);
      setClients(clientRes);
      setProjects(projectRes);
      setInvoices(invoiceRes);
      setActivities(activityRes);
      setUser(me);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On mount, check for token and fetch user/data
    if (api.getToken()) {
      fetchAllData();
    }
    // Check for saved theme and apply it
    const savedTheme = localStorage.getItem('crm-theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.login(email, password);
      await fetchAllData();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.signup(name, email, password);
      await fetchAllData();
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    setClients([]);
    setProjects([]);
    setInvoices([]);
    setActivities([]);
  };

  // CLIENTS CRUD
  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      await api.createClient(clientData);
      const updated = await api.getClients();
      setClients(updated);
    } finally {
      setLoading(false);
    }
  };
  const updateClient = async (id: string, clientData: Partial<Client>) => {
    setLoading(true);
    try {
      await api.updateClient(Number(id), clientData);
      const updated = await api.getClients();
      setClients(updated);
    } finally {
      setLoading(false);
    }
  };
  const deleteClient = async (id: string) => {
    setLoading(true);
    try {
      await api.deleteClient(Number(id));
      const updated = await api.getClients();
      setClients(updated);
    } finally {
      setLoading(false);
    }
  };

  // PROJECTS CRUD
  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      await api.createProject(projectData);
      const updated = await api.getProjects();
      setProjects(updated);
    } finally {
      setLoading(false);
    }
  };

  // INVOICES CRUD
  const addInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      await api.createInvoice(invoiceData);
      const updated = await api.getInvoices();
      setInvoices(updated);
    } finally {
      setLoading(false);
    }
  };

  // USER
  const updateUser = async (userData: Partial<User>) => {
    // Implement if you have a user update endpoint
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  // THEME
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('crm-theme', newTheme ? 'dark' : 'light');
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // DASHBOARD STATS
  const getTotalEarnings = () => {
    return invoices.filter(invoice => invoice.status === 'paid').reduce((total, invoice) => total + invoice.total, 0);
  };
  const getTotalClients = () => clients.length;
  const getActiveProjects = () => projects.filter(project => project.status === 'active').length;
  const getAllActivities = () => activities;
  const getUpcomingDeadlines = () => [];

  return (
    <AppContext.Provider
      value={{
        user,
        clients,
        projects,
        invoices,
        activities,
        isAuthenticated,
        isDarkMode,
        loading,
        error,
        login,
        signup,
        logout,
        addClient,
        updateClient,
        deleteClient,
        addProject,
        addInvoice,
        updateUser,
        toggleTheme,
        getTotalEarnings,
        getTotalClients,
        getActiveProjects,
        getAllActivities,
        getUpcomingDeadlines,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
