var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();
var Crawler = require("crawler");
var async = require("async");
var pdf = require('html-pdf');
const multer = require('multer');
const csv = require('fast-csv');
_ = require('underscore');
const readline = require('readline');


//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith

const port = 3002; 
const _K = "cmVuYWNlcnx8bWFyaWE="; 


app.use(bodyParser.json())
var fs = require("fs");
var path = require('path');
var menuManager = require('./menuManager');
var printingSystem = require('./printingSystem');
var mailerSystem = require('./mailer');
//console.log("public",__dirname + '/sitio')
app.use('/', express.static(__dirname + '/sitio'));
app.use('/bandeja/', express.static(__dirname + '/bandeja'));
app.use('/ordenes/', express.static(__dirname + '/ordenes'));
app.use('/archivo/', express.static(__dirname + '/archivo'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://redentregas.renacerdelcampo.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

menuManager.inicializa();

//ORDENES
app.post('/orden', function (req, res) {
  //console.log(req.body);
  name=req.body["nombre"].substring(0,4)+"__"+Math.floor(Math.random() * 100)+Math.floor(Date.now() / 60000);
  fs.writeFile("ordenes/"+name+".json",JSON.stringify(req.body) , function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    else{
	    	menuManager.actualiza(req.body.orden,function(){
	    		menuManager.updateCache(menuManager.liveMenu);
	    	});
	    	console.log("Orden "+name+" procesada");
	    	//return name;
	    	res.json({"orden":name});
	    }
	    
	}); 
  
});
app.post('/ordenview', function (req, res) {
  //console.log(req.body);
  nombreorden=req.body["nombre"];
  menuManager.getOrden(nombreorden, function(orden){
  		res.json(orden);
  });
});
// app.get('/ordenes', function (req, res) {
//   menuManager.getOrdenes(function(ordenes){
//   		res.send(ordenes);
// 		console.log("corte de caja...");
//   });
// });
app.get('/ordenaOrdenes', function (req, res) {

  menuManager.ordenaOrdenes(function(ordenes){
  		res.send(ordenes);
		console.log("corte de caja...");
  });
});
//MENÚ
app.get('/menu', function (req, res) {
	if( !isEmpty(menuManager.liveMenu) ){
		//console.log("live");
		res.json(menuManager.liveMenu);
	}
	else{
		menuManager.menu(function(menuR){
			menuManager.updateCache(menuR);
			res.json(menuR);
			console.log("initializing...");
		});
	}
	

});




//SITIO PRINCIPAL


app.get('/', function (req, res) {
	menudir="./menu/mainmenu.csv";
	if (!fs.existsSync(menudir)){
	   res.sendFile(path.join(__dirname + '/sitio/splash.html'));
	}
	else{
	   res.sendFile(path.join(__dirname + '/sitio/menu.html'));
	}	

});
app.get('/orden', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/orderview.html'));

});



//TEST
app.get('/hello', function (req, res) {
  res.sendFile(path.join(__dirname + '/sitio/staticindex.html'));
});
//ADMIN
app.get('/adminPrint', function (req, res) {
	printsinglePDF(function(){
		console.log("printed");
		res.send("ok")
	});

});



function printsinglePDF(callback) {
thistime="";
	bandeja={};
	printed=0;
	var options = { format: 'A4' };
	printingSystem.print(function(htmls){
		fs.readdir("bandeja", function (err, files) {
			 admin={};
			 //thistime="";
			 header="";
			  if (err) {
		        console.error("Error stating file.", error);
		        return;
		      }
		      files.forEach(function (file, index) {

		      		name=file.replace(".pdf","");
		      		
			      	if(!file.includes(".DS")){
			      		bandeja[name]=1;
			      		console.log(name," ya procesado");
			      	}
			      	
		     });
			for(key in htmls){
				if(!bandeja[key] && printed<1){
					printed++;
					    pdf.create(htmls[key],{ format: 'Letter' }).toFile('./bandeja/'+key+'.pdf', function(err, res) {
							if (err){console.log(err);} else {console.log(res);callback();}
						});
				}
		      
			}
		  //     pdf.create(thistime).toFile('./bandeja/'+thistime+'.pdf', function(err, res) {
				// if (err){console.log(err);} else {console.log(res);}
			 //  });
		});
	});
}


//ORION sec layer
app.post('/orion/*', function (req, res, next) {
	_P=req.body["permission"];
	if(_P==_K){
	
		next();

	}
	else{
		res.send({"status":"err","err":"incorrect key"})
	}
});



