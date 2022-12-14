/* eslint-disable jsdoc/check-param-names */
import { AppDataSource } from '../../data-source';
import { PRIMARY, CATEGORY_MASTER, SUBCATEGORY } from '../../entity';
import * as TYPES from '../../types/PartnerTypes';
import log from '../../logger/logger';
import * as moment from 'moment';
import { FindOperator, Like } from 'typeorm';
//import { string } from 'yup';
const CurrentDate = moment().format('DD/MM/YYYY');
import * as nodemailer from 'nodemailer';

import * as AWS from 'aws-sdk';

const ID = 'AKIASGQ26B2YOUETGCM4';
const SECRET = '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';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: 'ap-south-1',
});

/**
 *
 */
export class DealsService {
    private dealRepository = AppDataSource.getRepository(PRIMARY.DEALS.Deals);
    private categoryDealRepository = AppDataSource.getRepository(CATEGORY_MASTER.CategoryMaster);
    private subCategoryDealRepository = AppDataSource.getRepository(SUBCATEGORY.SubCategoryMater);

    /**
     *
     * @param {TYPES.Deals} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async register(req: TYPES.Deals): Promise<any> {
        let deals = new PRIMARY.DEALS.Deals();
        req.qr_id = `${req.partner_id},${req.category}, ${req.deal_name},${req.from_date},${req.to_date}`;
        deals = req;
        deals.status = 0;
        try {
            return this.dealRepository.save(deals);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     * @param {number} deal_id -- Unique category_id for th table deal_id
     * @param {any} req -- Unique category_id for th table astrologer_id
     * @returns {any} -- DB response SQL Response
     */
    async dealimageUpload(req: any, deal_id: number): Promise<any> {
        const deal = req.files.image;
        const deal_name = deal.name;

        const params = {
            Bucket: 'cryztal-upload', // pass your bucket name
            Key: deal_name, // file will be saved
            Body: deal.data,
            ContentType: 'jpg/jpeg/png',
            ACL: 'public-read',
        };
        s3.upload(params, async (err, data) => {
            if (err) {
                //result(err, null);
                //  console.log('err', err);
            } else {
                const image_data = await data.Location;
                const deal_data = new PRIMARY.DEALS.Deals();
                deal_data.id = deal_id;
                deal_data.image = image_data;

                try {
                    return this.dealRepository.update({ id: deal_id }, deal_data);
                } catch (error) {
                    log.error(error);
                    return error;
                }
            }
        });
    }

