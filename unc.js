'use strict'
let bufferedSpawn = require('buffered-spawn')

function parseDriveLetter(str) {
    console.log("stdout: " + str)
    const re = /([A-Z]):/
    if (re.test(str)) {
        return re.exec(str)[0]
    } else {
        return null
    }
}
//let args = ['use', '*', '\\\\10.104.246.10\\sht_bld']
let args = ['use', '\\\\10.104.246.10\\sht_bld']
args.push('/user:CORP-AIS900\\nas_bld')
args.push('nas2016bld')
bufferedSpawn('net', args).then((io) => {
    console.log(io.stdout);
    console.log(io.stderr);
    args = ['\\\\10.104.246.10\\sht_bld\\mapdrive3.bat']
    bufferedSpawn('more', args).then((io) => {
        console.log(io.stdout);
        console.log(io.stderr);
    }, (err) => {
        // Both stdout and stderr are also set on the error object 
        console.error(`Command failed with error code of #${err.status}`);
        console.error(err);
    });
}, (err) => {
    // Both stdout and stderr are also set on the error object 
    console.error(`Command failed with error code of #${err.status}`);
    console.error(err);
});