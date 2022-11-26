import { AppDataSource } from '../../data-source';
import { State } from '../../entity/master/State';
import * as TYPES from '../../types/master/StateTypes';
import log from '../../logger/logger';
// import * as moment from 'moment';
// import { FindOperator, Like } from 'typeorm';

/**
 *
 */
export class StateService {
    private stateRepository = AppDataSource.getRepository(State);
    /**
     *
     * @param {TYPES.state} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async create(req: TYPES.state) {
        let state = new State();
        state = req;
        try {
            return this.stateRepository.save(state);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @returns {any} -- DB response SQL Response
     */
    async getAllStateList(): Promise<any> {
        try {
            return this.stateRepository.find({});
        } catch (error) {
            log.error(error);
            return error;
        }
    }
}
