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

// Error Code DB
error.code_01001 = '01001';
error.desc_01001 = 'Unsuccess data update.';
error.code_01002 = '01002';
error.desc_01002 = 'Query error.';
error.code_01003 = '01003';
error.desc_01003 = 'Data not found.';
error.code_01004 = '01004';
error.desc_01004 = 'Data already exist.';



//=================OLD=================
// Error Code Internal
error.err_bms00001 = 'BMS00001';
error.err_bms00002 = 'BMS00002';
error.err_bms00003 = 'BMS00003';
error.err_bms00004 = 'BMS00004';
error.err_bms00005 = 'BMS00005';
error.err_bms00006 = 'BMS00006';
error.err_bms00007 = 'BMS00007';
error.err_bms00008 = 'BMS00008';
error.err_bms00009 = 'BMS00009';

error.desc_bms00001 = 'Wrong user or passowrd.';
error.desc_bms00002 = 'Invalid user token ID.';
error.desc_bms00003 = 'Internal exception error.';
error.desc_bms00004 = 'Unknow URL.';
error.desc_bms00005 = 'Incomplete parameter.';
error.desc_bms00006 = 'aaaaaaaaaaa.';
error.desc_bms00007 = 'aaaaaa';
error.desc_bms00008 = 'aaaaa';
error.desc_bms00009 = 'aaaaaaa';

// Error Code DB
error.err_db00001 = 'DB00001';
error.err_db00002 = 'DB00002';
error.err_db00003 = 'DB00003';
error.err_db00004 = 'DB00004';

error.desc_db00001 = 'Unsuccess data update.';
error.desc_db00002 = 'Query error.';
error.desc_db00003 = 'Data not found.';
error.desc_db00004 = 'Data already exist.';
