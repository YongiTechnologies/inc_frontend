import api from './api';

export interface PhoneCheckResult {
    exists: boolean;
    hasPassword: boolean;
}

export const phoneCheck = async (phone: string): Promise<PhoneCheckResult> => {
    const { data: envelope } = await api.post('/api/auth/phone-check', { phone });
    return envelope.data;
};

export const phoneLogin = async (phone: string, password: string) => {
    const { data: envelope } = await api.post('/api/auth/phone-login', { phone, password });
    return envelope.data; // { accessToken, user }
};

export const phoneSignup = async (phone: string, name: string, password: string) => {
    const { data: envelope } = await api.post('/api/auth/phone-signup', { phone, name, password });
    return envelope.data; // { accessToken, user }
};

export const linkPhone = async (phone: string): Promise<{ phone: string }> => {
    const { data: envelope } = await api.patch('/api/auth/me/phone', { phone });
    return envelope.data;
};
