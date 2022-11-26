import { object, string, boolean, bool } from 'yup';

export const createSubCategorySchema = object({
    body: object({
        category_id: string().required('category_id is required'),
        sub_category: string().required('sub_category is required'),
        status: boolean().required('status is required'),
    }),
});
const uploadPayload = {
    body: object({
        category_id: string().required('category_id is required'),
        sub_category: string().required('sub_category is required'),
        status: boolean().required('status is required'),
    }),
};
const params = {
    params: object({
        id: string().required('subCategory Id is required'),
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
export const updateSubCategorySchema = object({
    ...uploadPayload,
    ...params,
});
