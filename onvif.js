const request = require('request');
var fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
var cron = require('node-cron');

mkdirp.sync('snaps');
 
 var nvrs = [{host:'192.168.3.220',title:'220'},{host:'192.168.3.221',title:'221'}];

var cams = [];
var datetitle = timeStamp();
//cron.schedule('*/5 * * * *', function(){
//	return cek();
	
//});


	
return cek();


function cek(){
	datetitle = timeStamp();
	
	console.log('BASLIYOR __ '+ datetitle);
	
	cams = [];
	
	/// TEST
	/*
	cams.push({
		nvr : '192.168.3.220',
		datetitle : datetitle,
		channel : 50,
		id :'220'+'_'+50
	});
	return al();
	*/
	/// TEST

	for(var i=0;i<nvrs.length;i++){
		for(var j=1;j<50;j++){
			cams.push({
				nvr : nvrs[i].host,
				datetitle : datetitle,
				channel : j,
				id : nvrs[i].title+'_'+j
			});
		}
	}
	return al()
}





function al(){
	if(cams.length == 0){
		console.log('Komple Bitti 300 Saniye Sonra Başlayacak : '+timeStamp());
		return setTimeout(cek,1000*1200);
		return false;
	}else
		console.log(cams.length +' : '+cams[cams.length-1].id);
	
	var kanal = cams.pop();
	
	var writeStream = fs.createWriteStream(path.join('snaps',kanal.id+'_#_'+kanal.datetitle+'.jpg'));
	let snapshotUri = "http://"+kanal.nvr+"/cgi-bin/snapshot.cgi?channel="+kanal.channel+"&loginuse=admin&loginpas=password";
	request({
		method: 'GET',
		uri: snapshotUri,
		gzip: false,
		timeout: 20000,
		//encoding: 'binary',
		auth: {
			user: "admin",
			pass: "password",
			sendImmediately: false
		}
	})
	.on('response', function (proxyResponse) {
		console.log(proxyResponse.headers['content-length']);
		
	})
	.on('error',function (error) {
		if(error.code === 'ETIMEDOUT' || error.code == 'ESOCKETTIMEDOUT'){
			console.log('HATA : ' + cams[cams.length-1].id);
			setTimeout(al,15000);
		}else
			console.log(error);
	})
	.on('close', function (asd) {
		console.log('Done');
		return al();
	})
	.pipe(writeStream)
	.on('end', function() {
		//process.stdout.write('REPL stream ended.');
	});
}



function timeStamp() {
// Create a date object with the current time
  var now = new Date();
  return now.getFullYear()+"-"+addZeroBefore(now.getMonth()+1)+"-"+addZeroBefore(now.getDate())+" "+addZeroBefore(now.getHours())+'_'+addZeroBefore(now.getMinutes());
}

function addZeroBefore(n) {
	return (n < 10 ? '0' : '') + n;
}
