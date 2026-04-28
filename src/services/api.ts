import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CHATBOT_API = import.meta.env.VITE_CHATBOT_API;

const api = axios.create({
    baseURL: `${BASE_URL}/portfolio`,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiAuth = axios.create({
    baseURL: `${BASE_URL}/auth`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiAuthCached = setupCache(apiAuth, {
    ttl: 1000 * 60 * 5,
});


const apiEmail = axios.create({
    baseURL: `${BASE_URL}/email`,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiChatbot = axios.create({
    baseURL: `${CHATBOT_API}/chat`,
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
): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
    try {
        const response = await apiChatbot.post(`/${agent}`, { message }, {
            responseType: 'stream',
            adapter: 'fetch',
            withCredentials: true,
        });

        return (response.data as ReadableStream<Uint8Array>).getReader();
    } catch (error: any) {
        const status = error.response?.status;

        if (status === 429) {
            const reader = (error.response.data as ReadableStream<Uint8Array>).getReader();
            const { value } = await reader.read();
            const json = JSON.parse(new TextDecoder().decode(value));
            throw new Error(json.message);
        }

        throw new Error(
            status === 400 ? "Bad Request" : error.response?.statusText || "Something went wrong"
        );
    }
};

export const sendEmail = async (email: string, subject: string, message: string, name: string) => {
    try {
        const response = await apiEmail.post('/', { email, subject, message, name });
        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default api;
export interface PublicProfile {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    resumeLink: string;
    linkedinLink: string;
    githubLink: string;
    hackerRankLink: string;
    huggingFaceLink: string;
    leetCodeLink: string;
    npmLink: string;
    avatarLink: string;
    dockerHubLink: string;
    createdAt: string;
    updatedAt: string;
}
export const getPublicProfile = async (): Promise<PublicProfile> => {
    try {
        const response = await apiAuthCached.get('/public-profile');
        const data = response.data.data as PublicProfile;
        return data;
    } catch (error) {
        console.error('Error fetching public profile:', error);
        throw error;
    }
};
