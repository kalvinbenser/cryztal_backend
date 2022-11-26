import { object, string, bool, number } from 'yup';

export const createPrivacyPolicySchema = object({
    body: object({
        privacy_and_policy: string().required('privacy_and_policy is required'),
        type: number().required('type is required'),
        status: bool().required('status  is required'),
    }),
});
const uploadPayload = {
    body: object({
        privacy_and_policy: string().notRequired(),
        type: string().notRequired(),
        status: bool().notRequired(),
    }),
};
const params = {
    params: object({
        id: string().required('privacyPolicy Id is required'),
    }),
};
export const updatePrivacyPolicySchema = object({
    ...uploadPayload,
    ...params,
});
