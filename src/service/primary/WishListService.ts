import { AppDataSource } from '../../data-source';
import { PRIMARY } from '../../entity';
import * as TYPES from '../../types/WishListTypes';
import log from '../../logger/logger';
import * as moment from 'moment';
const CurrentDate = moment().format();
/**
 *
 */
export class WishListService {
    private wishListRepository = AppDataSource.getRepository(PRIMARY.WISHLIST.WishList);

    /**
     *
     * @param {TYPES.WishList} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async WishListRegister(req: TYPES.WishList): Promise<any> {
        let AllList = new PRIMARY.WISHLIST.WishList();
        AllList = req;
        try {
            return this.wishListRepository.save(AllList);
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {TYPES.WishList} user_id -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getAll(user_id: any): Promise<any> {
        try {
            return this.wishListRepository.find({
                relations: {
                    id: true,
                },
                where: {
                    partner_id: user_id,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.WishList} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getWishListById(req: number): Promise<any> {
        try {
            return this.wishListRepository.find({
                relations: {
                    id: true,
                    partner_id: true,
                },
                where: {
                    wish_list_id: req,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     *
     * @param {TYPES.WishList} req -- From Request body object
     * @returns {any} -- DB response SQL Response
     */
    async getWishListAdminById(req: any): Promise<any> {
        try {
            return this.wishListRepository.find({
                relations: {
                    id: true,
                    partner_id: true,
                },
                where: {
                    partner_id: req,
                },
            });
        } catch (error) {
            log.error(error);
            return error;
        }
    }
    /**
     * @param {string} id --partner id
     * @returns {any} -- DB response SQL Response
     */
    async getViewCount(id: number): Promise<any> {
        try {
            const data: any = {
                totalViews: 0,
                todayViews: 0,
            };
            data.totalViews = await this.wishListRepository.count({
                relations: {
                    partner_id: true,
                },
                where: {
                    partner_id: {
                        id: id,
                    },
                },
            });
            data.todayViews = await this.wishListRepository.count({
                relations: {
                    partner_id: true,
                },
                where: {
                    partner_id: {
                        id: id,
                    },
                    created_on: CurrentDate,
                },
            });

            return data;
        } catch (error) {
            log.error(error);
            return error;
        }
    }
}
