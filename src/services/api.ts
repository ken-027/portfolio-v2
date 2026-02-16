import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchExperiences = async () => {
    try {
        const response = await api.get('/experiences');
        return response.data;
    } catch (error) {
        console.error('Error fetching experiences:', error);
        throw error;
    }
};

export const fetchSkills = async () => {
    try {
        const response = await api.get('/skills');
        return response.data;
    } catch (error) {
        console.error('Error fetching skills:', error);
        throw error;
    }
};

export const fetchProjects = async () => {
    try {
        const response = await api.get('/projects');
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const fetchCertificates = async () => {
    try {
        const response = await api.get('/certificates');
        return response.data;
    } catch (error) {
        console.error('Error fetching certificates:', error);
        throw error;
    }
};

export default api;
