const mysql = require('mysql');

//1.连接
var db = mysql.createConnection({host:'localhost',user:'root',password:'123456',database:'blog'});

//2.查询
var sql = 'SELECT * from banner_table';
db.query(sql,function (err,data) {
    if (data) {
        console.log(data)
    }
})
