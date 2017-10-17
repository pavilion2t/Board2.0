/**
 * Created by Alan Tang on 8/28/2017.
 */

//var buf = fs.readFileSync(filename, "utf8");

const testFolder = './src/lang/';
const fs = require('fs');
const path = require('path');


findPoFiles();


function findPoFiles( ){
  fs.readdir(testFolder, (err, files) => {
    var listOfPo = [];
    files.map(function (file) {
      return path.join(testFolder, file);
    }).filter(function (file) {
      return fs.statSync(file).isFile();
    }).forEach(function (file) {
      if ( path.extname(file) === '.po' ) {
        var poContent = readPoFile( file );
        listOfPo.push(poContent);
      }
    });

    writeTranslationFile( listOfPo );
  })
}


function readPoFile( file ){
  var poContent = {};
  var translateMap = {};
  console.log( file );
  var content = fs.readFileSync(file, 'utf8');

  var lines = content.split('\n');

  var transKey = '';

  for ( var i = 0; i < lines.length; i ++ ){
    var line = lines[i];
    //console.log(line.indexOf("\""), line.lastIndexOf("\""), line.length);
    var first = line.indexOf("\"");
    var last = line.lastIndexOf("\"");

    // Double quoted

    if ( first === 0 && last !== -1 && first !== last ){
      var quotedLine = returnQuotedLine( line );
      var keyValuePairs = quotedLine.split(':');
      if ( keyValuePairs.length === 2 ){
        var key = keyValuePairs[0];
        var value = keyValuePairs[1];

        value = value.replace(/\\n/g,'');
        value = value.trim();
        poContent[key] = value;
      }
    }


    if ( line.indexOf('msgid ') !== -1 ) {
      var quotedLine = returnQuotedLine( line );
      transKey = quotedLine;
    }

    if ( line.indexOf('msgstr ') !== -1 ) {
      var quotedLine = returnQuotedLine( line );
      if ( transKey !== '' ) {
        translateMap[transKey] = quotedLine;
      }
    }
  }
  poContent.map = translateMap;
  return poContent;
}

function returnQuotedLine( line ){
  var first = line.indexOf("\"");
  var last = line.lastIndexOf("\"");
  var quotedLine = line.substring(first+1,last);
  return quotedLine;
}

function writeTranslationFile( files ){
  var text = "";
  var head = "export default angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) { \n";
  var tail = "}]).name";


  var poList = [];


  text = text + head;
  for ( var i = 0; i < files.length; i++ ){
    var po = "gettextCatalog.setStrings('";

    var file = files[i];
    po = po + file.Language + "',";
    po = po + JSON.stringify( file.map );
    po = po + "); \n"
    poList.push(po);
    text = text + po;
  }
  text = text + tail;

  let path = 'src/lang/translations.js'
  if (fs.existsSync(path))
    fs.unlinkSync(path);
  fs.writeFileSync('src/lang/translations.js', text);
}
