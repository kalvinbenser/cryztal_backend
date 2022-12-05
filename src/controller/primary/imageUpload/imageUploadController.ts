import { IMAGE_UPLOAD_SERVICE } from './../../../service';
import { Request, Response } from 'express';

import { StatusCode } from '../../../constants/HttpStatusCode';
// import * as RESPONSE from '../../../constants/response';

/**
 *
 * @param {Request} req  -- Express Request -BODY/PARAMS
 * @param {Response} res -- Express response from DB
 */
export async function imageUploadHandler(req: any, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
        const imageUploadService = new IMAGE_UPLOAD_SERVICE.ImageUploadService();
        const response = await imageUploadService.shopImageUpload(req);
        const image = {
            Status: true,
            Success: true,
            Message: 'image uploaded successfully',
            data: response,
            type: req.body.type,
        };

        return res.status(StatusCode.CREATED.code).send(image);
    } catch (e: any) {
        const imageFailed = {
            Status: true,
            Success: false,
            Message: 'please select upload image',
            data: [],
            type: req.body.type,
        };
        return res.status(StatusCode.CREATED.code).send(imageFailed);
    }
}
