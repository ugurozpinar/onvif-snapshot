const request = require('request');
var fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
var cron = require('node-cron');
const { exec } = require("child_process");

mkdirp.sync('/mnt/QNAP');
 
 var nvrs = [{host:'192.168.3.220',title:'220',max:64},{host:'192.168.3.221',title:'221',max:40}];

var cams = [];
var datetitle = timeStamp();
//cron.schedule('*/5 * * * *', function(){
//	return cek();
	
//});

//NAS'a BAGLAN
//------------------
exec("mount -t cifs -o username=admin,password=5ozyurt //172.16.3.1/Snaps /mnt/QNAP", (error, stdout, stderr) => {
if (error) {
	console.log(`error: ${error.message}`);
	return;
}
if (stderr) {
	console.log(`stderr: ${stderr}`);
	return;
}
console.log(`stdout: ${stdout}`);
});
//------------------

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
		for(var j=1;j<=nvrs[i].max;j++){
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


function kucukDosyalariTemizle(saveDir){
	

	exec("find "+saveDir+"/ -name \"*.jpg\" -type 'f' -size -20k -delete", (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});

}

function al(){
	var saveDir = '/mnt/QNAP'+'/'+timeStampJustDate();
	
	if(cams.length == 0){
		kucukDosyalariTemizle(saveDir);
		console.log('Komple Bitti 300 Saniye Sonra Başlayacak : '+timeStamp());
		return setTimeout(cek,1000*1200);
		return false;
	}else
		console.log(cams.length +' : '+cams[cams.length-1].id);
	
	
	
	var kanal = cams.pop();
	
	
	if (!fs.existsSync(saveDir))
		fs.mkdirSync(saveDir);
	
	var writeStream = fs.createWriteStream(path.join(saveDir,kanal.id+'_#_'+kanal.datetitle+'.jpg'));
	let snapshotUri = "http://"+kanal.nvr+"/cgi-bin/snapshot.cgi?channel="+kanal.channel+"&loginuse=admin&loginpas=oz5527431";
	request({
		method: 'GET',
		uri: snapshotUri,
		gzip: false,
		timeout: 20000,
		//encoding: 'binary',
		auth: {
			user: "admin",
			pass: "oz5527431",
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
function timeStampJustDate() {
// Create a date object with the current time
  var now = new Date();
  return now.getFullYear()+"-"+addZeroBefore(now.getMonth()+1)+"-"+addZeroBefore(now.getDate());
}

function addZeroBefore(n) {
	return (n < 10 ? '0' : '') + n;
}
