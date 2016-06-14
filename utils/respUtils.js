
exports.getJsonError = (errCode, errMsg) => {
	return { responseStatus: { responseCode: errCode, responseMessage: errMsg}};
}

/*exports.getJsonError = (errCode) => {
	return { responseStatus: { responseCode: errCode}};
}*/

exports.getJsonSuccess = (errCode, errMsg, resObj) => {
	return { responseStatus: { responseCode: errCode, responseMessage: errMsg}, responseData : resObj};
}

// exports.getJsonDataFound = (resObj, intTotal) => {
// 	// return { responseStatus: { responseCode: errCode, responseMessage: errMsg}, responseData : resObj};

//     if(util.chkDataFound(resObj)) return getJsonSuccess(error.err_00000,error.desc_00000,{"totalRecord":intTotal,"userRequestList":resObj}));
//     else return getJsonSuccess(error.err_db00003,error.desc_db00003);
// }