import { AppDataSource } from '../../data-source';
import { TermsAndCondition } from '../../entity/master/TermsAndCondition';
import * as TYPES from '../../types/master/TermsAndConditionMasterTypes';
import log from '../../logger/logger';
import * as moment from 'moment';
const CurrentDate = moment().format();
/**
 *
 */
export class TermsAndConditionService {
    private termsAndConditionRepository = AppDataSource.getRepository(TermsAndCondition);
    /**
     *
     * @param {TYPES.termsAndCondition} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async create(req: TYPES.termsAndCondition) {
        let termsAndCondition = new TermsAndCondition();
        termsAndCondition = req;
        try {
            return this.termsAndConditionRepository.save(termsAndCondition);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {number} user_type -- Unique category_id for th table categoryMaster
     * @param {string} terms_and_condition_id -- Unique category_id for th table categoryMaster
     * @returns {any} -- DB response SQL Response
     */
    async createUpdateStatus(terms_and_condition_id: string, user_type: number): Promise<any> {
        try {
            return this.termsAndConditionRepository
                .createQueryBuilder()
                .update(TermsAndCondition)
                .set({ status: false })
                .where('user_type=:user_type', { user_type: user_type })
                .andWhere('terms_and_condition_id != :terms_and_condition_id', {
                    terms_and_condition_id: terms_and_condition_id,
                })
                .execute();
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.termsAndCondition} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async get(req: any) {
        try {
            return this.termsAndConditionRepository.findOneBy({
                terms_and_condition_id: req,
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
    async getAll(): Promise<any> {
        try {
            return this.termsAndConditionRepository.find({});
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    // /**
    //  *
    //  * @returns {any} -- DB response SQL Response
    //  */
    // async getAllActiveOne() {
    //     try {
    //         return this.termsAndConditionRepository.find({
    //             status: true,
    //         });
    //     } catch (error) {
    //         log.error(error);
    //         return error;
    //     }
    // }
    /**
     *
     * @param {TYPES.termsAndCondition} req -- From Request body object
     * @param {string} terms_and_condition_id -- Unique terms_and_condition_id for th table termsAndCondition
     * @returns {any} -- DB response SQL Response
     */
    async update(req: TYPES.termsAndCondition, terms_and_condition_id: string): Promise<any> {
        try {
            return this.termsAndConditionRepository.update(
                { terms_and_condition_id: terms_and_condition_id },
                {
                    terms_and_condition: req.terms_and_condition,
                    user_type: req.user_type,
                    status: req.status,
                    updated_by: req.updated_by,
                    updated_on: CurrentDate,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {number} user_type -- Unique category_id for th table categoryMaster
     * @param {number} terms_and_condition_id -- Unique category_id for th table categoryMaster
     * @returns {any} -- DB response SQL Response
     */
    async updateStatus(terms_and_condition_id: string, user_type: number): Promise<any> {
        try {
            return this.termsAndConditionRepository
                .createQueryBuilder()
                .update(TermsAndCondition)
                .set({ status: false })
                .where('user_type=:user_type', { user_type: user_type })
                .andWhere('terms_and_condition_id != :terms_and_condition_id', {
                    terms_and_condition_id: terms_and_condition_id,
                })
                .execute();
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.termsAndCondition} reqParams -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async delete(reqParams: any) {
        try {
            const termsAndCondition = await this.termsAndConditionRepository.findOneBy({
                terms_and_condition_id: reqParams,
            });
            return this.termsAndConditionRepository.remove(termsAndCondition);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
}
