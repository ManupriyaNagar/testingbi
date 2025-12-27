// API configuration and service functions
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5001';
    }
  }
  return 'https://beyondinviteb.onrender.com';
};

export const BASE_URL = getBaseUrl();
export const API_BASE_URL = `${BASE_URL}/api`;

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Templates API functions
export const templatesAPI = {
  getAll: async () => {
    return apiRequest('/templates');
  },

  getById: async (id) => {
    return apiRequest(`/templates/${id}`);
  },

  create: async (templateData) => {
    return apiRequest('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },

  update: async (id, templateData) => {
    return apiRequest(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/templates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Invitations API functions
export const invitationsAPI = {
  getAll: async () => {
    return apiRequest('/invitations');
  },

  create: async (invitationData) => {
    return apiRequest('/invitations', {
      method: 'POST',
      body: JSON.stringify(invitationData),
    });
  },

  update: async (id, invitationData) => {
    return apiRequest(`/invitations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invitationData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/invitations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API functions
export const categoriesAPI = {
  getAll: async () => {
    return apiRequest('/categories');
  },

  create: async (categoryData) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
};

// Dashboard Analytics API functions
export const analyticsAPI = {
  getDashboardStats: async () => {
    try {
      const [templates, invitations, orders, orderStats] = await Promise.all([
        templatesAPI.getAll(),
        invitationsAPI.getAll(),
        ordersAPI.getAll(),
        ordersAPI.getStats().catch(() => ({ totalOrders: 0, totalRevenue: 0 }))
      ]);

      // Calculate stats from the data
      const totalTemplates = templates.length;
      const totalInvitations = invitations.length;
      const totalOrders = orderStats.totalOrders || orders.length;
      const totalRevenue = orderStats.totalRevenue || orders.reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);

      return {
        totalTemplates,
        totalInvitations,
        totalOrders,
        totalRevenue,
        templates,
        invitations,
        orders,
        orderStats
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },
};

// Orders API functions
export const ordersAPI = {
  getAll: async () => {
    return apiRequest('/orders');
  },

  getById: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  update: async (id, orderData) => {
    return apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/orders/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest('/orders/stats');
  },
};

// Customers API functions (mock for now)
export const customersAPI = {
  getAll: async () => {
    // Mock customers data - in real app, this would come from a dedicated customers table
    return [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@email.com',
        phone: '+1 (555) 123-4567',
        segment: 'Premium',
        orders: 5,
        totalSpent: 1495,
        lastOrder: '2025-01-15',
        joinDate: '2024-03-15',
        rating: 4.8,
        status: 'active',
      },
      {
        id: 2,
        name: 'Mike Chen',
        email: 'mike@email.com',
        phone: '+1 (555) 234-5678',
        segment: 'Regular',
        orders: 3,
        totalSpent: 447,
        lastOrder: '2025-01-14',
        joinDate: '2024-06-20',
        rating: 4.6,
        status: 'active',
      },
      // Add more mock customers as needed
    ];
  },
};

export default {
  auth: authAPI,
  templates: templatesAPI,
  invitations: invitationsAPI,
  categories: categoriesAPI,
  analytics: analyticsAPI,
  orders: ordersAPI,
  customers: customersAPI,
};