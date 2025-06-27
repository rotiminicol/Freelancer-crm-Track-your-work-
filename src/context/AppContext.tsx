import React, { createContext, useContext, useState, useEffect } from 'react';

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
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateUser: (user: Partial<User>) => void;
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

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    phone: '+1 (555) 987-6543',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    amount: 5000,
    clientId: '1',
    clientName: 'John Smith',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    title: 'Mobile App Development',
    amount: 12000,
    clientId: '2',
    clientName: 'Sarah Johnson',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

const defaultInvoices: Invoice[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'John Smith',
    total: 2500,
    status: 'paid',
    lineItems: [
      {
        id: '1',
        description: 'UI/UX Design',
        quantity: 1,
        rate: 2500,
        amount: 2500,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const defaultActivities: Activity[] = [
  {
    id: '1',
    message: 'New invoice sent to John Smith',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'invoice',
  },
  {
    id: '2',
    message: 'Project "Website Redesign" marked as active',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'project',
  },
  {
    id: '3',
    message: 'New client Sarah Johnson added',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    type: 'client',
  },
];

const defaultUpcomingDeadlines = [
  {
    id: '1',
    title: 'Website Redesign - Final Review',
    type: 'project' as const,
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    clientName: 'John Smith',
    priority: 'high' as const,
  },
  {
    id: '2',
    title: 'Invoice Payment Due',
    type: 'invoice' as const,
    deadline: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days from now
    clientName: 'Sarah Johnson',
    priority: 'medium' as const,
  },
  {
    id: '3',
    title: 'Mobile App Development - Milestone 2',
    type: 'project' as const,
    deadline: new Date(Date.now() + 86400000 * 6).toISOString(), // 6 days from now
    clientName: 'Tech Corp',
    priority: 'high' as const,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [upcomingDeadlines] = useState(defaultUpcomingDeadlines);

  useEffect(() => {
    // Load data from localStorage
    const savedUser = localStorage.getItem('crm-user');
    const savedClients = localStorage.getItem('crm-clients');
    const savedProjects = localStorage.getItem('crm-projects');
    const savedInvoices = localStorage.getItem('crm-invoices');
    const savedActivities = localStorage.getItem('crm-activities');
    const savedTheme = localStorage.getItem('crm-theme');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    setClients(savedClients ? JSON.parse(savedClients) : defaultClients);
    setProjects(savedProjects ? JSON.parse(savedProjects) : defaultProjects);
    setInvoices(savedInvoices ? JSON.parse(savedInvoices) : defaultInvoices);
    setActivities(savedActivities ? JSON.parse(savedActivities) : defaultActivities);
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const login = (email: string, password: string) => {
    const user = {
      id: generateId(),
      name: 'John Doe',
      email,
    };
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('crm-user', JSON.stringify(user));
  };

  const signup = (name: string, email: string, password: string) => {
    const user = {
      id: generateId(),
      name,
      email,
    };
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('crm-user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('crm-user');
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient = {
      ...clientData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem('crm-clients', JSON.stringify(updatedClients));

    // Add activity
    const activity = {
      id: generateId(),
      message: `New client ${newClient.name} added`,
      timestamp: new Date().toISOString(),
      type: 'client' as const,
    };
    const updatedActivities = [activity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem('crm-activities', JSON.stringify(updatedActivities));
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, ...clientData } : client
    );
    setClients(updatedClients);
    localStorage.setItem('crm-clients', JSON.stringify(updatedClients));
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    localStorage.setItem('crm-clients', JSON.stringify(updatedClients));
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject = {
      ...projectData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('crm-projects', JSON.stringify(updatedProjects));

    // Add activity
    const activity = {
      id: generateId(),
      message: `New project "${newProject.title}" created`,
      timestamp: new Date().toISOString(),
      type: 'project' as const,
    };
    const updatedActivities = [activity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem('crm-activities', JSON.stringify(updatedActivities));
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice = {
      ...invoiceData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('crm-invoices', JSON.stringify(updatedInvoices));

    // Add activity
    const activity = {
      id: generateId(),
      message: `New invoice sent to ${newInvoice.clientName}`,
      timestamp: new Date().toISOString(),
      type: 'invoice' as const,
    };
    const updatedActivities = [activity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem('crm-activities', JSON.stringify(updatedActivities));
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('crm-user', JSON.stringify(updatedUser));
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('crm-theme', newTheme ? 'dark' : 'light');
  };

  const getTotalEarnings = () => {
    return invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.total, 0);
  };

  const getTotalClients = () => clients.length;

  const getActiveProjects = () => {
    return projects.filter(project => project.status === 'active').length;
  };

  const getAllActivities = () => activities;

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return upcomingDeadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.deadline);
      return deadlineDate >= now && deadlineDate <= weekFromNow;
    });
  };

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
