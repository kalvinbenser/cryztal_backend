import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { PRIMARY, CATEGORY_MASTER, PRIVACY, SUBCATEGORY, CONDITION, USER, STATE } from './entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Addy@789**$',
    // password: 'root',
    database: 'cryztal_test_v1',
    synchronize: true,
    logging: false,
    entities: [
        User,
        PRIMARY.PARTNER.Partner,
        PRIMARY.DEALS.Deals,
        PRIMARY.ADMIN.Admin,
        CATEGORY_MASTER.CategoryMaster,
        PRIVACY.PrivacyPolicy,
        SUBCATEGORY.SubCategoryMater,
        CONDITION.TermsAndCondition,
        USER.users,
        PRIMARY.WISHLIST.WishList,
        STATE.State,
    ],
    migrations: [],
    subscribers: [],
});
