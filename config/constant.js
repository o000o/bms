'use strict'

const constant = module.exports = {};

//
constant.wDmApproval = "W_DM_APPROVAL";
constant.dmApproved = "DM_APPROVAL";
constant.dmRejected = "DM_REJECT";
constant.adminRejected = "ADMIN_REJECT";
constant.adminAccept = "ADMIN_ACCEPT";
constant.complete = "COMPLETE";
constant.close = "CLOSE";

//notification group
constant.myUr = "My Request";
constant.Ur = "User Request";

//userType
constant.admin = ['CENTERADMIN','AISADMIN'];
constant.dm = ['DM','MANAGER'];
constant.user = ['USER'];