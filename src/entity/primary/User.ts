import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';
const CurrentDate = moment(Date.now()).format('DD/MM/YYYY');

@Entity({ name: 'c_tbl_u_user' })
/**
 * ! User Entity/Model
 *  ? To define the table structure with ORM Specifications
 */
export class users {
    @PrimaryGeneratedColumn()
    user_id?: string;

    @Column({ type: 'varchar', nullable: true, unique: true })
    fir_uuid?: string;

    @Column({ type: 'varchar', nullable: false })
    first_name: string;

    @Column({ type: 'varchar', nullable: false })
    last_name: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    contact_number: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: false })
    location: string;

    @Column({ type: 'varchar', nullable: true })
    image: string;

    @Column({ type: 'varchar', default: '0' })
    status: string;
    //1-UnBlock,2-block,
    @Column({ nullable: true, default: true })
    block: boolean;

    @Column({ type: 'varchar', nullable: true })
    created_by?: string;

    @Column({ type: 'varchar', nullable: true })
    updated_by?: string;

    @Column({ type: 'varchar', nullable: false, default: CurrentDate.toString() })
    created_on?: Date;

    @Column({ type: 'varchar', nullable: true })
    updated_on?: Date;
}
