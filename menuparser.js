var fs = require('fs'),
path = require('path'),
_ = require('underscore');
var csv = require("fast-csv");

//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith


exports.disperser="disperser"

exports.compilaMenu= function(menu,callback){
	console.log("menu parseString")
	disperser=menu;
	MOBJ={};
	count=0;
	menustring="Producto;Unidad;Precio;existencia;Categoría;Productor;Ubicación;Precio consumidor;Margen\n";
	csv.parseString(menu, { delimiter:';' })
    .on('error', error => console.error(error))
    .on('data', function(row){
    	if(count==0){count+=1;}
    	else{
    		count+=1;
    		producto=row[0].toLowerCase();
			unidad=row[1];
			precioP=row[2];
			existencia=parseFloat(row[3]);
			productor=row[5];
			precioC=row[7];
			id=count;
			if(!MOBJ[producto]){ 
				MOBJ[producto]=[producto,unidad,precioP,existencia,"",productor,"",precioC,id];
				
			}
			else{
				console.log(producto, "new",MOBJ[producto][5])
				MOBJ[producto][3]+=existencia;
				MOBJ[producto][5]+=" - "+productor;
				console.log("----"+row)
			}
			
    		
    	}
    		
    })
    .on('end', function(rowCount){
    	for(producto in MOBJ){
    		menustring+=MOBJ[producto].join(";")+"\n";

    	}
    	console.log(menustring)
    	callback(menustring);
    });

	
	
	//callback(menustring)
	
}