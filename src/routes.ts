import { Router, Request, Response } from 'express';
import * as SCHEMA from './schema';
import * as HANDLER from './controller';
import validateRequest from './middleware/validateRequest';
import { auth } from './middleware/auth';

const router = Router();
router.get('/healthCheck', (req: Request, res: Response) => res.sendStatus(200));

// *! ADMIN
//** LOGIN API */
router.post(
    '/adminLogin',
    validateRequest(SCHEMA.ADMIN_PARTNER_SCHEMA.adminLogin),
    HANDLER.ADMIN_HANDLER.adminLoginHandler,
);
// !TODO --  DASHBOARD
// ** GET API
router.get('/getStateDropdown', HANDLER.STATE_HANDLER.getStateHandler);
// ** POST API
router.post('/createState', HANDLER.STATE_HANDLER.createStateHandler);
// !TODO --  DASHBOARD
// ** GET API
router.get('/getDashboardCounts', HANDLER.ADMIN_HANDLER.getDashboardCountHandler);
// ** POST API
router.post(
    '/getDashboardPartnerList',
    validateRequest(SCHEMA.ADMIN_PARTNER_SCHEMA.getDashboardPartnerList),
    HANDLER.ADMIN_HANDLER.getAllPartnersHandler,
);
// ** GET API

router.get('/getDashboardPartnerById/:id', auth, HANDLER.ADMIN_HANDLER.getPartnersByIdHandler);
// ** GET API

router.get('/getCategoryDropdown', auth, HANDLER.CATEGORY_HANDLER.getCategoryDropdownHandler);

// !TODO --  MASTERS
// *! CATEGORY
// ** POST API*/
router.post(
    '/createCategory',
    auth,
    validateRequest(SCHEMA.CATEGORY_SCHEMA.createCategorySchema),
    HANDLER.CATEGORY_HANDLER.createCategoryHandler,
);
//**GET API */
router.get('/getCategory/:id', auth, HANDLER.CATEGORY_HANDLER.getCategoryByIdHandler);
//**POST API */
router.post(
    '/getAllCategoryList',
    auth,
    validateRequest(SCHEMA.CATEGORY_SCHEMA.getAllSchema),
    HANDLER.CATEGORY_HANDLER.getCategoryAllHandler,
);
//**PUT API */
router.put(
    '/updateCategory/:id',
    auth,
    validateRequest(SCHEMA.CATEGORY_SCHEMA.updateCategorySchema),
    HANDLER.CATEGORY_HANDLER.updateCategoryById,
);
//**DELETE API */
router.delete('/deleteCategory/:id', auth, HANDLER.CATEGORY_HANDLER.deleteCategoryHandler);

// *! SUB CATEGORY
// ** CREATE API
router.post(
    '/createSubCategory',
    validateRequest(SCHEMA.SUB_SCHEMA.createSubCategorySchema),
    HANDLER.SUB_HANDLER.createSubCategoryHandler,
);
// ** UPDATE API

router.put(
    '/updateSubCategory/:id',
    auth,
    validateRequest(SCHEMA.SUB_SCHEMA.updateSubCategorySchema),
    HANDLER.SUB_HANDLER.updateSubCategoryHandler,
);

// ** GET API
router.get('/getSubCategoryById/:id', HANDLER.SUB_HANDLER.getSubCategoryIdHandler);
// ** GET API
router.post(
    '/getAllSubCategory',
    auth,
    validateRequest(SCHEMA.SUB_SCHEMA.getAllSchema),
    HANDLER.SUB_HANDLER.getSubCategoryAllHandler,
);

// ** DELETE API
router.delete('/deleteSubCategoryById/:id', auth, HANDLER.SUB_HANDLER.deleteSubCategoryHandler);

// *! TERMS AND CONDITION
router.post(
    '/createTermsAndCondition',
    auth,
    validateRequest(SCHEMA.TERMS_AND_CONDITION_SCHEMA.createTermsAndConditionSchema),
    HANDLER.CONDITION_HANDLER.createTermsAndConditionHandler,
);
//**GET API */
router.get('/getTermsAndCondition/:id', auth, HANDLER.CONDITION_HANDLER.getTermsAndConditionByIdHandler);
//**GET API */
router.get('/getAllTermsAndCondition', auth, HANDLER.CONDITION_HANDLER.getAllTermsAndConditionHandler);
//**PUT API */
router.put('/updateTermsAndCondition/:id', auth, HANDLER.CONDITION_HANDLER.updateTermsAndConditionHandler);
//**DELETE API */

