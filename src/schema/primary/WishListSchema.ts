import { object, string, number } from 'yup';
const createPayload = {
    body: object({
        id: number().required('Deal_id is required'),
        user_id: string().required('user_id is required'),
    }),
};

export const createWishListSchema = object({
    ...createPayload,
});

const getAll = {
    body: object({
        id: number().required('Deal_id is required'),
        partner_id: number().required('partner id is required'),
    }),
};
const params = {
    params: object({
        user_id: string().required('user_id is required'),
    }),
};

export const getAllWishListUserIdSchema = object({
    ...params,
    ...getAll,
});
