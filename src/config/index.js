// Configuration exports
export { getApiConfig, API_CONFIG } from './apiConfig';

// Convenience function to get all configuration
export const getConfig = () => ({
  api: getApiConfig()
});
