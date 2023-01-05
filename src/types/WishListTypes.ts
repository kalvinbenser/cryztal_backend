import { Deals } from './PartnerTypes';
import { Partner } from './PartnerTypes';

export type WishList = {
    wish_list_id?: number;
    id: Deals;
    partner_id: Partner;
    created_by?: string;
    updated_by?: string;
    created_on?: string;
    updated_on?: Date;
};