router.delete('/deleteTermsAndCondition/:id', auth, HANDLER.CONDITION_HANDLER.deleteTermsAndConditionHandler);

// *! PRIVACY POLICY
// ** CREATE API
router.post(
    '/createPrivacyPolicy',
    auth,
    validateRequest(SCHEMA.PRIVACY_SCHEMA.createPrivacyPolicySchema),
    HANDLER.PRIVACY_HANDLER.createPrivacyPolicyHandler,
);

// ** GET API
router.post('/getPrivacyPolicyAll', auth, HANDLER.PRIVACY_HANDLER.getPrivacyPolicyAllHandler);
router.get('/getPrivacyPolicyById/:id', auth, HANDLER.PRIVACY_HANDLER.getPrivacyPolicyIdHandler);

// ** UPDATE API
router.put(
    '/updatePrivacyPolicy/:id',
    auth,
    validateRequest(SCHEMA.PRIVACY_SCHEMA.updatePrivacyPolicySchema),
    HANDLER.PRIVACY_HANDLER.updatePrivacyPolicyHandler,
);

// ** DELETE API
router.delete('/deletePrivacyPolicyById/:id', auth, HANDLER.PRIVACY_HANDLER.deletePrivacyHandler);

// !TODO -- PARTNER

// !!!New API Partner
router.get('/getReportDropdownState', HANDLER.PARTNER_HANDLER.getReportDropdownState);
router.get('/getReportDropdownSuburb', HANDLER.PARTNER_HANDLER.getReportDropdownSuburb);
router.get('/getReportDropdownPostCode', HANDLER.PARTNER_HANDLER.getReportDropdownPostCode);
// !!New API User
router.get('/getReportDropdownUserState', HANDLER.PARTNER_HANDLER.getReportDropdownUserState);
router.get('/getReportDropdownUserSuburb', HANDLER.PARTNER_HANDLER.getReportDropdownUserSuburb);
router.get('/getReportDropdownUserPostCode', HANDLER.PARTNER_HANDLER.getReportDropdownUserPostCode);

/// ** GET API
router.post(
    '/getAllPartners',
    auth,
    validateRequest(SCHEMA.PARTNER_SCHEMA.getAllPartnerList),
    HANDLER.ADMIN_HANDLER.getAllPartnersHandler,
);
// ** GET API
router.post('/getAllReportPartners', auth, HANDLER.ADMIN_HANDLER.getAllPartnersHandler);
// ** GET API
router.post('/getPartnersFilterList', auth, HANDLER.ADMIN_HANDLER.getAllReportPartnersFilterHandler);
// ** GET API
router.post('/getPartnersDropDownFilter', HANDLER.ADMIN_HANDLER.getAllReportPartnersDropDownFilterHandler);
router.post('/getUserFilterList', auth, HANDLER.ADMIN_HANDLER.getAllReportPartnersUserFilterHandler);
router.post('/reportUserFilterDropdown', auth, HANDLER.ADMIN_HANDLER.reportUserFilterDropdown);
router.post('/reportFilterPartnerDropdown', auth, HANDLER.ADMIN_HANDLER.reportFilterPartnerDropdown);
// ** GET API
router.post('/getUserFilterReportList', auth, HANDLER.ADMIN_HANDLER.getAllReportPartnersUserFilterHandler);
// ** GET API
router.get('/getPartner/:id', auth, HANDLER.PARTNER_HANDLER.getPartnerByIdHandler);

// ** GET API
router.get('/getPartner_mobile/:id', HANDLER.PARTNER_HANDLER.getPartnerByIdHandler);

router.get('/getUser/:id', HANDLER.PARTNER_HANDLER.getUserByIdHandler);

// ** GET API
router.get('/getPartnerReports/:id', auth, HANDLER.PARTNER_HANDLER.getPartnerByIdReportsHandler);
// ** UPDATE API
router.put(
    '/partnerApproval/:id',
    auth,
    //validateRequest(SCHEMA.PARTNER_SCHEMA.updatePartnerSchema),
    HANDLER.ADMIN_HANDLER.updatePartnerById,
);

