import { ADMIN_SERVICE } from './../../../service';
import { PARTNER_SERVICE, DEALS_SERVICE } from './../../../service';
import { Request, Response } from 'express';
import log from '../../../logger/logger';
import { StatusCode } from '../../../constants/HttpStatusCode';
import * as RESPONSE from '../../../constants/response';
import { MESSAGE } from '../../../constants/messages';
import * as bcrypt from 'bcrypt';
import { getToken } from '../../../utils/jwt';
import { default_omit_arr } from '../../../constants/query';
import * as _ from 'lodash';
import * as referralCodeGenerator from 'referral-code-generator';

/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function adminLoginHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new ADMIN_SERVICE.AdminService();
        const userName = req.body.user_name;
        const response = await dealService.get(userName);
        if (response?.id) {
            // check user password with hashed password stored in the database
            const validPassword = await bcrypt.compare(req.body.password, response?.password);
            const token = getToken(response?.id, userName);
            if (validPassword) {
                RESPONSE.Success.data = { id: response?.id, token: token };
                RESPONSE.Success.Message = MESSAGE.LOGIN;
                return res.status(StatusCode.OK.code).send(RESPONSE.Success);
            } else {
                RESPONSE.Failure.Message = MESSAGE.LOGIN_FAIL;
                return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Failure);
            }
        } else {
            RESPONSE.Failure.Message = MESSAGE.USER_EXIST;
            return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function adminPartnerRegistration(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const referenceCode = referralCodeGenerator.custom('uppercase', 6, 4, 'temitope');
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const data = req.body;
        data.reference_code = referenceCode;
        const getPassword = await passwordGenerate();
        const response = await partnerService.create(data, getPassword[1], getPassword[0]);

        partnerService.adminPartnerMailSend(req.body, getPassword[0]);
        const value = response.id;
        await partnerService.shopImageUpload(req, value);
        await partnerService.shopLogo(req, value);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = { id: response?.id };
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
/**
 *
 */
function passwordGenerate() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        const val = Math.floor(10 + Math.random() * 90);

        const d = new Date();
        const dat = "'" + d + "'";
        const split_small = dat.slice(2, 3);

        const split_small_2 = dat.slice(6, 8);

        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        const alpha_small = characters.charAt(Math.floor(Math.random() * charactersLength));
        const characters_Caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength_caps = characters_Caps.length;
        const alpha_caps = characters_Caps.charAt(Math.floor(Math.random() * charactersLength_caps));
        const characters_nu = '!@#$%^&*()';
        const charactersLength_numeric = characters_nu.length;
        const alpha_numeric = characters_nu.charAt(Math.floor(Math.random() * charactersLength_numeric));

        const password = alpha_caps + alpha_small + split_small + alpha_numeric + val + split_small_2;

        const setRounds = 8;
        const hashedPassword = await new Promise((resolve) => {
            bcrypt.hash(password, setRounds, (err, hash) => {
                if (err) {
                    throw err;
                } else {
                    resolve(hash);
                }
            });
        });

        const result = [password, hashedPassword];
        resolve(result);
    });
}
// /**
//  *
//  * @param {Request} req -- Request handler from Express.
//  * @param {Response} res -- Response sent to express from DB.
//  * @returns {Response} -- Fetched DATA JSON.
//  */
// export async function adminPartnerRegistration(
//     req: Request,
//     res: Response,
// ): Promise<Response<any, Record<string, any>>> {
//     try {
//         const referenceCode = referralCodeGenerator.custom('uppercase', 6, 4, 'temitope');
//         const partnerService = new PARTNER_SERVICE.PartnerService();
//         const data = req.body;
//         data.reference_code = referenceCode;
//         await partnerService
//             .register({ req: req.body })
//             .then(async (response) => {
//                 await partnerService.profileImageAdmin(req, response.id);

