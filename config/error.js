'use strict'

const error = module.exports = {};

// Error Code Success
error.code_00000 = '00000';
error.desc_00000 = 'Success.';
// error.desc_00000_login = 'Login success.';
// error.desc_00000_logout = 'Logout success.';
// error.desc_00000_logout = 'ออกจากระบบสำเร็จ';

// Error Code Internal
error.code_00001 = '00001';
error.desc_00001 = 'Wrong user or passowrd.';
error.code_00002 = '00002';
error.desc_00002 = 'Invalid user token ID.';
error.code_00003 = '00003';
error.desc_00003 = 'Internal exception error.';
error.code_00004 = '00004';
error.desc_00004 = 'Unknow URL.';
error.code_00005 = '00005';
error.desc_00005 = 'Incomplete parameter.';
error.code_00006 = '00006';
error.desc_00006 = 'Token expire.';

// Error Code DB
error.code_01001 = '01001';
error.desc_01001 = 'Unsuccess data update.';
error.code_01002 = '01002';
error.desc_01002 = 'Query error.';
error.code_01003 = '01003';
error.desc_01003 = 'Data not found.';
error.code_01004 = '01004';
error.desc_01004 = 'Data already exist.';