import api from './api';

const BASE_URL = '/requests';

export const sendRequest = async (requestData) => {
    const response = await api.post(BASE_URL, requestData);
    return response.data;
};

export const getSentRequests = async () => {
    const response = await api.get(`${BASE_URL}/sent`);
    return response.data;
};

export const getIncomingRequests = async () => {
    const response = await api.get(`${BASE_URL}/incoming`);
    return response.data;
};

export const updateRequestStatus = async (id, status) => {
    const response = await api.patch(`${BASE_URL}/${id}/status`, { status });
    return response.data;
};
