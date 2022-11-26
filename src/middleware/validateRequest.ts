// src/middleware/validateRequest.ts

import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';
import log from '../logger/logger';
import { StatusCode } from '../constants/HttpStatusCode';
import * as RESPONSE from '../constants/response';

//To validate each API request using schemas
/**
 *
 * @param {AnySchema}schema -- Dynamic entity entries based on API Calls+
 * @returns {NextFunction} -- In case schema validation fails moves to response error or Schema passes moves to next function
 */
const validate = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (e: any) {
        log.error(e);
        RESPONSE.Failure.Type = e.name;
        RESPONSE.Failure.Message = e.errors;
        RESPONSE.Failure.Error = StatusCode.BAD_REQUEST.message;
        return res.status(StatusCode.BAD_REQUEST.code).send(RESPONSE.Failure);
    }
};

export default validate;
