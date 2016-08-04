'use strict'

const constant = module.exports = {};

//workflow & UR status
constant.wDmApproval = "W_DM_APPROVAL"
constant.dmApproved = "DM_APPROVAL"
constant.dmRejected = "DM_REJECT"
constant.adminRejected = "ADMIN_REJECT"
constant.adminAccept = "ADMIN_ACCEPT"
constant.complete = "COMPLETE"
constant.close = "CLOSE"
constant.editContractComplete = "EDITED_CONTRACT"
constant.editContractWait = "W_EDIT_CONTRACT"

//notification group
constant.myUr = "My Request"
constant.Ur = "User Request"

//userType
constant.admin = ['CENTERADMIN','AISADMIN']
constant.dm = ['DM','MANAGER']
constant.user = ['USER']

//table name for response
constant.models={};
constant.models.urWorkflows = "urWorkflowList"
constant.models.locationAreas = "buildingAreaList"
constant.models.areaDetails = "buildingDetailList"
constant.models.vendorProfile = "vendorProfile"
constant.models.vendorContacts = "vendorContactList"
constant.models.contractPayments = "contractPaymentList"
constant.models.documents = "documentList"
constant.models.locations = "buildingLocationList"
constant.models.area = "area"
constant.models.contractAgents = "contractVendorAgentList"
constant.models.agent = "contractVendorAgent"
