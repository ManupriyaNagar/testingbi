// import { useState, useEffect } from 'react';

// // Custom hook for API data fetching with loading and error states
// export function useApi(apiFunction, dependencies = []) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await apiFunction();

//         if (isMounted) {
//           setData(result);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err.message || 'An error occurred');
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, dependencies);

//   const refetch = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const result = await apiFunction();
//       setData(result);
//     } catch (err) {
//       setError(err.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { data, loading, error, refetch };
// }

// // Hook for dashboard stats
// export function useDashboardStats() {
//   return useApi(async () => {
//     const { analyticsAPI } = await import('../lib/api');
//     return analyticsAPI.getDashboardStats();
//   });
// }

// // Hook for templates
// export function useTemplates() {
//   return useApi(async () => {
//     const { templatesAPI } = await import('../lib/api');
//     return templatesAPI.getAll();
//   });
// }

// // Hook for invitations
// export function useInvitations() {
//   return useApi(async () => {
//     const { invitationsAPI } = await import('../lib/api');
//     return invitationsAPI.getAll();
//   });
// }

// // Hook for orders
// export function useOrders() {
//   return useApi(async () => {
//     const { ordersAPI } = await import('../lib/api');
//     return ordersAPI.getAll();
//   });
// }

// // Hook for customers
// export function useCustomers() {
//   return useApi(async () => {
//     const { customersAPI } = await import('../lib/api');
//     return customersAPI.getAll();
//   });
// }

// // Hook for categories
// export function useCategories() {
//   return useApi(async () => {
//     const { categoriesAPI } = await import('../lib/api');
//     return categoriesAPI.getAll();
//   });
// }


import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';

// ----------------------------------------
// Generic useApi hook for async operations
// ----------------------------------------
export function useApi(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err.message || 'An error occurred');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// ----------------------------------------
// Custom Hooks
// ----------------------------------------

// Dashboard Stats
export function useDashboardStats() {
  return useApi(async () => {
    const { analyticsAPI } = await import('../lib/api');
    return analyticsAPI.getDashboardStats();
  });
}

// Templates
export function useTemplates() {
  return useApi(async () => {
    const { templatesAPI } = await import('../lib/api');
    return templatesAPI.getAll();
  });
}

// Invitations
export function useInvitations() {
  return useApi(async () => {
    const { invitationsAPI } = await import('../lib/api');
    return invitationsAPI.getAll();
  });
}

// Orders
export function useOrders() {
  return useApi(async () => {
    const { ordersAPI } = await import('../lib/api');
    return ordersAPI.getAll();
  });
}

// ----------------------------------------
// Customers (Connected directly to backend)
// ----------------------------------------
export function useCustomers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`); // ✅ centralized API route
      if (!res.ok) throw new Error('Failed to fetch users');
      const json = await res.json();

      // Optional: format data for your frontend table
      const formatted = json.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '—',
        segment: u.segment || 'Regular',
        orders: u.orders || 0,
        totalSpent: `₹${u.totalSpent || 0}`,
        rating: u.rating || 0,
        lastOrder: u.lastOrder || '—',
        status: u.status || 'active',
      }));

      setData(formatted);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { data, loading, error, refetch: fetchCustomers };
}

// Categories
export function useCategories() {
  return useApi(async () => {
    const { categoriesAPI } = await import('../lib/api');
    return categoriesAPI.getAll();
  });
}
