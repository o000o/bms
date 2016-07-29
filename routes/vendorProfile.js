'use strict'

const logger = require('../utils/logUtils');
const resp = require('../utils/respUtils');
const util = require('../utils/bmsUtils');
const jsUtil = require('util');
const error = require('../config/error');
const cst = require('../config/constant');
const mVendorProfile = require('../models/mVendorProfile');
const mVendorContact = require('../models/mVendorProfileContact');

const vendorProfile = {

  add: (req, res) => {
	let cmd = 'addVendorProfile';
	try{	
		let jWhere = {vendorType: req.body.requestData.vendorType, vendorName1: req.body.requestData.vendorName1};
		logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
		mVendorProfile.findOrCreate({where:jWhere, 
			defaults:req.body.requestData,
  			include: [{model: mVendorContact, as:'vendorContactList'}]
		}).spread((db,succeed) => {
			logger.info(req,cmd+'|add VendorProfile complete');
  			return resp.getSuccess(req,res,cmd,db);
		}).catch((err) => {
    			logger.error(req,cmd+'|Error when create mVendorProfile|'+err);
    			logger.summary(req,cmd+'|'+error.desc_01001);
    			res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
		})
	}catch(err){                          
      		logger.error(req,cmd+'|'+err);
      		return resp.getInternalError(req,res,cmd,err);
    	}  
  },

  edit: (req, res) => {
        let cmd = 'updateVendorProfile';
        try{
                let jWhere = {vendorId: req.body.requestData.vendorId};
      		logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
                mVendorProfile.update(req.body.requestData, {where:jWhere}).then((succeed) => {
			logger.info(req,cmd+'|update VendorProfile complete');
                        return resp.getSuccess(req,res,cmd);
                }).catch((err) => {
                        logger.error(req,cmd+'|Error when update mVendorProfile|'+err);
                        logger.summary(req,cmd+'|'+error.desc_01001);
                        res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
                })
        }catch(err){        
                logger.error(req,cmd+'|'+err);
                return resp.getInternalError(req,res,cmd,err);
        }       
  },

  delete: (req, res) => {
	let cmd = 'deleteVendorProfile';
    	try{
      		let jWhere = {vendorId:req.params.vendorId};
      		logger.info(req,cmd+'|where:'+JSON.stringify(jWhere));
      		cmd = 'destroyVendorProfile';
      		mVendorProfile.destroy({where:jWhere}).then((succeed) => {
        		logger.info(req,cmd+'|deleted '+ succeed +' records');
        		return resp.getSuccess(req,res,cmd);
      		}).catch((err) => {
        		logger.error(req,cmd+'|Error while delete VendorProfile|'+err);
        		logger.summary(req,cmd+'|'+error.desc_01001);
        		res.json(resp.getJsonError(error.code_01001,error.desc_01001,err));
      		});
    	}catch(err){
      		logger.error(req,cmd+'|'+err);
      		return resp.getInternalError(req,res,cmd,err);
    	}
  },

  queryByCriteria: (req, res) => {
	let cmd = 'queryVendorProfileByCriteria';
    	try{
		cmd = 'chkPaging';
      		const jLimit={offset: null, limit: null};
      		if(Object.keys(req.query).length !=0){
        		cmd = 'chkPageCount';
        		if(util.isDigit(req.query.page) && util.isDigit(req.query.count)){
          			jLimit.offset = (req.query.page -1)*req.query.count;
          			jLimit.limit = parseInt(req.query.count);
        		}else{
          			logger.info(req,cmd+'|page or count is wrong format');
          			return resp.getIncompleteParameter(req,res,cmd);
        		}
      		}
      		logger.info(req,cmd+'|'+JSON.stringify(jLimit));

		let jWhere = {};
		//add paging in to jwhere
        	jWhere.offset = jLimit.offset;
        	jWhere.limit = jLimit.limit

        	cmd = 'genWhere';
        	if(util.isDataFound(req.body.requestData.vendorCriteria)){
        		logger.info(req,cmd+'|gen vendorCriteria');
          		jWhere = req.body.requestData.vendorCriteria;
        	}else{
          		logger.info(req,cmd+'|default VendorProfile with no criteria');
        	}
	        if(util.isDataFound(req.body.requestData.vendorContactCriteria)){
          		logger.info(req,cmd+'|gen vendorContactCriteria');
          		req.body.requestData.vendorContactCriteria.model=mVendorContact;
          		req.body.requestData.vendorContactCriteria.as=cst.models.vendorContacts;
          		if(!util.isDataFound(req.body.requestData.vendorContactCriteria.attributes)&&JSON.stringify(req.body.requestData.vendorContactCriteria.attributes)!='[]'){
            			logger.info(req,cmd+'|default vendorContact with no attributes');
            			req.body.requestData.vendorContactCriteria.attributes={exclude:['vendorId'] };
          		}else{
            			logger.info(req,cmd+'|selected vendorContact attributes');
          		}
          		jWhere.include = req.body.requestData.vendorContactCriteria;
        	}else{
          		logger.info(req,cmd+'|default vendorContact with no criteria');
          		jWhere.include = [{model:mVendorContact, as:cst.models.vendorContacts,required: false,attributes: { exclude: ['vendorId'] }}];
        	}
		logger.info(req,cmd+'|searchOptions:'+jsUtil.inspect(jWhere, {showHidden: false, depth: null}));
		cmd = 'findVendorProfile';
        	mVendorProfile.findAndCountAll(jWhere).then((db) => {
          		cmd = 'chkVendorProfileData';
          		logger.info(req,cmd+'|'+JSON.stringify(db));
          		if(db.count>0){
            			logger.info(req,cmd+'|Found VendorProfile');
            			return resp.getSuccess(req,res,cmd,{"totalRecord":db.count, "vendorProfileList":db.rows});
          		}else{
            			logger.summary(req,cmd+'|Not Found VendorProfile');
            			res.json(resp.getJsonError(error.code_01003,error.desc_01003,db));
          		}
        	}).catch((err) => {
          		logger.error(req,cmd+'|Error while check VendorProfile return|'+err);
          		logger.summary(req,cmd+'|'+error.desc_01002);
          		res.json(resp.getJsonError(error.code_01002,error.desc_01002,err));
        	});
	}catch(err){
      		logger.error(req,cmd+'|'+err);
      		return resp.getInternalError(req,res,cmd,err);
    	}
  }

};

module.exports = vendorProfile;
