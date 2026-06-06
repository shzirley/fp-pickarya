const API_BASE_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  const session = localStorage.getItem('pickarya_session');
  return session ? JSON.parse(session).token : null;
};

export const getArtists = async () => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/artists`);
  return res.json();
};

export const getArtistById = async (id) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/artists/${id}`);
  return res.json();
};

export const getArtistByUserId = async (userId) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/artists/user/${userId}`);
  if (!res.ok) return null;
  return res.json();
};

export const uploadPortfolio = async (artistId, portfolioData) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/artists/${artistId}/portfolio`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(portfolioData)
  });
  return res.json();
};

export const publishPortfolio = async (artistId) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/artists/${artistId}/publish`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return res.json();
};

export const unpublishPortfolio = async (artistId) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/artists/${artistId}/unpublish`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return res.json();
};

export const clearPortfolio = async (artistId) => {
  if (!API_BASE_URL) return null;
  const res = await fetch(`${API_BASE_URL}/artists/${artistId}/clear`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return res.json();
};