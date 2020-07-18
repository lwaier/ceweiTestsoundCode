# ceweiTestsoundCode
this is my interview sound code

App -        前端"uni-app"项目

    技术栈: Uni-app+Vue2+JS

AppServe -   后端"node"服务

    技术栈: Node+Express+mongodb

App目录拉取后可直接放入hbuilder运行 -- 此时访问的是我搭建好的线上服务(后端)

另外 提供了线上版本供直接预览 地址 https://lwaier.github.io/myComputerTest/index.html#/
由于是托管在github上 首次加载可能很慢 稍微等等即可;



注: 

    若贵公司人员想测试本地AppServe服务可如下操作

    AppServe目录启动服务之前请先在本地搭建mongodb服务 然后创建名为 "cewei" 的数据库 , 之后进入AppServe根目录初始化node_modules , 同目录nodemon app.js即可启动本地服务

    服务启动完成后 找到App目录中的 /common/config.js文件 将IP地址换为本地即可 如不换 则访问的是我搭建好的线上服务(内网穿透)