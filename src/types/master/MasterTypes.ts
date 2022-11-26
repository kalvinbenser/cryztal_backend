import { categoryMaster } from './CategoryMasterTypes';
export type SubCategory = {
    sub_category_id?: string;
    category_id: categoryMaster;
    sub_category: string;
    status: boolean;
    created_by?: number;
    updated_by?: number;
    created_on?: Date;
    updated_on?: Date;
};

export type PrivacyPolicy = {
    privacy_and_policy_id?: string;
    privacy_and_policy: string;
    type: number;
    status: boolean;
    created_by?: number;
    updated_by?: number;
    created_on?: Date;
    updated_on?: Date;
};
