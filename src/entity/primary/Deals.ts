import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Partner } from './Partner';
import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_pm_partner_deals' })
/**
 * ! Deals Entity/Model
 *  ? To define the table structure with ORM Specifications
 */
export class Deals {
    // @PrimaryGeneratedColumn('uuid')
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', nullable: false })
    qr_id: string;

    @ManyToOne(() => Partner)
    @JoinColumn()
    partner_id: Partner;

    @Column({ type: 'varchar', nullable: false })
    category: string;

    @Column({ type: 'varchar', nullable: false })
    sub_category: string;

    @Column({ type: 'varchar', nullable: false })
    deal_name: string;

    @Column({ type: 'varchar', nullable: false })
    offer: string;

    @Column({ type: 'varchar', nullable: false })
    discount_description: string;

    @Column({ type: 'varchar', nullable: false })
    from_date: string;

    @Column({ type: 'varchar', nullable: false })
    to_date: string;

    @Column({ type: 'varchar', nullable: true })
    image: string;

    @Column({ type: 'varchar', nullable: true })
    reference_code: string;

    @Column({ type: 'int', nullable: false, default: 0 })
    status: number;

    @Column({ type: 'varchar', default: 0 })
    delete_status: number;

    @Column({ type: 'varchar', nullable: true })
    created_by?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_by?: Date;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: string;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
