import { IMAGE_UPLOAD_SERVICE } from './../../../service';
import { Request, Response } from 'express';

import { StatusCode } from '../../../constants/HttpStatusCode';
import * as RESPONSE from '../../../constants/response';

/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function imageUploadHandler(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const imageUploadService = new IMAGE_UPLOAD_SERVICE.ImageUploadService();
        const response = await imageUploadService.shopImageUpload(req);

        RESPONSE.Success.Message = 'image uploaded successfully';
        RESPONSE.Success.data = response;
        return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    } catch (e: any) {
        RESPONSE.Success.Message = 'please select upload image';
        RESPONSE.Success.data = [];
        return res.status(StatusCode.CREATED.code).send(RESPONSE.Success);
    }
}