//                 RESPONSE.Success.Message = MESSAGE.PARTNER_SUCCESS;
//                 RESPONSE.Success.data = { id: response?.id };
//                 return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
//             })
//             .catch((err) => {
//                 RESPONSE.Failure.Message = err.sqlMessage;
//                 RESPONSE.Failure.Error = err.code;
//                 return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Failure);
//             });
//     } catch (e: any) {
//         RESPONSE.Failure.Message = e.message;
//         log.error(e);
//         return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
//     }
// }
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getAllPartnersHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const keyword = req.body.isFilter;
        const filter = req.body.isSearch;
        const response = await partnerRegistrationService.getAll(keyword, filter);
        for (const i in response[0]) {
            response[0][i].type_of_store = JSON.parse(response[0][i].type_of_store);
        }
        const result = _.map(response[0], (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getAllReportUserFilterHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const location = req.body.location;
        const response = await partnerRegistrationService.reportFilterUser(
            location,
            req.body.created_on,
            req.body.isFilter,
        );
        const result = _.map(response, (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getAllReportPartnersFilterHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerRegistrationService.reportFilterPartner(
            req.body.category,
            req.body.state,
            req.body.suburb,
            req.body.address,
            req.body.zipcode,
            req.body.created_on,
        );
        for (const i in response[0]) {
            response[0][i].type_of_store = JSON.parse(response[0][i].type_of_store);
        }
        const result = _.map(response[0], (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getAllReportPartnersDropDownFilterHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerRegistrationService.reportFilterDropDownPartner(
            req.body.category,
            req.body.state,
            req.body.suburb,
            req.body.address,
            req.body.zipcode,
            req.body.created_on,
        );
        const result = _.map(response[0], (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getAllReportPartnersUserFilterHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerRegistrationService.reportUserFilterPartner(
            req.body.user_state,
            req.body.user_zipcode,
            req.body.user_suburb,
        );
        const result = _.map(response[0], (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        });

        const stateResult = _.map(response[0], (obj) => {
            return _.pick(obj, ['state']);
        });

        const suburbResult = _.map(response[0], (obj) => {
            return _.pick(obj, ['suburb']);
        });

        const zipcodeResult = _.map(response[0], (obj) => {
            return _.pick(obj, ['zipcode']);
        });

        const state = _.uniqBy(stateResult, 'state');
        const suburb = _.uniqBy(suburbResult, 'suburb');
        const zipcode = _.uniqBy(zipcodeResult, 'zipcode');

        if (result) {
            const data = {
                Status: true,
                Success: true,
                Message: 'SUCCESS',
                data: result,
                dropdownData: {
                    state: state,
                    suburb: suburb,
                    zipcode: zipcode,
                },
            };
            return res.status(StatusCode.CREATED.code).send(data);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}

/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function reportUserFilterDropdown(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerRegistrationService.reportUserFilterDropdown(
            req.body.user_state,
            req.body.user_zipcode,
            req.body.user_suburb,
            req.body.ids,
        );
        const result = _.map(response[0], (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}

/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function reportFilterPartnerDropdown(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerRegistrationService.reportFilterPartnerDropdown(
            req.body.category,
            req.body.state,
            req.body.suburb,
            req.body.zipcode,
            req.body.ids,
        );
        const result = _.map(response[0], (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getPartnersByIdHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params?.id;
        const response = await PartnerRegistrationService.getPartnerReportsId(id);
        response.type_of_store = JSON.parse(response.type_of_store);
        RESPONSE.Success.Message = MESSAGE.SUCCESS;
        const result = _.omit(response, default_omit_arr);
        if (!_.isEmpty(result)) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.NOT_FOUND.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updatePartnerById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const response = await PartnerRegistrationService.updatePartner(req.body, id);

        if (response?.affected) {
            RESPONSE.Success.data = response;
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_DATA;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function deleteAdminPartnerRegistrationHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const partnerRegistration = +req.params.id;
        const response = await PartnerRegistrationService.deleteAdminPartner(partnerRegistration);
        if (response) {
            RESPONSE.Success.data = response;
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_DATA;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}

/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function getActiveDealsHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicyService = new DEALS_SERVICE.DealsService();
        const status = req.body.status;
        const response = await privacyPolicyService.getActiveDeals(status);
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function getActiveDealsByIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicyService = new DEALS_SERVICE.DealsService();
        const id = +req.params.id;
        const response = await privacyPolicyService.getActiveDealsById(id);
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getAllReportSearchHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerRegistrationService = new DEALS_SERVICE.DealsService();
        const id = +req.body?._id;
        const keyword = req.body.keyword;
        const response = await partnerRegistrationService.getAllActiveDeal(id, req.body.isSearch, keyword);
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function getDashboardCountHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dashboard = new ADMIN_SERVICE.AdminService();
        const response = await dashboard.getDashboardCount();

        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = {
                dealsCount: response[0][0].dealsCount,
                customersCount: response[1][0].customersCount,
                customersActiveCount: response[2][0].customersActiveCount,
                customersInActiveCount: response[3][0].customersInActiveCount,
                dealsPending: response[5][0].dealsPending,
                dealsApproved: response[7][0].dealsApproved,
                dealsReject: response[9][0].dealsReject,
                dealsQuarantine: response[11][0].dealsQuarantine,
                totalPartnersCount: response[12][0].totalPartnersCount,
                partnersInActiveCount: response[13][0].partnersInActiveCount,
                partnersActiveCount: response[14][0].partnersActiveCount,
                partnersQuarantineCount: response[15][0].partnersQuarantineCount,
            };
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updateDealApprovalById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new DEALS_SERVICE.DealsService();
        const id = +req.params.id;
        const response = await PartnerRegistrationService.updateAdminDeal(req.body, id);
        const getDeals = await PartnerRegistrationService.getDealsData(id);
        const store_email = getDeals.partner_id.store_email;
        const email_status = +req.body.status;

        await PartnerRegistrationService.DealsApprovalMailSend(store_email, email_status);

        if (response) {
            RESPONSE.Success.data = 'Updated Successfully';
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_DATA;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
