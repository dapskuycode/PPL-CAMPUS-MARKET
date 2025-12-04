/**
 * Helper to add authentication headers to fetch requests
 */
export function getAuthHeaders(): HeadersInit {
  const userDataString = localStorage.getItem("user");
  
  if (!userDataString) {
    return {};
  }

  return {
    "x-user-data": userDataString,
  };
}

/**
 * Authenticated fetch helper
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
