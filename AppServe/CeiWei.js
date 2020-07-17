const express = require('express')
const router = express.Router(); //得到router路由

const {conn,setError} = require('./utils')
const {ObjectID} = require("mongodb"); //得到创建id的方法 接受前端传入的id 使用objectID创建为数据库id 然后操作增删改查

//数据库查
router.get('/xiaobai',(req,res)=>{    
    conn((err,db)=>{
        setError(err,res,db)
        db.collection('users').findOne({},(err,result)=>{
            setError(err,res,db)
            console.log(result,'result');
            res.json({
                result,
            })
        })
    })
})

router.post('/getUsrs',(req,res)=>{    
    console.log(11231,'');
    console.log(req.body,'');
    conn((err,db)=>{
        setError(err,res,db)
        db.collection('users').findOne({},(err,result)=>{
            setError(err,res,db)
            console.log(result,'result');
            res.json({
                result,
                code:'000000'
            })
        })
    })
})



//保存用户信息
router.post('/saveUserInfo',(req,res)=>{    
    let id = req.body.id; //接受该用户id

    if(id){
        //当id存在时 更新该用户信息
        let time =  new Date().getTime(); //创建时间对象 获取时间戳 后期查列表排序需要;
        let changeTime = time; //初始化修改时间戳
        conn((err,db)=>{
            setError(err,res,db)
            db.collection('users').update({_id:ObjectID(id)},{$set:{...req.body,changeTime}},(err,result)=>{
                setError(err,res,db);
                res.json({
                    code:'000000',
                    errInfo:'用户修改成功'
                })
            }) 
        })

    }else{
        //当id不存在时 插入该用户信息
        let time =  new Date().getTime(); //创建时间对象 获取时间戳 后期查列表排序需要;
        let createTime = time; //初始化创建时间戳
        let changeTime = time; //初始化修改时间戳
        conn((err,db)=>{
            setError(err,res,db)
            db.collection('users').insert({...req.body,createTime,changeTime},(err,result)=>{
                setError(err,res,db);
                res.json({
                    code:'000000',
                    errInfo:'用户创建成功'
                })
            })
        })

    }

})

//查询用户信息-列表查询
router.post('/getUserInfoList',(req,res)=>{    
    let {pageSize,pageNo} = req.body; //接受该用户id
        conn((err,db)=>{
            setError(err,res,db)
            db.collection('users').find({}).toArray((err,result)=>{
                setError(err,res,db)
                let allPageNumber = result.length; //得到用户总数量,用于后期分页上拉限制
                db.collection('users').find({}).sort({changeTime:-1}).skip((pageNo-1)*pageSize).limit(pageSize).toArray((err,result)=>{
                    setError(err,res,db)
                    res.json({
                        code:'000000',
                        errInfo:'查询用户数据成功',
                        allPageNumber, //用户数量
                        result,
                    })
                })
            })
            
        })

    

})

//查询用户信息-单个查询
router.post('/getOneUserInfo',(req,res)=>{    
    let id= req.body.id; 
    console.log(id)
    console.log(ObjectID(id))
    conn((err,db)=>{
        setError(err,res,db)
        db.collection('users').findOne({_id:ObjectID(id)},(err,result)=>{
            setError(err,res,db)
            res.json({
                code:'000000',
                errInfo:'查询用户数据成功',
                result,
            })
        })
    })
})


//删除单个用户
router.post('/deleteOneUserInfo',(req,res)=>{    
    let id= req.body.id; 
    conn((err,db)=>{
        setError(err,res,db)
        db.collection('users').deleteOne({_id:ObjectID(id)},(err,result)=>{
            setError(err,res,db)
            res.json({
                code:'000000',
                errInfo:'删除数据成功',
            })
        })
    })
})






//图片上传
const multer = require('multer');
var storage = multer.diskStorage({
    //将上传的文件存储在指定的位置（不存在的话需要手动创建）
    destination: function (req, file, cb) {
        cb(null, './public/avatar')
    },
    //将上传的文件做名称的更改
    filename: function (req, file, cb) {
        var fileformat = (file.originalname).split('.');
        console.log(file);
        cb(null, Date.now()+file.originalname);
    }
})
//创建multer对象
var upload = multer({ storage: storage })
const avatarUpload = upload.any();

//图片上传接口
router.post('/upImg',avatarUpload,(req,res,next)=>{

    var imgUrl = req.files[0].path;
    res.json({
        code:'000000',
        errInfo:'上传头像成功',
        result:imgUrl
    })
})


module.exports = router; 