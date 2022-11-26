import { AppDataSource } from '../../data-source';
import { CategoryMaster } from '../../entity/master/CategoryMaster';
import * as TYPES from '../../types/master/CategoryMasterTypes';
import log from '../../logger/logger';
import * as moment from 'moment';
import { FindOperator, Like } from 'typeorm';

const CurrentDate = moment().format();
/**
 *
 */
export class CategoryMasterService {
    private categoryRepository = AppDataSource.getRepository(CategoryMaster);
    /**
     *
     * @param {TYPES.CategoryMaster} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async create(req: TYPES.categoryMaster) {
        let categoryMaster = new CategoryMaster();
        categoryMaster = req;
        try {
            return this.categoryRepository.save(categoryMaster);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {TYPES.categoryMaster} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async checkuniqueCategory(req: string) {
        try {
            return this.categoryRepository.findOneBy({
                category_master: req,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.categoryMaster} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async get(req: number) {
        try {
            return this.categoryRepository.findOneBy({
                category_id: req,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @returns {any} -- DB response SQL Response
     * @param {boolean} isSearch -- based on boolean search query enabled
     * @param {string} keyword -- Keyword for search
     * @param {number} filter --status filter
     * @param {boolean} isFilter -- to check is filter API
     */
    async getAll(isSearch: boolean, keyword: string, filter: boolean, isFilter: boolean) {
        let whereObj: { category_master?: FindOperator<string>; status?: boolean };
        if (isSearch && isFilter) {
            whereObj = {
                category_master: Like(`%${keyword}%`),
                status: filter,
            };
        } else if (isSearch) {
            whereObj = {
                category_master: Like(`%${keyword}%`),
            };
        } else if (isFilter) {
            whereObj = {
                status: filter,
            };
        }
        try {
            return this.categoryRepository.find({
                where: whereObj,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @returns {any} -- DB response SQL Response
     */
    async getAllCategoryDropdown(): Promise<any> {
        try {
            return this.categoryRepository.find({
                where: {
                    status: true,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.categoryMaster} req -- From Request body object
     * @param {number} category_id -- Unique category_id for th table categoryMaster
     * @returns {any} -- DB response SQL Response
     */
    async update(req: TYPES.categoryMaster, category_id: number): Promise<any> {
        try {
            return this.categoryRepository.update(
                { category_id: category_id },
                {
                    category_master: req.category_master,
                    status: req.status,
                    updated_on: CurrentDate,
                },
            );
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {TYPES.categoryMaster} reqParams -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async delete(reqParams: any): Promise<any> {
        try {
            const deleteCategory = await this.categoryRepository.findOneBy({
                category_id: reqParams,
            });

            return this.categoryRepository.remove(deleteCategory);
        } catch (e) {
            log.error(e);
            return e;
        }
    }
}
