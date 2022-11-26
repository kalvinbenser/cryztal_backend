import { object, string, bool } from 'yup';
import * as PATTERN from '../../constants/regExp';
const payload = {
    body: object({
        fir_uuid: string().required('fir_uuid is required'),
        first_name: string().required('first_name is required'),
        last_name: string().required('last_name is required'),
        email: string().matches(PATTERN.emailRegExp, 'Email is not valid').required('store_email is required'),
        contact_number: string()
            .matches(PATTERN.phoneRegExp, 'Phone number is not valid')
            .required('contact_number is required'),
        password: string().required('password is required'),
        image: string().optional(),
        location: string().required('location is required'),
    }),
};

export const createUserSchema = object({
    ...payload,
});
export const getUserListSchema = object({
    body: object({
        isSearch: bool().required('isSearch is required'),
        keyword: string().when('isSearch', {
            is: true,
            then: string().required('keyword is required'),
            otherwise: string(),
        }),
    }),
});
const update = {
    body: object({
        first_name: string().required('first_name is required'),
        email: string().matches(PATTERN.emailRegExp, 'Email is not valid').required('store_email is required'),
        contact_number: string()
            .matches(PATTERN.phoneRegExp, 'Phone number is not valid')
            .required('contact_number is required'),
        image: string().optional(),
    }),
};
const params = {
    params: object({
        id: string().required('id is required'),
    }),
};
export const updateUser = object({
    ...update,
    ...params,
});

export const getAllDealAndProductList = object({
    body: object({
        isSearch: bool().required('isSearch is required'),
        keyword: string().when('isSearch', {
            is: true,
            then: string().required('keyword is required'),
            otherwise: string(),
        }),
        isFilter: bool().required('isFilter is required'),
        filter_keyword: string().when('isFilter', {
            is: true,
            then: string().required('filter keyword is required'),
            otherwise: string(),
        }),
    }),
});

export const getAdvanceFilterSchema = object({
    body: object({
        latitude: string().required('latitude is Required'),
        longitude: string().required('longitude is required'),
    }),
});

export const loginUserSchema = object({
    body: object({
        email: string().required('email is Required'),
        password: string().required('password is required'),
    }),
});

const ChangePassword = {
    body: object({
        previous_password: string().required('previous_password is Required'),
        change_Password: string().required('change_Password is Required'),
        confirm_password: string().required('confirm_password'),
    }),
};
const ForgerPassword = {
    body: object({
        change_Password: string().required('change_Password is Required'),
        confirm_password: string().required('confirm_password'),
    }),
};

export const userChangePassword = object({
    ...ChangePassword,
    ...params,
});
export const userForgetPassword = object({
    ...ForgerPassword,
    ...params,
});
export const checkExistingUserSchema = object({
    body: object({
        fir_uuid: string().required('fir_uuid is Required'),
    }),
});
