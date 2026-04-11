export const projects = [
  { id: '1', name: 'Client Portal Redesign', client: 'Acme Corp', color: '#84cc16' },
  { id: '2', name: 'Mobile App Development', client: 'TechStart Inc', color: '#a3e635' },
  { id: '3', name: 'Data Migration', client: 'Global Finance', color: '#bef264' },
  { id: '4', name: 'Security Audit', client: 'SecureNet', color: '#65a30d' },
  { id: '5', name: 'Internal Training', client: 'FDM Group', color: '#4d7c0f' },
];

export const timeEntries = [
  {
    id: '0',
    projectId: '3',
    date: '2026-03-17',
    hours: 8,
    description: 'validation of data consistency',
    status: 'submitted',
  },
  {
    id: '9',
    projectId: '2',
    date: '2026-03-16',
    hours: 7,
    description: 'review of mobile test results',
    status: 'submitted',
  },
  {
    id: '1',
    projectId: '1',
    date: '2026-04-01',
    hours: 8,
    description: 'Frontend component development',
    status: 'draft',
  },
  {
    id: '2',
    projectId: '1',
    date: '2026-03-31',
    hours: 7.5,
    description: 'UI/UX implementation',
    status: 'submitted',
  },
  {
    id: '3',
    projectId: '2',
    date: '2026-03-29',
    hours: 6,
    description: 'React Native setup and configuration',
    status: 'approved',
  },
  {
    id: '4',
    projectId: '3',
    date: '2026-03-28',
    hours: 8,
    description: 'Database schema mapping',
    status: 'approved',
  },
  {
    id: '5',
    projectId: '2',
    date: '2026-03-27',
    hours: 7,
    description: 'API integration',
    status: 'approved',
  },
  {
    id: '6',
    projectId: '4',
    date: '2026-03-26',
    hours: 8,
    description: 'Penetration testing',
    status: 'approved',
  },
  {
    id: '7',
    projectId: '1',
    date: '2026-03-25',
    hours: 6.5,
    description: 'Code review and optimization',
    status: 'approved',
  },
  {
    id: '8',
    projectId: '5',
    date: '2026-03-24',
    hours: 4,
    description: 'Team training session',
    status: 'approved',
  },
];
export const loginData = [
  { username: 'consultant', password: 'password', role: 'Consultant',  name: 'Consultant' },
  { username: 'admin',      password: 'password', role: 'Admin',       name: 'Admin'   },
  { username: 'payroll',    password: 'password', role: 'Payroll',     name: 'Payroll'      },
  { username: 'manager',    password: 'password', role: 'Manager',     name: 'Manager'      },
];

export const getUserByCredentials = (username, password) =>
  loginData.find(u => u.username === username && u.password === password);
export const getProjectById = (id) => {
  return projects.find(p => p.id === id);
};

export const getEntriesForWeek = (weekStart) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
};