// ** UPDATE API
router.put(
    '/updatePartnerById/:id',
    auth,
    validateRequest(SCHEMA.ADMIN_PARTNER_SCHEMA.updatePartnerSchema),
    HANDLER.ADMIN_HANDLER.updatePartnerById,
);
// ** CREATE API

router.post(
    '/createAdminRegistrationPartner',
    //validateRequest(SCHEMA.ADMIN_PARTNER_SCHEMA.createAdminPartner),
    HANDLER.ADMIN_HANDLER.adminPartnerRegistration,
);
router.post(
    '/createRegistrationPartner',
    //validateRequest(SCHEMA.ADMIN_PARTNER_SCHEMA.createAdminPartner),
    HANDLER.ADMIN_HANDLER.PartnerRegistration,
);
// !TODO -- DEALS

// ** GET LIST API
router.post(
    '/getAllDealList',
    auth,
    //validateRequest(SCHEMA.DEALS_SCHEMA.getAllDealsForAdminIDSchema),
    HANDLER.DEALS_HANDLER.getAllDealsForAdminIdHandler,
);

//** PUT API*/
router.put(
    '/updateDealsApprovalById/:id',
    auth,
    validateRequest(SCHEMA.DEALS_SCHEMA.updateDealApprovalSchema),
    HANDLER.ADMIN_HANDLER.updateDealApprovalById,
);
//** PUT API*/
router.put(
    '/updateDealsAdminById/:id',
    validateRequest(SCHEMA.DEALS_SCHEMA.updateDealsAdminSchema),
    HANDLER.DEALS_HANDLER.updateDealsById,
);

// ** GET API
router.get('/getDeal/:id', auth, HANDLER.DEALS_HANDLER.getDealsByIdHandler);
// ** GET API
router.delete('/deleteMobileDeals/:id', HANDLER.DEALS_HANDLER.deleteDealsById);
// !TODO -- Customer

// ** GET API
router.post(
    '/getAllUsers',
    auth,
    validateRequest(SCHEMA.USER_SCHEMA.getUserListSchema),
    HANDLER.USER_HANDLER.getUserAllHandler,
);

// ** GET API
router.get('/getUserDetailsById/:id', auth, HANDLER.USER_HANDLER.getUserByIdHandler);

// ** GET API
router.put('/updateUserBlockById/:id', auth, HANDLER.USER_HANDLER.updateBlockId);
// ** GET API
router.put('/updateUserUnBlockById/:id', auth, HANDLER.USER_HANDLER.updateUnBlockId);
// *! PARTNER
// ** GET API

router.post(
    '/checkExistingPartner',
    //validateRequest(SCHEMA.PARTNER_SCHEMA.checkPartnerSchema),
    HANDLER.PARTNER_HANDLER.checkExistingPartnerHandler,
);
// ** GET API

router.post(
    '/checkActivationPartner',
    //validateRequest(SCHEMA.PARTNER_SCHEMA.checkPartnerSchema),
    HANDLER.PARTNER_HANDLER.checkActivationPartnerHandler,
);
// ** GET API

router.post(
    '/partnerEmailLogin',
    validateRequest(SCHEMA.PARTNER_SCHEMA.loginPartnerSchema),
    HANDLER.PARTNER_HANDLER.partnerLoginHandler,
);

// !! NEW API ** CREATE API
router.post(
    '/userCreate',
    validateRequest(SCHEMA.PARTNER_SCHEMA.createPartnerSchema1),
    HANDLER.PARTNER_HANDLER.createPartnerHandler,
);
router.put(
    '/updateAsPartner/:id',
    validateRequest(SCHEMA.PARTNER_SCHEMA.createPartnerSchema),
    HANDLER.PARTNER_HANDLER.updatePartnerAppById,
);
router.put(
    '/updateUserProfileById/:id',
    validateRequest(SCHEMA.PARTNER_SCHEMA.updateUserProfileSchema),
    HANDLER.PARTNER_HANDLER.updateUserProfileAppById,
);
router.put(
    '/updatePartnerProfileById/:id',
    validateRequest(SCHEMA.PARTNER_SCHEMA.UpdatePartner),
    HANDLER.PARTNER_HANDLER.updatePartnerProfileAppById,
);
router.get('/getUser/:id', HANDLER.PARTNER_HANDLER.getUserByIdHandler);

