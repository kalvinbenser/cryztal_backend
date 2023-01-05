import { USER_SERVICE } from './../../../service';
import { Request, Response } from 'express';
import log from '../../../logger/logger';
import { StatusCode } from '../../../constants/HttpStatusCode';
import * as RESPONSE from '../../../constants/response';
import { MESSAGE } from '../../../constants/messages';
import { default_omit_arr } from '../../../constants/query';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';

/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function createUserHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const UserService = new USER_SERVICE.userService();
        await UserService.insertUser({ req: req.body })
            .then((response) => {
                RESPONSE.Success.Message = MESSAGE.REGISTRATION_SUCCESS;
                RESPONSE.Success.data = { id: response?.user_id };
                return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
            })
            .catch((err) => {
                RESPONSE.Failure.Message = err.sqlMessage;
                RESPONSE.Failure.Error = err.code;
                return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Failure);
            });
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
export async function getUserAllHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const UserService = new USER_SERVICE.userService();
        const keyword = req.body.keyword;
        const response = await UserService.getAllUser(req.body.isSearch, keyword);
        const result = _.map(response[0], (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        });
        if (result) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.NO_CONTENT.code).send(RESPONSE.Failure);
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
export async function getUserByIdHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const subCategoryService = new USER_SERVICE.userService();
        const user_id: any = req.params.id;
        const response = await subCategoryService.getUserById(user_id);
        RESPONSE.Success.Message = MESSAGE.SUCCESS;
        const result = _.omit(response, ['created_by', 'updated_by', 'updated_on', 'delete_status', 'password']);
        RESPONSE.Success.data = result;
        return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
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
export async function getUserTermsAndConditionByIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const termsAndConditionService = new USER_SERVICE.userService();

        const response = await termsAndConditionService.getUserTermsAndConditionId();
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
export async function getUserPrivacyPolicyByIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicyService = new USER_SERVICE.userService();
        const type = req.body.type;
        const response = await privacyPolicyService.getUserPrivacyPolicyId(type);
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
export async function updateBlockId(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new USER_SERVICE.userService();
        const id: any = +req.params.id;
        const response = await PartnerRegistrationService.updateBlock(req.body, id);
        const block = await PartnerRegistrationService.BlockDeals(id);
        console.log(block);

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
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updateUnBlockId(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new USER_SERVICE.userService();
        const id: any = +req.params.id;
        const response = await PartnerRegistrationService.updateUnBlock(req.body, id);
        const block = await PartnerRegistrationService.unBlockDeals(id);
        console.log(block);

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
export async function getPartnerStoreDetailsByIdHandle(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const UserService = new USER_SERVICE.userService();
        const id = +req.params.id;
        const response = await UserService.getPartnerStoreDetailsById(id);
        const value = await UserService.getPartnerDealDetailsId(id);

        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
            const data: any = {
                Status: true,
                Success: true,
                Message: 'SUCCESS',
                partnerData: response,
                dealsData: value,
            };
            return res.status(StatusCode.ACCEPTED.code).send(data);
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
export async function getPartnerStoreDetailsAllHandle(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const UserService = new USER_SERVICE.userService();
        const response = await UserService.getPartnerStoreDetails();

        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr, [
                'primary_contact',
                'secondary_contact',
                'secondary_contact',
                'status',
                'delete_status',
                'password',
            ]);
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
export async function getProductDetailsAllHandle(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const ProductDetails = new USER_SERVICE.userService();
        const response = await ProductDetails.getProductDetails();

        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr, ['status']);
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
export async function getProductDetailsByIdHandle(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const ProductDetails = new USER_SERVICE.userService();
        const id = +req.params?.id;
        const response = await ProductDetails.getProductDetailsById(id);

        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr, ['status']);
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
export async function getUserCategoryDropdownHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new USER_SERVICE.userService();
        const response = await dealService.getUserCategoryDeals();
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr, ['status']);
        });
        if (result.length) {
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
export async function getUserSubCategoryDropdownHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new USER_SERVICE.userService();
        const category_id = req.body.category_id;
        const response = await dealService.getUserSubCategoryDeals(category_id);
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr, ['category_id'], ['status'], ['sub_category_id']);
        });
        if (result.length) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
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
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updatePartnerById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new USER_SERVICE.userService();
        const id = req.params.id;
        const response = await PartnerRegistrationService.updateUser(req.body, id);
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
export async function getAllDealsAndProductHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const UserService = new USER_SERVICE.userService();
        const keyword = req.body.keyword;
        const postCode = req.body.postCode;
        const offers = req.body.offers;
        const allOffer = req.body.allOffer;
        const filter_keyword = req.body.filter_keyword;
        const response = await UserService.getAllDealAndProduct(
            req.body.isSearch,
            keyword,
            postCode,
            offers,
            allOffer,
            req.body.isFilter,
            filter_keyword,
            req.body.isNear,
            req.body,
        );
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
export async function userLoginHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const userLoginService = new USER_SERVICE.userService();
        const userName = req.body.email;
        const response = await userLoginService.userLogin(userName);
        if (response.block == false || (response.status == 0 && response.store_status == 0)) {
            RESPONSE.Failure.Message = MESSAGE.SERVICE_UNAVAILABLE;
            return res.status(StatusCode.SERVICE_UNAVAILABLE.code).send(RESPONSE.Failure);
        } else {
            const validPassword = await bcrypt.compare(req.body.password, response?.password);
            if (validPassword) {
                RESPONSE.Success.Message = MESSAGE.LOGIN;
                RESPONSE.Success.data = { user_id: response?.id, isShop: response?.isShop };
                return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
            } else {
                RESPONSE.Success.Message = 'Invalid credentials';
                RESPONSE.Success.data = [];
                return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
            }
        }
    } catch (e: any) {
        log.error(e);
        RESPONSE.Success.Message = 'Invalid credentials';
        RESPONSE.Success.data = [];
        return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
    }
}
/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function userChangePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const userLoginService = new USER_SERVICE.userService();
        const confirm_password = req.body.confirm_password;
        const previous_password = req.body.previous_password;
        const change_Password = req.body.change_Password;

        const user_id: any = req.params.id;

        if (confirm_password === change_Password) {
            const response = await userLoginService.userChangePasswordValidation(user_id);
            const compared = bcrypt.compareSync(previous_password, response?.password);
            if (compared) {
                const result = await userLoginService.userChangePassword(change_Password, user_id);
                if (result) {
                    RESPONSE.Success.Message = MESSAGE.PASSWORD_CHANGE;
                    return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
                } else {
                    RESPONSE.Success.Message = MESSAGE.SUCCESS;
                    RESPONSE.Success.data = {};
                    return res.status(StatusCode.NO_CONTENT.code).send(RESPONSE.Success);
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
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.ServerFailure);
    }
}

