import { Request, Response } from 'express';
import log from '../../../logger/logger';
import { StatusCode } from '../../../constants/HttpStatusCode';
import * as RESPONSE from '../../../constants/response';
import { MESSAGE } from '../../../constants/messages';
import { default_omit_arr } from '../../../constants/query';
import { PARTNER_SERVICE } from '../../../service';
import * as bcrypt from 'bcrypt';
import * as referralCodeGenerator from 'referral-code-generator';
import * as moment from 'moment';

const CurrentDate = moment().format('DD/MM/YYYY');

import * as _ from 'lodash';

// !! NEW API
// /**
//  *
//  * @param {any} req -- Request handler from Express.
//  * @param {Response} res -- Response sent to express from DB.
//  * @returns {Response} -- Fetched DATA JSON.
//  */
// export async function createPartnerHandler(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
//     try {
//         const referenceCode = referralCodeGenerator.custom('uppercase', 6, 4, 'temitope');
//         const data = req.body;
//         const partnerService = new PARTNER_SERVICE.PartnerService();
//         data.reference_code = referenceCode;

//         await partnerService
//             .register({ req: req.body })
//             .then(async (response) => {
//                 await partnerService.profileImage(req, response.id);

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
export async function createPartnerHandler(req: any, res: Response): Promise<Response<any>> {
    try {
        const referenceCode = referralCodeGenerator.custom('uppercase', 6, 4, 'temitope');
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const data = req.body;
        const password = req.body.password;
        data.reference_code = referenceCode;
        if (password.length >= 8) {
            const response = await partnerService.register({ req: req.body });
            const data1 = response.id;
            await partnerService.profileImage(req, data1);
            RESPONSE.Success.Message = MESSAGE.PARTNER_SUCCESS;
            RESPONSE.Success.data = { id: response?.id };
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.PASSWORD_8;
            return res.status(StatusCode.NOT_FOUND.code).send(RESPONSE.Failure);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        RESPONSE.Failure.Message = MESSAGE.MAIL;
        return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Failure);
    }
}
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function partnerCheck(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const response = await partnerService.getPartnerId(id);
        const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (result) {
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

// !! Another New API
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getPartnerByIdHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const response = await partnerService.getPartnerId(id);
        response.type_of_store = JSON.parse(response.type_of_store);
        const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (result) {
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getUserByIdHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const response = await partnerService.getPartnerId(id);
        const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (result) {
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getReportDropdownState(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerService.getReportDropdownState();
        // const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getReportDropdownSuburb(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerService.getReportDropdownSuburb();
        // const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getReportDropdownPostCode(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerService.getReportDropdownPostCode();
        // const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getReportDropdownUserState(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerService.getReportDropdownUserState();
        // const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getReportDropdownUserSuburb(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerService.getReportDropdownUserSuburb();
        // const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getReportDropdownUserPostCode(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const response = await partnerService.getReportDropdownUserPostCode();
        // const result = _.omit(response, default_omit_arr, ['created_by', 'updated_by', 'updated_on', 'password']);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getPartnerByIdReportsHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const value = await partnerService.getPartnerReportsId(id);
        const response = await partnerService.getAdminPartnerId(id);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            //const data: any = { partnerData: value, dealsData: response };
            const data: any = {
                Status: true,
                Success: true,
                Message: 'SUCCESS',
                data: [{ partnerData: value, dealsData: response }],
            };

            return res.status(StatusCode.ACCEPTED.code).send(data);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.NO_CONTENT.code).send(RESPONSE.Success);
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
export async function getPartnerAppByIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const response = await partnerService.getPartner(id);
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
export async function getPartnerTermsAndConditionByIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const termsAndConditionService = new PARTNER_SERVICE.PartnerService();

        const response = await termsAndConditionService.getPartnerTermsAndConditionId();
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
export async function getPartnerPrivacyPolicyByIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicyService = new PARTNER_SERVICE.PartnerService();
        const type = req.body.type;
        const response = await privacyPolicyService.getPartnerPrivacyPolicyId(type);
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
export async function checkExistingPartnerHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicyService = new PARTNER_SERVICE.PartnerService();
        const fir_uuid = req.body.id;
        const response = await privacyPolicyService.checkExistingPartner(fir_uuid);

        if (response[0].store_status == 1) {
            RESPONSE.Success.Message = 'Partner Activated';
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.PARTNER_NOT_ACTIVE;
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
export async function checkActivationPartnerHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicyService = new PARTNER_SERVICE.PartnerService();
        const fir_uuid = req.body.id;
        const response = await privacyPolicyService.checkExistingPartner(fir_uuid);

        console.log(response.store_status);

        if (response.store_status == 1) {
            RESPONSE.Success.Message = 'Partner Activated';
            RESPONSE.Success.data = response;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.PARTNER_NOT_ACTIVE;
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
export async function partnerLoginHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicyService = new PARTNER_SERVICE.PartnerService();
        const userName = req.body.store_email;
        const response = await privacyPolicyService.partnerLogin(userName);
        const validPassword = await bcrypt.compare(req.body.password, response?.password);
        if (validPassword) {
            RESPONSE.Success.Message = MESSAGE.LOGIN;
            RESPONSE.Success.data = { id: response?.id };
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.LOGIN_FAIL;
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
export async function partnerChangePassword(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerLoginService = new PARTNER_SERVICE.PartnerService();
        const confirm_password = req.body.confirm_password;
        const previous_password = req.body.previous_password;
        const change_Password = req.body.change_Password;

        const id = req.params.id;
        if (change_Password.length >= 8 && confirm_password.length >= 8) {
            if (confirm_password === change_Password) {
                const response = await partnerLoginService.partnerChangePasswordValidation(id);
                const compared = bcrypt.compareSync(previous_password, response?.password);
                if (compared) {
                    const result = await partnerLoginService.partnerChangePassword(change_Password, id);
                    if (result) {
                        RESPONSE.Success.Message = MESSAGE.PASSWORD_CHANGE;
                        return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
                    } else {
                        RESPONSE.Success.Message = MESSAGE.SUCCESS;
                        RESPONSE.Success.data = {};
                        return res.status(StatusCode.NO_CONTENT.code).send(RESPONSE.Success);
                    }
                } else {
                    RESPONSE.Failure.Message = MESSAGE.PASSWORD_8;
                    return res.status(StatusCode.NOT_FOUND.code).send(RESPONSE.Failure);
                }
            } else {
                RESPONSE.Failure.Message = MESSAGE.INCORRECT_PASSWORD;
                return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Failure);
            }
        } else {
            RESPONSE.Success.Message = MESSAGE.DOES_NOT_MATCH;
            return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Success);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function partnerForgetPassword(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const partnerLoginService = new PARTNER_SERVICE.PartnerService();
        const email = req.body.email;

        const response = await partnerLoginService.checkExistingPartnerEmail(email);

        if (response) {
            await partnerLoginService.forgotMailSend(req, response.password_ori);
            RESPONSE.Success.Message = 'Password is send to your mail';
            RESPONSE.Success.data = [];
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Success.Message = 'Email not registered';
            RESPONSE.Success.data = [];
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}
/**
 *
 * @param {any} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updatePartnerAppById(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const referenceCode = referralCodeGenerator.custom('uppercase', 6, 4, 'temitope');
        const PartnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const content = req.body;
        //console.log('content', content.isShop);
        content.isShop = 2;

        content.store_status = 0;
        content.created_on = CurrentDate.toString();
        content.reference_code = referenceCode;
        const response = await PartnerRegistrationService.updatePartnerApp(content, id);
        //console.log('req', req.files);
        if (req.files != null) {
            await PartnerRegistrationService.shopImageUpload(req, id);
            await PartnerRegistrationService.shopLogo(req, id);
            if (response?.affected) {
                RESPONSE.Success.data = response;
                RESPONSE.Success.Message = MESSAGE.SUCCESS;
                return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
            } else {
                RESPONSE.Failure.Message = MESSAGE.INVALID_DATA;
                return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
            }
        }
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Failure);
    }
}
/**
 *
 * @param {any} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updateUserProfileAppById(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const response = await PartnerRegistrationService.updateUserProfileApp(req.body, id);

        if (req.files != null) {
            await PartnerRegistrationService.profileImage(req, id);
        }

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
 * @param {any} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updatePartnerProfileAppById(
    req: any,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const response = await PartnerRegistrationService.updatePartnerProfileApp(req.body, id);

        if (req.files != null) {
            await PartnerRegistrationService.shopLogo(req, id);
        }

        if (response?.affected) {
            RESPONSE.Success.data = response;
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.WRONG;
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
 * @param {any} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updatePartnerToUserAppById(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params.id;
        const response = await PartnerRegistrationService.updatePartnerToUserApp(req.body, id);

        if (req.files != null) {
            await PartnerRegistrationService.profileImage(req, id);
        }

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
export async function getCategoryByUserIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new PARTNER_SERVICE.PartnerService();
        const id = +req.params?.id;
        const response = await PartnerRegistrationService.getCategoryByUserId(id);
        response.type_of_store = JSON.parse(response.type_of_store);
        type ObjectType = {
            category_master: string;
        };
        const result: ObjectType[] = response.type_of_store.map((str: any) => ({ category_master: str }));
        // eslint-disable-next-line no-constant-condition
        if (result) {
            RESPONSE.Success.data = result;
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
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
