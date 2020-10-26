var fs = require('fs'),
path = require('path'),
_ = require('underscore');
var csv = require("fast-csv");
var pdf = require('html-pdf');

//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith


exports.printSingle= function (key,ordenInfo){
	tabla=`
			<Br>
			<Br>
			<Br>
			<Br>
			<table style="margin-top:150px;">
			<tr>
				<td style="border-bottom: 1px solid #000!important;">Producto</td>
				<td style="border-bottom: 1px solid #000!important;">Productor</td>
				<td style="border-bottom: 1px solid #000!important;">Cantidad</td>
				<td style="border-bottom: 1px solid #000!important;">-</td>
				<td style="border-bottom: 1px solid #000!important;">-</td>
				<td style="border-bottom: 1px solid #000!important;">Total por producto</td>
				<td style="border-bottom: 1px solid #000!important;">-</td>
			</tr>
		
		`;
		contenido = `

		<div style="width: 100vw;float:left;">
			<table style="width: 100%;float:left;">
				

			<tr style="background-color: #fff;"">
			<td style="font-size: 14pt;border-bottom: 1px solid #000!important;">Número de orden:</td><td style="padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+key+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 14pt;border-bottom: 1px solid #000!important;">Total:</td><td style="padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.total+`</td>
			</tr>
			<td style="font-size: 14pt;border-bottom: 1px solid #000!important;">Costo de envío:</td><td style="padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.costo_envio+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 12pt;border-bottom: 1px solid #000!important;">Nombre:</td><td style="font-size: 10pt;padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.nombre+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 12pt;border-bottom: 1px solid #000!important;">Teléfono:</td><td style="font-size: 10pt;padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.telefono+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 12pt;border-bottom: 1px solid #000!important;">Dirección:</td><td style="font-size: 10pt;padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.recoleccion+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 12pt;border-bottom: 1px solid #000!important;">
			Comentarios:
			</td><td style="font-size: 10pt;padding-left: 60px;border-bottom: 1px solid #000!important;">`+ordenInfo.comentarios+`</td>
			</tr>

			
			
			</table>
		</div>
		<pre  style="width:13vw;font-size: 4pt; height:10vw;position:fixed;top:10px;right: 140px;">
						           o|
			   _________/__|__________
			  |                  - (  |
			 ,'-.                 . + |
			(____".       ,-.    '   ||\
			  |          /|,-|   ,-.  |\
			  |      ,-./     | /'.-| |\
			  |     /-.,|      /     ||\
			  |    /     |    ,-.     |\
			  |___/_______|__/___|_____| orion\
\
		      EL RENACER DEL CAMPO \
\
		      \
\
		      722 108 2700 \
\
		      @elrenacerdelcampo\
\
		</pre>`;
		orden=ordenInfo.orden;
		for(pp in orden){
					arr=orden[pp];
					if(arr[1]!=0){
						rr=arr[0].split("[|]");
						producto=rr[0];
						productor=rr[1];
						precio=parseFloat(arr[2].replace("$",""));
						cantidad=parseFloat(arr[1]);
						tr='<tr><td>'+producto+'</td><td>'+productor+'</td>'+""+'<td></td>'+""+'<td></td>'+'<td>'+cantidad+'</td>'+'<td>'+(precio*cantidad)+'</td>';
						tabla+=tr;
					}
					
				}

		httm=contenido+tabla+'</table>';
		return httm;
}

exports.print=function (callback){
	htmls={};
	contenido="";

	readordenes(function(data){
		//console.log(data);
		for(key in data){
			httm="";
			htmls[key]="";
			ordenInfo=data[key];
			tabla=`
			<Br>
			<Br>
			<Br>
			<Br>
			<table style="margin-top:150px;">
			<tr>
				<td style="border-bottom: 1px solid #000!important;">Producto</td>
				<td style="border-bottom: 1px solid #000!important;">Productor</td>
				<td style="border-bottom: 1px solid #000!important;">Cantidad</td>
				<td style="border-bottom: 1px solid #000!important;">-</td>
				<td style="border-bottom: 1px solid #000!important;">-</td>
				<td style="border-bottom: 1px solid #000!important;">Total por producto</td>
				<td style="border-bottom: 1px solid #000!important;">-</td>
			</tr>
		
		`;
			contenido = `

		<div style="width: 100vw;float:left;">
			<table style="width: 100%;float:left;">
				

			<tr style="background-color: #fff;"">
			<td style="font-size: 14pt;border-bottom: 1px solid #000!important;">Número de orden:</td><td style="padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+key+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 14pt;border-bottom: 1px solid #000!important;">Total:</td><td style="padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.total+`</td>
			</tr>
			<td style="font-size: 14pt;border-bottom: 1px solid #000!important;">Costo de envío:</td><td style="padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.costo_envio+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 12pt;border-bottom: 1px solid #000!important;">Nombre:</td><td style="font-size: 10pt;padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.nombre+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 12pt;border-bottom: 1px solid #000!important;">Teléfono:</td><td style="font-size: 10pt;padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.telefono+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 12pt;border-bottom: 1px solid #000!important;">Dirección:</td><td style="font-size: 10pt;padding-left: 60px;border-bottom: 1px solid #000!important;">
			`+ordenInfo.recoleccion+`</td>
			</tr>
			<tr style="background-color: #fff;"">
			<td style="font-size: 12pt;border-bottom: 1px solid #000!important;">
			Comentarios:
			</td><td style="font-size: 10pt;padding-left: 60px;border-bottom: 1px solid #000!important;">`+ordenInfo.comentarios+`</td>
			</tr>

			
			
			</table>
		</div>
		<pre  style="width:13vw;font-size: 4pt; height:10vw;position:fixed;top:10px;right: 140px;">
						           o|
			   _________/__|__________
			  |                  - (  |
			 ,'-.                 . + |
			(____".       ,-.    '   ||\
			  |          /|,-|   ,-.  |\
			  |      ,-./     | /'.-| |\
			  |     /-.,|      /     ||\
			  |    /     |    ,-.     |\
			  |___/_______|__/___|_____| orion\
\
		      EL RENACER DEL CAMPO \
\
		      \
\
		      722 108 2700 \
\
		      @elrenacerdelcampo\
		</pre>

		`;
					//TABLA


				for(pp in data[key].orden){
					arr=data[key].orden[pp];
					if(arr[1]!=0){
						rr=arr[0].split("[|]");
						producto=rr[0];
						productor=rr[1];
						precio=parseFloat(arr[2].replace("$",""));
						cantidad=parseFloat(arr[1]);
						tr='<tr><td>'+producto+'</td><td>'+productor+'</td>'+""+'<td></td>'+""+'<td></td>'+'<td>'+cantidad+'</td>'+'<td>'+(precio*cantidad)+'</td>';
						tabla+=tr;
					}
					
				}

					httm=contenido+tabla+'</table>';
					
					// pdf.create(contenido).toFile('./bandeja/'+key+'.pdf', function(err, res) {
					//     if (err){
					//         console.log(err);
					//     } else {
					//         console.log(res);
					//     }
					// });
					htmls[key]=httm;

		}
		callback(htmls);
	});


		
}


function readordenes( callback){
	fs.readdir("ordenes", function (err, files) {
	 admin={};
	 header="";
	 csv="";
	  if (err) {
        console.error("Error stating file.", error);
        return;
      }
      files.forEach(function (file, index) {
      	
      	if(!file.includes(".DS")){
      		admin[file] = JSON.parse(fs.readFileSync('ordenes/'+file, 'utf8'));
      	}
      	
      	//console.log(file,index);
      });
      callback(admin);
	});
}