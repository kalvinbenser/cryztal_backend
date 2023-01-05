import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Deals } from './Deals';
import { Partner } from './Partner';

import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_u_wish_list' })
/**
 * ! Wish List Entity/Model
 *  ? To define the table structure with ORM Specifications
 */
export class WishList {
    @PrimaryGeneratedColumn()
    wish_list_id?: number;

    @ManyToOne(() => Deals)
    @JoinColumn()
    id: Deals;

    @ManyToOne(() => Partner)
    @JoinColumn()
    partner_id: Partner;

    @Column({ type: 'varchar', nullable: true })
    created_by?: string;

    @Column({ type: 'varchar', nullable: true })
    updated_by?: string;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: string;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
