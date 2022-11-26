export type user = {
    user_id?: string;
    fir_uuid?: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    password: string;
    image: string;
    location: string;
    status: string;
    block: boolean;
    created_by?: string;
    updated_by?: string;
    created_on?: Date;
    updated_on?: Date;
};
