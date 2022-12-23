import { DEALS_SERVICE, PARTNER_SERVICE } from './../../../service';
import { Request, Response } from 'express';
import log from '../../../logger/logger';
import { StatusCode } from '../../../constants/HttpStatusCode';
import * as RESPONSE from '../../../constants/response';
import { MESSAGE } from '../../../constants/messages';
import { default_omit_arr } from '../../../constants/query';
import * as _ from 'lodash';
import * as moment from 'moment';

/**
 *
 * @param min
 * @param max
 */
async function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function createDealsHandler(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const partnerService = new PARTNER_SERVICE.PartnerService();
        const id = req.body.partner_id;

        const partner = await partnerService.getPartnerId(id);

        const data = req.body;
        const dealRandom = await getRandomArbitrary(10, 99);
        const deal_reference_code = partner.reference_code + dealRandom;

        data.reference_code = deal_reference_code;

        const response = await dealService.register(data);
        await dealService.dealimageUpload(req, response?.id);
        RESPONSE.Success.Message = MESSAGE.REGISTRATION_SUCCESS;
        RESPONSE.Success.data = { id: response?.id };
        return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
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
export async function getDealsByIdHandler(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const id = +req.params?.id;
        const response = await dealService.get(id);
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr);
        });
        if (result.length) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
export async function getAllDealsByPartnerIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const id = +req.body?.partner_id;
        const search_keyword = req.body.search_keyword;
        const percentage_keyword = req.body.percentage_keyword;
        const oldest_keyword = req.body.oldest_keyword;
        const newest_keyword = req.body.newest_keyword;
        const response = await dealService.getAll(
            id,
            search_keyword,
            percentage_keyword,
            oldest_keyword,
            newest_keyword,
        );

        const result = _.map(response[0], (obj) => {
            return _.omit(obj, default_omit_arr);
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
export async function getActiveDealsByPartnerHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const id = req.body?.partner_id;

        const response = await dealService.getAllActiveDeals(id);

        // const result = _.map(response[0], (obj) => {
        //     return _.omit(obj, default_omit_arr);
        // });
        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
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
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function updateDealsById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const id = +req.params.id;
        const response = await dealService.update(req.body, id);
        if (req.body.image != '') {
            await dealService.dealimageUpload(req, id);
        }

        if (response?.affected) {
            RESPONSE.Success.data = response;
            RESPONSE.Success.Message = MESSAGE.DEAL;
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
export async function getAllDealsForAdminIdHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const keyword = req.body.keyword;
        const filter = req.body.filter;

        const response = await dealService.getAdminDealAll(req.body.isSearch, keyword, filter, req.body.isFilter);
        for (const i in response) {
            response[i].from_date = moment(new Date(response[i].from_date)).format('DD/MM/yyyy');
            response[i].to_date = moment(new Date(response[i].to_date)).format('DD/MM/yyyy');
        }
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr);
        });
        if (result.length) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = result;
            return res.status(StatusCode.ACCEPTED.code).send(RESPONSE.Success);
        } else {
            RESPONSE.Failure.Message = MESSAGE.INVALID_ID;
            return res.status(StatusCode.NO_CONTENT.code).send(RESPONSE.Failure);
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
export async function getCategoryDealsDropdownHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const response = await dealService.getCategoryDeals();
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr, ['category_id'], ['status']);
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
export async function getSubCategoryDealsDropdownHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const response = await dealService.getSubCategoryDeals();
        const result = _.map(response, (obj) => {
            return _.omit(obj, default_omit_arr, ['category_id'], ['status'], ['sub_category_id']);
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
export async function getPartnerDashboardCountHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dashboard = new DEALS_SERVICE.DealsService();
        const id = +req.params.id;
        const response = await dashboard.getPartnerDashboardCount(id);

        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
export async function getTodayDealsDashboardCountHandler(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const dashboard = new DEALS_SERVICE.DealsService();
        const id = +req.params.id;
        const response = await dashboard.geTodayDealsCount(id);

        if (response) {
            RESPONSE.Success.Message = MESSAGE.SUCCESS;
            RESPONSE.Success.data = response;
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
export async function updateQuraintinStatusId(
    req: Request,
    res: Response,
): Promise<Response<any, Record<string, any>>> {
    try {
        const PartnerRegistrationService = new DEALS_SERVICE.DealsService();
        const id: any = +req.params.id;

        const response = await PartnerRegistrationService.updateQuintainStatus(req.body.status, id);

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
export async function deleteDealsById(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const dealService = new DEALS_SERVICE.DealsService();
        const id = +req.params.id;
        const response = await dealService.deleteMobileDeal(req.body, id);
        if (response?.affected) {
            RESPONSE.Success.data = response;
            RESPONSE.Success.Message = MESSAGE.DELETE_DEALS;
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
