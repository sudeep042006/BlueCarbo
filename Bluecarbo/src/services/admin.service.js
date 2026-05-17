import api from './api';

export const getPendingProjects = async () => {
    const response = await api.get('/projects/pending');
    return response.data;
};

export const verifyProject = async (id, status) => {
    const response = await api.patch(`/projects/${id}/verify`, { status });
    return response.data;
};

export const analyzeProject = async (id) => {
    const response = await api.post(`/projects/${id}/analyze`, {});
    return response.data;
};

export const getUsers = async (role) => {
    const response = await api.get(`/users/${role}`);
    return response.data;
};

export const getFinanceStats = async () => {
    const response = await api.get('/admin/finance');
    return response.data;
};
