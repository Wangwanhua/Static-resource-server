//能够开启http服务 引入httpmok
let http = require('http');

// 生成路劲 path
let path = require('path');

// 引入文件系统
let fs = require('fs');

// require mime模块 第三方模块 文件类型
let mime = require("mime");

// 引入 querystring 查询字符串模块 
let querystring = require("querystring");


//配置网站的根目录
let rootPath = path.join(__dirname,'www');
// console.log(__dirname);
console.log(rootPath);

//开启服务
http.createServer((Request,Response)=>{
    // console.log(Request.url);
    // console.log('请求来了');
    //根据请求的url 生成静态资源服务中的绝对路劲
    // 中文目录无法读取,需要解码,使用querystring模板
    let filePath = path.join(rootPath,querystring.unescape(Request.url));
    console.log(filePath);

    // 判断访问的这个目录(文件)是否存在
    let isExist = fs.existsSync(filePath);
    //如果存在
    if(isExist){
      // 只有存在才需要继续走
      // 生成文件列表
      fs.readdir(filePath,(err,files)=>{
          //如果是文件
          if(err){
            //   console.log(err);
            // 能够进到这里 说明是文件
            // 读取文件 返回读取的文件
            fs.readFile(filePath,(err,data)=>{
                if(err){
                    // console.log(err);
                }else{
                    // 判断文件类型是什么 设置不同的mime类型返回给浏览器
                    Response.writeHead(200,{
                        "content-type":mime.getType(filePath)
                    });
                    // 直接返回
                    Response.end(data); 
                }
            });
          }
          //否则是文件夹 
          else{
            console.log(files);
            // 直接判断是否存在首页
            if(files.indexOf("index.html")!=-1){
                console.log("有首页");
                // 读取首页即可
                fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                    console.log(filePath);
                    if(err){
                        console.log(err);
                    }else{
                        // 判断文件类型是什么 设置不同的mime类型返回给浏览器
                        Response.writeHead(200,{
                            "content-type":mime.getType(filePath)
                        });
                        Response.end(data);
                    }
                });
            }
            // 如果没有首页
            else{
               // 没有首页 
               let backData = "";
               for(let i = 0; i < files.length; i++){
                // 根目录 request.url => /
                // 默认拼接的都是 ./ 只能访问根目录
                //根据请求的url 进行判断 拼接上一级目录的地址 点击即可进行访问
                   backData += `<h2><a href="${Request.url == "/" ? "" : Request.url}/${files[i]}">${files[i]}</a></h2>`;
               }
               Response.writeHead(200,{
                   "content-type":"text/html;charset=utf-8"
               });
               Response.end(backData);
            }
          }
      })
    }
    // 否则不存在
    else{
       // 不存在 返回 404
       Response.writeHead(404,{
           "content-type":"text/html;charset=utf-8"
       }) ;
       // 响应跟 Apache一样的错误信息 并返回
       Response.end(`
            <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
            <h1>Not Found</h1>
            <p>The requested URL /index.hththt was not found on this server.</p>
            </body></html>
       `);
    }
    // console.log(filePath,isExist);

    // 响应内容
    // response.end('you come')

}).listen(80,'127.0.0.1',()=>{
    console.log('开始监听 127.0.0.1');
})

