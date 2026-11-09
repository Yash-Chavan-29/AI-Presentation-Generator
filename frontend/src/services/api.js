import axios from 'axios';

// Set up the base URL pointing to the local express backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Sends prompt and optional code to the backend to generate the presentation.
 * @param {string} prompt - Slide deck generation prompt
 * @param {string} code - Code block to highlight or analyze
 * @returns {Promise<Object>} - Server response containing download links & content
 */
export const generatePresentation = async (prompt, code) => {
  try {
    const response = await API.post('/generate', { prompt, code });
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error.response?.data || new Error('Failed to generate presentation. Server might be offline.');
  }
};

export default API;
