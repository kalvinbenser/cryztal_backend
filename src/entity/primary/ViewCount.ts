import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Partner } from './Partner';
import { Deals } from './Deals';
import { users } from './User';

import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_m_view_count' })
/**
 * ! Deals Entity/Model
 *  ? To define the table structure with ORM Specifications
 */
export class viewCount {
    // @PrimaryGeneratedColumn('uuid')
    @PrimaryGeneratedColumn()
    view_count_id?: number;

    @ManyToOne(() => Partner)
    @JoinColumn()
    partner_id: Partner;

    @ManyToOne(() => Deals)
    @JoinColumn()
    deal_id: Deals;

    @ManyToOne(() => users)
    @JoinColumn()
    user_id: users;

    @Column({ type: 'int', nullable: false, default: 0 })
    status: number;

    @Column({ type: 'varchar', nullable: true })
    created_by?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_by?: Date;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: string;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
