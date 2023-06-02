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

export async function depositOrWithdraw(clientData) {
    const { data } = await api.put(`/clients/deposit/${clientData.client_id}`, clientData);
    return data;
};

export async function searchByAccountNumber(accountNumber) {
    const { data } = await api.get(`/clients/search?q=${Number(accountNumber)}`);
    return data;
};

export async function sendMoney(moneyData) {
    const { data } = await api.post(`/clients/send-money`, moneyData);
    return data;
};

export async function createClient(clientData) {
    const { data } = await api.post(`/clients/create-client`, clientData);
    return data;
};

export async function getAccountNumber() {
    const { data } = await api.get(`/clients/get-account-number`);
    return data;
};

export async function showPremiumCustomersByCountry(country_name) {
    const encodedCountryName = encodeURI(country_name);
    const { data } = await api.get(`/clients/premium?country=${encodedCountryName}`);
    return data;
}
