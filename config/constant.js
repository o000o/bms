'use strict'

const constant = module.exports = {}

//workflow & UR status
constant.status = {}
constant.status.wDmApproval = 'W_DM_APPROVAL'
constant.status.wVpApproval = 'W_VP_APPROVAL' //for check ur belonging only
constant.status.dmApproved = 'DM_APPROVAL'
constant.status.dmRejected = 'DM_REJECT'
constant.status.vpApproved = 'VP_APPROVAL'
constant.status.vpRejected = 'VP_REJECT'
constant.status.adminRejected = 'ADMIN_REJECT'
constant.status.adminAccept = 'ADMIN_ACCEPT'
constant.status.complete = 'COMPLETE'
constant.status.editContractComplete = 'EDITED_CONTRACT'
constant.status.editContractWait = 'W_EDIT_CONTRACT'
constant.status[constant.status.wDmApproval] = 'รอ Manager อนุมัติ'
constant.status[constant.status.dmApproved] = 'รอ VP อนุมัติ'
constant.status[constant.status.dmRejected] = 'Manager ไม่อนุมัติ'
constant.status[constant.status.vpApproved] = 'รอ Admin ดำเนินการ'
constant.status[constant.status.vpRejected] = 'VP ไม่อนุมัติ'
constant.status[constant.status.adminRejected] = 'Admin ไม่อนุมัติ'
constant.status[constant.status.complete] = 'ดำเนินการสำเร็จแล้ว'

constant.urType = {}
constant.urType.editContract = 'EDIT_CONTRACT'
constant.urType.renewContract = 'RENEW_CONTRACT'
constant.urType.cancelContract = 'CANCEL_CONTRACT'
constant.urType.rental = 'RENTAL'
constant.urType.move = 'MOVEMENT'
constant.urType[constant.urType.editContract] = 'ขอแก้ไขสัญญา'
constant.urType[constant.urType.renewContract] = 'ขอต่อสัญญา'
constant.urType[constant.urType.cancelContract] = 'ขอยกเลิกสัญญา'
constant.urType[constant.urType.rental] = 'ขอใช้สถานที่'
constant.urType[constant.urType.move] = 'ขอเปลี่ยนสถานที่'

constant.rentalObj = {}
constant.rentalObj.Shop = 'AIS Shop'
constant.rentalObj.Office = 'อาคารสำนักงาน'
constant.rentalObj.Parking = 'ที่จอดรถ(Parking)'
constant.rentalObj.KIOSK = 'KIOSK'
constant.rentalObj.Partner = 'AIS Shop by Partner'
constant.rentalObj.Store = 'Store'

//notification group
constant.notification = {}
constant.notification.myUr = 'My Request'
constant.notification.Ur = 'User Request'

//userType
constant.userType = {}
constant.userType.user = 'USER'
constant.userType.manager = 'MANAGER'
constant.userType.centerAdmin = 'CENTER_ADMIN'
constant.userType.managerAdmin = 'MANAGER_ADMIN'
constant.userType.accountant = 'ACCOUNTANT'
constant.userType.system = 'SYSTEM'
constant.userType.vp = 'VP'

constant.userGroup = {}
constant.userGroup.admin = [constant.userType.centerAdmin]
constant.userGroup.manager = [constant.userType.manager,constant.userType.managerAdmin]
constant.userGroup.user = [constant.userType.user]
constant.userGroup.vp = [constant.userType.vp]

//table name for response
constant.models = {}
constant.models.urWorkflows = 'urWorkflowList'
constant.models.locationAreas = 'buildingAreaList'
constant.models.areaDetails = 'buildingDetailList'
constant.models.vendorProfile = 'vendorProfile'
constant.models.vendorContacts = 'vendorContactList'
constant.models.contractPayments = 'contractPaymentList'
constant.models.documents = 'documentList'
constant.models.locations = 'buildingLocationList'
constant.models.area = 'area'
constant.models.contractAgents = 'contractVendorAgentList'
constant.models.agent = 'contractVendorAgent'
constant.models.location = 'buildingLocation'
constant.models.urs = 'userRequestList'
constant.models.movements = 'movementList'
