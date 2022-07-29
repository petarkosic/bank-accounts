import api from './../api/bankApi';

export async function fetchClients() {
    const { data } = await api.get('/clients');
    return data.clients;
};

export async function fetchClient(id) {
    const { data } = await api.get(`/clients/${id}`);
    return data.client;
};