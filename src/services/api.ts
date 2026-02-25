import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CHATBOT_API = import.meta.env.VITE_CHATBOT_API;

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

export const chatStream = async (
    message: string,
    agent: "portfolio" | "github"
): Promise<any> => {
    const response = await fetch(`${CHATBOT_API}/agents/${agent}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        credentials: "include",
    });

    if (response.status >= 400) {
        let errMessage: string =
            response.statusText || response.status === 400
                ? "Bad Request"
                : "Something went wrong";

        if (response.status === 429) {
            errMessage = (await response.json()).message;
        }
        throw new Error(errMessage);
    }

    const result = response.body?.getReader();

    return result;
};

export default api;
