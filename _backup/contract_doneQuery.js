'use strict'

const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const logger = require('../utils/logUtils');
const jsUtil = require('util');
const error = require('../config/error');
const cst = require('../config/constant');
const mContract = require('../models/mContract');
const mVendorProfile = require('../models/mVendorProfile');
const mVendorContact = require('../models/mVendorProfileContact');
const mLocation = require('../models/mBuildingLocation');
const mArea = require('../models/mBuildingArea');
const mDocument = require('../models/mDocument');
const mPayment = require('../models/mContractPayment');
const mContractAgent = require('../models/mContractAgent');

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
  add: (req, res) => {
    let cmd = 'addContract';
    try{
      cmd = 'chkVendorProfileExisting';
      let jWhere = {vendorType:req.body.requestData.vendorProfile.vendorType, vendorName1:req.body.requestData.vendorProfile.vendorName1};
      logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      mVendorProfile.findOne({where:jWhere,attributes:['vendorId']}).then((db) => {
        logger.info(req,cmd+'|'+JSON.stringify(db));

        if(util.isDataFound(db)){ //already have vendor use old data
          logger.info(req,cmd+'|'+error.desc_01004);
          req.body.requestData.vendorId = db.vendorId; //link old vendor with contract
          delete req.body.requestData.vendorProfile; //delete new vendor data
        }
        let cloneLocation = JSON.parse(JSON.stringify(req.body.requestData.buildingLocation));
        delete req.body.requestData.buildingLocation; //delete Location
        cmd = 'insertContractList';
        jWhere = {contractNo:req.body.requestData.contractNo, contractDate:req.body.requestData.contractDate};
        logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
        mContract.findOrCreate({where:jWhere, defaults:req.body.requestData, include:[
          {model: mVendorProfile, as:cst.models.vendorProfile,
            include:{model:mVendorContact, as:cst.models.vendorContacts}},
          {model: mPayment, as:cst.models.contractPayments},
          {model: mDocument, as:cst.models.documents}
          // {model: mLocation, as:'buildingLocation',through:{model:mArea, as:'buildingAreaList'}}
        ]})
        .spread((db,succeed) => {
          logger.info(req,cmd+'|Inserted:'+succeed+'|'+JSON.stringify(db))
          if(succeed){ //contract inserted
            //check and add location here!!!
            cmd = 'insertLocation';
            let cloneDb = JSON.parse(JSON.stringify(db))
            //add contractId to areaList
            cloneLocation.buildingAreaList.forEach((value) => {value.contractId=db.contractId})
            jWhere={buildingName:cloneLocation.buildingName, buildingNo:cloneLocation.buildingNo}
            logger.info(req,cmd+'|where:'+JSON.stringify(jWhere))
            logger.info(req,cmd+'|Location:'+JSON.stringify(cloneLocation))
            mLocation.findOrCreate({where:jWhere, defaults:cloneLocation,
              include:[{model: mArea, as:cst.models.locationAreas}]})
            .spread((db,succeed) => {
              logger.info(req,cmd+'|Inserted:'+succeed+'|'+JSON.stringify(db));
              cloneDb.buildingLocation = JSON.parse(JSON.stringify(db));
              if(succeed){ //Location inserted
                return resp.getSuccess(req,res,cmd,cloneDb)
              }else{ //Location exist add Area
                logger.info(req,cmd+'|'+error.desc_01004)
                cmd = 'insertAreaList'
                cloneLocation.buildingAreaList.forEach((value) => {value.buildingId=db.buildingId});
                logger.info(req,cmd+'|AreaList:'+JSON.stringify(cloneLocation.buildingAreaList));
                mArea.bulkCreate(cloneLocation.buildingAreaList, {validate:true})
                .then((succeed) => {
                  logger.info(req,cmd+'|Inserted:'+JSON.stringify(succeed))
                  //too lazy too query area again so just return contract
                  delete cloneDb.buildingLocation.buildingAreaList //delete areaList from other contract
                  return resp.getSuccess(req,res,cmd,cloneDb)
                }).catch((err) => {
                  logger.error(req,cmd+'|Error while create AreaList|'+err)
                  logger.summary(req,cmd+'|'+error.desc_01001);
                  res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
                })
              }
            }).catch((err) => {
              logger.error(req,cmd+'|Error while create Location|'+err)
              logger.summary(req,cmd+'|'+error.desc_01001)
              res.json(resp.getJsonError(error.code_01001,error.desc_01001,err))
            })
          }else{ //contract existed don't add location list
            logger.info(req,cmd+'|'+error.desc_01004);
            logger.summary(req,cmd+'|'+error.desc_01004);
            res.json(resp.getJsonError(error.code_01004,error.desc_01004,db));
          }
        }).catch((err) => {
            logger.error(req,cmd+'|Error while create contractList|'+err);
            logger.summary(req,cmd+'|'+error.desc_01001);
            res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
        })
      }).catch((err) => {
          logger.error(req,cmd+'|Error while check venderProfile|'+err);
          logger.summary(req,cmd+'|'+error.desc_01001);
          res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      })
    }catch(err){
      logger.error(req,cmd+'|'+err);
      resp.getInternalError(req,res,cmd,err);
    }
  },

  editLocation: (req, res) => {
    let cmd = 'editLocation';
    try{
 
 return resp.getSuccess(req,res,cmd);
      // const jWhere = {urId:req.body.requestData.urId};
      // delete req.body.requestData.urId;
      // cmd = 'updateUR';
      // logger.info(req,cmd+'|where:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null})+'|set:'+jsUtil.inspect(req.body.requestData, {showHidden: false, depth: null}));
      // mUR.update(req.body.requestData, { where: jWhere }).then((succeed) => {
      //   logger.info(req,cmd+'|updated '+ succeed +' rows');
      //   return resp.getSuccess(req,res,cmd);
      // }).catch((err) => {
      //   logger.error(req,cmd+'|Error while update UR|'+err);
      //   logger.summary(req,cmd+'|'+error.desc_01001);
      //   res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      //   // logger.error(req,cmd+'|Error when query or delete|'+err);
      //   // return resp.getInternalError(req,res,cmd,err);
      // });


      cmd = 'asyncTasks';
      // Array to hold async tasks
      let asyncTasks = [];
       
      // Loop through some items
      items.forEach((item)=>{
        // We don't actually execute the async action here
        // We add a function containing it to an array of "tasks"
        asyncTasks.push((callback)=>{
          // Call an async function, often a save() to DB
          item.someAsyncCall(()=>{
            // Async call is done, alert via callback
            callback();
          });
        });
      });

      // To move beyond the iteration example, let's add
      // another (different) async task for proof of concept
      asyncTasks.push((callback)=>{
        // Set a timeout for 3 seconds
        setTimeout(()=>{
          // It's been 3 seconds, alert via callback
          callback();
        }, 3000);
      });
       
      // Now we have an array of functions doing async tasks
      // Execute all async tasks in the asyncTasks array
      async.parallel(asyncTasks, ()=>{
        // All tasks are done now
        doSomethingOnceAllAreDone()
      })



    }catch(err){
      logger.error(req,cmd+'|'+err);
      resp.getInternalError(req,res,cmd,err);
    }
  },

  editVendor: (req, res) => {
    let cmd = 'editVendor';
    try{
 
 return resp.getSuccess(req,res,cmd);


    }catch(err){
      logger.error(req,cmd+'|'+err);
      resp.getInternalError(req,res,cmd,err);
    }
  },

  queryByCriteria: (req, res) => {
    let cmd = 'queryContractByCriteria'
    try{
      cmd = 'chkPaging'
      const jLimit={offset: null, limit: null}
      // console.log('jLimit : '+chalk.blue(JSON.stringify(jLimit)));
      if(Object.keys(req.query).length !=0){
        cmd = 'chkPageCount'
        // console.log(chalk.green('=========== NOT NUll ==========='));
        if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          // console.log(chalk.green('=========== isDigit ==========='));
          jLimit.offset = (req.query.page -1)*req.query.count
          jLimit.limit = parseInt(req.query.count)
        }else{
          logger.info(req,cmd+'|page or count is wrong format')
          return resp.getIncompleteParameter(req,res,cmd)
          // console.log(chalk.green('=========== Invalid ==========='));
          // return res.json(resp.getJsonError(error.code_00005,error.desc_00005));
        }
      }
      logger.info(req,cmd+'|'+JSON.stringify(jLimit))

      cmd = 'chkRequestBody'
      if(util.isDataFound(req.body)){
        let jWhere = {};
        cmd = 'genContractCriteria'
        if(util.isDataFound(req.body.requestData.contractCriteria)){
          logger.info(req,cmd+'|selected Contract')
          jWhere = JSON.parse(JSON.stringify(req.body.requestData.contractCriteria))
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
          criteria = JSON.parse(JSON.stringify(req.body.requestData.contractPaymentCriteria))
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
          criteria = JSON.parse(JSON.stringify(req.body.requestData.documentCriteria))
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
          criteria = JSON.parse(JSON.stringify(req.body.requestData.contractVendorAgentCriteria))
        }else{
          logger.info(req,cmd+'|default Agent with no criteria')
        }
        if(JSON.stringify(criteria.attributes)!='[]'){ //Error if not check => Cannot set property 'contractVendorAgent' of undefined
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
            childCriteria = JSON.parse(JSON.stringify(req.body.requestData.vendorCriteria.contactCriteria))
          }
          
          delete req.body.requestData.vendorCriteria.contactCriteria
          criteria = JSON.parse(JSON.stringify(req.body.requestData.vendorCriteria))
        }else{
          logger.info(req,cmd+'|default Vender with no criteria')
        }
        criteria.model=mVendorProfile
        criteria.as=cst.models.vendorProfile
        if(JSON.stringify(criteria.attributes)!='[]'){ //Error if not check => Cannot set property 'vendorContactList' of undefined
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
            childCriteria = JSON.parse(JSON.stringify(req.body.requestData.locationCriteria.areaCriteria))
          }
          delete req.body.requestData.locationCriteria.areaCriteria
          criteria = JSON.parse(JSON.stringify(req.body.requestData.locationCriteria))
        }else{
          logger.info(req,cmd+'|default Location with no criteria')
        }
        if(JSON.stringify(criteria.attributes)!='[]'){
          criteria.through={model:mArea, as:cst.models.area, attributes:[]}
          criteria.model=mLocation
          criteria.as=cst.models.locations
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
        logger.info(req,cmd+'|searchOptions:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null}))
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
          logger.query(req,cmd+'|'+JSON.stringify(db))
          if(db.count>0) return resp.getSuccess(req,res,cmd,{"totalRecord":db.count,"contractList":db.rows})
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
        return resp.getIncompleteParameter(req,res,cmd)
      }
    }catch(err){
      logger.error(req,cmd+'|'+err);
      return resp.getInternalError(req,res,cmd,err)
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
