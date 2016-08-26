'use strict'
const logger = require('../utils/logUtils')
const async = require('async')
const request = require('request')
const fs = require('fs')
const resp = require('../utils/respUtils')
const util = require('../utils/bmsUtils')
const jsUtil = require('util')
const error = require('../config/error')
const cfg = require('../config/config')
const document = {
    download: (req, res) => {
        let cmd = 'DownloadDocument'
        try {
            if (!req.params.fileName) {
                logger.error(req, cmd + '|Error:' + error.desc_00005)
                return resp.getIncompleteParameter(req, res, cmd)
            }
            let options = {
                method: 'POST',
                url: cfg.archiving.authenURL,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    authorization: 'Basic ' + new Buffer(cfg.archiving.username + ":" + cfg.archiving.password).toString("base64")
                },
                form: {
                    object_url: encodeURI(cfg.archiving.objectURL + req.params.fileName),
                    expire: cfg.archiving.expireToken,
                    client_ip: cfg.archiving.clientIP
                }
            }
            cmd = 'ArchivingAuthen'
            logger.info(req, cmd + '|Request: ' + JSON.stringify(options))
            console.log('|Request: ' + JSON.stringify(options))
            request(options, (error, response, result) => {
                if (error) {
                    logger.error(req, cmd + '|Error: ' + error)
                    logger.summary(req, cmd + '|' + error.desc_02001)
                    res.json(resp.getJsonError(error.code_02001, error.desc_02001))
                } else {
                    let json = JSON.parse(result)
                    if (json.status == 'success') {
                        options = {}
                        options = {
                                method: 'GET',
                                url: cfg.archiving.downloadURL,
                                qs: {
                                    file: encodeURI(cfg.archiving.objectURL + req.params.fileName),
                                    token: json.token
                                },
                                headers: {
                                    authorization: 'Basic ' + new Buffer(cfg.archiving.username + ":" + cfg.archiving.password).toString("base64")
                                }
                            }

                        let data = []
                        let header = {}

                        cmd = 'Download'
                        logger.info(req, cmd + '|Request: ' + JSON.stringify(options))

                        request(options).on('response', function(response) {
                                header.statusCode = response.statusCode
                                header.contentType = response.headers['content-type']
                                header.contentDisposition = response.headers['content-disposition']
                            }).on('error', function(err) {
                                logger.error(req, cmd + '|Error: ' + error)
                                logger.summary(req, cmd + '|' + error.desc_02003)
                                res.json(resp.getJsonError(error.code_02003, error.desc_02003))
                            }).on('data', function(content) {
                                data.push(content);
                            }).on('end', function() {
                              logger.summary(req,cmd+'|Success')
                                data = Buffer.concat(data);
                                res.writeHead(header.statusCode, {
                                    'Content-Type': header.contentType,
                                    'Content-Disposition': header.contentDisposition,
                                    'Content-Length': data.length
                                });
                                res.end(data)
                            })
                    } else {
                        logger.error(req, cmd + '|Error: ' + result.status)
                        logger.summary(req, cmd + '|' + error.desc_02002)
                        res.json(resp.getJsonError(error.code_02002, error.desc_02002))
                    }
                }
            })
        } catch (err) {
            logger.error(req, cmd + '|Error:' + err)
            return resp.getInternalError(req, res, cmd, err)
        }
    }
}
module.exports = document