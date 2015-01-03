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

 * 功能：实现了Node版的静态服务器
 * 实现了缓存，gzip压缩等
 * @ author      hellfire
 * @ date        2014/12/1
 */

 // 设置端口号
var PORT = 8000;

// 引入模块
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

// 引入文件
var mime = require('./mime').types;
var config = require('./config');
var server = http.createServer(function (req, res) {
	res.setHeader("Server","Node/V8");
	// 获取文件路径
	var pathName = url.parse(req.url).pathname;
	if(pathName.slice(-1) === "/"){
        pathName = pathName + "index.html";   //默认取当前默认下的index.html
    }
	// 安全处理（当使用Linux 的 curl命令访问时，存在安全隐患）
	var realPath = path.join("assert", path.normalize(pathName.replace(/\.\./g, "")));
	// 检查文件路径是否存在
	fs.exists(realPath, function(exists) {
		// 当文件不存在时的情况， 输出一个404错误
		if (!exists) {
			res.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});
			res.write("The request url" + pathName +" is not found!");
			res.end();
		} else {                      // 当文件存在时的处理逻辑
			fs.stat(realPath, function(err, stat) {
                            // 获取文件扩展名
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : "unknown";
                var contentType = mime[ext] || "text/plain";
                // 设置 Content-Type
                res.setHeader("Content-Type", contentType);

				var lastModified = stat.mtime.toUTCString();
				var ifModifiedSince = "If-Modified-Since".toLowerCase();
				res.setHeader("Last-Modified", lastModified);

				if (ext.match(config.Expires.fileMatch)) {
                    var expires = new Date();
                    expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                    res.setHeader("Expires", expires.toUTCString());
                    res.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                }
                if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
                    res.writeHead(304, "Not Modified");
                    res.end();
                } else {
                	// 使用流的方式去读取文件
                	var raw = fs.createReadStream(realPath);
                	var acceptEncoding = req.headers['accept-encoding'] || "";
                	var matched = ext.match(config.Compress.match);
                	if (matched && acceptEncoding.match(/\bgzip\b/)) {
                        res.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});
                        raw.pipe(zlib.createGzip()).pipe(res);
                    } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                        res.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});
                        raw.pipe(zlib.createDeflate()).pipe(res);
                    } else {
                        res.writeHead(200, "Ok");
                        raw.pipe(res);
                    }
//下面是普通的读取文件的方式，不推荐
//                 	fs.readFile(realPath, "binary", function(err, data) {
//						if(err) {
//							// file exists, but have some error while read
//							res.writeHead(500, {'Content-Type': 'text/plain'});
//							res.end(err);
//						} else {
//							// file exists, can success return
//							res.writeHead(200, {'Content-Type': contentType});
//							res.write(data, "binary");
//							res.end();
//						}
//					});
                }
			});
		}
	});
});
//监听8000端口
server.listen(PORT, function() {
	console.log("Server is listening on port " + PORT + "!");
});