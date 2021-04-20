'use strict';
require('dotenv').config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const pg = require('pg');
const express = require('express');
const superagent = require('superagent');
const client = new pg.Client(DATABASE_URL);
const app = express();
const methodoverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/',renderAPI);
app.post('/savedata', saveToDB);
app.get('/savedPage', showDataBaseValues);
app.get('/details/:id', renderDetails);
app.delete('/update/:id', deletehcar);
app.put('/update/:id', updatechar);

function deletehcar(req, res)
{
    const id=req.params.id;
    const SQL=`DELETE FROM coll WHERE id=${id};`
    client.query(SQL).then(()=>{
        res.redirect('/savedPage');
    });
}
function updatechar(req, res)
{
    const {name, house, patronus, is_alive}= req.body;
    const SQL= `UPDATE coll SET name=$1, house=$2, patronus=$3, isalive=$4 WHERE id=$5 `;
    let val= [name, house, patronus, is_alive, req.params.id];
    client.query(SQL,val).then(()=>{
        res.redirect(`/details/${req.params.id}`);
    });
}



function Char(data){
this.name=data.name;
this.house=data.house ;
this.patronus=data.patronus;
this.is_alive=data.alive;
}
function renderAPI(req, res)
{
    const url ='http://hp-api.herokuapp.com/api/characters';
    superagent.get(url).then(data => {
        let apidata=data.body.map(ob=> new Char(ob));
        res.render('index', {apidata: apidata});
    });
}
function saveToDB(req, res)
{
    //  console.log(req.body);
     const {name, house, patronus, is_alive}= req.body;
     const SQL= 'INSERT INTO coll (name, house, patronus, isalive) VALUES($1, $2, $3, $4) ';
     let val= [name, house, patronus, is_alive];
     client.query(SQL,val).then(()=>{
         res.redirect('/savedPage');
     });
}
function showDataBaseValues(req,res){
    const SQL= 'SELECT * FROM coll;';
    client.query(SQL).then((data)=>{
        let arr=data.rows;
        res.render('savedPage', {arr:arr});
    });

}
function renderDetails(req, res)
{
    const SQL= 'SELECT * FROM coll WHERE id= $1;';
    let id=[req.params.id]
    client.query(SQL, id).then((data)=>{
        let arr=data.rows;
        res.render('detailschar', {arr:arr});
    });
}

client.connect().then(() => {
    app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
})

