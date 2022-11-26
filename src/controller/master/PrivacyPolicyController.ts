import { PRIVACY_POLICY } from './../../../src/service';
import { Request, Response } from 'express';
import log from '../../../src/logger/logger';
import { StatusCode } from '../../../src/constants/HttpStatusCode';
import * as RESPONSE from '../../../src/constants/response';
import { MESSAGE } from '../../../src/constants/messages';
import { default_omit_arr } from '../../../src/constants/query';

import * as _ from 'lodash';

/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function createPrivacyPolicyHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicy = new PRIVACY_POLICY.PrivacyPolicy();
        const response = await privacyPolicy.create(req.body);
        const value = response.privacy_and_policy_id;
        const user_type = response.type;
        if (response) {
            const terms_data = await privacyPolicy.getById(value);
            if (terms_data.status == true) {
                await privacyPolicy.updateStatus(value, user_type);
            }
        } else {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = { privacy_and_policy_id: response?.privacy_and_policy_id };
            return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
        }
        return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
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
export async function getPrivacyPolicyIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicy = new PRIVACY_POLICY.PrivacyPolicy();
        const privacy_and_policy_id = +req.params.id;
        const response = await privacyPolicy.getById(privacy_and_policy_id);
        //console.log(response);
        RESPONSE.Success.Message = MESSAGE.SUCCESS;
        const result = _.omit(response, ['created_by', 'updated_by', 'updated_on', 'password']);
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
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getPrivacyPolicyAllHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicy = new PRIVACY_POLICY.PrivacyPolicy();
        const type = req.body.type;
        const response = await privacyPolicy.get(type);
        // console.log(response);
        const result = _.map(response, (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'password']);
        });
        if (result.length) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.NO_CONTENT;
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
export async function updatePrivacyPolicyHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicy = new PRIVACY_POLICY.PrivacyPolicy();
        const privacy_policy = req.params.id;
        const response = await privacyPolicy.update(req.body, privacy_policy);

        if (response?.affected === 1) {
            const privacy_data = await privacyPolicy.getById(privacy_policy);
            if (privacy_data.status == true) {
                await privacyPolicy.updateStatus(privacy_data.privacy_and_policy_id, privacy_data.type);
            }
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = privacy_data;
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
export async function deletePrivacyHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const privacyPolicy = new PRIVACY_POLICY.PrivacyPolicy();

        const reqParams = req.params.id;
        const response = await privacyPolicy.delete(reqParams);
        RESPONSE.Success.Message = MESSAGE.SUCCESS;
        const result = _.omit(response, default_omit_arr);
        RESPONSE.Success.data = result;
        return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } catch (e: any) {
        RESPONSE.Failure.Message = e.message;
        log.error(e);
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}
