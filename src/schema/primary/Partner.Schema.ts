import { object, string, bool, number, boolean } from 'yup';
import * as PATTERN from '../../constants/regExp';

export const createPartnerSchema1 = object({
    body: object({
        name: string().required('name is required'),
        email: string().matches(PATTERN.emailRegExp, 'Email is not valid').required('email is required'),
        // phone_number: string()
        //     .matches(PATTERN.phoneRegExp, 'Phone number is not valid')
        //     .required('phone_number is required'),
        phone_number: string().required('phone_number is required'),
        password: string().matches(PATTERN.PASSWORD, 'password too weak').required('password is required'),
        profile_image: string().optional(),
        location: string().required('location is required'),
    }),
});
export const updateUserProfileSchema = object({
    body: object({
        name: string().notRequired(),
        email: string().matches(PATTERN.emailRegExp, 'Email is not valid').notRequired(),
        phone_number: string().matches(PATTERN.phoneRegExp, 'Phone number is not valid').notRequired(),
        password: string().notRequired(),
        // profile_image: string().notRequired(),
        location: string().notRequired(),
    }),
});
export const updatePartnerToUserSchema = object({
    body: object({
        name: string().notRequired(),
        email: string().matches(PATTERN.emailRegExp, 'Email is not valid').notRequired(),
        phone_number: string().matches(PATTERN.phoneRegExp, 'Phone number is not valid').notRequired(),
        password: string().matches(PATTERN.PASSWORD, 'password too weak').notRequired(),
        // profile_image: string().notRequired(),
        location: string().notRequired(),
    }),
});
export const createPartnerSchema = object({
    body: object({
        store_name: string().required('store_name is required'),
        type_of_store: string().required('type_of_store is required'),
        shop_description: string().required('shop_description  is required'),
        ABN_number: string().matches(PATTERN.ABNRegExp, 'ABN number is not valid').notRequired(),
        GST_number: string().notRequired(),
        address: string().required('address is required'),
        state: string().required('state is required'),
        country: string().required('country is required'),
        suburb: string().required('suburb is required'),
        latitude: string().required('suburb is required'),
        longitude: string().required('suburb is required'),
        store_email: string().matches(PATTERN.emailRegExp, 'Email is not valid').notRequired(),
        // primary_contact: string().matches(PATTERN.phoneRegExp, 'Phone number is not valid').notRequired(),
        primary_contact: string().notRequired(),
        zipcode: string()
            // .test('Len', 'Zip code Must be 4 digits', (val) => val?.length === 4)
            .required('zipcode is required'),
        // shop_logo: string().required('shop_logo is required'),
        // shop_images: array().of(string()).required('shop_images is required'),
        discount: string().notRequired(),
    }),
});
const uploadPayload = {
    body: object({
        store_name: string().notRequired(),
        store_email: string().matches(PATTERN.emailRegExp, 'Email is not valid').notRequired(),
        address: string().notRequired(),
        primary_contact: string().matches(PATTERN.phoneRegExp, 'Phone number is not valid').notRequired(),
    }),
};
const params = {
    params: object({
        id: string().required('Partner Id is required'),
    }),
};

const paramsId = {
    params: object({
        id: string().required(' partner id is required'),
    }),
};
export const updatePartnerSchema = object({
    body: object({
        store_status: number().required('store_status is Required'),
    }),
});
export const getAllPartnerList = object({
    body: object({
        isSearch: bool().required('isSearch is required'),
        keyword: string().when('isSearch', {
            is: true,
            then: string().required('keyword is required'),
            otherwise: string(),
        }),
        isFilter: boolean().required('isFilter is required'),
        filter: number().when('isFilter', {
            is: true,
            then: number().required('filter is required'),
            otherwise: number(),
        }),
    }),
});

export const checkPartnerSchema = object({
    body: object({
        fir_uuid: string().required('fir_uuid is Required'),
    }),
});

export const loginPartnerSchema = object({
    body: object({
        store_email: string().required('store_email is Required'),
        password: string().required('password is required'),
    }),
});
const ChangePassword = {
    body: object({
        previous_password: string().required('previous_password is Required'),
        change_Password: string()
            .matches(PATTERN.PASSWORD, 'password too weak')
            .required('change_Password is Required'),
        confirm_password: string().required('confirm_password'),
    }),
};
const ForgerPassword = {
    body: object({
        email: string().required('email is required'),
    }),
};

export const partnerChangePassword = object({
    ...ChangePassword,
    ...params,
});
export const partnerForgetPassword = object({
    ...ForgerPassword,
});

export const UpdatePartner = object({
    ...uploadPayload,
    ...paramsId,
});