/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function userForgetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const userLoginService = new USER_SERVICE.userService();
        const confirm_password = req.body.confirm_password;
        // const previous_password = req.body.previous_password;
        const change_Password = req.body.change_Password;

        const user_id: any = req.params.id;

        if (confirm_password === change_Password) {
            const result = await userLoginService.userChangePassword(change_Password, user_id);
            if (result) {
                RESPONSE.Success.Message = MESSAGE.PASSWORD_CHANGE;
                return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
            } else {
                RESPONSE.Success.Message = MESSAGE.SUCCESS;
                RESPONSE.Success.data = {};
                return res.status(StatusCode.NO_CONTENT.code).send(RESPONSE.Success);
            }
        } else {
            RESPONSE.Success.Message = MESSAGE.DOES_NOT_MATCH;
            return res.status(StatusCode.NON_AUTHORITATIVE_INFORMATION.code).send(RESPONSE.Success);
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
export async function checkExistingUserHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const existingUserService = new USER_SERVICE.userService();
        const fir_uuid = req.body.fir_uuid;
        const response = await existingUserService.checkExistingUser(fir_uuid);
        const result = _.omit(response, default_omit_arr);
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.USER_EXIST;
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
export async function getAllNewListForUserHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const UserService = new USER_SERVICE.userService();

        const response = await UserService.getAllNewListForUsers();
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getAdvanceFilter(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const UserService = new USER_SERVICE.userService();
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const filter_keyword = req.body.filter_keyword;
        const search_keyword = req.body.search_keyword;
        const state = req.body.state;
        const post_code = req.body.post_code;
        const range_km = req.body.range_km;
        const category = req.body.category;
        const sub_category = req.body.sub_category;
        const discount = req.body.discount;
        const kilometre = req.body.kilometre;
        const response = await UserService.getAdvanceFilter(
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
            kilometre,
        );
        for (const i in response[0]) {
            response[0][i].type_of_store = JSON.parse(response[0][i].type_of_store);
        }
        const result = _.map(response[0], (obj) => {
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
