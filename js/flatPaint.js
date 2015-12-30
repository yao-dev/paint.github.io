(function($) {

	$.fn.flatPaint = function(arg)
	{
		var param = 
		{
			width: "1705px",
			height: "870px",
			background: "#2c3e50",
			color: "#000000",
			thickness: 3
		};

		/** Début: Définition du canvas **/
		var opt = $.extend(param, arg),
			myCanvas = document.getElementById('paint'),
			canvas = $("#paint"),
			context = canvas[0].getContext('2d'),
			// Définition des positions de la souris
			mouse = {x: 0, y: 0},
			start_mouse = {x: 0, y: 0},		

			// Création du tableau comportant les images sauvegarder
			tabImg = [];
		/** Fin: Définition du canvas **/			


		/** Début: Création visuel de my_paint **/
		$("link").before($("<link rel=stylesheet href=https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css>"));
		$("link").before($("<link rel=icon href=./img/favicon.ico />"));
		$("<div>", {id: "wrapper"}).css({"border-top": "50px solid "+opt.background, "border-bottom": "50px solid "+opt.background, "border-right": "50px solid "+opt.background}).prependTo("body");
		$(this).attr({"width": opt.width, "height": opt.height}).appendTo("#wrapper");
		$("<header>", {id: "logo"}).appendTo("#wrapper");
		$("<img src=./img/logo.png>").appendTo("#logo");
		$("<h1>").html("My paint").appendTo("#logo");
		$(this).before($("<div>", {id: "panel"}).css({"background": opt.background}));
		$("<div>", {id: "img-save"}).appendTo("body");
		$("<div>", {id: "show-img"}).html("Images sauvegardé").appendTo("#wrapper");
		$("#panel").append(
		"<ul id=tools>"
			+ "<hr />"
			+ "<li id=line title=Crayon class='fa fa-pencil'></li>"
			+ "<li id=eraser title='Tout effacer' class='fa fa-eraser'></li>"
			+ "<li id=circle title='Cercle plein' class='fa fa-circle'></li>"
			+ "<li id='circle-o' title='Cercle vide' class='fa fa-circle-o'></li>"
			+ "<li id='square-o' title='Carré vide' class='fa fa-square-o'></li>"
			+ "<li id=square title='Carré plein' class='fa fa-square'></li>"
			// + "<li id='font' title=Texte class='fa fa-font'></li>"
			// + "<li id='back' title='Revenir en arrière' class='fa fa-undo'></li>"
			+ "<li id=color><input title=Couleur type=color ></li>"
			+ "<li id=thickness><input title=epaisseur type=range value=3 min=1 max=30 ></li>"
			+ "<li id='save' title=Sauvegarder class='fa fa-floppy-o'></li>"
			+ "<hr class=clear />" +
		"</ul>"
		);
		/** Fin: Création visuel de my_paint **/


		/** Début: Création et insertion du canvas temporaire **/
		var tmpCanvas = document.createElement('canvas');
		var tmpCtx = tmpCanvas.getContext('2d');
		$(tmpCanvas).attr({id: 'tmpCanvas', 'width': opt.width, 'height': opt.height});
		$(tmpCanvas).appendTo("#wrapper");
		/** Fin: Création et insertion du canvas temporaire **/

		function draw(nameFunction) {
				/* On attache un evenement au mouvement de la souris */
				tmpCanvas.addEventListener('mousemove', function(e) {
					mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
					mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
				}, false);
			
				tmpCanvas.addEventListener('mousedown', function(e) {
					tmpCanvas.addEventListener('mousemove', nameFunction, false);
					
					mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
					mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
					
					start_mouse.x = mouse.x;
					start_mouse.y = mouse.y;
					
					nameFunction();
				}, false);
			
				tmpCanvas.addEventListener('mouseup', function() {
					tmpCanvas.removeEventListener('mousemove', nameFunction, false);
					
					/** Chargement du dessin temporaire dans le context principale **/
					context.drawImage(tmpCanvas, 0, 0);
					
				}, false);
				
			
		}

		function line() {
			/** Efface le context temporaire **/
			tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);

			tmpCtx.beginPath();
			tmpCtx.moveTo(start_mouse.x, start_mouse.y);
			tmpCtx.lineTo(mouse.x, mouse.y);
			tmpCtx.stroke();
			tmpCtx.closePath();		
		}		

		function square() {
			/** Efface le context temporaire **/
			tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
			
			var x = Math.min(mouse.x, start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var width = Math.abs(mouse.x - start_mouse.x);
			var height = Math.abs(mouse.y - start_mouse.y);
			tmpCtx.strokeRect(x, y, width, height);	
		}		

		function squareFull() {
			/** Efface le context temporaire **/
			tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
			
			var x = Math.min(mouse.x, start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var width = Math.abs(mouse.x - start_mouse.x);
			var height = Math.abs(mouse.y - start_mouse.y);
			tmpCtx.fillRect(x, y, width, height);	
		}		

		function circle() {
			tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
			
			var x = (mouse.x + start_mouse.x) / 2;
			var y = (mouse.y + start_mouse.y) / 2;
			
			var radius = Math.max(
				Math.abs(mouse.x - start_mouse.x),
				Math.abs(mouse.y - start_mouse.y)
			) / 2;
			
			tmpCtx.beginPath();
			tmpCtx.arc(x, y, radius, 0, Math.PI*2, false);
			tmpCtx.stroke();
			tmpCtx.closePath();			
		}

		function circleFull() {
			tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
			
			var x = (mouse.x + start_mouse.x) / 2;
			var y = (mouse.y + start_mouse.y) / 2;
			
			var radius = Math.max(
				Math.abs(mouse.x - start_mouse.x),
				Math.abs(mouse.y - start_mouse.y)
			) / 2;
			
			tmpCtx.beginPath();
			tmpCtx.arc(x, y, radius, 0, Math.PI*2, false);
			tmpCtx.fill();
			tmpCtx.closePath();			
		}

		/** Début: Show/Hide du menu image **/

		var show = false;
		$("#wrapper").on('click', '#show-img', function() 
		{
			if (!show) 
			{
				show = true;
				$('#img-save').css({"right": 0});
				$(this).css({"right": 220});
				return;
			}
			if(show)
			{
				show = false;
				$('#img-save').css({"right": -220});
				$(this).css({"right": 50});
				return;
			}
		});

		/** Fin: Show/Hide du menu image **/

		/** Début: Chargement d'une image sauvegardé **/

		$('#img-save').on('click', 'img', function()
		{
			var url = $(this).attr('src');
			
			if (confirm('Voulez vous charger cette image ?')) {
				if (confirm('Coupler à l\'image actuelle ?')) {
					loadDraw(url);
					return;
				}
				context.clearRect(0, 0, myCanvas.width, myCanvas.height);
				loadDraw(url);
			}
		});

		/** Fin: Chargement d'une image sauvegardé **/

		/** Début: Chargement des images sauvegarder dans le menu image **/

		if (sessionStorage) 
		{
			var count = sessionStorage.nItem;

			for(var i = 0; i < count; i++) {
				tabImg.push(sessionStorage['item' + i]);
				if (i == count) {
					loadDraw(sessionStorage['item' + i]);
				}
			}

			count = count - 1;

			for(var j = 1; j < count; count--) {
				$("<img>").attr("src", tabImg[count]).css({"border": "2px solid " + opt.background}).appendTo("#img-save");
			}
		}

		/** Fin: Chargement des images sauvegarder dans le menu image **/

		/** Début: Hover sur les outils **/

		$("li")
			.mouseenter(function() {
				$(this).css({"background": "#fff", "color": opt.background});
			})
			.mouseleave(function() {
				$(this).css({"background": opt.background, "color": "#fff"});
			});

		/** Fin: Hover sur les outils **/


		/** Début: Définition des rôles des outils **/

		$("#tools li").on('click', function()
		{
			var tool = $(this).attr('id');

			switch(tool) {
				case 'line':
					draw(line);
				break;
				case 'square':
					draw(squareFull);
				break;
				case 'square-o':
					draw(square);
				break;
				case 'circle':
					draw(circleFull);
				break;
				case 'circle-o':
					draw(circle);
				break;
				case 'eraser':
					eraser();
				break;
				case 'save':
					save();
				break;
			}
		});

		/** Fin: Définition des rôles des outils **/

		/** Début: Choix d'un couleur **/
		$("input[type=color]").on('change', function()
		{
			opt.color = $(this).val();
			tmpCtx.strokeStyle = opt.color;
			tmpCtx.fillStyle = opt.color;
		});
		/** Fin: Choix d'un couleur **/

		/** Début: Choix de l'épaisseur **/
		$("input[type=range]").on('change', function()
		{
			opt.thickness = $(this).val();
			tmpCtx.lineWidth = opt.thickness;
		});
		/** Fin: Choix de l'épaisseur **/



		/** Save **/
		function save()
		{
			var draw = document.getElementById('paint');
			var url = draw.toDataURL();
			tabImg.push(url);
			var nItem = tabImg.length;
			for(var i = 0; i < nItem; i++) {
				sessionStorage["item" + i] = tabImg[i];
			}

			sessionStorage["nItem"] = nItem;

			var nowItem = nItem - 1

			if (sessionStorage['item' + nowItem] != 'undefined') {
				$("<img>").attr("src", url).css({"border": "2px solid " + opt.background}).insertBefore("#img-save img:first");
			}
		}
		/** Save **/

		/** Load draw **/
		function loadDraw(dataURL) {

		// load image from data url
		var draw = new Image();
		draw.onload = function() {
		  context.drawImage(this, 0, 0);
		};
		draw.src = dataURL;
		}
		/** Load draw **/		
	};
	return this;
})(jQuery);

$(document).ready(function()
{
	$("#paint").flatPaint();
});


