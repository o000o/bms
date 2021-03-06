var soap = require('soap-ntlm-2')
var parser = require('xml2js').Parser()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

var options = {
    wsdl_options: {
        ntlm: true,
        username: "omws_stg",
        password: "OM@stg!#2014",
        domain: "corp-ais900dev"
    }
}

var args = {OmCode:'OMTESTBMS',CompanyCode:'AIS',OrgDescOrOrgCode:'A'}
// var args ={"OmCode":"OMTESTBMS","Username":"Signature verification failed"}
soap.createClient(__dirname + '/config/om.wsdl', options, (err, client, body)=>{
    if (err) {
        console.log(err)
    }else{
        client.setSecurity(new soap.NtlmSecurity(options.wsdl_options))
        client.OM_WS_SearchOrgInfo(args, (err, result)=>{
          if(err){
            console.error(err)
          }else{
            parser.parseString(result.OM_WS_SearchOrgInfoResult, (err, dataJsonStr)=>{
              console.log(dataJsonStr.NewDataSet.Permission[0].MsgDetail[0]) // Get Status Success
              console.log(dataJsonStr.NewDataSet)
              console.log(dataJsonStr.NewDataSet.Permission[0].MsgStatus[0])
              // console.log(dataJsonStr.NewDataSet.Table[0].APPROVAL_EMAIL[0]) // Get Email
              // console.log(dataJsonStr.NewDataSet.Table[0])
            })
          }
        }, {timeout: 10000}) //10 Sec
    }
})