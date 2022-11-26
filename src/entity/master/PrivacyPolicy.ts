import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_m_privacy_and_policy' })
/**
 * ! PrivacyPolicy Entity Creation
 * ? To define the table structure with ORM Specifications
 */
export class PrivacyPolicy {
    @PrimaryGeneratedColumn()
    privacy_and_policy_id: string;

    @Column({ type: 'text', nullable: false })
    privacy_and_policy: string;

    @Column({ nullable: false })
    type: number;

    @Column({ nullable: false })
    status: boolean;

    @Column({ nullable: true })
    created_by?: number;

    @Column({ nullable: true })
    updated_by?: number;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