// !! NEW API ** USER IS REGISTERED
router.get('/partnerCheck/:id', HANDLER.PARTNER_HANDLER.partnerCheck);

// ** UPDATE API
router.put(
    '/updatePartnerAppById/:id',
    validateRequest(SCHEMA.PARTNER_SCHEMA.UpdatePartner),
    HANDLER.PARTNER_HANDLER.updatePartnerAppById,
);
// ** GET API
router.get('/getPartnerById/:id', HANDLER.PARTNER_HANDLER.getPartnerByIdHandler);

// ** GET API
router.get('/getPartnerTermsAndConditionById', HANDLER.PARTNER_HANDLER.getPartnerTermsAndConditionByIdHandler);
// ** GET API
router.post('/getPartnerPrivacyPolicyById', HANDLER.PARTNER_HANDLER.getPartnerPrivacyPolicyByIdHandler);
// ** UPDATE API
router.put(
    '/updatePartnerAppById/:id',
    validateRequest(SCHEMA.ADMIN_PARTNER_SCHEMA.updatePartnerSchema),
    HANDLER.ADMIN_HANDLER.updatePartnerById,
);
//** PUT API*/
router.put(
    '/partnerChangePassword/:id',
    validateRequest(SCHEMA.PARTNER_SCHEMA.partnerChangePassword),
    HANDLER.PARTNER_HANDLER.partnerChangePassword,
);
//** PUT API*/
router.post(
    '/partnerForgetPassword',
    validateRequest(SCHEMA.PARTNER_SCHEMA.partnerForgetPassword),
    HANDLER.PARTNER_HANDLER.partnerForgetPassword,
);
// ** GET API
router.get('/getPartnerDashboardCounts/:id', HANDLER.DEALS_HANDLER.getPartnerDashboardCountHandler);
router.get('/getTodayDealsCounts/:id', HANDLER.DEALS_HANDLER.getTodayDealsDashboardCountHandler);

// *! DEALS
// ** CREATE API
router.post(
    '/createDeals',
    validateRequest(SCHEMA.DEALS_SCHEMA.createDealsSchema),
    HANDLER.DEALS_HANDLER.createDealsHandler,
);
// ** GET API
router.get('/getDealById/:id', HANDLER.DEALS_HANDLER.getDealsByIdHandler);
// ** GET API
router.get('/getDealDropdownCategory', HANDLER.DEALS_HANDLER.getCategoryDealsDropdownHandler);
// ** GET API
router.get('/getDealDropdownSubCategory', HANDLER.DEALS_HANDLER.getSubCategoryDealsDropdownHandler);

// ** GET LIST API
router.post(
    '/getDealsByPartnerId',
    validateRequest(SCHEMA.DEALS_SCHEMA.getAllDealsForAdminIDSchema),
    HANDLER.DEALS_HANDLER.getAllDealsByPartnerIdHandler,
);

router.post(
    '/getActiveDealsByPartnerId',

    HANDLER.DEALS_HANDLER.getActiveDealsByPartnerHandler,
);
//** PUT API*/
router.put(
    '/updateDealsById/:id',
    validateRequest(SCHEMA.DEALS_SCHEMA.updateDealsSchema),
    HANDLER.DEALS_HANDLER.updateDealsById,
);
//** PUT API*/
router.put('/updateQuintainStatusById/:id', HANDLER.DEALS_HANDLER.updateQuraintinStatusId);
// *! USER
// ** CREATE API

