'use strict'

const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const logger = require('../utils/logUtils')
const error = require('../config/error')
const cst = require('../config/constant')
const mContract = require('../models/mContract')
const mVendorProfile = require('../models/mVendorProfile')
const mVendorContact = require('../models/mVendorProfileContact')
const mLocation = require('../models/mBuildingLocation')
const mArea = require('../models/mBuildingArea')
const mDocument = require('../models/mDocument')
const mPayment = require('../models/mContractPayment')
const mContractAgent = require('../models/mContractAgent')
const mUrWf = require('../models/mUrWorkFlow')
const mUR = require('../models/mUR')
const async = require('async')

const contract = {
/***************
{
    "requestData": {
        "contractStatus":"oooo",
        "contractNo": "20160512/12",
        "contractDate": "2016-06-03",
        "startDate": "2016-06-03",
        "endDate": "2017-06-03",
        "contractDuration": "1Y0M0D",
        "adminOwner": "user1",
        "adminTeam": "ADMINCENTER",
        "vendorProfile": {
            "vendorType": "RENTER",
            "vendorName1": "SC Asset",
            "buildingName": "Phaholyothin",
            "buildingNo": "123/5",
            "floor": "22",
            "homeNo": "123",
            "road": "Phayathai",
            "tumbol": "Samsannai",
            "amphur": "Samsannai",
            "province": "Bangkok",
            "postalCode": "12000",
            "landline": "027220233",
            "mobileNo": "0820030444",
            "fax": "027220233",
            "email": "ais@ais.co.th",
            "vendorCode": "12345",
            "vendorContactList": [
                {
                    "vendorName": "zzzMr. Sombat Jaiyen",
                    "buildingName": "Phaholyothin",
                    "buildingNo": "123/5",
                    "floor": "22",
                    "homeNo": "123",
                    "road": "Phayathai",
                    "tumbol": "Samsannai",
                    "amphur": "Samsannai",
                    "province": "Bangkok",
                    "postalCode": "12000",
                    "landline": "027220233",
                    "mobileNo": "0820030444",
                    "fax": "027220233",
                    "email": "ais@ais.co.th"
                },
                {
                    "vendorName": "sssMr. Sombat Jaiyen",
                    "buildingName": "Phaholyothin",
                    "buildingNo": "123/5",
                    "floor": "22",
                    "homeNo": "123",
                    "road": "Phayathai",
                    "tumbol": "Samsannai",
                    "amphur": "Samsannai",
                    "province": "Bangkok",
                    "postalCode": "12000",
                    "landline": "027220233",
                    "mobileNo": "0820030444",
                    "fax": "027220233",
                    "email": "ais@ais.co.th"
                }
            ]
        },
        "buildingLocation": {
            "buildingNo": "234/5",
            "buildingName": "Phaholyothin Building",
            "titleDeeds": "2222/333",
            "road": "Phaholyothin",
            "tumbol": "Samsannai",
            "amphur": "Samsannai",
            "province": "Bangkok",
            "postalCode": "10400",
            "region": "Center",
            "location": "13.7828955,100.5448923",
            "buildingAreaList": [
                {
                    "areaName": "qqqZoneA",
                    "floor": "23A",
                    "homeNo": "1234/2",
                    "areaSize": 234,
                    "unitArea": "SQM",
                    "rentalObjective": "Office"
                },
                {
                    "areaName": "wwwZonec",
                    "floor": "23C",
                    "homeNo": "1234/3",
                    "areaSize": 250,
                    "unitArea": "SQM",
                    "rentalObjective": "Office"
                }
            ]
        },
        "contractPaymentList": [
            {
                "paymentType": "cccRENTAL",
                "paymentDetail": "Rental of Phaholyothin Building",
                "startDate": "2016-06-03T12:37:48.000Z",
                "endDate": "2017-06-03T12:37:48.000Z",
                "price": 1300000,
                "priceIncVat": 1456000,
                "paymentPeriod": "M",
                "vatFlag": "Y",
                "vatRate": "7",
                "whtFlag": "Y",
                "whtRate": "5"
            },
            {
                "paymentType": "bbbRENTAL",
                "paymentDetail": "Rental of Phaholyothin Building",
                "startDate": "2016-06-03T12:37:48.000Z",
                "endDate": "2017-06-03T12:37:48.000Z",
                "price": 1300000,
                "priceIncVat": 1456000,
                "paymentPeriod": "M",
                "vatFlag": "Y",
                "vatRate": "7",
                "whtFlag": "Y",
                "whtRate": "5"
            }
        ],
        "documentList": [
            {
                "documentName": "aaaโฉนด ตึกพหลโยธิน",
                "documentVersion": "1.0",
                "documentType": "TITLE_DEEDS",
                "documentStatus": "ACTIVE",
                "uploadDate": "2016-06-03T12:37:48.000Z",
                "uploadBy": "user1"
            },
            {
                "documentName": "oooโฉนด ตึกพหลโยธิน",
                "documentVersion": "1.0",
                "documentType": "TITLE_DEEDS",
                "documentStatus": "ACTIVE",
                "uploadDate": "2016-06-03T12:37:48.000Z",
                "uploadBy": "user1"
            }
        ]
    }
}
***************/
  addOld: (req, res) => { //always need vendorProfile to add contract
    let cmd = 'addContract'
    try{
      cmd = 'chkVendorProfileExisting'
      let jWhere = {vendorType:req.body.requestData.vendorProfile.vendorType, vendorName1:req.body.requestData.vendorProfile.vendorName1}
      logger.info(req,cmd+'|where:'+util.jsonToText(jWhere))
      mVendorProfile.findOne({where:jWhere,attributes:['vendorId']}).then((db) => {
        logger.info(req,cmd+'|'+util.jsonToText(db))

        if(util.isDataFound(db)){ //already have vendor use old data
          logger.info(req,cmd+'|'+error.desc_01004)
          req.body.requestData.vendorId = db.vendorId //link old vendor with contract
          delete req.body.requestData.vendorProfile //delete new vendor data
        }
        let cloneLocation = JSON.parse(util.jsonToText(req.body.requestData.buildingLocation))
        delete req.body.requestData.buildingLocation //delete Location
        cmd = 'insertContractList'
        jWhere = {contractNo:req.body.requestData.contractNo, contractDate:req.body.requestData.contractDate}
        logger.info(req,cmd+'|where:'+util.jsonToText(jWhere))
        mContract.findOrCreate({where:jWhere, defaults:req.body.requestData, include:[
          {model: mVendorProfile, as:cst.models.vendorProfile,
            include:{model:mVendorContact, as:cst.models.vendorContacts}},
          {model: mPayment, as:cst.models.contractPayments},
          {model: mDocument, as:cst.models.documents}
          // {model: mLocation, as:'buildingLocation',through:{model:mArea, as:'buildingAreaList'}}
        ]})
        .spread((db,succeed) => {
          logger.info(req,cmd+'|Inserted:'+succeed+'|'+util.jsonToText(db))
          if(succeed){ //contract inserted
            //check and add location here!!!
            cmd = 'insertLocation'
            let cloneDb = JSON.parse(util.jsonToText(db))
            //add contractId to areaList
            cloneLocation.buildingAreaList.forEach((value) => {value.contractId=db.contractId})
            jWhere={buildingName:cloneLocation.buildingName, buildingNo:cloneLocation.buildingNo}
            logger.info(req,cmd+'|where:'+util.jsonToText(jWhere))
            logger.info(req,cmd+'|Location:'+util.jsonToText(cloneLocation))
            mLocation.findOrCreate({where:jWhere, defaults:cloneLocation,
              include:[{model: mArea, as:cst.models.locationAreas}]})
            .spread((db,succeed) => {
              logger.info(req,cmd+'|Inserted:'+succeed+'|'+util.jsonToText(db))
              cloneDb.buildingLocation = JSON.parse(util.jsonToText(db))
              if(succeed){ //Location inserted
                resp.getSuccess(req,res,cmd,cloneDb)
              }else{ //Location exist add Area
                logger.info(req,cmd+'|'+error.desc_01004)
                cmd = 'insertAreaList'
                cloneLocation.buildingAreaList.forEach((value) => {value.buildingId=db.buildingId})
                logger.info(req,cmd+'|AreaList:'+util.jsonToText(cloneLocation.buildingAreaList))
                mArea.bulkCreate(cloneLocation.buildingAreaList, {validate:true})
                .then((succeed) => {
                  logger.info(req,cmd+'|Inserted:'+util.jsonToText(succeed))
                  //too lazy too query area again so just return contract
                  delete cloneDb.buildingLocation.buildingAreaList //delete areaList from other contract
                  resp.getSuccess(req,res,cmd,cloneDb)
                }).catch((err) => {
                  logger.error(req,cmd+'|Error while create AreaList|'+err)
                  logger.summary(req,cmd+'|'+error.desc_01001)
                  res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
                })
              }
            }).catch((err) => {
              logger.error(req,cmd+'|Error while create Location|'+err)
              logger.summary(req,cmd+'|'+error.desc_01001)
              res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
            })
          }else{ //contract existed don't add location list
            logger.info(req,cmd+'|'+error.desc_01004)
            logger.summary(req,cmd+'|'+error.desc_01004)
            res.json(resp.getJsonError(error.code_01004,error.desc_01004,db))
          }
        }).catch((err) => {
            logger.error(req,cmd+'|Error while create contractList|'+err)
            logger.summary(req,cmd+'|'+error.desc_01001)
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
        })
      }).catch((err) => {
          logger.error(req,cmd+'|Error while check venderProfile|'+err)
          logger.summary(req,cmd+'|'+error.desc_01001)
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
      })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
    }
  },

  add: (req, res) => { //no need vendorProfile but need valid vendorId to add contract
    let cmd = 'addContract'
    try{
      cmd = 'prepareData'
      let cloneLocation = (util.isDataFound(req.body.requestData.buildingLocation))?JSON.parse(util.jsonToText(req.body.requestData.buildingLocation)):null
      if(util.isDataFound(cloneLocation)) delete req.body.requestData.buildingLocation //delete Location
      let cloneArea = (util.isDataFound(cloneLocation.buildingAreaList))?JSON.parse(util.jsonToText(cloneLocation.buildingAreaList)):null
      if(util.isDataFound(cloneArea)) delete cloneLocation.buildingAreaList //delete Area

      let cloneAgent = []
      let tempAgent = []
      if(util.isDataFound(req.body.requestData.contractVendorAgentList)){
        req.body.requestData.contractVendorAgentList.forEach((value) => 
          {tempAgent.push({
        		vendorContactId: value.vendorContactId,
        		createBy: value.createBy
        	})})
        delete req.body.requestData.contractVendorAgentList //delete AgentList
      }
      
      cmd = 'insertContractList'
      let jWhere = {contractNo:req.body.requestData.contractNo, contractDate:req.body.requestData.contractDate}
      logger.info(req,cmd+'|where:'+util.jsonToText(jWhere))
      mContract.findOrCreate({where:jWhere, defaults:req.body.requestData, include:[
        // {model: mVendorProfile, as:cst.models.vendorProfile,
        //   include:{model:mVendorContact, as:cst.models.vendorContacts}},
        {model: mPayment, as:cst.models.contractPayments},
        // {model: mDocument, as:cst.models.documents} // cut into new api
      ]})
      .spread((db,succeed) => {
        logger.info(req,cmd+'|Inserted:'+succeed+'|'+util.jsonToText(db))
        if(succeed){ //contract inserted
          // resp.getSuccess(req,res,cmd,succeed)
          let cloneDb = JSON.parse(util.jsonToText(db))
          let asyncTasks=[]
          let asyncError=0

          //check and add agent here!!!
          cmd = 'checkAgentList'
          if(util.isDataFound(tempAgent)){
            tempAgent.forEach((value) => {
          		cloneAgent.push({
          			vendorContactId: value.vendorContactId,
          			contractId: db.contractId,
          			createBy: value.createBy
          		})})
            cmd = 'pushAgentList'
            asyncTasks.push((callback)=>{
              mContractAgent.bulkCreate(cloneAgent, {validate:true})
              .then((succeed) => {
                logger.info(req,'insertAgentList|'+util.jsonToText(succeed))
                callback()
              }).catch((err) => {
                logger.error(req,'insertAgentList|'+err)
                asyncError=3
                callback()
              })
            })
          }

          //check and add location here!!!
          cmd = 'checkLocation'
          if(util.isDataFound(cloneLocation)){
            //add contractId to areaList
            // cloneLocation.buildingAreaList.forEach((value) => {value.contractId=db.contractId})
            let cmdPush = 'pushLocation'
            asyncTasks.push((callback)=>{
              jWhere={buildingName:cloneLocation.buildingName, buildingNo:cloneLocation.buildingNo}
              logger.info(req,cmdPush+'|Location:'+util.jsonToText(cloneLocation)+'|where:'+util.jsonToText(jWhere))
              mLocation.findOrCreate({where:jWhere, defaults:cloneLocation})
                // include:[{model: mArea, as:cst.models.locationAreas}]}) // db lock when send 2 duplicate areas in a row
              .spread((dbl,succeed) => {
                logger.info(req,cmdPush+'|Inserted:'+succeed+'|'+util.jsonToText(dbl))
                // cloneDb.buildingLocation = JSON.parse(util.jsonToText(db))
                if(!succeed) logger.info(req,'insertLocation|'+error.desc_01004)
                if(util.isDataFound(cloneArea)){
                  cmdPush = 'addIdIntoAreaList'
                  cloneArea.forEach((value) => {
                    value.buildingId=dbl.buildingId
                    value.contractId=db.contractId
                  })
                  logger.info(req,cmdPush+'|AreaList:'+util.jsonToText(cloneArea))
                  cmdPush = 'bulkCreateAreaList'
                  mArea.bulkCreate(cloneArea, {validate:true})
                  .then((succeed) => {
                    logger.info(req,cmdPush+'|'+util.jsonToText(succeed))
                    //too lazy too query area again so just return contract
                    callback()
                  }).catch((err) => {
                    logger.error(req,cmdPush+'|'+err)
                    asyncError=1
                    callback()
                  })
                }else callback()
              }).catch((err) => {
                logger.error(req,cmdPush+'|'+err)
                asyncError=2
                callback()
              })
            })
          }

          cmd = 'runAsyncTasks'
          async.parallel(asyncTasks, ()=>{
            // All tasks are done now
            // doSomethingOnceAllAreDone()
            switch(asyncError){
              case 0:
                resp.getSuccess(req,res,cmd,cloneDb)
                break
              case 1:
                logger.summary(req,cmd+'|'+error.desc_01016)
                res.json(resp.getJsonError(error.code_01016,error.desc_01016,cloneDb))
                break
              case 2:
                logger.summary(req,cmd+'|'+error.desc_01021)
                res.json(resp.getJsonError(error.code_01021,error.desc_01021,cloneDb))
                break
              case 3:
                logger.summary(req,cmd+'|'+error.desc_01020)
                res.json(resp.getJsonError(error.code_01020,error.desc_01020,cloneDb))
                break
              default:
                logger.summary(req,cmd+'|'+error.desc_01001)
                res.json(resp.getJsonError(error.code_01001,error.desc_01001,cloneDb))
                break
            }
            // logger.error(req,'ooooooooooo2|'+asyncError)
            // if(asyncError){
            //   logger.error(req,cmd+'|Error while run asyncTasks|')
            //   logger.summary(req,cmd+'|'+error.desc_01001)
            //   res.json(resp.getJsonError(error.code_01001,error.desc_01001,cloneDb))
            // }else{
            //   // logger.info(req,cmd+'|'+ util.jsonToText({contractId:tContractId,result}))
            //   resp.getSuccess(req,res,cmd,cloneDb)
            // }
          })

        }else{ //contract existed don't add location list
          logger.info(req,cmd+'|'+error.desc_01004)
          logger.summary(req,cmd+'|'+error.desc_01004)
          res.json(resp.getJsonError(error.code_01004,error.desc_01004,db))
        }
      }).catch((err) => {
          logger.error(req,cmd+'|Error while create contractList|'+err)
          logger.summary(req,cmd+'|'+error.desc_01001)
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
      })
    // }).catch((err) => {
    //     logger.error(req,cmd+'|Error while check venderProfile|'+err)
    //     logger.summary(req,cmd+'|'+error.desc_01001)
    //     res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
    // })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
    }
  },

  editLocation: (req, res) => {
    let cmd = 'editLocation'
    let edit = {}
    // let uMsg = []
    try{
      if(util.isDataFound(req.body.requestData)&&util.isDataFound(req.body.requestData.contractId)&&util.isDataFound(req.body.requestData.urId)){
        let asyncTasks = [] // Array to hold async tasks
        edit.contractId = req.body.requestData.contractId
        edit.countPush = 0 //not count on datas that not push on asyncTasks
        edit.countSuccess = 0 //not count on datas that not push on asyncTasks
        edit.countError = 0 //not count on update UR and create workflow Error but on datas that not push on asyncTasks
        edit.contractUpdateError = 0
        edit.locationUpdateError = 0
        edit.areaInsertError = 0
        edit.areaUpdateError = 0
        edit.areaDeleteError = 0
        edit.editResults = []
        cmd = 'checkContractData'
        let ctData = JSON.parse(util.jsonToText(req.body.requestData))
        delete ctData.buildingLocation
        delete ctData.contractId
        delete ctData.urId
        delete ctData.urStatus
        if(util.isDataFound(ctData)){
          cmd = 'pushUpdateContractTask'
          edit.countPush = edit.countPush + 1
          asyncTasks.push((callback)=>{
            let ctWhere = {contractId:edit.contractId}
            logger.info(req,'runUpdateContractTask|contract:'+util.jsonToText(ctData)+'|where:'+util.jsonToText(ctWhere))
            mContract.update(ctData,{where:ctWhere}).then((succeed) => {
              // ctWhere.editStatus='Updated '+succeed+' rows'
              if(succeed>0){
                edit.countSuccess = edit.countSuccess + 1
                edit.editResults.push({contractId:edit.contractId,editStatus:'Updated '+succeed+' rows'})
              }else{
                edit.countError = edit.countError + 1
                edit.contractUpdateError = edit.contractUpdateError + 1
                ctData.updateWhere = edit.contractId
                ctData.editStatus='No row Update'
                edit.editResults.push(ctData)
                // uMsg.push('แก้ไขข้อมูลสัญญาไม่สำเร็จ')
              }
              callback()
            }).catch((err) => {
              edit.countError = edit.countError + 1
              edit.contractUpdateError = edit.contractUpdateError + 1
              ctData.updateWhere = edit.contractId
              ctData.editStatus='Update Error:'+err
              edit.editResults.push(ctData)
              // uMsg.push('แก้ไขข้อมูลสัญญาไม่สำเร็จ')
              callback()
            })
          })
        }

        cmd = 'checkLocationData'
        if(util.isDataFound(req.body.requestData.buildingLocation)){
          let tbuildingId = util.isDataFound(req.body.requestData.buildingLocation.buildingId) ? req.body.requestData.buildingLocation.buildingId : 0
          let loData = JSON.parse(util.jsonToText(req.body.requestData.buildingLocation))
          delete loData.buildingAreaList
          delete loData.buildingId
          cmd = 'pushUpdateLocationTask'
          if(loData){
            if(tbuildingId){
              edit.countPush = edit.countPush + 1
              asyncTasks.push((callback)=>{
                let loWhere = {buildingId:tbuildingId}
                logger.info(req,'runUpdateLocationTask|location:'+util.jsonToText(loData)+'|where:'+util.jsonToText(loWhere))
                mLocation.update(loData,{where:loWhere}).then((succeed) => {
                  if(succeed>0){
                    edit.countSuccess = edit.countSuccess + 1
                    edit.editResults.push({buildingId:tbuildingId, editStatus:'Updated '+succeed+' rows'})
                  }else{
                    edit.countError = edit.countError + 1
                    edit.locationUpdateError = edit.locationUpdateError + 1
                    loData.updateWhere = tbuildingId
                    loData.editStatus='No row Update'
                    edit.editResults.push(loData)
                    // uMsg.push('แก้ไขข้อมูลสถานที่ไม่สำเร็จ')
                  }
                  callback()
                }).catch((err) => {
                  edit.countError = edit.countError + 1
                  edit.locationUpdateError = edit.locationUpdateError + 1
                  loData.updateWhere = tbuildingId
                  loData.editStatus='Update Error:'+err
                  edit.editResults.push(loData)
                  // uMsg.push('แก้ไขข้อมูลสถานที่ไม่สำเร็จ')
                  callback()
                })
              })
            }else{
              edit.countError = edit.countError + 1
              edit.locationUpdateError = edit.locationUpdateError + 1
              loData.editStatus = 'BadRequest:Can not update Location without buildingId'
              edit.editResults.push(loData)
              // uMsg.push('แก้ไขข้อมูลสถานที่ไม่สำเร็จ')
              callback()
            }
          }

          cmd = 'pushBuildingAreaListTasks'
          if(util.isDataFound(req.body.requestData.buildingLocation.buildingAreaList)){
            req.body.requestData.buildingLocation.buildingAreaList.forEach((item)=>{ // Loop through some items
              if(util.isDataFound(item.buildingAreaId) && item.editAction=='D'){ //delete
                edit.countPush = edit.countPush + 1
                asyncTasks.push((callback)=>{
                  mArea.destroy({where:{buildingAreaId:item.buildingAreaId}}).then((succeed) => {
                    edit.countSuccess = edit.countSuccess + 1
                    edit.editResults.push({buildingAreaId:item.buildingAreaId, editStatus:'Deleted '+succeed+' rows'})
                    callback()
                  }).catch((err) => {
                    // uMsg.push('ลบข้อมูลพื้นที่ไม่สำเร็จ')
                    edit.countError = edit.countError + 1
                    edit.areaDeleteError = edit.areaDeleteError + 1
                    edit.editResults.push({buildingAreaId:item.buildingAreaId, editStatus:'Delete Error:'+err})
                    callback()
                  })
                })
              }else if(!util.isDataFound(item.buildingAreaId) && item.editAction=='A' && tbuildingId){
                //insert
                edit.countPush = edit.countPush + 1
                asyncTasks.push((callback)=>{
                  let jInsert = JSON.parse(util.jsonToText(item))
                  delete jInsert.editAction
                  jInsert.contractId = edit.contractId
                  jInsert.buildingId = tbuildingId
                  mArea.create(jInsert).then((succeed) => {
                    // logger.info(req,cmd+'|deleted '+ succeed +' records')
                    edit.countSuccess = edit.countSuccess + 1
                    edit.editResults.push({buildingAreaId:succeed.buildingAreaId, editStatus:'Inserted'})
                    callback()
                  }).catch((err) => {
                    // jInsert.editStatus='Insert Error:'+err
                    // editResults.push(jInsert)
                    // uMsg.push('เพิ่มข้อมูลพื้นที่ไม่สำเร็จ')
                    item.editStatus='Insert Error:'+err
                    edit.countError = edit.countError + 1
                    edit.areaInsertError = edit.areaInsertError + 1
                    edit.editResults.push(item)
                    callback()
                  })
                })
              }else if(util.isDataFound(item.buildingAreaId) && item.editAction=='E'){
                //update
                edit.countPush = edit.countPush + 1
                asyncTasks.push((callback)=>{
                  let jUpdate = JSON.parse(util.jsonToText(item))
                  delete jUpdate.editAction
                  delete jUpdate.buildingAreaId
                  mArea.update(jUpdate,{where:{buildingAreaId:item.buildingAreaId}}).then((succeed) => {
                    if(succeed>0){
                      edit.countSuccess = edit.countSuccess + 1
                      edit.editResults.push({buildingAreaId:item.buildingAreaId, editStatus:'Updated '+succeed+' rows'})
                    }else{
                      // uMsg.push('แก้ไขข้อมูลพื้นที่ไม่สำเร็จ')
                      edit.countError = edit.countError + 1
                      edit.areaUpdateError = edit.areaUpdateError + 1
                      jUpdate.updateWhere = item.buildingAreaId
                      jUpdate.editStatus='No row Update'
                      edit.editResults.push(jUpdate)
                    }
                    callback()
                  }).catch((err) => {
                    // jUpdate.buildingAreaId = item.buildingAreaId
                    // jUpdate.editStatus='Update Error:'+err
                    // editResults.push(jUpdate)
                    // uMsg.push('แก้ไขข้อมูลพื้นที่ไม่สำเร็จ')
                    jUpdate.editStatus='Update Error:'+err
                    jUpdate.updateWhere = item.buildingAreaId
                    edit.countError = edit.countError + 1
                    edit.areaUpdateError = edit.areaUpdateError + 1
                    edit.editResults.push(jUpdate)
                    callback()
                  })
                })
              }else{ //conflict not insert or update DB
                // uMsg.push('แก้ไขข้อมูลพื้นที่ไม่สำเร็จ')
                edit.countError = edit.countError + 1
                edit.areaUpdateError = edit.areaUpdateError + 1
                item.editStatus = 'BadRequest:Conflict between data and editAction'
                edit.editResults.push(item)
              }
            })
            logger.info(req,cmd+'|done')
          }
        }

        // Now we have an array of functions doing async tasks
        // Execute all async tasks in the asyncTasks array
        cmd = 'checkContractBuildingTasks'
        if(util.isDataFound(asyncTasks)){
          logger.info(req,cmd+'|Have Tasks')
          let cStatus = util.isDataFound(req.body.requestData.urStatus) ? req.body.requestData.urStatus : cst.status.editContractComplete
          logger.debug(req,cmd+'|cStatus:'+cStatus+'|urStatusFound:'+util.isDataFound(req.body.requestData.urStatus))

          cmd = 'pushUpdateUrStatusTask'
          edit.countPush = edit.countPush + 1
          asyncTasks.push((callback)=>{
            let urWhere = {urId:req.body.requestData.urId, urStatus:{$ne:cStatus}}
            logger.info(req,'runUpdateUrStatusTask|urStatus:'+cStatus+'|where:'+util.jsonToText(urWhere))
            mUR.update({urStatus:cStatus},{where:urWhere}).then((succeed) => {
              // urWhere.editStatus='Updated '+succeed+' rows'
              if(succeed>0){
                edit.countSuccess = edit.countSuccess + 1
                edit.editResults.push({urId:req.body.requestData.urId, editStatus:'Updated '+succeed+' rows'})
              }else{
                // edit.countError = edit.countError + 1 //wanna return success to user cause user can't do anything about this
                edit.editResults.push({urId:req.body.requestData.urId, editStatus:'No row Update'})
              }
              callback()
            }).catch((err) => {
              // urWhere.editStatus='Update Error:'+err
              // edit.countError = edit.countError + 1 //wanna return success to user cause user can't do anything about this
              edit.editResults.push({urId:req.body.requestData.urId, editStatus:'Update Error:'+err})
              callback()
            })
          })

          cmd = 'pushInsertWorkflowTask'
          edit.countPush = edit.countPush + 1
          asyncTasks.push((callback)=>{
            let upBy = req.header('x-userTokenId') ? util.getUserName(req.header('x-userTokenId')):'system'
            let workFlowData = {urId:req.body.requestData.urId,urStatus:cStatus,updateBy:upBy}
            let wfWhere = {urId:req.body.requestData.urId, urStatus:cStatus}
            logger.info(req,'runhInsertWorkflowTask|workFlow:'+util.jsonToText(workFlowData)+'|where:'+util.jsonToText(wfWhere))
            mUrWf.findOrCreate({where:wfWhere, defaults:workFlowData})
            .spread((db,succeed) => {
              let dbClone = {}
              if(util.isDataFound(db)) dbClone.wfId = db.wfId
              if(succeed) dbClone.editStatus = 'Inserted'
              else dbClone.editStatus = 'Duplicate'
              edit.countSuccess = edit.countSuccess + 1
              edit.editResults.push(dbClone)
              callback()
            }).catch((err) => {
              // edit.countError = edit.countError + 1 //wanna return success to user cause user can't do anything about this
              workFlowData.editStatus = 'Insert Error:'+err
              edit.editResults.push(workFlowData)
              callback()
            })
          })

          cmd = 'runAsyncTasks'
          async.parallel(asyncTasks, ()=>{ // All tasks are done now
            // doSomethingOnceAllAreDone()
            if(util.isDataFound(edit)) logger.info(req,cmd+'|'+ util.jsonToText(edit))
            if(edit.countError){
              logger.error(req,cmd+'|Error while run asyncTasks|')
              if(edit.contractUpdateError&&edit.locationUpdateError
                &&(edit.areaUpdateError||edit.areaDeleteError||edit.areaInsertError)){
                if(!edit.areaUpdateError&&edit.areaDeleteError&&!edit.areaInsertError){
// error.desc_01014 = 'Contract, Lodation update and Area delete unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01014)
                  res.json(resp.getJsonError(error.code_01014,error.desc_01014,edit))
                }else if(!edit.areaUpdateError&&!edit.areaDeleteError&&edit.areaInsertError){
// error.desc_01018 = 'Contract, Lodation update and Area insert unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01018)
                  res.json(resp.getJsonError(error.code_01018,error.desc_01018,edit))
                }else{
                  // error.desc_01010 = 'Contract, Lodation and Area update unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01010)
                  res.json(resp.getJsonError(error.code_01010,error.desc_01010,edit))
                }
              }else if(edit.contractUpdateError
                &&(edit.areaUpdateError||edit.areaDeleteError||edit.areaInsertError)){
                if(!edit.areaUpdateError&&edit.areaDeleteError&&!edit.areaInsertError){
// error.desc_01013 = 'Contract udpate and Area delete unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01013)
                  res.json(resp.getJsonError(error.code_01013,error.desc_01013,edit))
                }else if(!edit.areaUpdateError&&!edit.areaDeleteError&&edit.areaInsertError){
// error.desc_01017 = 'Contract udpate and Area insert unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01017)
                  res.json(resp.getJsonError(error.code_01017,error.desc_01017,edit))
                }else{
                  // error.desc_01009 = 'Contract and Area update unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01009)
                  res.json(resp.getJsonError(error.code_01009,error.desc_01009,edit))
                }
              }else if(edit.locationUpdateError
                &&(edit.areaUpdateError||edit.areaDeleteError||edit.areaInsertError)){
                if(!edit.areaUpdateError&&edit.areaDeleteError&&!edit.areaInsertError){
// error.desc_01015 = 'Location update and Area delete unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01015)
                  res.json(resp.getJsonError(error.code_01015,error.desc_01015,edit))
                }else if(!edit.areaUpdateError&&!edit.areaDeleteError&&edit.areaInsertError){
// error.desc_01019 = 'Location update and Area insert unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01019)
                  res.json(resp.getJsonError(error.code_01019,error.desc_01019,edit))
                }else{
                  // error.desc_01011 = 'Location and Area update unsuccess'
                  logger.summary(req,cmd+'|'+error.desc_01011)
                  res.json(resp.getJsonError(error.code_01011,error.desc_01011,edit))
                }
              }else if(edit.contractUpdateError&&edit.locationUpdateError){
                logger.summary(req,cmd+'|'+error.desc_01008)
                res.json(resp.getJsonError(error.code_01008,error.desc_01008,edit))
              }else if(edit.areaDeleteError){
                logger.summary(req,cmd+'|'+error.desc_01012)
                res.json(resp.getJsonError(error.code_01012,error.desc_01012,edit))
              }else if(edit.areaUpdateError){
                logger.summary(req,cmd+'|'+error.desc_01007)
                res.json(resp.getJsonError(error.code_01007,error.desc_01007,edit))
              }else if(edit.areaInsertError){
                logger.summary(req,cmd+'|'+error.desc_01016)
                res.json(resp.getJsonError(error.code_01016,error.desc_01016,edit))
              }else if(edit.locationUpdateError){
                logger.summary(req,cmd+'|'+error.desc_01006)
                res.json(resp.getJsonError(error.code_01006,error.desc_01006,edit))
              }else if(edit.contractUpdateError){
                logger.summary(req,cmd+'|'+error.desc_01005)
                res.json(resp.getJsonError(error.code_01005,error.desc_01005,edit))
              }else{
                logger.summary(req,cmd+'|'+error.desc_01001)
                res.json(resp.getJsonError(error.code_01001,error.desc_01001,edit))
              }
            }else{
              // logger.info(req,cmd+'|'+ util.jsonToText({contractId:tContractId,result}))
              resp.getSuccess(req,res,cmd)
            }
          })
        }else{
          let err = 'Tasks not found'
          logger.summary(req,cmd+'|'+error.desc_01001+'|'+err)
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
        }
      }else{
        let err = 'Incomplete requestData'
        logger.info(req,cmd+'|'+err)
        resp.getIncompleteParameter(req,res,cmd,err)
      }
    }catch(err){
      if(util.isDataFound(edit)) logger.info(req,cmd+'|'+ util.jsonToText(edit))
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
    }
  },

  editVendorAgent: (req, res) => {
        let cmd = 'EditVendorAgent'
        try {
            let cStatus = cst.editContractComplete
            let wStatus = cst.editContractWait
            let upBy = 'system'
            let workFlowData = {
                urId: req.body.requestData.urId,
                urStatus: cStatus,
                updateBy: upBy
            }
            let asyncTasks = []
            asyncTasks.push((callback) => {
                let jWhere1 = {
                    contractId: req.body.requestData.contractId
                }
                mContract.update({
                    vendorId: req.body.requestData.vendorId
                }, {
                    where: jWhere1
                }).then((succeed) => {
                    logger.info(req, 'UpdateVendorId|Data:{\"vendorId\": \"' + req.body.requestData.vendorId + '\"}|Update complete')
                    callback(null, succeed)
                }).catch((err) => {
                    logger.error(req, 'UpdateVendorId|Data:{\"vendorId\": \"' + req.body.requestData.vendorId + '\"}|Error:' + err)
                    callback(err, null)
                })
            })
            if (util.isDataFound(req.body.requestData.contractVendorAgentList)) {
                req.body.requestData.contractVendorAgentList.forEach((vendorAgent) => {
                    if (vendorAgent.editAction == "A") {
                        vendorAgent.contractId = req.body.requestData.contractId
                        delete vendorAgent.editAction
                        asyncTasks.push((callback) => {
                            mContractAgent.create(vendorAgent).then((succeed) => {
                                logger.info(req, 'UpdateVendorAgent|Data:' + util.jsonToText(vendorAgent) + '|Create complete')
                                callback(null, succeed)
                            }).catch((err) => {
                                logger.error(req, 'UpdateVendorAgent|Data:' + util.jsonToText(vendorAgent) + '|Error:' + err)
                                callback(err, null)
                            })
                        })
                    } else if (vendorAgent.editAction == "D") {
                        let jWhere2 = {
                            contractId: req.body.requestData.contractId,
                            vendorContactId: vendorAgent.vendorContactId
                        }
                        delete vendorAgent.editAction
                        asyncTasks.push((callback) => {
                            mContractAgent.destroy({
                                where: jWhere2
                            }).then((succeed) => {
                                logger.info(req, 'UpdateVendorAgent|Data:' + util.jsonToText(vendorAgent) + '|Deleted ' + succeed + ' records')
                                callback(null, succeed)
                            }).catch((err) => {
                                logger.error(req, 'UpdateVendorAgent|Data:' + util.jsonToText(vendorAgent) + '|Error:' + err)
                                callback(err, null)
                            })
                        })
                    }
                })
            }
            asyncTasks.push((callback) => {
                let jWhere3 = {
                    urId: req.body.requestData.urId,
                    urStatus: wStatus
                }
                mUR.update({
                    urStatus: cStatus
                }, {
                    where: jWhere3
                }).then((succeed) => {
                    logger.info(req, 'PushUpdateUrStatusTasks|Data:{\"urStatus\": \"' + cStatus + '\"}|Update complete')
                    callback(null, succeed)
                }).catch((err) => {
                    logger.error(req, 'PushUpdateUrStatusTasks|Data:{\"urStatus\": \"' + cStatus + '\"}|Error:' + err)
                    callback(err, null)
                })
            })
            asyncTasks.push((callback) => {
                mUrWf.findOrCreate({
                    where: {
                        urId: req.body.requestData.urId
                    },
                    defaults: workFlowData
                }).spread((db, succeed) => {
                    if (succeed) logger.info(req, 'PushUpdateUrWfStatusTasks|Data:' + util.jsonToText(workFlowData) + '|Create complete')
                    else logger.info(req, 'PushUpdateUrWfStatusTasks|Data:' + util.jsonToText(workFlowData) + '|Create duplicate')
                    callback(null, succeed)
                }).catch((err) => {
                    logger.error(req, 'PushUpdateUrWfStatusTasks|Data:' + util.jsonToText(workFlowData) + '|Error:' + err)
                    callback(err, null)
                })
            })
            async.parallel(asyncTasks, (err, result) => {
                if (err) {
                    logger.summary(req, cmd + '|' + error.desc_01001)
                    res.json(resp.getJsonError(error.code_01001, error.desc_01001, err))
                } else {
                    resp.getSuccess(req, res, cmd)
                }
            })
        } catch (err) {
            logger.error(req, cmd + '|' + err)
            resp.getInternalError(req, res, cmd, err)
        }
    },

  editPayment: (req, res) => {
    let cmd = 'editPayment'
    let edit = {}
    try{
      if(util.isDataFound(req.body.requestData)&&util.isDataFound(req.body.requestData.contractPaymentList)
        &&util.isDataFound(req.body.requestData.contractId)&&util.isDataFound(req.body.requestData.urId)){
        let asyncTasks = [] // Array to hold async tasks
        edit.contractId = req.body.requestData.contractId
        edit.countPush = 0
        edit.countSuccess = 0
        edit.countError = 0
        edit.editResults = []

        cmd = 'pushPaymentListTasks'
        req.body.requestData.contractPaymentList.forEach((item)=>{ // Loop through some items
          if(util.isDataFound(item.contractPaymentId) && item.editAction=='D'){ //delete
            edit.countPush = edit.countPush + 1
            asyncTasks.push((callback)=>{
              mPayment.destroy({where:{contractPaymentId:item.contractPaymentId}}).then((succeed) => {
                // logger.info(req,cmd+'|deleted '+ succeed +' records')
                edit.editResults.push({contractPaymentId:item.contractPaymentId, editStatus:'Deleted '+succeed+' rows'})
                edit.countSuccess = edit.countSuccess + 1
                callback()
              }).catch((err) => {
                // logger.error(req,cmd+'|Error while delete contractPayments|'+err)
                edit.editResults.push({contractPaymentId:item.contractPaymentId, editStatus:'Delete Error:'+err})
                edit.countError = edit.countError + 1
                callback()
              })
            })
          }else if(!util.isDataFound(item.contractPaymentId) && item.editAction=='A'){
            //insert
            edit.countPush = edit.countPush + 1
            asyncTasks.push((callback)=>{
              let jInsert = JSON.parse(util.jsonToText(item))
              delete jInsert.editAction
              jInsert.contractId = edit.contractId
              mPayment.create(jInsert).then((succeed) => {
                // logger.info(req,cmd+'|deleted '+ succeed +' records')
                edit.editResults.push({contractPaymentId:succeed.contractPaymentId, editStatus:'Inserted'})
                edit.countSuccess = edit.countSuccess + 1
                callback()
              }).catch((err) => {
                jInsert.editStatus='Insert Error:'+err
                edit.editResults.push(jInsert)
                edit.countError = edit.countError + 1
                callback()
              })
            })
          }else if(util.isDataFound(item.contractPaymentId) && item.editAction=='E'){
            //update
            edit.countPush = edit.countPush + 1
            asyncTasks.push((callback)=>{
              let jUpdate = JSON.parse(util.jsonToText(item))
              delete jUpdate.editAction
              delete jUpdate.contractPaymentId
              mPayment.update(jUpdate,{where:{contractPaymentId:item.contractPaymentId}}).then((succeed) => {
                if(util.isDataFound(succeed)){
                  edit.editResults.push({contractPaymentId:item.contractPaymentId, editStatus:'Updated '+succeed+' rows'})
                  edit.countSuccess = edit.countSuccess + 1
                }else{
                  edit.countError = edit.countError + 1
                  jUpdate.where = item.contractPaymentId
                  jUpdate.editStatus='Update Error:'+succeed
                  edit.editResults.push(jUpdate)
                }
                callback()
              }).catch((err) => {
                // jUpdate.contractPaymentId = item.contractPaymentId
                jUpdate.where = item.contractPaymentId
                jUpdate.editStatus='Update Error:'+err
                edit.editResults.push(jUpdate)
                edit.countError = edit.countError + 1
                callback()
              })
            })
          }else{ //conflict not insert or update DB
            edit.countError = edit.countError + 1
            item.editStatus = 'BadRequest:Conflict between data and editAction'
            edit.editResults.push(item)
          }
        })
        logger.info(req,cmd+'|done')
        // Now we have an array of functions doing async tasks
        // Execute all async tasks in the asyncTasks array
        cmd = 'checkPaymentListTasks'
        if(util.isDataFound(asyncTasks)){
          logger.info(req,cmd+'|Have Tasks')
          let cStatus = util.isDataFound(req.body.requestData.urStatus) ? req.body.requestData.urStatus : cst.editContractComplete

          cmd = 'pushUpdateUrStatusTask'
          edit.countPush = edit.countPush + 1
          asyncTasks.push((callback)=>{
            let urWhere = {urId:req.body.requestData.urId, urStatus:{$ne:cStatus}}
            logger.info(req,'runUpdateUrStatusTask|urStatus:'+cStatus+'|where:'+util.jsonToText(urWhere))
            mUR.update({urStatus:cStatus},{where:urWhere}).then((succeed) => {
              // urWhere.editStatus='Updated '+succeed+' rows' //urId become ur_id if use this line
              if(util.isDataFound(succeed)){
                edit.countSuccess = edit.countSuccess + 1
                edit.editResults.push({urId:req.body.requestData.urId, editStatus:'Updated '+succeed+' rows'})
              }else{
                // edit.countError = edit.countError + 1
                edit.editResults.push({urId:req.body.requestData.urId, editStatus:'Update Error:'+succeed})
              }
              callback()
            }).catch((err) => {
              // urWhere.editStatus='Update Error:'+err //urId become ur_id if use this line
              edit.editResults.push({urId:req.body.requestData.urId, editStatus:'Update Error:'+err})
              // edit.countError = edit.countError + 1
              callback()
            })
          })

          cmd = 'pushInsertWorkflowTask'
          edit.countPush = edit.countPush + 1
          asyncTasks.push((callback)=>{
            let upBy = req.header('x-userTokenId') ? util.getUserName(req.header('x-userTokenId')):'system'
            let workFlowData = {urId:req.body.requestData.urId,urStatus:cStatus,updateBy:upBy}
            let wfWhere = {urId:req.body.requestData.urId, urStatus:cStatus}
            logger.info(req,'runInsertWorkflowTask|workFlow:'+util.jsonToText(workFlowData)+'|where:'+util.jsonToText(wfWhere))
            mUrWf.findOrCreate({where:wfWhere, defaults:workFlowData})
            .spread((db,succeed) => {
              let dbClone = {}
              if(util.isDataFound(db)) dbClone.wfId = db.wfId
              if(succeed) dbClone.editStatus = 'Inserted'
              else dbClone.editStatus = 'Duplicate'
              edit.editResults.push(dbClone)
              edit.countSuccess = edit.countSuccess + 1
              callback()
            }).catch((err) => {
              workFlowData.editStatus = 'Insert Error:'+err
              edit.editResults.push(workFlowData)
              // edit.countError = edit.countError + 1
              callback()
            })
          })

          cmd = 'runAsyncTasks'
          async.parallel(asyncTasks, ()=>{
            // All tasks are done now
            // doSomethingOnceAllAreDone()
            if(util.isDataFound(edit)) logger.info(req,cmd+'|'+ util.jsonToText(edit))
            if(edit.countError){
              logger.error(req,cmd+'|Error while run asyncTasks|')
              logger.summary(req,cmd+'|'+error.desc_01001)
              res.json(resp.getJsonError(error.code_01001,error.desc_01001,edit))
            }else{
              // logger.info(req,cmd+'|'+ util.jsonToText({contractId:tContractId,result}))
              resp.getSuccess(req,res,cmd,edit)
            }
          })
        }else{
          let err = 'Tasks not found'
          logger.summary(req,cmd+'|'+error.desc_01001+'|'+err)
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
        }
      }else{
        let err = 'Incomplete requestData'
        logger.info(req,cmd+'|'+err)
        resp.getIncompleteParameter(req,res,cmd,err)
      }
    }catch(err){
      if(util.isDataFound(edit)) logger.info(req,cmd+'|'+ util.jsonToText(edit))
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
    }
  },

  queryByCriteria: (req, res) => {
    let cmd = 'queryContractByCriteria'
    try{
      cmd = 'chkPaging'
      const jLimit={offset: null, limit: null}
      // console.log('jLimit : '+chalk.blue(util.jsonToText(jLimit)))
      if(Object.keys(req.query).length !=0){
        cmd = 'chkPageCount'
        // console.log(chalk.green('=========== NOT NUll ==========='))
        if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          // console.log(chalk.green('=========== isDigit ==========='))
          jLimit.offset = (req.query.page -1)*req.query.count
          jLimit.limit = parseInt(req.query.count)
        }else{
          logger.info(req,cmd+'|page or count is wrong format')
          resp.getIncompleteParameter(req,res,cmd)
          // console.log(chalk.green('=========== Invalid ==========='))
          // res.json(resp.getJsonError(error.code_00005,error.desc_00005))
        }
      }
      logger.info(req,cmd+'|'+util.jsonToText(jLimit))

      cmd = 'chkRequestBody'
      if(util.isDataFound(req.body)){
        let jWhere = {}
        cmd = 'genContractCriteria'
        if(util.isDataFound(req.body.requestData.contractCriteria)){
          logger.info(req,cmd+'|selected Contract')
          jWhere = JSON.parse(util.jsonToText(req.body.requestData.contractCriteria))
        }else{
          logger.info(req,cmd+'|default Contract with no criteria')
        }
        //add paging in to jwhere
        jWhere.offset = jLimit.offset
        jWhere.limit = jLimit.limit
        jWhere.include=[] //jWhere.include.push(value)
        let criteria={}
        let childCriteria={}

        cmd = 'chkPaymentCriteria'
        if(util.isDataFound(req.body.requestData.contractPaymentCriteria)){
          logger.info(req,cmd+'|selected Payment')
          criteria = JSON.parse(util.jsonToText(req.body.requestData.contractPaymentCriteria))
        }else{
          logger.info(req,cmd+'|default Payment with no criteria')
        }
        criteria.model=mPayment
        criteria.as=cst.models.contractPayments
        jWhere.include.push(criteria)
        
        cmd = 'chkDocumentCriteria'
        criteria = {}
        if(util.isDataFound(req.body.requestData.documentCriteria)){
          logger.info(req,cmd+'|selected Document')
          criteria = JSON.parse(util.jsonToText(req.body.requestData.documentCriteria))
        }else{
          logger.info(req,cmd+'|default Document with no criteria')
        }
        criteria.model=mDocument
        criteria.as=cst.models.documents
        jWhere.include.push(criteria)
        
        cmd = 'chkAgentCriteria'
        criteria = {}
        if(util.isDataFound(req.body.requestData.contractVendorAgentCriteria)){
          logger.info(req,cmd+'|selected Agent')
          criteria = JSON.parse(util.jsonToText(req.body.requestData.contractVendorAgentCriteria))
        }else{
          logger.info(req,cmd+'|default Agent with no criteria')
        }
        if(util.jsonToText(criteria.attributes)!='[]'){ //Error if not check => Cannot set property 'contractVendorAgent' of undefined
          criteria.through={model:mContractAgent, as:cst.models.agent, attributes:[]}
          criteria.model=mVendorContact
          criteria.as=cst.models.contractAgents
          jWhere.include.push(criteria)
        }
        
        cmd = 'chkVenderCriteria'
        criteria = {}
        childCriteria={}
        if(util.isDataFound(req.body.requestData.vendorCriteria)){
          logger.info(req,cmd+'|selected Vender')
          if(util.isDataFound(req.body.requestData.vendorCriteria.contactCriteria)){
            logger.info(req,cmd+'|selected Contact')
            childCriteria = JSON.parse(util.jsonToText(req.body.requestData.vendorCriteria.contactCriteria))
          }
          
          delete req.body.requestData.vendorCriteria.contactCriteria
          criteria = JSON.parse(util.jsonToText(req.body.requestData.vendorCriteria))
        }else{
          logger.info(req,cmd+'|default Vender with no criteria')
        }
        criteria.model=mVendorProfile
        criteria.as=cst.models.vendorProfile
        criteria.required = true
        if(util.jsonToText(criteria.attributes)!='[]'){ //Error if not check => Cannot set property 'vendorContactList' of undefined
          childCriteria.model=mVendorContact
          childCriteria.as=cst.models.vendorContacts
          criteria.include=childCriteria
        }
        jWhere.include.push(criteria)
        // jWhere.include.push({model: mVendorProfile, as:cst.models.vendorProfile, criteria,
        //   include:{model:mVendorContact, as:cst.models.vendorContacts, childCriteria}})

        cmd = 'chkLocationCriteria'
        criteria = {}
        childCriteria={}
        if(util.isDataFound(req.body.requestData.locationCriteria)){
          logger.info(req,cmd+'|selected Location')
          if(util.isDataFound(req.body.requestData.locationCriteria.areaCriteria)){
            logger.info(req,cmd+'|selected Area')
            childCriteria = JSON.parse(util.jsonToText(req.body.requestData.locationCriteria.areaCriteria))
          }
          delete req.body.requestData.locationCriteria.areaCriteria
          criteria = JSON.parse(util.jsonToText(req.body.requestData.locationCriteria))
        }else{
          logger.info(req,cmd+'|default Location with no criteria')
        }
        if(util.jsonToText(criteria.attributes)!='[]'){
          criteria.through={model:mArea, as:cst.models.area, attributes:[]}
          criteria.model=mLocation
          criteria.as=cst.models.locations
          criteria.required = true
          childCriteria.model=mArea
          childCriteria.as=cst.models.locationAreas
          criteria.include=childCriteria
          jWhere.include.push(criteria)
        }
        // jWhere.include.push({model: mLocation, as:cst.models.locations, criteria,
        //   through:{model:mArea, as:cst.models.area, attributes:[]}, 
        //   // through:{model:mArea, as:cst.models.area}, criteria,
        //   include:{model:mArea, as:cst.models.locationAreas, childCriteria}
        // })


        cmd = 'jWhere'
        logger.info(req,cmd+'|searchOptions:'+util.jsonToText(jWhere))
        cmd = 'findContracts'
        // mContract.findAndCountAll({include:[
        //   {model: mVendorProfile, as: 'vendorProfile', where:{vendorName1:'SC Asset'},
        //     include:{model:mVendorContact, as:'vendorContactList'}},
        //   {model: mPayment, as: 'contractPaymentList'},
        //   {model: mDocument, as: 'documentList'},
        //   {model: mLocation, as:'buildingLocationList', //where:{buildingName:'ชินวัตร1'} ,
        //     include:{model:mArea, as:'buildingAreaList'}, //where: {buildingAreaId: 2}},
        //     through: {
        //       // where: {buildingAreaId: 2},
        //       attributes: [],
        //       model:mArea, as:'area'
        //     }
        //   }
        // ]})
        // mContract.findAndCountAll({include:[{all:true,nested:true}]})
        mContract.findAndCountAll(jWhere)
        .then((db) => {
          cmd = 'chkContractData'
          logger.query(req,cmd+'|'+util.jsonToText(db))
          if(db.count>0) resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"contractList":db.rows})
          else{
            logger.summary(req,cmd+'|Not Found Contract')
            res.json(resp.getJsonError(error.code_01003,error.desc_01003,db))
          }
        }).catch((err) => {
          logger.error(req,cmd+'|Error while check Contract return|'+err)
          logger.summary(req,cmd+'|'+error.desc_01002)
          res.json(resp.getJsonError(error.code_01002,error.desc_01002,err))
        })

      }else{
        logger.info(req,cmd+'|Not Found requestData|')
        resp.getIncompleteParameter(req,res,cmd)
      }
    }catch(err){
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
    }
  },

  queryById: (req, res) => {
    let cmd = 'queryContractById'
    try{
      cmd = 'findContract'
      mContract.findOne({where:{contractId:req.params.contractId},
        include:[
          {model:mPayment, as:cst.models.contractPayments},
          {model:mDocument, as:cst.models.documents},
          {through:{model:mContractAgent, as:cst.models.agent, attributes:[]},
            model:mVendorContact, as:cst.models.contractAgents},
          {model:mVendorProfile, as:cst.models.vendorProfile,
            include:{model:mVendorContact, as:cst.models.vendorContacts}},
          {through:{model:mArea, as:cst.models.area, attributes:[]},
            model:mLocation,
            as:cst.models.locations,
            include:{model:mArea, as:cst.models.locationAreas,where:{contractId:req.params.contractId}}} 
        ]})
      .then((db) => {
        cmd = 'chkContractData'
        logger.query(req,cmd+'|'+util.jsonToText(db))
        if(util.isDataFound(db)) resp.getSuccess(req,res,cmd,db)
        else{
          logger.summary(req,cmd+'|Not Found Contract')
          res.json(resp.getJsonError(error.code_01003,error.desc_01003,db))
        }
      }).catch((err) => {
        logger.error(req,cmd+'|'+err)
        logger.summary(req,cmd+'|'+error.desc_01002)
        res.json(resp.getJsonError(error.code_01002,error.desc_01002,err))
      })
    }catch(err){
      logger.error(req,cmd+'|'+err)
      resp.getInternalError(req,res,cmd,err)
    }
  }
}

module.exports = contract

/************************
{
    "requestData": {
        "contractCriteria": {
          "where":{
            "contractStatus": "ACTIVE",
            "contractNo": "1234/5"
          }
        },
        "locationCriteria": {
          "where":{

          },
          "attributes":[],
          "areaCriteria":{
            "where":{

            },
            "attributes":[]
          }


        },
        "vendorCriteria": {
          "where":{
            "vendorType":"BUY"
          },
          "attributes":[],
          "contactCriteria":{
            "where":{

            },
            "attributes":[]
          }
        },
        "contractVendorAgentCriteria":{},
        "contractPaymentCriteria": {
          "where":{

          }  
        },
        "documentCriteria": {
          "where":{
            "vendorType":"BUY"
          }  
        }
    }
}

****************************/
