import { AppDataSource } from '../../data-source';
import { SubCategoryMater } from '../../entity/master/SubCategoryMaster';
import * as TYPES from '../../types/master/MasterTypes';
import log from '../../logger/logger';
import { FindOperator, Like } from 'typeorm';
import * as moment from 'moment';

const CurrentDate = moment().format();
/**
 *
 */
export class SubCategoryService {
    private SubCategoryRepository = AppDataSource.getRepository(SubCategoryMater);
    /**
     *
     * @param {TYPES.SubCategory} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async create(req: TYPES.SubCategory) {
        // let data: Partner;
        const subCategory = new SubCategoryMater();
        subCategory.category_id = req.category_id;
        subCategory.sub_category = req.sub_category;
        subCategory.status = req.status;
        subCategory.created_by = 1;
        try {
            return this.SubCategoryRepository.save(subCategory);
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {any} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async checkSubCatExits(req: any) {
        // let data: Partner;
        try {
            return this.SubCategoryRepository.findOne({
                where: {
                    category_id: req.category_id,
                    sub_category: req.sub_category,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.SubCategory} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getById(req: string) {
        // let data: Partner;
        try {
            return this.SubCategoryRepository.findOne({
                relations: {
                    category_id: true,
                },
                where: {
                    sub_category_id: req,
                },
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
        let whereObj: { sub_category_master?: FindOperator<string>; status?: boolean };
        if (isSearch && isFilter) {
            whereObj = {
                sub_category_master: Like(`%${keyword}%`),
                status: filter,
            };
        } else if (isSearch) {
            whereObj = {
                sub_category_master: Like(`%${keyword}%`),
            };
        } else if (isFilter) {
            whereObj = {
                status: filter,
            };
        }
        try {
            return this.SubCategoryRepository.find({
                relations: {
                    category_id: true,
                },
                where: whereObj,
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }

    /**
     *
     * @param {TYPES.SubCategory} req -- From Request body object
     * @param {number} sub_category_id -- Unique category_id for th table SubCategoryMater
     * @returns {any} -- DB response SQL Response
     */
    async update(req: TYPES.SubCategory, sub_category_id: string): Promise<any> {
        try {
            return this.SubCategoryRepository.update(
                { sub_category_id: sub_category_id },
                {
                    sub_category: req.sub_category,
                    category_id: req.category_id,
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
     * @param {TYPES.SubCategoryMater} reqParams -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async delete(reqParams: any) {
        try {
            const deleteSubCategory = await this.SubCategoryRepository.findOneBy({
                sub_category_id: reqParams,
            });

            return this.SubCategoryRepository.remove(deleteSubCategory);
        } catch (e) {
            log.error(e);
            return e;
        }
    }
}
