// ─── Client API Fallback (Static Demo Mode) ──────────────────────────────────
// Network requests are disabled for static demo deployment.

export const apiClient = async (endpoint, options = {}) => {
  console.info(`[Static Demo] API call mocked for: ${endpoint}`);
  return { success: true, data: [] };
};
