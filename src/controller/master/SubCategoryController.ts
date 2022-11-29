import { SUB_SERVICE } from './../../../src/service';
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
export async function createSubCategoryHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const subCategoryService = new SUB_SERVICE.SubCategoryService();
        const checkSubCat = await subCategoryService.checkSubCatExits(req.body);
        if (checkSubCat) {
            const validateData = {
                Status: true,
                Success: false,
                Type: 'ValidationError',
                Message: ['sub category is already exits'],
                Error: 'Bad Request',
            };
            res.send(validateData);
        } else {
            const response = await subCategoryService.create(req.body);
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = { id: response?.sub_category_id };
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
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
export async function getSubCategoryIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const subCategoryService = new SUB_SERVICE.SubCategoryService();
        const sub_category_id = req.params.id;
        const response = await subCategoryService.getById(sub_category_id);
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
        return res.status(StatusCode.SERVER_ERROR.code).send(RESPONSE.Failure);
    }
}

/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getSubCategoryAllHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const categoryService = new SUB_SERVICE.SubCategoryService();
        const keyword = req.body.keyword;
        const filter = req.body.filter;
        const response = await categoryService.getAll(req.body.isSearch, keyword, filter, req.body.isFilter);
        const result = _.map(response, (obj) => {
            return _.omit(obj, ['created_by', 'updated_by', 'updated_on', 'delete_status']);
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
export async function updateSubCategoryHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const subCategoryService = new SUB_SERVICE.SubCategoryService();
        const sub_category_id = req.params.id;
        const response = await subCategoryService.update(req.body, sub_category_id);
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

/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 */
export async function deleteSubCategoryHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const subCategoryService = new SUB_SERVICE.SubCategoryService();

        const id = +req.params.id;
        const response = await subCategoryService.delete(id);
        //console.log(response);
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
