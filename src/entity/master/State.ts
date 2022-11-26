import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_m_state' })
/**
 * ! State Entity Creation
 * ? To define the table structure with ORM Specifications
 */
export class State {
    // @PrimaryGeneratedColumn('uuid')
    @PrimaryGeneratedColumn()
    state_id?: number;

    @Column({ type: 'varchar', nullable: false })
    state: string;

    @Column({ type: 'varchar', nullable: true })
    created_by?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_by?: Date;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