router.post(
    '/insertUser',
    validateRequest(SCHEMA.USER_SCHEMA.createUserSchema),
    HANDLER.USER_HANDLER.createUserHandler,
);
//** PUT API*/
router.put(
    '/updateUserById/:id',
    validateRequest(SCHEMA.USER_SCHEMA.updateUser),
    HANDLER.USER_HANDLER.updatePartnerById,
);
// ** GET API
router.get('/getUserById/:id', HANDLER.USER_HANDLER.getUserByIdHandler);
// ** GET LIST API
router.post('/getUserTermsAndCondition', HANDLER.USER_HANDLER.getUserTermsAndConditionByIdHandler);
// ** GET LIST API
router.post('/getUserPrivacyPolicy', HANDLER.USER_HANDLER.getUserPrivacyPolicyByIdHandler);
// ** GET LIST API
router.get('/getStoreDetails', HANDLER.USER_HANDLER.getPartnerStoreDetailsAllHandle);
// ** GET LIST API
router.get('/getStoreDetailsById/:id', HANDLER.USER_HANDLER.getPartnerStoreDetailsByIdHandle);
// ** GET LIST API
router.get('/getProductDetailsById/:id', HANDLER.USER_HANDLER.getProductDetailsByIdHandle);
// ** GET LIST API
router.get('/getProductDetails', HANDLER.USER_HANDLER.getProductDetailsAllHandle);
// ** GET LIST API
router.get('/getUserCategoryDropdown', HANDLER.USER_HANDLER.getUserCategoryDropdownHandler);
// ** GET LIST API
router.post('/getUserSubCategoryDropdown', HANDLER.USER_HANDLER.getUserSubCategoryDropdownHandler);
// ** GET LIST API
router.get('/getNewList', HANDLER.USER_HANDLER.getAllNewListForUserHandler);
// ** GET LIST API
router.post(
    '/getDealsAndProduct',
    validateRequest(SCHEMA.USER_SCHEMA.getAllDealAndProductList),
    HANDLER.USER_HANDLER.getAllDealsAndProductHandler,
);
router.post(
    '/getAdvanceFilter',
    validateRequest(SCHEMA.USER_SCHEMA.getAdvanceFilterSchema),
    HANDLER.USER_HANDLER.getAdvanceFilter,
);
router.post(
    '/dashboardSearch',
    validateRequest(SCHEMA.USER_SCHEMA.getAdvanceFilterSchema),
    HANDLER.USER_HANDLER.getAdvanceFilter,
);
router.post(
    '/customTabSearch',
    validateRequest(SCHEMA.USER_SCHEMA.getAdvanceFilterSchema),
    HANDLER.USER_HANDLER.getAdvanceFilter,
);
router.post(
    '/sliderFilter',
    validateRequest(SCHEMA.USER_SCHEMA.getAdvanceFilterSchema),
    HANDLER.USER_HANDLER.getAdvanceFilter,
);

// ** GET LIST API
router.post(
    '/userEmailLogin',
    validateRequest(SCHEMA.USER_SCHEMA.loginUserSchema),
    HANDLER.USER_HANDLER.userLoginHandler,
);
//** PUT API*/
router.put(
    '/userChangePassword/:id',
    validateRequest(SCHEMA.USER_SCHEMA.userForgetPassword),
    HANDLER.USER_HANDLER.userChangePassword,
);
//** PUT API*/
router.put(
    '/userForgetPassword/:id',
    validateRequest(SCHEMA.USER_SCHEMA.userForgetPassword),
    HANDLER.USER_HANDLER.userForgetPassword,
);
router.post(
    '/checkExistingUser',
    validateRequest(SCHEMA.USER_SCHEMA.checkExistingUserSchema),
    HANDLER.USER_HANDLER.checkExistingUserHandler,
);
// *! WISH LIST

// ** CREATE API
router.post(
    '/insertWishList',
    //validateRequest(SCHEMA.WISH_LIST_SCHEMA.createWishListSchema),
    HANDLER.WISH_LIST_HANDLER.createWishListHandler,
);
// ** GET LIST API
router.post(
    '/getAllMyWishList/:user_id',
    //validateRequest(SCHEMA.WISH_LIST_SCHEMA.getAllWishListUserIdSchema),
    HANDLER.WISH_LIST_HANDLER.getAllMyWishListHandler,
);
// ** GET LIST API
router.get('/getMyWishListById/:wish_list_id', HANDLER.WISH_LIST_HANDLER.getMyWishListByIdHandler);

router.get('/getTotalViews/:id', HANDLER.WISH_LIST_HANDLER.getViewDashboardCountHandler);
// !TODO -- Customer
// ** GET LIST API
router.get('/getMyWishListAdminUserById/:user_id', auth, HANDLER.WISH_LIST_HANDLER.getMyWishListByAdminIdHandler);

router.post('/imageUpload', HANDLER.IMAGE_UPLOAD_HANDLER.imageUploadHandler);

router.post('/checkMobileNumber', HANDLER.ADMIN_HANDLER.cheakNumber);
export default router;
