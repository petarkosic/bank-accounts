import api from './../api/bankApi';

export async function fetchClients() {
    const { data } = await api.get('/clients');
    return data.clients;
};

export async function fetchClient(id) {
    const { data } = await api.get(`/clients/${id}`);
    return data.client;
};

export async function changeAddress(clientData) {
    const { data } = await api.put(`/clients/change-address/${clientData.client_id}`, clientData);
    return data;
};

export async function switchAccount(clientData) {
    const { data } = await api.put(`/clients/switch-account/${clientData.client_id}`, clientData);
    return data;
};