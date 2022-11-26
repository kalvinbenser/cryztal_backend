import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_m_teams_and_condition' })
/**
 * ! TermsAndCondition Entity Creation
 * ? To define the table structure with ORM Specifications
 */
export class TermsAndCondition {
    // @PrimaryGeneratedColumn('uuid')
    @PrimaryGeneratedColumn()
    terms_and_condition_id?: string;

    @Column({ type: 'text', nullable: false })
    terms_and_condition: string;

    @Column({ type: 'varchar', nullable: false })
    user_type: number;

    @Column({ default: true })
    status: boolean;

    @Column({ type: 'varchar', nullable: true })
    created_by?: string;

    @Column({ type: 'varchar', nullable: true })
    updated_by?: string;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
