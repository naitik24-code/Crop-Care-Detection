import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

/**
 * Sends a leaf image file to the prediction endpoint.
 * @param {File} file - The image file to analyze.
 * @returns {Promise<Object>} - e.g. { prediction, confidence, description, solution, status }
 */
export async function predictDisease(file) {
  const formData = new FormData();
  formData.append("file", file);

  console.log("[API] Sending request to:", `${API_BASE_URL}/predict`);

  const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });

  console.log("[API] Response received:", response.data);
  return response.data;
}

/**
 * Health check to verify the backend is online.
 * @returns {Promise<Object>}
 */
export async function healthCheck() {
  const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
  return response.data;
}
