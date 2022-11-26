import { object, string, number, array, bool } from 'yup';
const payload = {
    body: object({
        partner_id: number().required('partner_id is required'),
        category: string().required('category is required'),
        sub_category: string().required('sub_category  is required'),
        deal_name: string().required('deal_name is required'),
        discount_description: string().required('discount_description is required'),
        offer: string().required('offer is required'),
        from_date: string().required('from_date is required'),
        to_date: string().required('to_date is required'),
        image: string().notRequired(),
        reference_code: string().notRequired(),
    }),
};

const uploadPayload = {
    body: object({
        category: string().required('category is required'),
        sub_category: string().required('sub_category  is required'),
        deal_name: string().required('deal_name is required'),
        offer: string().required('offer is required'),
        discount_description: string().required('discount_description is required'),
        from_date: string().required('from_date is required'),
        to_date: string().required('to_date is required'),
        image: string().required('image is required'),
        reference_code: string().notRequired(),
    }),
};
const uploadAdminPayload = {
    body: object({
        category: string().notRequired(),
        sub_category: string().notRequired(),
        deal_name: string().notRequired(),
        offer: string().notRequired(),
        discount_description: string().notRequired(),
        from_date: string().notRequired(),
        to_date: string().notRequired(),
        image: array().of(string()).notRequired(),
        reference_code: string().notRequired(),
    }),
};
export const createDealsSchema = object({
    ...payload,
});

export const getAllDealsForAdminIDSchema = object({
    body: object({
        partner_id: string().required('partner_id is required'),
        percentage_keyword: bool().notRequired(),
        oldest_keyword: bool().notRequired(),
        newest_keyword: bool().notRequired(),
    }),
});

export const getAllDealsSchema = object({
    body: object({
        isSearch: bool().required('isSearch is required'),
        keyword: string().when('isSearch', {
            is: true,
            then: string().required('keyword is required'),
            otherwise: string(),
        }),
        isFilter: bool().required('isFilter is required'),
        filter: number().when('isFilter', {
            is: true,
            then: number().required('filter is required'),
            otherwise: number(),
        }),
    }),
});
const params = {
    params: object({
        id: string().required('Deal Id is required'),
    }),
};
export const updateDealsSchema = object({
    ...params,
    ...uploadPayload,
});

const updateDealApprovalIDSchema = {
    body: object({
        status: number().required('status is required'),
    }),
};
export const updateDealApprovalSchema = object({
    ...params,
    ...updateDealApprovalIDSchema,
});
export const updateDealsAdminSchema = object({
    ...params,
    ...uploadAdminPayload,
});