    /**
     * @param {string} patner_id -- From Request body object
     * @param {string} search_keyword -- Keyword for search data
     * @param {boolean} percentage_keyword -- Keyword for percentage data
     * @param {boolean} oldest_keyword -- Keyword for oldest data
     *  @param {boolean} newest_keyword -- Keyword for newest data
     * @returns {any} -- DB response SQL Response
     */
    async getAll(patner_id, search_keyword, percentage_keyword, oldest_keyword, newest_keyword): Promise<any> {
        try {
            return this.dealRepository.query('call cryztal_test_v1.sp_dealsByPartnerFilter(?,?,?,?,?)', [
                patner_id,
                search_keyword,
                percentage_keyword,
                oldest_keyword,
                newest_keyword,
            ]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     * @param {any} patner_id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getAllActiveDeals(patner_id: any): Promise<any> {
        try {
            return this.dealRepository.query(
                `select c_tbl_pm_partner_deals.id,c_tbl_pm_partner_deals.category,c_tbl_pm_partner_deals.sub_category,  c_tbl_pm_partner_deals.deal_name,c_tbl_pm_partner_deals.offer,c_tbl_pm_partner_deals.discount_description,c_tbl_pm_partner_deals.from_date,c_tbl_pm_partner_deals.to_date,c_tbl_pm_partner_deals.image,c_tbl_pm_partner_deals.reference_code,c_tbl_pm_partner_deals.status,c_tbl_pm_partner_deals.created_on,c_tbl_pm_partner.id as partner_id,c_tbl_pm_partner.name,
                c_tbl_pm_partner.email,c_tbl_pm_partner.phone_number,c_tbl_pm_partner.location,c_tbl_pm_partner.store_name,c_tbl_pm_partner.type_of_store,
                c_tbl_pm_partner.shop_description,c_tbl_pm_partner.ABN_number,c_tbl_pm_partner.GST_number,c_tbl_pm_partner.address,c_tbl_pm_partner.state,
                c_tbl_pm_partner.country,c_tbl_pm_partner.suburb,c_tbl_pm_partner.zipcode,c_tbl_pm_partner.profile_image,c_tbl_pm_partner.shop_logo,
                c_tbl_pm_partner.store_email,c_tbl_pm_partner.secondary_contact,c_tbl_pm_partner.status as customer_status from c_tbl_pm_partner_deals left join c_tbl_pm_partner on c_tbl_pm_partner.id=c_tbl_pm_partner_deals.partnerIdId where  c_tbl_pm_partner_deals.status=1 and c_tbl_pm_partner.id=${patner_id}`,
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Deals} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async get(req: number): Promise<any> {
        try {
            return this.dealRepository.findOne({
                relations: {
                    partner_id: true,
                },
                where: {
                    id: req,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Deals} req -- From Request body object
     * @param {number} id -- Unique id for th table Deals
     * @returns {any} -- DB response SQL Response
     */
    async update(req: TYPES.Deals, id: number): Promise<any> {
        try {
            return this.dealRepository.update(
                { id: id },
                {
                    category: req.category,
                    sub_category: req.sub_category,
                    deal_name: req.deal_name,
                    discount_description: req.discount_description,
                    offer: req.offer,
                    from_date: req.from_date,
                    to_date: req.to_date,
                    image: req.image,
                    updated_by: req.id,
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
     * @param {boolean} isFilter --status isFilter
     * @param {number} filter --status filter
     */
    async getAdminDealAll(isSearch: boolean, keyword: string, filter: number, isFilter: boolean): Promise<any> {
        let whereObj: { deal_name?: FindOperator<string>; status?: number };
        if (isSearch && isFilter) {
            whereObj = {
                deal_name: Like(`%${keyword}%`),
                status: filter,
            };
        } else if (isSearch) {
            whereObj = {
                deal_name: Like(`%${keyword}%`),
            };
        } else if (isFilter) {
            whereObj = {
                status: filter,
            };
        }
        try {
            return this.dealRepository.find({
                relations: {
                    partner_id: true,
                },
                where: whereObj,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Deals} req -- From Request body object
     * @param {number} id  -- Unique id for th table Deals
     * @returns {any} -- DB response SQL Response
     */
    async updateAdminDeal(req: TYPES.Deals, id: number): Promise<any> {
        const status_code = req.status;

        try {
            return this.dealRepository.update(
                { id: id },
                {
                    status: status_code,
                    updated_by: req.id,
                    updated_on: CurrentDate,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Deals} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getAdminPartnerId(req: number) {
        try {
            return this.dealRepository.findOneBy({
                id: req,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {TYPES.Deals} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     * @param {boolean} isSearch -- based on boolean search query enabled
     * @param {string} keyword -- Keyword for search
     */
    async getAllActiveDeal(req: number, isSearch: boolean, keyword: string): Promise<any> {
        let whereObj: { partner_id: { id: number } | { id: number }; deal_name?: FindOperator<string> };
        if (isSearch) {
            whereObj = {
                partner_id: { id: req },
                deal_name: Like(`%${keyword}%`),
            };
        } else {
            whereObj = {
                partner_id: { id: req },
            };
        }
        try {
            return this.dealRepository.find({
                relations: {
                    partner_id: true,
                },
                where: whereObj,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Deals} status -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getActiveDeals(status: number): Promise<any> {
        try {
            return this.dealRepository.find({
                where: {
                    status: status,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Deals} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getActiveDealsById(req: number): Promise<any> {
        try {
            return this.dealRepository.find({
                where: {
                    id: req,
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
    async getCategoryDeals(): Promise<any> {
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
     * @returns {any} -- DB response SQL Response
     */
    async getSubCategoryDeals(): Promise<any> {
        try {
            return this.subCategoryDealRepository.find({
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
     * @param {string} id --partner id
     * @returns {any} -- DB response SQL Response
     */
    async getPartnerDashboardCount(id: number): Promise<any> {
        try {
            const data: any = {
                dealsCount: 0,
                todayDeals: 0,
                totalViews: 1,
                todayViews: 1,
            };
            data.dealsCount = await this.dealRepository.count({
                relations: {
                    partner_id: true,
                },
                where: {
                    partner_id: {
                        id: id,
                    },
                },
            });
            data.todayDeals = await this.dealRepository.count({
                relations: {
                    partner_id: true,
                },
                where: {
                    partner_id: {
                        id: id,
                    },
                    created_on: CurrentDate,
                },
            });

            return data;
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *@param {any} id --
     * @returns {any} -- DB response SQL Response
     */
    async geTodayDealsCount(id: any): Promise<any> {
        try {
            const data: any = {
                dealsCount: 0,
            };
            data.dealsCount = await this.dealRepository.count({
                relations: {
                    partner_id: true,
                },
                where: {
                    partner_id: {
                        id: id,
                    },
                    created_on: CurrentDate,
                },
            });
            return data;
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {number}id  -- partner id
     * @returns {any} -- DB response SQL Response
     */
    async getDealsData(id: number) {
        return this.dealRepository.findOne({
            relations: {
                partner_id: true,
            },
            where: {
                id: id,
            },
        });
    }
    /**
     *
     *
     * @param {string} email -- email
     * @param {number} email_status --email status
     * @returns {any} -- DB response SQL Response
     */
    async DealsApprovalMailSend(email: string, email_status: number) {
        try {
            let email_data = '';

            switch (email_status) {
                case 0:
                    email_data = 'Rejected';
                    break;
                case 1:
                    email_data = 'approval';
                    break;
                case 2:
                    email_data = 'quarantine';
                    break;
                default:
                    email_data = 'no status';
            }

            const transporter = nodemailer.createTransport({
                host: 'paladinsoftwares.com',
                port: 465,
                // secureConnection:false,
                tls: {
                    rejectUnauthorized: false,
                },
                auth: {
                    user: 'samuelraj@paladinsoftwares.com',
                    pass: 'sammas(2&',
                },
            });
            const mailOptions = {
                to: email,
                from: 'samuelraj@paladinsoftwares.com',
                subject: 'Cryztal',
                text: `${email_data}`,
            };

            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    //  console.log(error);
                    return error;
                } else {
                    //  console.log('Email sent: ' + info.response);
                    return info.response;
                }
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Deals} req -- From Request body object
     * @param status
     * @param {number} id  -- Unique id for th table Deals
     * @returns {any} -- DB response SQL Response
     */
    async updateQuintainStatus(status: any, id: number): Promise<any> {
        try {
            let getStatus: number;
            if (status == true) {
                getStatus = 1;
            } else {
                getStatus = 3;
            }
            return this.dealRepository.update(
                { id: id },
                {
                    status: getStatus,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Deals} req -- From Request body object
     * @param {number} id  -- Unique id for th table Deals
     * @returns {any} -- DB response SQL Response
     */
    async deleteMobileDeal(req: TYPES.Deals, id: number): Promise<any> {
        try {
            return this.dealRepository.update(
                { id: id },
                {
                    delete_status: 1,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
}
