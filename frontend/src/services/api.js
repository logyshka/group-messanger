// API service for interacting with the backend

const API_URL = 'http://localhost:8000';

// Helper function for making authenticated requests
const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    const response = await fetch(`${API_URL}${url}`, options);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Something went wrong');
    }

    return response.json();
};

// Authentication API
export const authAPI = {
    // Register a new user
    register: async (username, password) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'Registration failed');
        }

        return response.json();
    },

    // Login and get access token
    login: async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        return data;
    },

    // Logout (client-side only)
    logout: () => {
        localStorage.removeItem('token');
    }
};

// Chats API
export const chatsAPI = {
    // Get all chats
    getChats: () => {
        return authFetch('/chats');
    },

    // Get a specific chat
    getChat: (chatId) => {
        return authFetch(`/chats/${chatId}`);
    },

    // Create a new chat
    createChat: (name) => {
        return authFetch('/chats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name})
        });
    }
};

// Messages API
export const messagesAPI = {
    // Get all messages for a chat
    getMessages: (chatId, offset = 0, limit = 20) => {
        return authFetch(`/chats/${chatId}/messages?offset=${offset}&limit=${limit}`);
    },

    getNewMessages: (chatId, lastMessageId) => {
        return authFetch(`/chats/${chatId}/newMessages?last_message_id=${lastMessageId}`);
    },

    // Create a new message
    createMessage: (chatId, content) => {
        return authFetch(`/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content})
        });
    },

    // Update a message
    updateMessage: (chatId, messageId, content) => {
        return authFetch(`/chats/${chatId}/messages/${messageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content})
        });
    },

    // Delete a message
    deleteMessage: (chatId, messageId) => {
        return authFetch(`/chats/${chatId}/messages/${messageId}`, {
            method: 'DELETE'
        });
    }
};
