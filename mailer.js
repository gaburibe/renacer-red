var nodemailer=require("nodemailer");
var handlebars = require('handlebars');
//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith
var fs = require('fs');


var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: 'elrenacerdelcampo@gmail.com',
	        pass: 'redagro2020'
	    }
	});









exports.testmail= function (ordername,callback){

readHTMLFile('sitio/mail.html', function(err, html) {
	//ordername="Adri__2426618590";
	pedido=["producto","cantidad","total"];
	orden = JSON.parse(fs.readFileSync('ordenes/'+ordername, 'utf8'));
    console.log("sending... ",orden.mail);
    if(orden.mail==""){
        callback("no mail");
    }
    for(key in orden.orden){
    	if(orden.orden[key][1]!=0){
    		precio=parseFloat(orden.orden[key][2].replace("$","")) ;
    		pedido.push([orden.orden[key][0],orden.orden[key][1],"$"+(precio*orden.orden[key][1]) ])
    	}
    }
    var template = handlebars.compile(html);
    var replacements = {
         orden: ordername,
         nombre: orden.nombre,
         costo_envio:orden.costo_envio,
         pedido: pedido,
         recoleccion:orden.recoleccion, 
         total:orden.total
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
        from:"Orion",
		to:orden.mail,
		subject:"Orden confirmada",
        html : htmlToSend,
        attachments: [{
		     filename: 'logo.png',
		     path: 'sitio/img/logo.png',
		     cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
		}]
     };
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            callback(error);
        }
        else{callback("");}
    });
});

}

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};




