import { AppDataSource } from '../../data-source';
import { PRIMARY, CONDITION, PRIVACY, USER } from '../../entity';
import * as TYPES from '../../types/PartnerTypes';
import log from '../../logger/logger';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';

const ID = 'AKIASGQ26B2YOUETGCM4';
const SECRET = '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';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    region: 'ap-south-1',
});

const CurrentDate = moment().format();

/**
 *
 */
export class PartnerService {
    private partnerRepository = AppDataSource.getRepository(PRIMARY.PARTNER.Partner);
    private dealRepository = AppDataSource.getRepository(PRIMARY.DEALS.Deals);
    private PartnerTermsAndConditionRepository = AppDataSource.getRepository(CONDITION.TermsAndCondition);
    private PartnerPrivacyPolicyRepository = AppDataSource.getRepository(PRIVACY.PrivacyPolicy);
    private UserRepository = AppDataSource.getRepository(USER.users);

    /**
     *
     * @param {any} req -- From Request body object
     * @param {any} getPassword -- From Request body object
     * @param {any} password_ori
     * @returns {any} -- DB response SQL Response
     */
    async create(req: any, getPassword: any, password_ori: string): Promise<any> {
        const partner = new PRIMARY.PARTNER.Partner();

        partner.store_name = req.store_name;
        partner.type_of_store = req.type_of_store;
        partner.ABN_number = req.ABN_number;
        partner.GST_number = req.GST_number;
        partner.contact_person_name = req.contact_person_name;
        partner.primary_contact = req.primary_contact;
        partner.secondary_contact = req.secondary_contact;
        partner.store_email = req.email;
        partner.country = req.country;
        partner.state = req.state;
        partner.address = req.address;
        partner.suburb = req.suburb;
        partner.zipcode = req.zipcode;
        partner.discount = req.discount;
        partner.shop_description = req.shop_description;
        partner.shop_logo = req.shop_logo;
        partner.shop_images = req.shop_images;
        partner.latitude = req.latitude;
        partner.longitude = req.longitude;
        partner.store_status = 1;
        partner.isShop = 1;
        partner.admin_create = 1;
        partner.password = getPassword;
        partner.password_ori = password_ori;
        partner.reference_code = req.reference_code;

        try {
            return this.partnerRepository.save(partner);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {any} req -- From Request body object
     * @param {any} getPassword -- From Request body object
     * @param {any} password_ori
     * @returns {any} -- DB response SQL Response
     */
    async createPartner(req: any, getPassword: any, password_ori: string): Promise<any> {
        const partner = new PRIMARY.PARTNER.Partner();

        partner.store_name = req.store_name;
        partner.type_of_store = req.type_of_store;
        partner.ABN_number = req.ABN_number;
        partner.GST_number = req.GST_number;
        partner.contact_person_name = req.contact_person_name;
        partner.primary_contact = req.primary_contact;
        partner.secondary_contact = req.secondary_contact;
        partner.store_email = req.email;
        partner.country = req.country;
        partner.state = req.state;
        partner.address = req.address;
        partner.suburb = req.suburb;
        partner.zipcode = req.zipcode;
        partner.discount = req.discount;
        partner.shop_description = req.shop_description;
        partner.shop_logo = req.shop_logo;
        partner.shop_images = req.shop_images;
        partner.latitude = req.latitude;
        partner.longitude = req.longitude;
        partner.store_status = 0;
        partner.isShop = 2;
        partner.admin_create = 0;
        partner.password = getPassword;
        partner.password_ori = password_ori;
        partner.reference_code = req.reference_code;

        try {
            return this.partnerRepository.save(partner);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     /**
     *
     * @param {TYPES.Partner} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async register({ req }: { req: TYPES.Partner }): Promise<any> {
        const salt = await bcrypt.genSalt(10);
        const password = req.password || 'password';
        const hashPassword = await bcrypt.hash(password, salt);
        const partner = new PRIMARY.PARTNER.Partner();

        partner.name = req.name;
        partner.email = req.email;
        partner.phone_number = req.phone_number;
        partner.password = hashPassword;
        partner.country = req.location;
        partner.user_state = req.user_state;
        partner.user_zipcode = req.user_zipcode;
        partner.user_suburb = req.user_suburb;
        partner.password_ori = req.password;
        partner.status = 1;

        try {
            return this.partnerRepository.save(partner);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     * @returns {any} -- DB response SQL Response
     * @param {boolean} isSearch -- based on boolean search query enabled
     * @param {string} keyword -- Keyword for search
     * @param {number} filter --status filter
     * @param isShop
     * @param {boolean} isFilter -- to check is filter API
     */
    async getAll(isSearch: boolean, isFilter: boolean): Promise<any> {
        try {
            return this.partnerRepository.query('call cryztal_test_v1.sp_getAllPartnerNew(?,?)', [isSearch, isFilter]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {TYPES.Partner} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getPartner(req: number): Promise<any> {
        try {
            return this.partnerRepository.findOne({
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
     * @param {string} category  --
     * @param {string}state --
     * @param {string} suburb --
     * @param {string}zipcode --
     * @returns {any} -- DB response SQL Response
     */
    async reportFilterPartner(category: string, state: string, suburb: string, zipcode: string): Promise<any> {
        try {
            return this.partnerRepository.query('call cryztal_test_v1.sp_reportFilter(?,?,?,?)', [
                category,
                state,
                suburb,
                zipcode,
            ]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {string} category  --
     * @param {string}state --
     * @param {string} suburb --
     * @param {string}address --
     * @param {string}zipcode --
     * @param {string}created_on --
     * @returns {any} -- DB response SQL Response
     */
    async reportFilterDropDownPartner(
        category: string,
        state: string,
        suburb: string,
        address: string,
        zipcode: string,
        created_on: string,
    ): Promise<any> {
        try {
            return this.partnerRepository.query('call cryztal_test_v1.sp_reportDropDownFilter(?,?,?,?,?,?)', [
                category,
                state,
                suburb,
                address,
                zipcode,
                created_on,
            ]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     
     * @param user_state
     * @param user_zipcode
     * @param user_suburb
     * @param ids
     * @returns {any} -- DB response SQL Response
     */
    async reportUserFilterDropdown(
        user_state: string,
        user_zipcode: string,
        user_suburb: string,
        ids: number,
    ): Promise<any> {
        try {
            return this.partnerRepository.query('call cryztal_test_v1.sp_reportUserFilterDropdown(?,?,?,?)', [
                user_state,
                user_zipcode,
                user_suburb,
                ids,
            ]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     
     * @param category
     * @param state
     * @param suburb
     * @param zipcode
     * @param ids
     * @returns {any} -- DB response SQL Response
     */
    async reportFilterPartnerDropdown(
        category: string,
        state: string,
        suburb: string,
        zipcode: string,
        ids: number,
    ): Promise<any> {
        try {
            return this.partnerRepository.query('call cryztal_test_v1.sp_reportFilterPartnerDropdown(?,?,?,?)', [
                category,
                state,
                suburb,
                zipcode,
                ids,
            ]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     
     * @param user_state
     * @param user_zipcode
     * @param user_suburb
     * @returns {any} -- DB response SQL Response
     */
    async reportUserFilterPartner(user_state: string, user_zipcode: string, user_suburb: string): Promise<any> {
        try {
            return this.partnerRepository.query('call cryztal_test_v1.sp_reportUserFilter(?,?,?)', [
                user_state,
                user_zipcode,
                user_suburb,
            ]);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @returns {any} -- DB response SQL Response
     * @param {number} location --status filter
     * @param {Date} created_on --date
     * @param {boolean} isFilter -- to check is filter API
     */
    async reportFilterUser(location: string, created_on: Date, isFilter: boolean): Promise<any> {
        let whereObj: {
            location?: string;
            created_on?: Date;
            isShop: number;
        };
        if (isFilter) {
            whereObj = {
                location: location,
                created_on: created_on,
                isShop: 0,
            };
        } else {
            whereObj = {
                isShop: 0,
            };
        }
        try {
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
     * @param {TYPES.Partner} id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getAdminPartnerId(id: any) {
        try {
            return this.dealRepository.find({
                // relations: {
                //     partner_id: true,
                // },
                where: {
                    partner_id: {
                        id: id,
                    },
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
    async getPartnerReportsId(id: number) {
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
     * @param {TYPES.Partner} id -- From Request body object
     * @param {TYPES.Partner} isShop -- to check whether it is a user or not
     * @returns {any} -- DB response SQL Response
     */
    async getPartnerId(id: number) {
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
     * @param {TYPES.Partner} id -- From Request body object
     * @param {TYPES.Partner} isShop -- to check whether it is a user or not
     * @returns {any} -- DB response SQL Response
     */
    async getReportDropdownState() {
        try {
            return this.partnerRepository.query(`SELECT  DISTINCT state from c_tbl_pm_partner`);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {TYPES.Partner} id -- From Request body object
     * @param {TYPES.Partner} isShop -- to check whether it is a user or not
     * @returns {any} -- DB response SQL Response
     */
    async getReportDropdownSuburb() {
        try {
            return this.partnerRepository.query(`SELECT  DISTINCT suburb from c_tbl_pm_partner`);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {TYPES.Partner} id -- From Request body object
     * @param {TYPES.Partner} isShop -- to check whether it is a user or not
     * @returns {any} -- DB response SQL Response
     */
    async getReportDropdownPostCode() {
        try {
            return this.partnerRepository.query(`SELECT  DISTINCT zipcode from c_tbl_pm_partner`);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} id -- From Request body object
     * @param {TYPES.Partner} isShop -- to check whether it is a user or not
     * @returns {any} -- DB response SQL Response
     */
    async getReportDropdownUserState() {
        try {
            return this.partnerRepository.query(`SELECT  DISTINCT user_state from c_tbl_pm_partner`);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} id -- From Request body object
     * @param {TYPES.Partner} isShop -- to check whether it is a user or not
     * @returns {any} -- DB response SQL Response
     */
    async getReportDropdownUserSuburb() {
        try {
            return this.partnerRepository.query(`SELECT  DISTINCT user_suburb from c_tbl_pm_partner`);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} id -- From Request body object
     * @param {TYPES.Partner} isShop -- to check whether it is a user or not
     * @returns {any} -- DB response SQL Response
     */
    async getReportDropdownUserPostCode() {
        try {
            return this.partnerRepository.query(`SELECT  DISTINCT user_zipcode from c_tbl_pm_partner`);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} req -- From Request body object
     * @param {number} id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async updatePartner(req: TYPES.Partner, id: number): Promise<any> {
        try {
            return this.partnerRepository.update(
                { id: id },
                {
                    store_name: req.store_name,
                    type_of_store: req.type_of_store,
                    shop_description: req.shop_description,
                    ABN_number: req.ABN_number,
                    GST_number: req.GST_number,
                    address: req.address,
                    state: req.state,
                    country: req.country,
                    suburb: req.suburb,
                    zipcode: req.zipcode,
                    shop_logo: req.shop_logo,
                    shop_images: req.shop_images,
                    store_email: req.store_email,
                    secondary_contact: req.secondary_contact,
                    contact_person_name: req.contact_person_name,
                    store_status: req.store_status,
                    discount: req.discount,
                    latitude: req.latitude,
                    longitude: req.longitude,
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
     * @param {TYPES.Partner} req -- From Request body object
     * @param {number} id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async updatePartnerApp(req: TYPES.Partner, id: number): Promise<any> {
        try {
            return this.partnerRepository.update({ id: id }, req);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {any} req -- From Request body object
     * @param {number} id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async updateUserProfileApp(req: any, id: number): Promise<any> {
        try {
            return this.partnerRepository.update(
                {
                    id: id,
                },
                {
                    name: req.name,
                    email: req.email,
                    phone_number: req.phone_number,
                    location: req.location,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {any} req -- From Request body object
     * @param {number} id -- Unique id for th table Partner
     * @returns {any} -- DB response SQL Response
     */
    async updatePartnerProfileApp(req: any, id: number): Promise<any> {
        try {
            return this.partnerRepository.update(
                {
                    id: id,
                },
                {
                    store_name: req.store_name,
                    store_email: req.store_email,
                    primary_contact: req.primary_contact,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.Partner} reqParams -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async deleteAdminPartner(reqParams: any) {
        try {
            const deletePartner = await this.partnerRepository.findOneBy({
                id: reqParams.id,
            });

            return this.partnerRepository.remove(deletePartner);
        } catch (e) {
            log.error(e);
            return e;
        }
    }
    /**
     *
     *
     * @returns {any} -- DB response SQL Response
     */
    async getPartnerTermsAndConditionId(): Promise<any> {
        try {
            return this.PartnerTermsAndConditionRepository.find({
                where: {
                    user_type: 2,
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
     * @param {TYPES.PrivacyPolicy} type -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getPartnerPrivacyPolicyId(type: number): Promise<any> {
        try {
            return this.PartnerPrivacyPolicyRepository.find({
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
     *
     * @param {string} id --
     * @returns {any} -- DB response SQL Response
     */
    async checkExistingPartner(id: number): Promise<any> {
        try {
            return this.partnerRepository.find({
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
     * @param {string} email -- to check email in db
     * @returns {any} -- DB response SQL Response
     */
    async partnerLogin(email: string): Promise<any> {
        try {
            return this.partnerRepository.findOne({
                where: {
                    store_email: email,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {number} id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async partnerChangePasswordValidation(id: number): Promise<any> {
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
     * @param {string} email -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async checkExistingPartnerEmail(email: string): Promise<any> {
        try {
            return this.partnerRepository.findOne({
                where: [
                    {
                        email: email,
                    },
                    {
                        store_email: email,
                    },
                ],
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     * @param {any} req
     * @param {string} password -- req
     * @returns {any} -- DB response SQL Response
     */
    async forgotMailSend(req: any, password: string) {
        try {
            const email = req.body.email;
            // console.log('req', req);
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
                to: `${email}`,
                from: 'samuelraj@paladinsoftwares.com',
                subject: 'Cryztal Forget Password',
                text: `Dear Sir/Madam,
                    \n Hope you are doing well!
                    \n Thank you for your Cryztal Partner Forget Password
                    \n \n User Name:  ${email}
                    \n Password:  ${password} 
                    \n Kindly request you to not share this sensitive information anywhere else.
                   `,
            };
            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    console.log(error);
                    return error;
                } else {
                    console.log('Email sent: ' + info.response);
                    // return 1;
                }
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {string} password -- From Request body object
     * @param {number} id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async partnerChangePassword(password: string, id: number): Promise<any> {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            return this.partnerRepository.update(
                {
                    id: id,
                },
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
     * @param {number} id -- Unique category_id for th table deal_id
     * @param {any} req -- Unique category_id for th table astrologer_id
     * @returns {any} -- DB response SQL Response
     */
    async shopImageUpload(req: any, id: number): Promise<any> {
        const image_length = req.files.shop_images.length;

        const image_data = [];
        if (image_length == undefined) {
            const shop = req.files.shop_images;
            const shop_name = shop.name;

            const params = {
                Bucket: 'cryztal-upload', // pass your bucket name
                Key: shop_name, // file will be saved
                Body: shop.data,
                ContentType: 'jpg/jpeg/png',
                ACL: 'public-read',
            };

            const image_l = await this.s3Upload(params);
            image_data.push(image_l);
        }

        if (image_length > 1) {
            for (const i in req.files.shop_images) {
                const shop = req.files.shop_images[i];

                const params = {
                    Bucket: 'cryztal-upload', // pass your bucket name
                    Key: shop.name, // file will be saved as
                    Body: shop.data,
                    ContentType: 'jpg/jpeg/png',
                    ACL: 'public-read',
                };

                const image_l = await this.s3Upload(params);

                image_data.push(image_l);
            }
        }

        const shop_data = new PRIMARY.PARTNER.Partner();
        shop_data.id = id;
        shop_data.shop_images = image_data;
        try {
            return this.partnerRepository.save(shop_data);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {number} params -- params s3
     */
    async s3Upload(params) {
        return new Promise((resolve) => {
            s3.upload(params, async (err, data) => {
                if (err) {
                    //result(err, null);
                    // console.log('err', err);
                    resolve('');
                } else {
                    const image_link = data.Location;

                    resolve(image_link);
                }
            });
        });
    }
    /**
     * @param {number} id -- Unique category_id for th table deal_id
     * @param {any} req -- Unique category_id for th table astrologer_id
     * @returns {any} -- DB response SQL Response
     */
    async shopLogo(req: any, id: number): Promise<any> {
        const shop = req.files.shop_logo;
        const shop_name = shop.name;
        const params = {
            Bucket: 'cryztal-upload', // pass your bucket name
            Key: shop_name, // file will be saved as testBucket/contacts.csv
            Body: shop.data,
            ContentType: 'jpg/jpeg/png',
            //ContentType: 'application/pdf',
            ACL: 'public-read',
        };
        s3.upload(params, async (err, data) => {
            if (err) {
                //result(err, null);
                // console.log('err', err);
            } else {
                const shop_data = new PRIMARY.PARTNER.Partner();
                shop_data.id = id;
                shop_data.shop_logo = data.Location;
                try {
                    // console.log('shop_data', shop_data);
                    return this.partnerRepository.save(shop_data);
                } catch (error) {
                    log.error(error);
                    return error;
                }
            }
        });
    }

    /**
     * @param {number} id -- Unique category_id for th table deal_id
     * @param {any} req -- Unique category_id for th table astrologer_id
     * @returns {any} -- DB response SQL Response
     */
    async profileImage(req: any, id: number): Promise<any> {
        const profile = req.files.profile_image;

        const profile_name = profile.name;
        const name = profile_name;

        const params = {
            Bucket: 'cryztal-upload', // pass your bucket name
            Key: name, // file will be saved
            Body: profile.data,
            ContentType: 'jpg/jpeg/png',
            ACL: 'public-read',
        };
        s3.upload(params, async (err, data) => {
            if (err) {
                //result(err, null);
                // console.log('err', err);
            } else {
                const profile_image = await data.Location;
                const profile_data = new PRIMARY.PARTNER.Partner();
                profile_data.id = id;
                profile_data.profile_image = profile_image;

                try {
                    return this.partnerRepository.save(profile_data);
                } catch (error) {
                    log.error(error);
                    return error;
                }
            }
        });
    }

    /**
     *
     * @param {any} req -- req
     * @param {any} getPassword -- req
     * @returns {any} -- DB response SQL Response
     */
    async adminPartnerMailSend(req: any, getPassword: any) {
        try {
            const email = req.email;
            console.log('req', req);
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
                to: `${email}`,
                // to: 'kalvinbenser1@gmail.com',
                from: 'samuelraj@paladinsoftwares.com',
                subject: 'Cryztal Login credentials',
                text: `Dear Sir/Madam,
                \n Hope you are doing well!
                \n Thank you for your Cryztal Partner registration
                \n \n User Name:  ${email}
                \n Password:  ${getPassword} 
                \n Kindly request you to not share this sensitive information anywhere else.
               `,
            };
            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    console.log(error);
                    return error;
                } else {
                    console.log('Email sent: ' + info.response);
                    // return 1;
                }
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {any} req -- req
     * @param {any} getPassword -- req
     * @returns {any} -- DB response SQL Response
     */
    async userMailSend(req: any, getPassword: any) {
        try {
            const email = req.email;
            console.log('req', req);
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
                to: `${email}`,
                // to: 'kalvinbenser1@gmail.com',
                from: 'samuelraj@paladinsoftwares.com',
                subject: 'Cryztal Login credentials',
                text: `Dear Sir/Madam,
                \n Hope you are doing well!
                \n Thank you for your Cryztal  registration
                \n \n User Name:  ${email}
                \n Password:  ${getPassword} 
                \n Kindly request you to not share this sensitive information anywhere else.
               `,
            };
            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    console.log(error);
                    return error;
                } else {
                    console.log('Email sent: ' + info.response);
                    // return 1;
                }
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
}
