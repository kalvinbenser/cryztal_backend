/* eslint-disable jsdoc/require-param-description */
import { AppDataSource } from '../../data-source';
import { USER, CONDITION, PRIVACY, PRIMARY, CATEGORY_MASTER, SUBCATEGORY } from '../../entity';
import * as TYPES from '../../types/UserType';
import * as TYPE from '../../types/PartnerTypes';
import log from '../../logger/logger';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

import { FindOperator, Like } from 'typeorm';
const CurrentDate = moment().format();

/**
 *
 */
export class userService {
    private userRepository = AppDataSource.getRepository(USER.users);
    private userTermsAndConditionRepository = AppDataSource.getRepository(CONDITION.TermsAndCondition);
    private userPrivacyPolicyRepository = AppDataSource.getRepository(PRIVACY.PrivacyPolicy);
    private partnerRepository = AppDataSource.getRepository(PRIMARY.PARTNER.Partner);
    private dealsRepository = AppDataSource.getRepository(PRIMARY.DEALS.Deals);
    private categoryDealRepository = AppDataSource.getRepository(CATEGORY_MASTER.CategoryMaster);
    private subCategoryDealRepository = AppDataSource.getRepository(SUBCATEGORY.SubCategoryMater);

    /**
     *
     /**
     *
     * @param {TYPES.user} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async insertUser({ req }: { req: TYPES.user }): Promise<any> {
        const salt = await bcrypt.genSalt(10);
        const password = req.password;
        const hashPassword = await bcrypt.hash(password, salt);
        let user = new USER.users();
        req.password = hashPassword;
        user = req;
        try {
            return this.userRepository.save(user);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} req -- From Request body object
     * @param {string} user_id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async updateUser(req: TYPES.user, user_id: string): Promise<any> {
        try {
            return this.userRepository.update(
                { user_id: user_id },
                {
                    first_name: req.first_name,
                    email: req.email,
                    contact_number: req.contact_number,
                    image: req.image,
                    updated_by: req.user_id,
                    updated_on: CurrentDate,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     * @returns {any} -- DB response SQL Response
     * @param {boolean} isSearch -- based on boolean search query enabled
     * @param {string} keyword -- Keyword for search
     */
    async getAllUser(isSearch: boolean, keyword: string): Promise<any> {
        try {
            return this.partnerRepository.query('call cryztal_test_v1.sp_getAllUserNew(?,?)', [isSearch, keyword]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.user} id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getUserById(id: number) {
        try {
            return this.partnerRepository.findOne({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPE.Partner} req -- From Request body object
     * @param {number} id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async updateUnBlock(req: TYPE.Partner, id: number): Promise<any> {
        try {
            return this.partnerRepository.update(
                { id: id },
                {
                    block: req.block,
                    status: 1,
                    store_status: 1,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPE.Partner} req -- From Request body object
     * @param {number} id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async updateBlock(req: TYPE.Partner, id: number): Promise<any> {
        try {
            return this.partnerRepository.update(
                { id: id },
                {
                    block: req.block,
                    status: 0,
                    store_status: 0,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPE.Partner} req -- From Request body object
     * @param {number} partner_id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async BlockDeals(partner_id: any): Promise<any> {
        try {
            return this.dealsRepository.update(
                { partner_id: partner_id },
                {
                    status: 2,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPE.Partner} req -- From Request body object
     * @param {number} partner_id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async unBlockDeals(partner_id: any): Promise<any> {
        try {
            return this.dealsRepository.update(
                { partner_id: partner_id },
                {
                    status: 1,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     *
     * @returns {any} -- DB response SQL Response
     */
    async getUserTermsAndConditionId(): Promise<any> {
        try {
            return this.userTermsAndConditionRepository.find({
                // relations: {
                //     partner_id: true,
                // },
                where: {
                    user_type: 1,
                    status: true,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.termsAndCondition} type -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getUserPrivacyPolicyId(type: number): Promise<any> {
        try {
            return this.userPrivacyPolicyRepository.find({
                // relations: {
                //     partner_id: true,
                // },
                where: {
                    type: type,
                    status: true,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {TYPES.Partner} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     * @param {boolean} isSearch -- based on boolean search query enabled
     * @param {string} keyword -- Keyword for search
     */
    async getAll(req: number, isSearch: boolean, keyword: string): Promise<any> {
        let whereObj: { _id: { id: number } | { id: number }; store_name?: FindOperator<string> };
        let whereObjAll: { partner_id: { id: number } | { id: number }; deal_name?: FindOperator<string> };
        if (isSearch) {
            whereObj = {
                _id: { id: req },
                store_name: Like(`%${keyword}%`),
            };
        } else {
            whereObj = {
                _id: { id: req },
            };
        }
        if (isSearch) {
            whereObjAll = {
                partner_id: { id: req },
                deal_name: Like(`%${keyword}%`),
            };
        } else {
            whereObjAll = {
                partner_id: { id: req },
            };
        }
        try {
            const partnersTotalData = this.partnerRepository.find({
                relations: {
                    id: true,
                },
                where: whereObj,
            });

            const Deals = this.dealsRepository.find({
                relations: {
                    id: true,
                },
                where: whereObjAll,
            });

            const data = [
                {
                    total: partnersTotalData,
                    active: Deals,
                },
            ];
            return data;
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @returns {any} -- DB response SQL Response
     */
    async getPartnerStoreDetails(): Promise<any> {
        try {
            return this.partnerRepository.find({
                where: {
                    store_status: 1,
                    delete_status: 0,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getPartnerStoreDetailsById(id: number): Promise<any> {
        try {
            return this.partnerRepository.findOne({
                where: {
                    id: id,
                    store_status: 1,
                    delete_status: 0,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getPartnerDealDetailsId(id: any) {
        try {
            // return this.dealsRepository.find({
            //     where: {
            //         partner_id: {
            //             id: id,
            //         },
            //         status: 0,
            //     },
            // });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars

            return this.dealsRepository.query(`select * from c_tbl_pm_partner_deals where 	partnerIdId=${id}`);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @returns {any} -- DB response SQL Response
     */
    async getProductDetails(): Promise<any> {
        try {
            return this.dealsRepository.find({
                where: {
                    status: 1,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getProductDetailsById(id: number): Promise<any> {
        try {
            return this.dealsRepository.find({
                where: {
                    id: id,
                    status: 1,
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
    async getUserCategoryDeals(): Promise<any> {
        try {
            return this.categoryDealRepository.find({
                where: {
                    status: true,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param category_id
     * @returns {any} -- DB response SQL Response
     */
    async getUserSubCategoryDeals(category_id: any): Promise<any> {
        try {
            return this.subCategoryDealRepository.find({
                where: {
                    category_id: category_id,
                    status: true,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     * @returns {any} -- DB response SQL Response
     * @param {boolean} isSearch -- based on boolean search query enabled
     * @param {string} keyword -- Keyword for search
     * @param {string} postCode --status filter
     * @param {string} offers --status filter
     * @param allOffer
     * @param filter_keyword
     * @param {boo}isNear
     * @param req
     * @param {boolean} isFilter -- to check is filter API
     */
    async getAllDealAndProduct(
        isSearch: boolean,
        keyword: string,
        postCode: string,
        offers: string,
        allOffer: boolean,
        isFilter: boolean,
        filter_keyword: string,
        isNear: boolean,
        req: any,
    ): Promise<any> {
        let whereObj: {
            store_name?: FindOperator<string>;
            type_of_store?: FindOperator<string>;
            zipcode?: string;
            discount?: string;
            store_status?: number;
            delete_status: number;
            isShop: number;
        };
        if (isSearch && isFilter) {
            whereObj = {
                store_name: Like(`%${keyword}%`),
                type_of_store: Like(`%${filter_keyword}%`),
                delete_status: 0,
                store_status: 1,
                isShop: 1,
            };
        } else if (isSearch) {
            whereObj = {
                store_name: Like(`%${keyword}%`),
                delete_status: 0,
                store_status: 1,
                isShop: 1,
            };
        } else if (allOffer) {
            whereObj = {
                delete_status: 0,
                store_status: 1,
                isShop: 1,
            };
        } else if (isFilter) {
            whereObj = {
                type_of_store: Like(`%${filter_keyword}%`),
                delete_status: 0,
                store_status: 1,
                isShop: 1,
            };
        } else if (isNear) {
            //is Near
            const state = req.state;
            const zipcode = req.zipcode;
            const category = req.category;
            const sub_category = req.sub_category;
            const offer = req.offer;
            const latitude = req.latitude;
            const longitude = req.longitude;
            const range = req.range;

            let sql = '';
            let geo1 = '';
            let geo2 = '';

            if (state == null && zipcode == null && category == null && sub_category == null && offer == null) {
                sql += 'where isShop = 1';
            }

            if (state != null || zipcode != null || category != null || sub_category != null || offer != null) {
                sql += 'and  ';
            }

            if (state != null) {
                sql += `state= ${state}`;
            }

            if (zipcode != null) {
                sql += `${state != null ? ' and zipcode=' + zipcode + '' : 'zipcode=' + zipcode + ''}`;
            }

            if (category != null) {
                sql += `${
                    state != null || zipcode != null
                        ? ' and category LIKE ' + "'%" + category + "%'"
                        : 'category LIKE ' + "'%" + category + "%'"
                }`;
            }

            if (sub_category != null) {
                sql += `${
                    state != null || zipcode != null || category != null
                        ? ' and sub_category LIKE ' + "'%" + sub_category + "%'"
                        : 'sub_category LIKE ' + "'%" + sub_category + "%'"
                }`;
            }

            if (offer != null) {
                sql += `${
                    state != null || zipcode != null || category != null || sub_category != null
                        ? ' and offer=' + offer + ''
                        : 'offer=' + offer + ''
                }`;
            }

            if (latitude != null && longitude != null && range != null) {
                geo1 = `latitude, longitude,  ROUND(6371 * acos( 
                    cos( radians(${latitude}) ) 
                  * cos( radians( latitude ) ) 
                  * cos( radians( longitude ) - radians(${longitude}) ) 
                  + sin( radians(${latitude}) ) 
                  * sin( radians( latitude ) )
                    ) ) as distance,`;

                geo2 = `  HAVING distance < ${range} ORDER BY distance;`;
            } else {
                geo1 = '';
                geo2 = '';
            }

            const filter_sql = `select ${geo1} c_tbl_pm_partner.id as partner_id, c_tbl_pm_partner.store_name as store_name,c_tbl_pm_partner.shop_description as shop_description,c_tbl_pm_partner.shop_logo as shop_logo,c_tbl_pm_partner.discount as discount,c_tbl_pm_partner.state,c_tbl_pm_partner.zipcode,c_tbl_pm_partner.reference_code as partner_reference_code,c_tbl_pm_partner_deals.id as deals_id,c_tbl_pm_partner_deals.category as deals_category,c_tbl_pm_partner_deals.sub_category as sub_category,c_tbl_pm_partner_deals.deal_name as deal_name,c_tbl_pm_partner_deals.offer as deals_offer,c_tbl_pm_partner_deals.discount_description as deal_discount_description,c_tbl_pm_partner_deals.from_date as from_date,c_tbl_pm_partner_deals.to_date,c_tbl_pm_partner_deals.image as deals_image,c_tbl_pm_partner_deals.reference_code as deal_reference_code,c_tbl_pm_partner_deals.status as deal_status,c_tbl_pm_partner_deals.created_on as deal_created_on from c_tbl_pm_partner left join  c_tbl_pm_partner_deals on c_tbl_pm_partner.id=c_tbl_pm_partner_deals.partnerIdId  ${sql} ${geo2} `;

            console.log(filter_sql);
            return this.userRepository.query(filter_sql);
        }
        try {
            console.log(whereObj);
            return this.partnerRepository.find({
                where: whereObj,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {string} email -- to check email in db
     * @returns {any} -- DB response SQL Response
     */
    async userLogin(email: string): Promise<any> {
        try {
            return this.partnerRepository.findOne({
                where: [
                    {
                        email: email,
                    },
                    { store_email: email },
                ],
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {string} user_id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async userChangePasswordValidation(user_id: number): Promise<any> {
        try {
            return this.partnerRepository.findOne({
                where: {
                    id: user_id,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {string} password -- From Request body object
     * @param {string} user_id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async userChangePassword(password: string, user_id: number): Promise<any> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            return this.partnerRepository.update(
                { id: user_id },
                {
                    password: hashPassword,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {string} id --
     * @returns {any} -- DB response SQL Response
     */
    async checkExistingUser(id: string): Promise<any> {
        try {
            return this.userRepository.findOne({
                where: {
                    fir_uuid: id,
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
    async getAllNewListForUsers(): Promise<any> {
        try {
            return this.partnerRepository.query(
                'SELECT DISTINCT * FROM   c_tbl_pm_partner WHERE status=1 AND  delete_status=0 ORDER  BY created_on DESC LIMIT  50',
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     * @param {string} latitude  --
     * @param {string} longitude --
     *  @param {string} filter_keyword --
     *  @param {string} search_keyword --
     * @param {string} state --
     * @param {string} post_code --
     * @param {string} range_km
     * @param {string} category --
     * @param {string} sub_category --
     * @param {string} discount --discount
     * @returns {any} -- DB response SQL Response
     */
    async getAdvanceFilter(
        latitude: string,
        longitude: string,
        filter_keyword: string,
        search_keyword: string,
        state: string,
        post_code: string,
        range_km: string,
        category: string,
        sub_category: string,
        discount: string,
    ): Promise<any> {
        try {
            return this.partnerRepository.query('call cryztal_test_v1.sp_advanceFilter(?,?,?,?,?,?,?,?,?,?)', [
                latitude,
                longitude,
                filter_keyword,
                search_keyword,
                state,
                post_code,
                range_km,
                category,
                sub_category,
                discount,
            ]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
}
