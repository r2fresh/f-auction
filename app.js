var express = require('express');
var path = require('path');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/',function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 5000!');
});
