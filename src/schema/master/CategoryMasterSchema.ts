import { object, string, boolean, bool } from 'yup';
// const phoneRegExp =
export const createCategorySchema = object({
    body: object({
        category_master: string().required('category_master is required'),
        status: boolean().required('status is required'),
    }),
});

const updatePayload = {
    body: object({
        category_master: string().required('category_master is required'),
        status: boolean().required('status is required'),
    }),
};
export const getAllSchema = object({
    body: object({
        isSearch: boolean().required('isSearch is required'),
        keyword: string().when('isSearch', {
            is: true,
            then: string().required('keyword is required'),
            otherwise: string(),
        }),
        isFilter: boolean().required('isFilter is required'),
        filter: bool().when('isFilter', {
            is: true,
            then: bool().required('filter is required'),
            otherwise: bool(),
        }),
    }),
});
const params = {
    params: object({
        id: string().required('category Id is required'),
    }),
};
export const updateCategorySchema = object({
    ...updatePayload,
    ...params,
});
