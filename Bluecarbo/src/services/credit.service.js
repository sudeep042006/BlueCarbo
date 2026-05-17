import api from './api';

export const getMyCredits = async () => {
    const response = await api.get('/credits/my-credits');
    return response.data;
};
