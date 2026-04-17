// Central API base URL — reads from .env so you only change it in one place.
// Local dev:  VITE_API_BASE_URL=https://localhost:5000
// Production: VITE_API_BASE_URL=https://your-production-api.com
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default API_BASE;
