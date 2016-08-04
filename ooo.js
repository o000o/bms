const util = require('./utils/bmsUtils')

        try{
            var body = 002
            if(body) console.log('T')
            else console.log('F')
            // var body = {}
            // if(util.isDataFound(body.requestData.contractPaymentList)) console.log('T')
            // else console.log('F')
            // // var buildingId = 1
            // // var tbuildingId = util.isDataFound(buildingId) ? buildingId : null
            // // console.log(tbuildingId)
            // var regDigit=/[0-9]/
            // var resObj=10
            // if(resObj) console.log('T')
            // else console.log('F')
            // console.log(resObj.length)
            // if(resObj==null || resObj=='undefined' || resObj==''){
            //     console.log('first false')
            // }else{
            //     if(resObj.length) console.log('length true')
            //     else {
            //         if (JSON.stringify(resObj).length>2) console.log('stringify length>2 true')
            //         else if(/[0-9]/.test(resObj)) console.log('regDigit true')
            //         else if(/[a-z],[A-Z]/.test(resObj)) console.log('alphabet true')
            //         else console.log('stringify length>2 false')
            //     }
            // }
        }catch(err){
            // logger.error('bmsUtils|idDataFound|'+err);
            // return false;
            console.log('catch false:' + err)
            // if (JSON.stringify(resObj).length>2) console.log('true')
            // else console.log('stringify length>2 false')
        }
