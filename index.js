const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo-app-nodejs'
});

conn.connect((err) =>{
    if(err) throw err;
    console.log("mysql Connected...");
});

app.set('views', path.join(__dirname,'views'));

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use('/assets', express.static(__dirname + '/public'));

app.get('/',(req,res) => {
    let sql = "select * from task";
    let query = conn.query(sql, (err,results) => {
        if(err) throw err;
        res.render('tasks_view',{
            results: results
        });
    });
});

app.post('/save',(req,res) => {
    let data = {task: req.body.task_name};
    let sql = "INSERT INTO task SET ?";
    let query = conn.query(sql, data,(err,results) => {
        if(err){
            console.log(err);
            throw err;
        }  
        res.redirect('/');
    });
});

app.post('/update',(req, res) => {
    let sql = "UPDATE task SET task='"+req.body.task_name+"' WHERE id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.post('/delete',(req, res) => {
    let sql = "DELETE from task where id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(8000, () => {
    console.log('Server is running at port 8000');
});