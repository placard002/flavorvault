const BASE = '/api'

function getToken() {
  return localStorage.getItem('folio_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers
  })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Invalid server response')
  }

  if (!response.ok || (data && data.success === false)) {
    const message = data?.error?.message || `Request failed with status ${response.status}`
    const err = new Error(message)
    err.code = data?.error?.code || String(response.status)
    err.status = response.status
    throw err
  }

  return data
}

export const api = {
  get(path, params) {
    const url = params
      ? `${path}?${new URLSearchParams(
          Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
        )}`
      : path
    return request(url, { method: 'GET' })
  },

  post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  },

  delete(path) {
    return request(path, { method: 'DELETE' })
  }
}

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

// Recipes
export const recipesAPI = {
  list: (params) => api.get('/recipes', params),
  get: (id) => api.get(`/recipes/${id}`),
}

// Favorites
export const favoritesAPI = {
  list: () => api.get('/favorites'),
  add: (id) => api.post(`/favorites/${id}`),
  remove: (id) => api.delete(`/favorites/${id}`)
}

// Categories / Cuisines
export const metaAPI = {
  categories: () => api.get('/categories'),
  cuisines: () => api.get('/cuisines')
}

export default api
