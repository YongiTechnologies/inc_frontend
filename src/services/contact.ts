import api from './api';

/**
 * Submit contact form (public endpoint)
 * POST /api/contact
 */
export const submitContact = async (payload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}) => {
    const { data: envelope } = await api.post('/api/contact', payload);
    return envelope;
};
