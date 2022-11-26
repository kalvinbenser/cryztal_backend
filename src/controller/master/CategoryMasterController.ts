import { CATEGORY_SERVICE } from './../../service';
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
export async function createCategoryHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const categoryService = new CATEGORY_SERVICE.CategoryMasterService();
        const checkuniqueCategory = await categoryService.checkuniqueCategory(req.body.category_master);
        if (checkuniqueCategory) {
            RESPONSE.Success.Message = ' already exit';
            RESPONSE.Success.data = [];
        } else {
            const response = await categoryService.create(req.body);
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = { category_id: response?.category_id };
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
export async function getCategoryByIdHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const categoryService = new CATEGORY_SERVICE.CategoryMasterService();
        const category_id = +req.params?.id;
        const response = await categoryService.get(category_id);
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

/**
 *
 * @param {Request} req -- Request handler from Express.
 * @param {Response} res -- Response sent to express from DB.
 * @returns {Response} -- Fetched DATA JSON.
 */
export async function getCategoryAllHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const categoryService = new CATEGORY_SERVICE.CategoryMasterService();
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
export async function getCategoryDropdownHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const categoryService = new CATEGORY_SERVICE.CategoryMasterService();
        const response = await categoryService.getAllCategoryDropdown();
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
export async function updateCategoryById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const categoryService = new CATEGORY_SERVICE.CategoryMasterService();
        const category_id = +req.params.id;
        const response = await categoryService.update(req.body, category_id);
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
export async function deleteCategoryHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const categoryService = new CATEGORY_SERVICE.CategoryMasterService();
        const category = +req.params.id;
        const response = await categoryService.delete(category);
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
