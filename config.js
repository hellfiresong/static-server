/**
The MIT License (MIT)

Copyright (c) 2014 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

 * 全局配置文件
 * @ author      hellfire
 * @ date        2014/12/1
 */

//set ext file and expire time
exports.Expires = {

    fileMatch: /^(gif|png|jpg|js|css)$/ig,

    maxAge: 606024365

};

// set compress file type, image is no need for compress
exports.Compress = {

    match: /css|js|html/ig

};