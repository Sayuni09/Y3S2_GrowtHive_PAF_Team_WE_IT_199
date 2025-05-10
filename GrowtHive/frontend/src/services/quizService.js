import axios from 'axios';
import API_BASE_URL from './baseUrl';

const API_URL = `${API_BASE_URL}/api/quizzes`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    return {
        'Content-Type': 'application/json'
    };
};

export const getAllQuizzes = async () => {
    try {
        const headers = getAuthHeader();
        const response = await axios.get(API_URL, { 
            headers,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
};

export const getQuizzesByCreator = async (creatorId) => {
    try {
        const headers = getAuthHeader();
        const response = await axios.get(`${API_URL}/user/${creatorId}`, { 
            headers,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching creator quizzes:', error);
        throw error;
    }
};

export const getSharedQuizzes = async () => {
    try {
        const headers = getAuthHeader();
        const response = await axios.get(`${API_URL}/shared`, { 
            headers,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching shared quizzes:', error);
        throw error;
    }
};

export const createQuiz = async (quiz) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        const headers = getAuthHeader();
        console.log('Auth headers:', headers);
        console.log('Creating quiz with data:', quiz);
        
        const response = await axios.post(API_URL, quiz, { 
            headers,
            withCredentials: true
        });
        
        console.log('Quiz created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating quiz:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
        }
        throw error;
    }
};

export const updateQuiz = async (id, quiz) => {
    try {
        const headers = getAuthHeader();
        const response = await axios.put(`${API_URL}/${id}`, quiz, { 
            headers,
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error updating quiz:', error);
        throw error;
    }
};

export const deleteQuiz = async (id) => {
    try {
        const headers = getAuthHeader();
        await axios.delete(`${API_URL}/${id}`, { 
            headers,
            withCredentials: true
        });
        return true;
    } catch (error) {
        console.error('Error deleting quiz:', error);
        throw error;
    }
}; 