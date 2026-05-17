import api from './api';

const BASE_URL = '/projects';

export const createProject = async (projectData) => {
    // If projectData is FormData, let the browser set the Content-Type automatically.
    // However, our api instance has default application/json. 
    // Axios usually handles FormData correctly if we don't force Content-Type.
    // But since we set default Content-Type in api.js, we might need to override it for FormData.

    const config = {};
    if (projectData instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
    }

    const response = await api.post(BASE_URL, projectData, config);
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
};

export const getMyProjects = async () => {
    const response = await api.get(`${BASE_URL}/my-projects`);
    return response.data;
};

export const getMarketplace = async () => {
    const response = await api.get(`${BASE_URL}/marketplace`);
    return response.data;
};
