import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryMaster } from './CategoryMaster';

import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_m_sub_category_master' })
/**
 * ! Sub category Entity Creation
 * ? To define the table structure with ORM Specifications
 */
export class SubCategoryMater {
    @PrimaryGeneratedColumn()
    sub_category_id?: string;

    @ManyToOne(() => CategoryMaster)
    @JoinColumn()
    category_id: CategoryMaster;

    @Column({ type: 'varchar', nullable: true })
    sub_category: string;

    @Column({ nullable: false })
    status: boolean;

    @Column({ type: 'int', nullable: false, default: '1' })
    created_by?: number;

    @Column({ type: 'int', nullable: true })
    updated_by?: number;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
