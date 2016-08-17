'use strict'

const constant = module.exports = {}

//workflow & UR status
constant.status = {}
constant.status.wDmApproval = "W_DM_APPROVAL"
constant.status.dmApproved = "DM_APPROVAL"
constant.status.dmRejected = "DM_REJECT"
constant.status.adminRejected = "ADMIN_REJECT"
constant.status.adminAccept = "ADMIN_ACCEPT"
constant.status.complete = "COMPLETE"
constant.status.editContractComplete = "EDITED_CONTRACT"
constant.status.editContractWait = "W_EDIT_CONTRACT"
// constant.status.renewContract = "W_RENEW_CONTRACT"
// constant.status.cancelContract = "W_CANCEL_CONTRACT"

constant.urType = {}
constant.urType.editContract = "EDIT_CONTRACT"
constant.urType.renewContract = "RENEW_CONTRACT"
constant.urType.cancelContract = "CANCEL_CONTRACT"
constant.urType.rental = "RENTAL"
constant.urType.move = "MOVEMENT"

//notification group
constant.notification = {}
constant.notification.myUr = "My Request"
constant.notification.Ur = "User Request"

//userType
constant.userType = {}
constant.userType.user = 'USER'
constant.userType.manager = 'MANAGER'
constant.userType.centerAdmin = 'CENTER_ADMIN'
constant.userType.managerAdmin = 'MANAGER_ADMIN'
constant.userType.accountant = 'ACCOUNTANT'
constant.userType.system = 'SYSTEM'

constant.userGroup = {}
constant.userGroup.admin = [constant.userType.managerAdmin,constant.userType.centerAdmin]
constant.userGroup.manager = [constant.userType.manager,constant.userType.managerAdmin]
constant.userGroup.user = [constant.userType.user]

//table name for response
constant.models = {}
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
constant.models.location = "buildingLocation"
// constant.models.locationArea = "buildingArea"