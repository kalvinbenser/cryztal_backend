import { AppDataSource } from '../../data-source';
import { PrivacyPolicy as PrivacyPolicyEntity } from '../../entity/master/PrivacyPolicy';
import * as TYPES from '../../types/master/MasterTypes';
import log from '../../logger/logger';
import * as moment from 'moment';
const CurrentDate = moment().format();
/**
 *
 */
export class PrivacyPolicy {
    private PrivacyPolicyRepository = AppDataSource.getRepository(PrivacyPolicyEntity);
    /**
     *
     * @param {TYPES.PrivacyPolicy} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async create(req: TYPES.PrivacyPolicy) {
        // let data: Partner;
        const privacy = new PrivacyPolicyEntity();
        privacy.privacy_and_policy = req.privacy_and_policy;
        privacy.type = req.type;
        privacy.status = req.status;
        privacy.created_by = req.created_by;

        try {
            return this.PrivacyPolicyRepository.save(privacy);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {number} type -- Unique
     * @param {number} privacy_and_policy_id -- Unique category_id for th table categoryMaster
     * @returns {any} -- DB response SQL Response
     */
    async createUpdateStatus(privacy_and_policy_id: number, type: number): Promise<any> {
        try {
            return this.PrivacyPolicyRepository.createQueryBuilder()
                .update(PrivacyPolicyEntity)
                .set({ status: false })
                .where('type=:type', { type: type })
                .andWhere('privacy_and_policy_id != :privacy_and_policy_id', {
                    privacy_and_policy_id: privacy_and_policy_id,
                })
                .execute();
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.PrivacyPolicy} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getById(req: any) {
        // let data: Partner;
        try {
            return this.PrivacyPolicyRepository.findOneBy({
                privacy_and_policy_id: req,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param type
     * @returns {any} -- DB response SQL Response
     */
    async get(type: number) {
        // let data: Partner;
        try {
            return this.PrivacyPolicyRepository.find({
                where: {
                    type: type,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {TYPES.PrivacyPolicy} req -- From Request body object
     * @param {string} privacy_and_policy_id -- Unique terms_and_condition_id for th table PrivacyPolicy
     * @returns {any} -- DB response SQL Response
     */
    async update(req: TYPES.PrivacyPolicy, privacy_and_policy_id: string): Promise<any> {
        try {
            return this.PrivacyPolicyRepository.update(
                { privacy_and_policy_id: privacy_and_policy_id },
                {
                    privacy_and_policy: req.privacy_and_policy,
                    type: req.type,
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
     * @param {number} type -- Unique
     * @param {number} privacy_and_policy_id -- Unique category_id for th table categoryMaster
     * @returns {any} -- DB response SQL Response
     */
    async updateStatus(privacy_and_policy_id: string, type: number): Promise<any> {
        try {
            return this.PrivacyPolicyRepository.createQueryBuilder()
                .update(PrivacyPolicyEntity)
                .set({ status: false })
                .where('type=:type', { type: type })
                .andWhere('privacy_and_policy_id != :privacy_and_policy_id', {
                    privacy_and_policy_id: privacy_and_policy_id,
                })
                .execute();
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.PrivacyPolicy} reqParams -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async delete(reqParams: any) {
        try {
            const deletePrivacyPolicy = await this.PrivacyPolicyRepository.findOneBy({
                privacy_and_policy_id: reqParams,
            });

            return this.PrivacyPolicyRepository.remove(deletePrivacyPolicy);
        } catch (e) {
            log.error(e);
            return e;
        }
    }
}