// BACK
app.get('/operacion', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/operacion.html'));

});
app.post('/orion/backconfirm', function (req, res) {
	nombreorden=req.body["nombre"];
	console.log("./ordenes/"+nombreorden)
	mailerSystem.testmail(nombreorden,function(mailst){
		console.log(mailst);
		fs.readFile("./ordenes/"+nombreorden, (err, data) => {
		    if (err) throw err;
		    let json = JSON.parse(data);

		    html=printingSystem.printSingle(nombreorden,json);
			pdf.create(html,{ format: 'Letter' }).toFile('./bandeja/'+nombreorden+'.pdf', function(err, result) {
				if (err){console.log(err);} else {console.log(result);}
				console.log('./bandeja/'+nombreorden+'.pdf',"CONFIRMED");
				res.sendStatus(200)
			});
			 
		});
	})
	
	
	
});
app.post('/orion/backunconfirm', function (req, res) {
	nombreorden=req.body["nombre"];
	fs.unlink("./bandeja/"+nombreorden+".pdf", function (err) {
	    if (err) throw err;
	    // if no error, file has been deleted successfully
	     res.sendStatus(200)
	}); 
});
app.post('/orion/backOrdenes', function (req, res) {
	menuManager.getOrdenesJson(function(ordenes){
  		res.send(ordenes);
  	});

});
app.post('/orion/ordenes', function (req, res) {
  menuManager.getConfirmed(function(ordenes){
  		res.send(ordenes);
		console.log("corte de caja...");
  });
});
function divideProductos(productores,cantidad,precio){
	splitter=productores.split("-");
	res={};
	preciounitario=precio/cantidad;
	sum=0;
	for(i=0;i<splitter.length;i++){
	  	nameproductor=splitter[i].trim();
	  	if(i==splitter.length-1){
	  		res[nameproductor]=[cantidad-sum,(cantidad-sum)*preciounitario];
	  	}
	  	else{
	  		sum+=Math.floor(cantidad/splitter.length);
	  		//console.log(sum,cantidad,"-")
	  		res[nameproductor]=[Math.floor(cantidad/splitter.length) , 
	  		Math.floor(cantidad/splitter.length)*preciounitario];

	  	}
	  					
	}	
	
	return res;

}
app.post('/orion/resumen', function (req, res) {

  menuManager.getResumen(function(ordenes){
  	console.log(ordenes);
  	IN_file="menu/mainmenu.csv";
	rownum=0;
	proovedor="";
	menuthis={};
	csv
	 .parseFile(IN_file,{ delimiter:';'})  
	 .on("data", function(data){
	 	rownum+=1;
	 	data.push(rownum);

	 	if(rownum==1){}
	 	else{
	 		productos=data[0];
	 		precioproductor=data[2];
	 		precioC=data[7]
	 		unidad=data[1];
	 		if(!menuthis[productos]){
	 			menuthis[productos]=[precioproductor,precioC,unidad];
	 		}
	 		//menuthis[proovedor].push(data);
	 	}
	 		 	
	 })	
	 .on("end", function(){
	 	console.log(menuthis)
	 	csvsend="Productor\t Producto\tunidad \t total de unidades ordenadas\t total venta \t total precio productor \n";
  		for (productor in ordenes){
  			
  			
  			
  				for(producto in ordenes[productor]){
  					precios=menuthis[producto];
  					console.log(precios)
  					precioinicial=parseFloat(precios[0].replace("$",""));
  					unidad=precios[2];
  					//precio a pagar
  					ordenes[productor][producto][2]=ordenes[productor][producto][0]*precioinicial;
  					console.log(ordenes[productor][producto][2])
	  				csvsend+=productor+"\t"+producto+"\t"+unidad+
	  				"\t"+ordenes[productor][producto][0]
	  				+"\t"+ordenes[productor][producto][1]
	  				+"\t"+ordenes[productor][producto][2]
	  				+"\n";
	  			}
  			
  			
  		}
  		res.send(csvsend);
		console.log("productores...");
	 })
  		
  });
});

app.post('/orion/resumenzonas', function (req, res) {

  menuManager.getResumenZonas(function(zonas){
  		csvsend="Zona\t Producto\t total de unidades ordenadas\t total $ \n";
  		for (zona in zonas){
  			for(producto in zonas[zona]){
  				csvsend+=zona+"\t"+producto+
  				"\t"+zonas[zona][producto][0]+
  				"\t"+zonas[zona][producto][1]
  				+"\n";
  			}
  		}
  		res.send(csvsend);
		console.log("Zonas...");
  });
});
app.post('/orion/backOrdenes', function (req, res) {
	menuManager.getOrdenesJson(function(ordenes){
  		res.send(ordenes);
  	});

});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// OPERACIÓN  
app.get('/orionadmin', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/admin.html'));
});
app.get('/back', function (req, res) {
	res.sendFile(path.join(__dirname + '/sitio/back.html'));
});
app.get('/status', function (req, res) {
	orderdir="./ordenes";
	bandejadir="./bandeja";
	menufile="./menu/mainmenu.csv";
	status={"ordenes":0,"bandeja":0,"menu":0}
	if (fs.existsSync(orderdir)){status.ordenes=1; }
	if (fs.existsSync(bandejadir)){status.bandeja=1; }
	if (fs.existsSync(menufile)){status.menu=1; }
	res.json(status);
});
app.post('/orion/uploadmenu', function (req, res) {
	
		newmenu=req.body["newmenu"];
		menuManager.uploadmenu(newmenu,function (respuesta){
			menuManager.liveMenu={};
			menuManager.menu(function(menuR){
				menuManager.updateCache(menuR);
				menuManager.inicializa();
				res.json(respuesta);
				console.log("initializing...");
			});
			
		});
	

});
app.post('/orion/closeShop', function (req, res) {

		menuManager.closeShop(function(err){
			if(!err){
				res.send({"status":"suave",});
			}
			else{
				res.send({"status":"err","err":err});
			}
			
		})
	
})
app.post('/orion/closeOp', function (req, res) {
	
		console.log("closing operation");
		menuManager.closeOp(function(err){
			if(!err){
				res.send({"status":"suave",});
			}
			else{
				res.send({"status":"err","err":err});
			}
			
		})
	
		
	
});

//PUERTO

console.log(`Your port is ${port}`);

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!!!');
});


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}