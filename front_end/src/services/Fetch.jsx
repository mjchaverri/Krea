const BASE_URL = 'http://localhost:3000'

function getToken() {
    return localStorage.getItem('token')
}

function buildHeaders() {
    const headers = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
}

async function handleResponse(res) {
    const json = await res.json()
    if (!res.ok) {
        const err = new Error(json.message || `Error ${res.status}`)
        err.status = res.status
        err.errors = json.data || null
        throw err
    }
    return json.data !== undefined ? json.data : json
}

async function getData(endpoint) {
    const res = await fetch(`${BASE_URL}/${endpoint}`, { headers: buildHeaders() })
    return handleResponse(res)
}

async function postData(endpoint, obj) {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(obj),
    })
    return handleResponse(res)
}

async function putData(endpoint, obj) {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(obj),
    })
    return handleResponse(res)
}

async function deleteData(endpoint) {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'DELETE',
        headers: buildHeaders(),
    })
    return handleResponse(res)
}

async function logoutClient() {
    try {
        const token = getToken()
        if (token) {
            await fetch(`${BASE_URL}/usuarios/logout`, {
                method: 'POST',
                headers: buildHeaders()
            })
        }
    } catch (error) {
        console.error("Error al notificar logout al servidor:", error)
    } finally {
        localStorage.removeItem('token')
        localStorage.removeItem('rol')
        localStorage.removeItem('idUsuario')
        localStorage.removeItem('UsuarioActivo')
        window.location.href = "/"
    }
}

export default { getData, postData, putData, deleteData, logoutClient }
