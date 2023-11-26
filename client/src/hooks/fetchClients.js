import api from './../api/bankApi';

export async function fetchClients({ pageParam = 1 }) {
    const { data } = await api.get(`/clients?page=${pageParam}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export async function fetchClient(id) {
    const { data } = await api.get(`/clients/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data.client;
};

export async function changeAddress(clientData) {
    const { data } = await api.put(`/clients/change-address/${clientData.client_id}`, clientData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export async function switchAccount(clientData) {
    const { data } = await api.put(`/clients/switch-account/${clientData.client_id}`, clientData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export async function depositOrWithdraw(clientData) {
    const { data } = await api.put(`/money-transfer/deposit/${clientData.client_id}`, clientData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export async function searchByAccountNumber(accountNumber) {
    const { data } = await api.get(`/clients/search?q=${encodeURIComponent(accountNumber)}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export async function sendMoney(moneyData) {
    const { data } = await api.post(`/money-transfer/send-money`, moneyData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export async function createClient(clientData) {
    const { data } = await api.post(`/clients/create-client`, clientData, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export async function getAccountNumber() {
    const { data } = await api.get(`/clients/get-account-number`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
};

export async function showPremiumCustomersByCountry(country_name) {
    const encodedCountryName = encodeURI(country_name);
    const { data } = await api.get(`/clients/premium?country=${encodedCountryName}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}

export async function customersToReachCardLimit() {
    const { data } = await api.get(`/clients/card-limit`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    return data;
}

export async function login(login_id, password) {
    const { data } = await api.post('/tellers/login', {
        login_id,
        password
    })

    if (data.message === 'Invalid Credentials') {
        throw new Error('Invalid Credentials');
    }

    localStorage.setItem('accessToken', data.accessToken);

    return data;
}

export async function createTeller(first_name, last_name, email, password) {
    const { data } = await api.post('/tellers/create', {
        first_name,
        last_name,
        email,
        password
    })
    return data;
}