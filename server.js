const express=require('express');
const static=require('express-static');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const bodyParser=require('body-parser');
const multer=require('multer');
const consolidate=require('consolidate');
const mysql=require('mysql');
const common = require('./libs/common')

//连接池
const db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'blog'});

var server=express();
server.listen(8081);

//1.解析cookie
server.use(cookieParser('sdfasl43kjoifguokn4lkhoifo4k3'));

//2.使用session
var arr=[];
for(var i=0;i<100000;i++){
  arr.push('keys_'+Math.random());
}
server.use(cookieSession({name: 'zns_sess_id', keys: arr, maxAge: 20*3600*1000}));

//3.post数据
server.use(bodyParser.urlencoded({extended: false}));
server.use(multer({dest: './www/upload'}).any());

//4.配置模板引擎
//输出什么东西
server.set('view engine', 'html');
//模板文件放在哪儿
server.set('views', './template');
//哪种模板引擎
server.engine('html', consolidate.ejs);

//接收用户请求
server.get('/', (req, res,next)=>{
  //查询banner的东西
  db.query("SELECT * FROM banner_table", (err, data)=>{
    if(err){
      console.log(err);
      res.status(500).send('database error').end();
    }else{
      console.log(data);
      res.banners = data;
      next();
      // res.render('index.ejs', {banners: data});
    }
  });
});
server.get('/', (req, res)=>{
  //查询banner的东西
  db.query("SELECT ID,title,summary FROM article_table", (err, data)=>{
    if(err){
      // console.log(err);
      res.status(500).send('database error').end();
    }else{
      res.articleData = data;
      res.render('index.ejs', res);
    }
  });
});


server.get('/article', (req, res)=>{
  if (req.query.id) {
    if (req.query.act == 'like') {
      db.query(`UPDATE article_table set n_like=n_like+1 where ID = ${req.query.id}`, (err, data)=>{
        if(err){
          console.log(err);
          res.status(500).send('database error').end();
        }
      });
    }else{
      db.query(`SELECT * FROM article_table where id = ${req.query.id}`, (err, data)=>{
        if(err){
          console.log(err);
          res.status(500).send('database error').end();
        }else{
          var articles = data[0];
          articles.sDate = common.timeDate(articles.post_time) ;
          // console.log(data)
          res.render('context.ejs', {articles:articles});
        }
      });
    }
   
  }else{
    res.status(404).send("请求的文章不存在").end();
  } 
});




//4.static数据
server.use(static('./www'));
