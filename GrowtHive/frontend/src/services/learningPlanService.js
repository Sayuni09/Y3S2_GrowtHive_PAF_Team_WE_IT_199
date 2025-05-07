import axios from 'axios';
import API_BASE_URL from './baseUrl';
import { getAuthHeader } from '../utils/authUtils';

const API_URL = `${API_BASE_URL}/api/learning-plans`;

export const getLearningPlans = async (userId) => {
    try {
        console.log('Fetching learning plans for user:', userId);
        const headers = getAuthHeader();
        console.log('Using headers:', headers);
        
        const response = await axios.get(`${API_URL}/user/${userId}`, {
            headers: headers
        });
        console.log('Received response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching learning plans:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
};

export const createLearningPlan = async (learningPlan) => {
    try {
        console.log('Creating learning plan:', learningPlan);
        const headers = getAuthHeader();
        const response = await axios.post(API_URL, learningPlan, {
            headers: headers
        });
        console.log('Created learning plan:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating learning plan:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
};

export const updateLearningPlan = async (id, learningPlan) => {
    try {
        console.log('Updating learning plan:', id, learningPlan);
        const headers = getAuthHeader();
        const response = await axios.put(`${API_URL}/${id}`, learningPlan, {
            headers: headers
        });
        console.log('Updated learning plan:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating learning plan:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
};

export const deleteLearningPlan = async (id) => {
    try {
        console.log('Deleting learning plan:', id);
        const headers = getAuthHeader();
        await axios.delete(`${API_URL}/${id}`, {
            headers: headers
        });
        console.log('Successfully deleted learning plan:', id);
        return true;
    } catch (error) {
        console.error('Error deleting learning plan:', error);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}; 