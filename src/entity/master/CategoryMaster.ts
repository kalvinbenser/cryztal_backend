import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_m_category_master' })
/**
 * ! CategoryMaster Entity Creation
 * ? To define the table structure with ORM Specifications
 */
export class CategoryMaster {
    // @PrimaryGeneratedColumn('uuid')
    @PrimaryGeneratedColumn()
    category_id?: number;

    @Column({ type: 'varchar', nullable: false })
    category_master: string;

    @Column({ nullable: false })
    status: boolean;

    @Column({ type: 'varchar', nullable: true })
    created_by?: string;

    @Column({ type: 'varchar', nullable: true })
    updated_by?: string;

    @Column({ type: 'varchar', nullable: true, default: CurrentDate.toString() })
    created_on?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
