// src/lib/api.ts
const API_BASE = 'https://x8ki-letl-twmt.n7.xano.io/api:hH6Qed79';
const AUTH_BASE = 'https://x8ki-letl-twmt.n7.xano.io/api:8FbHvE5s';

export const getToken = () => localStorage.getItem('token');

export async function apiFetch(endpoint: string, options: RequestInit = {}, isAuth = true) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(isAuth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Auth endpoints
export async function login(email: string, password: string) {
  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  localStorage.setItem('token', data.authToken || data.token);
  return data;
}

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${AUTH_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  localStorage.setItem('token', data.authToken || data.token);
  return data;
}

export async function getMe() {
  const res = await fetch(`${AUTH_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Clients
export const getClients = () => apiFetch('/client', { method: 'GET' });
export const getClient = (id: number) => apiFetch(`/client/${id}`, { method: 'GET' });
export const createClient = (data: any) => apiFetch('/client', { method: 'POST', body: JSON.stringify(data) });
export const updateClient = (id: number, data: any) => apiFetch(`/client/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteClient = (id: number) => apiFetch(`/client/${id}`, { method: 'DELETE' });

// Projects
export const getProjects = () => apiFetch('/project', { method: 'GET' });
export const getProject = (id: number) => apiFetch(`/project/${id}`, { method: 'GET' });
export const createProject = (data: any) => apiFetch('/project', { method: 'POST', body: JSON.stringify(data) });
export const updateProject = (id: number, data: any) => apiFetch(`/project/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteProject = (id: number) => apiFetch(`/project/${id}`, { method: 'DELETE' });

// Invoices
export const getInvoices = () => apiFetch('/invoice', { method: 'GET' });
export const getInvoice = (id: number) => apiFetch(`/invoice/${id}`, { method: 'GET' });
export const createInvoice = (data: any) => apiFetch('/invoice', { method: 'POST', body: JSON.stringify(data) });
export const updateInvoice = (id: number, data: any) => apiFetch(`/invoice/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteInvoice = (id: number) => apiFetch(`/invoice/${id}`, { method: 'DELETE' });

// Invoice Line Items
export const getInvoiceLineItems = () => apiFetch('/invoice_line_item', { method: 'GET' });
export const getInvoiceLineItem = (id: number) => apiFetch(`/invoice_line_item/${id}`, { method: 'GET' });
export const createInvoiceLineItem = (data: any) => apiFetch('/invoice_line_item', { method: 'POST', body: JSON.stringify(data) });
export const updateInvoiceLineItem = (id: number, data: any) => apiFetch(`/invoice_line_item/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteInvoiceLineItem = (id: number) => apiFetch(`/invoice_line_item/${id}`, { method: 'DELETE' });

// Activity Log
export const getActivityLogs = () => apiFetch('/activity_log', { method: 'GET' });
export const getActivityLog = (id: number) => apiFetch(`/activity_log/${id}`, { method: 'GET' });
export const createActivityLog = (data: any) => apiFetch('/activity_log', { method: 'POST', body: JSON.stringify(data) });
export const updateActivityLog = (id: number, data: any) => apiFetch(`/activity_log/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteActivityLog = (id: number) => apiFetch(`/activity_log/${id}`, { method: 'DELETE' }); 