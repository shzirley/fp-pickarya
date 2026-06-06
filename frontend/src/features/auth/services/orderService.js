const API_BASE_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  const session = localStorage.getItem('pickarya_session');
  return session ? JSON.parse(session).token : null;
};

export const createOrderAPI = async (orderData) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(orderData)
  });
  return res.json();
};

export const getOrdersByBuyer = async (buyerId) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/orders?buyerId=${buyerId}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
};

export const getOrdersByArtist = async (artistId) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/orders?artistId=${artistId}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
};

export const updateOrderStatus = async (orderId, action, body = {}) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/${action}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(body)
  });
  return res.json();
};