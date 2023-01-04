import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_pm_partner' })
/**
 * ! Partner Entity Creation
 * ? To define the table structure with ORM Specifications
 */
export class Partner {
    // @PrimaryGeneratedColumn('uuid')
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', nullable: true, unique: true })
    fir_uuid?: string;

    @Column({ type: 'varchar', nullable: true })
    name?: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    email?: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    phone_number?: string;

    @Column({ type: 'varchar', nullable: true })
    location?: string;

    @Column({ type: 'varchar', nullable: true })
    store_name?: string;

    @Column({ type: 'text', nullable: true })
    type_of_store?: string;

    @Column({ type: 'varchar', nullable: true })
    shop_description?: string;

    @Column({ type: 'varchar', nullable: true })
    ABN_number?: string;

    @Column({ type: 'varchar', nullable: true })
    GST_number?: string;

    @Column({ type: 'varchar', nullable: true })
    address?: string;

    @Column({ type: 'varchar', nullable: true })
    state?: string;

    @Column({ type: 'varchar', nullable: true })
    country?: string;

    @Column({ type: 'varchar', nullable: true })
    suburb?: string;

    @Column({ type: 'varchar', nullable: true })
    zipcode?: string;

    @Column({ type: 'varchar', nullable: true })
    profile_image: string;

    @Column({ type: 'varchar', nullable: true })
    shop_logo: string;

    @Column({ type: 'simple-array', nullable: true })
    shop_images: string[];

    @Column({ type: 'varchar', nullable: true, unique: true })
    store_email: string;

    @Column({ type: 'varchar', nullable: true })
    secondary_contact?: string;

    @Column({ type: 'varchar', nullable: true })
    primary_contact: string;

    @Column({ type: 'varchar', nullable: true })
    contact_person_name: string;

    @Column({ type: 'varchar', nullable: true })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    password_ori: string;

    @Column({ type: 'varchar', nullable: true })
    reference_code?: string;

    @Column({ type: 'varchar', nullable: true })
    discount?: string;

    @Column({ type: 'int', default: 0 })
    admin_create: number;

    @Column({ type: 'double', nullable: true })
    latitude?: number;

    @Column({ type: 'double', nullable: true })
    longitude?: number;

    @Column({ type: 'varchar', nullable: true })
    user_state: string;

    @Column({ type: 'varchar', nullable: true })
    user_zipcode: string;

    @Column({ type: 'varchar', nullable: true })
    user_suburb?: string;

    @Column({ type: 'int', nullable: true })
    status: number;

    @Column({ type: 'int', default: 0 })
    isShop: number;

    //1-UnBlock,0-block,
    @Column({ nullable: true, default: true })
    block: boolean;

    @Column({ nullable: true, default: true })
    store_status: number;

    @Column({ type: 'varchar', default: 0 })
    delete_status: number;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
