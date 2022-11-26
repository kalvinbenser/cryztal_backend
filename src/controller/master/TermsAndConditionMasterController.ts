import { CONDITION_SERVICE } from './../../service';
import { Request, Response } from 'express';
import log from '../../../src/logger/logger';
import { StatusCode } from '../../../src/constants/HttpStatusCode';
import * as RESPONSE from '../../../src/constants/response';
import { MESSAGE } from '../../../src/constants/messages';

import * as _ from 'lodash';

/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function createTermsAndConditionHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const termsAndConditionService = new CONDITION_SERVICE.TermsAndConditionService();
        const response = await termsAndConditionService.create(req.body);
        const value = response.terms_and_condition_id;
        const user_type = response.user_type;

        if (response) {
            const terms_data = await termsAndConditionService.get(value);
            if (terms_data.status == true) {
                await termsAndConditionService.createUpdateStatus(terms_data.terms_and_condition_id, user_type);
            }
        } else {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = { terms_and_condition_id: response?.terms_and_condition_id };
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
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
export async function getTermsAndConditionByIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const termsAndConditionService = new CONDITION_SERVICE.TermsAndConditionService();
        const terms_and_condition_id = +req.params?.id;
        const response = await termsAndConditionService.get(terms_and_condition_id);
        RESPONSE.Success.Message = MESSAGE.SUCCESS;
        const result = _.omit(response, ['created_by', 'updated_by', 'updated_on']);
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getAllTermsAndConditionHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const termsAndConditionService = new CONDITION_SERVICE.TermsAndConditionService();
        const response = await termsAndConditionService.getAll();
        const result = _.map(response, (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on']);
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
export async function updateTermsAndConditionHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const termsAndConditionService = new CONDITION_SERVICE.TermsAndConditionService();
        const terms_and_condition_id = req.params.id;
        const response = await termsAndConditionService.update(req.body, terms_and_condition_id);

        if (response?.affected === 1) {
            const terms_data = await termsAndConditionService.get(terms_and_condition_id);
            if (terms_data.status == true) {
                await termsAndConditionService.updateStatus(terms_data.terms_and_condition_id, terms_data.user_type);
            }
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = terms_data;
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
export async function deleteTermsAndConditionHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const termsAndConditionService = new CONDITION_SERVICE.TermsAndConditionService();
        const termsAndCondition = req.params.id;
        const response = await termsAndConditionService.delete(termsAndCondition);
        if (response) {
            RESPONSE.Success.data = response;
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_DATA;
            return res.status(StatusCode.FORBIDDEN.code).send(RESPONSE.Failure);
        }
        return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
