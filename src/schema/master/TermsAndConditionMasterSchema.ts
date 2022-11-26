import { object, string, boolean, number } from 'yup';
// const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const createTermsAndConditionSchema = object({
    body: object({
        terms_and_condition: string().required('terms_and_condition is required'),
        user_type: number().required('user_type is required'),
        status: boolean().required('status is required'),
    }),
});
const uploadPayload = {
    body: object({
        terms_and_condition: string().required('terms_and_condition is required'),
        user_type: string().required('user_type is required'),
        status: boolean().required('status is required'),
    }),
};
const params = {
    params: object({
        id: string().required(' Id is required'),
    }),
};
export const updateTermsAndConditionSchema = object({
    ...uploadPayload,
    ...params,
});
