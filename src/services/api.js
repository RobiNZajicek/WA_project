/**
 * JecnaGames API Service
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Token management
let token = localStorage.getItem('jecna_token');

export const setToken = (newToken) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('jecna_token', newToken);
  } else {
    localStorage.removeItem('jecna_token');
  }
};

export const getToken = () => token;

// API request helper
const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// AUTH
export const auth = {
  register: async (userData) => {
    const data = await request('register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setToken(data.token);
    return data;
  },

  login: async (email, password) => {
    const data = await request('login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },

  logout: () => {
    setToken(null);
  },

  getMe: async () => {
    return await request('me');
  },

  isLoggedIn: () => !!token,
};

// LEADERBOARD
export const leaderboard = {
  getPlayers: async () => {
    return await request('leaderboard?type=players');
  },

  getClasses: async () => {
    return await request('leaderboard?type=classes');
  },
};

// SCORES
export const scores = {
  submit: async (game, score, won, details = {}) => {
    return await request('scores', {
      method: 'POST',
      body: JSON.stringify({ game, score, won, details }),
    });
  },

  getMy: async () => {
    return await request('scores');
  },
};

// DAILY
export const daily = {
  getStatus: async () => {
    return await request('daily');
  },
};

export default {
  auth,
  leaderboard,
  scores,
  daily,
};
