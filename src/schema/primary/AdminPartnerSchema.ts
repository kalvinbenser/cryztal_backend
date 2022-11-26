import { object, string, array, bool } from 'yup';
import * as PATTERN from '../../constants/regExp';
const updatePartner = {
    body: object({
        store_name: string().required('store_name is required'),
        type_of_store: array().of(string()).required('type_of_store is required'),
        shop_description: string().required('shop_description is required'),
        ABN_number: string().matches(PATTERN.ABNRegExp, 'ABN number is not valid').required('ABN_number is required'),
        GST_number: string().notRequired(),
        address: string().required('address is required'),
        state: string().required('state is required'),
        country: string().required('country is required'),
        suburb: string().required('suburb is required'),
        zipcode: string()
            .test('Len', 'Zip code Must be 4 digits', (val) => val?.length === 4)
            .required('zipcode is required'),
        shop_logo: string().required(),
        shop_images: array().of(string()).required(),
        contact_person_name: string().required(),
        store_email: string().matches(PATTERN.emailRegExp, 'Email is not valid').notRequired(),
        primary_contact: string().matches(PATTERN.phoneRegExp, 'Phone number is not valid').notRequired(),
        secondary_contact: string().notRequired(),
        status: string().required('status is required'),
        discount: string().optional(),
    }),
};
const params = {
    params: object({
        id: string().required('Partner Id is required'),
    }),
};

export const createAdminPartner = object({
    body: object({
        store_name: string().required('store_name is required'),
        type_of_store: array().of(string()).required('type_of_store is required'),
        shop_description: string().required('shop_description is required'),
        ABN_number: string().matches(PATTERN.ABNRegExp, 'ABN number is not valid').required('ABN_number is required'),
        GST_number: string().notRequired(),
        state: string().required('state is required'),
        country: string().required('country is required'),
        suburb: string().required('suburb is required'),
        zipcode: string()
            .test('Len', 'Zip code Must be 4 digits', (val) => val?.length === 4)
            .required('zipcode is required'),
        shop_logo: string().notRequired(),
        shop_images: string().notRequired(),
        contact_person_name: string().required(),
        store_email: string().matches(PATTERN.emailRegExp, 'Email is not valid').notRequired(),
        primary_contact: string().matches(PATTERN.phoneRegExp, 'Phone number is not valid').notRequired(),
        secondary_contact: string().notRequired(),
        status: string().notRequired(),
        discount: string().notRequired(),
    }),
});

export const updatePartnerSchema = object({
    ...updatePartner,
    ...params,
});
export const getDashboardPartnerList = object({
    body: object({
        isSearch: bool().required('isSearch is required'),
        keyword: string().when('isSearch', {
            is: true,
            then: string().required('keyword is required'),
            otherwise: string(),
        }),
    }),
});
export const adminLogin = object({
    body: object({
        user_name: string().required('user_name is required'),
        password: string().required('password is requires'),
    }),
});
