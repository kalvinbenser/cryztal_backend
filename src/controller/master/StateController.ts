import { STATE_SERVICE } from './../../service';
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
export async function createStateHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const stateService = new STATE_SERVICE.StateService();
        const response = await stateService.create(req.body);
        RESPONSE.Success.Message = MESSAGE.SUCCESS;
        RESPONSE.Success.data = { state_id: response?.state_id };
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
export async function getStateHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const stateService = new STATE_SERVICE.StateService();
        const response = await stateService.getAllStateList();
        RESPONSE.Success.Message = MESSAGE.SUCCESS;
        const result = _.omit(response, ['created_by', 'updated_by', 'updated_on', 'delete_status']);
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
