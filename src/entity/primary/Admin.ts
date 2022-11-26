import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format();

@Entity({ name: 'c_tbl_pm_admin' })
/**
 * ! Admin Entity/Model
 *  ? To define the table structure with ORM Specifications
 */
export class Admin {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar', nullable: false })
    user_name: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    created_by?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_by?: Date;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
