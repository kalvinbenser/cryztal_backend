import { AppDataSource } from '../../data-source';
import { PRIMARY } from '../../entity';
import { Admin } from '../../types/AdminTypes';
import log from '../../logger/logger';
/**
 *
 */
export class AdminService {
    private adminRepository = AppDataSource.getRepository(PRIMARY.ADMIN.Admin);
    private dashboardDealRepository = AppDataSource.getRepository(PRIMARY.DEALS.Deals);
    private dashboardPartnersRepository = AppDataSource.getRepository(PRIMARY.PARTNER.Partner);
    private customersRepository = AppDataSource.getRepository(PRIMARY.USER.users);

    /**
     *
     * @param {Admin} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async get(req: string): Promise<any> {
        try {
            // *! Do not remove static password added using this API/Service
            // *TODO Incase of changing password use this password again
            // const salt = await bcrypt.genSalt(10);
            // const password = 'c4y2t@l@123!';
            // const hashPassword = await bcrypt.hash(password, salt);
            // const sampleObj = {
            //     user_name: 'cryztalAdmin@admin.com',
            //     password: hashPassword,
            // };
            // let adminData = new PRIMARY.ADMIN.Admin();
            // adminData = sampleObj;
            // this.adminRepository.save(adminData);

            return this.adminRepository.findOne({
                where: {
                    user_name: req,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @returns {any} -- DB response SQL Response
     */
    async getDashboardCount(): Promise<any> {
        try {
            return this.adminRepository.query('call cryztal_test_v1.sp_adminDashboardCount()');
        } catch (error) {
            log.error(error);
            return error;
        }
    }
}
