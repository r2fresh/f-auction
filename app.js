var express = require('express');
var path = require('path');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'))

app.get('/',function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/auction',function(req, res){
    res.sendFile(path.join(__dirname + '/preAuction.html'))
})

app.get('/login',function(req, res){
    res.sendFile(path.join(__dirname + '/login.html'))
})

app.get('/insert',function(req, res){
    res.sendFile(path.join(__dirname + '/insertAuction.html'))
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 5000!');
});
