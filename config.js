/**
 * 全局配置文件
 * @author      liufeng.clf
 * @date        2014/12/1
 */

//set ext file and expire time
exports.Expires = {

    fileMatch: /^(gif|png|jpg|js|css)$/ig,

    maxAge: 606024365

};

// set compress type, image is no need for compress
exports.Compress = {

    match: /css|js|html/ig

};
