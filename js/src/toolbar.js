

l_sch.Toolbar = Class.extend({
    
	NAME : "l_sch.Toolbar", 

    /**
     * @constructor
     * 
     */	
	init:function(elementId,app){
		this.highlevel			= $("#"+elementId);
		this.toolbar_container 	= $('<div></div>');
		this.menu_container		= $('<div></div>');
		this.highlevel.append(this.toolbar_container);
		this.highlevel.append(this.menu_container);
		this.app	= app;
		this.css 	= $("<style type='text/css'> </style>").appendTo("head");
		this.group	= undefined;
		this.klass	= "ui-button-toolbar";
		this.page_setup = {
			orientation	:	'landscape',
			paper		:	'a3',
			width 		:	297,
			height		:	420,
			color		:	'#ffffff'
		};
		this.maxPage	= 1;
		this.curPage	= 1;
		
		
		// Create Icons
		this.createIcon("book_21x24.png",			"ui-icon-book");
		this.createIcon("undo_alt_24x24.png",		"ui-icon-undo");
		this.createIcon("redo_alt_24x24.png",		"ui-icon-redo");
		this.createIcon("pin_24x24.png",			"ui-icon-pin");
		this.createIcon("cursor_24x24.png",			"ui-icon-cursor");
		this.createIcon("move_24x24.png",			"ui-icon-move");
		this.createIcon("arrow_left_alt1_24x24.png","ui-icon-prev-page");
		this.createIcon("arrow_right_alt1_24x24.png","ui-icon-next-page");
		this.createIcon("minus_alt_24x24.png",		"ui-icon-rem-page");
		this.createIcon("plus_alt_24x24.png",		"ui-icon-add-page");
		
		
		
		//Create Menus
		// id: Item id
		// text: text showed in menu
		// under: id of parent item (for sub menu)
		// icon: class icon
		// click: function called when item is clicked
		
		// File menu
		file_menu = new l_sch.Menu(this.menu_container);		
		file_menu.addItem({
				icon:'ui-icon-document',
				text:'New...'
			})
			.addItem({
				icon:'ui-icon-folder-open',
				text:'Open...'
			})
			.addItem({
				text:'Rename...'
			})
			.addItem({
				text:'Make a copy...'
			})
			.addItem({
				icon:'ui-icon-arrowthickstop-1-s',
				text:'Download as PDF'
			})
			.addSeparator()
			.addItem({
				text:'Page Setup...',
				click: $.proxy(function(){
					this.showDialog('page_setup');
				},this)
			})


		//Create Buttons
		
		// Inject the File Button and the callbacks
		//		
		this.createButton({
			type	: "dropdown",
			id		: "file",
			menu	: file_menu,
			check	: false,
			text	: true,
			label	: "File",
			icons	: {
				secondary: "ui-icon-triangle-1-s"
			}			
		});
		
		// Inject the Library Button and the callbacks
		//		
		this.createButton({
			type	: "checkbox",
			id		: "library",
			check	: true,
			text	: false,
			label	: "Library",
			icons	: {
				primary: "ui-icon-book"
			}			
		})
		.click($.proxy(function(){
	    	this.app.libraryShow($('#library').is(':checked'));				
			console.log("library clicked");
		},this));

		this.startGroup('gp-1');
		// Inject the Undo Button and the callbacks
		//		
		this.createButton({
			type	: "button",
			id		: "undo",
			text	: false,
			label	: "Undo",
			icons	: {
				primary: "ui-icon-undo"
			}			
		})
		.click($.proxy(function(){
		       
		},this));

		
		// Inject the Redo Button and the callbacks
		//		
		this.createButton({
			type	: "button",
			id		: "redo",
			text	: false,
			label	: "Redo",
			icons	: {
				primary: "ui-icon-redo"
			}			
		})
		.click($.proxy(function(){
		       
		},this));
		
		this.stopGroup();		
		

		//start a group to page
		this.startGroup('gp-cursor');
		// Inject the Cursor Button and the callbacks
		//
		this.createButton({
			type	: "radio",
			id		: "cursor",
			name	: "cursor",
			check	: true,
			text	: false,
			label	: "Cursor",
			icons	: {
				primary: "ui-icon-cursor"
			}			
		})
		.click($.proxy(function(){
		       
		},this));
		// Inject the Move Button and the callbacks
		//
		this.createButton({
			type	: "radio",
			id		: "move",
			name	: "cursor",
			check	: false,
			text	: false,
			label	: "Move",
			icons	: {
				primary: "ui-icon-move"
			}			
		})
		.click($.proxy(function(){
		       
		},this));
		//stop select cursor group
		this.stopGroup();
		
		
		this.createPageBar();
		
	},	
	createPageBar: function(){
		this.startGroup('gp-page');
		// Inject the PrevPage Button and the callback
		this.createButton({
			type	: "button",
			id		: "prev-page",
			text	: false,
			label	: "Previus Page",
			icons	: {
				primary: "ui-icon-prev-page"
			}			
		})
		.click($.proxy(function(){
			$('#cur-page').val(this.prevPage());
		},this));		
		//Inject page indicator and the callback
		this.group.append($(
			'<input type="text"id="cur-page"value="'+this.curPage+
			'"size="3"name="page"class="'+this.klass+
			' ui-widget ui-state-default"/>')
			.change($.proxy(function(e){
				val = $("#cur-page").val();
				if(val!=this.curPage){
					if(!this.gotoPage(val)){						
						$("#cur-page").val(this.curPage);
					}
				}
			},this)));
		//Number of Sheets
		this.group.append($(
		'<span id="max-page"class="'+this.klass+
				' ui-widget ui-state-default ui-toobar-text">/ '+
				this.maxPage+'</span>'));	
		// Inject the Next Page Button and the callback
		this.createButton({
			type	: "button",
			id		: "next-page",
			text	: false,
			label	: "Next Page",
			icons	: {
				primary: "ui-icon-next-page"
			}			
		})
		.click($.proxy(function(){
		    $('#cur-page').val(this.nextPage());
		},this));
		// Inject the Remove Page Button and the callback
		this.createButton({
			type	: "button",
			id		: "remove-page",
			text	: false,
			label	: "Remove Page",
			icons	: {
				primary: "ui-icon-rem-page"
			}			
		})
		.click($.proxy(function(){
			this.removePage();
			$('#max-page').empty();
			$('#max-page').text('/ '+this.maxPage);
			$('#cur-page').val(this.curPage);
		},this));
		// Inject the Add Page Button and the callback
		this.createButton({
			type	: "button",
			id		: "add-page",
			text	: false,
			label	: "Add Page",
			icons	: {
				primary: "ui-icon-add-page"
			}			
		})
		.click($.proxy(function(){
			this.addPage();
			$('#max-page').empty();
			$('#max-page').text('/ '+this.maxPage);
		},this));
		this.stopGroup();		
	},
	addPage:function(){
		return ++this.maxPage;		
	},
	removePage:function(){
		if(this.maxPage>1)this.maxPage--;
		if(this.curPage>this.maxPage)this.curPage = this.maxPage;
		return this.maxPage;
	},
	nextPage:function(){
		return ((this.curPage<this.maxPage)?++this.curPage:this.curPage);
	},
	prevPage:function(){
		return ((this.curPage>1)?--this.curPage:this.curPage);		
	},
	gotoPage:function(page){
		if(page>=1 && page<=this.maxPage){
			this.curPage = page;
			return true;
		}
		else{
			return false;
		}		
	},
	
	createIcon:function(file_name,class_name){
		this.css.append('.ui-button .ui-icon.'+class_name+'{background-image:url("./icons/blue/'+file_name+'");width:24px;height:24px;}');	
		this.css.append('.ui-button.ui-state-hover .ui-icon.'+class_name+'{background-image:url("./icons/cyan/'+file_name+'");width:24px;height:24px;}');			 
		this.css.append('.ui-button.ui-state-active .ui-icon.'+class_name+'{background-image:url("./icons/gray_dark/'+file_name+'");width:24px;height:24px;}');			 
	},
	
	
	createButton:function(attr){
		
		switch(attr.type)
		{
			default:
			case "button":
				str  = '<button id="'+attr.id+'" class="'+this.klass+'">'+attr.label+'</button>';
				break;
			case "dropdown":
			case "checkbox":
				str  = '<input type="checkbox" id="'+attr.id+'" class="'+this.klass+'"'
				if(attr.check == true) str += ' checked="checked"';
				str  +=' /><label for="'+attr.id+'" class="'+this.klass+'">'+attr.label+'</label>';
				break;
			case "radio":
				str = '<input type="radio" id="'+attr.id+'" name="'+attr.name+'" class="'+this.klass+'"';
				if(attr.check == true) str += ' checked="checked"';
				str +=' /><label for="'+attr.id+'" class="'+this.klass+'">'+attr.label+'</label>';
				break;
		}
		
		if(this.group !== undefined){
			this.group.append($(str));
		}
		else{
			this.toolbar_container.append($(str));
		}
		
		btn = $('#'+attr.id);

		if( attr.menu !== undefined ){
			attr.menu.attachToButton(btn);
		}
		
		return btn.button({
			text	: attr.text,
			label	: attr.label,
			disabled	: attr.disabled,
			icons	: attr.icons
		}).focus();
	},

	startGroup:function(group){		
		this.toolbar_container.append($('<span id="'+group+'" class="'+this.klass+'"></span>'));
		this.group = $('#'+group);
	},
	stopGroup:function(){
		if(this.group === undefined)return;
		this.group.buttonset();
		this.group = undefined;
	},
	showDialog:function(dialog){

		switch(dialog)
		{
			default:
			case 'page_setup':
				var radio =	'<input name="page-orientation"type="radio"value="portrait"'+
							(this.page_setup.orientation=='portrait'?' checked':'')+'>Portrait'+
							'<span style="padding:50px"><\span>'+
							'<input name="page-orientation"type="radio"value="landscape"'+
							(this.page_setup.orientation=='landscape'?' checked':'')+'>Landscape'
				var spinner =	'<fildset id="custom-paper"><p><label for="sp-width">Width:</label>'+
								'<input id="sp-width"class="spinner"size="6"name="spinner"/>cm'+
								'<label for="sp-height"style="margin-left:10px">Height:</label>'+
								'<input type="text"id="sp-height"class="spinner"size="6"name="spinner"/>cm</p></fieldset>'
				form = $('<form></<form>')
					.append('<p><b>Orientation</b></p>')
					.append(radio)
					.append('<p><b>Paper size</b></p>')
					.append(this.getPapersDropdown('page-paper-size',this.page_setup.paper))
					.append(spinner)
					.append("<p><b>Page color</b></p>")
					.append('<input id="page-color"type="text"class="cp-basic"value="'+this.page_setup.color+'" />');
				this.dialog=$('<div title="Page Setup"></div>')
					.append(form)
					.dialog({
					height: 'auto',
					width: 'auto',
					minHeight:320,
					minWidth:220,
					modal:true,
					buttons: {
						Cancel:function(){	
							$(this).remove();
						},
						Ok:$.proxy(function(){
							with(this.page_setup){
								paper 		= $('#page-paper-size').selectmenu("value");
								color 		= $('#page-color').val();
								orientation	= $('input:radio[name="page-orientation"]:checked').val();
								if(paper == 'custom'){
									width		= parseFloat($("#sp-width").spinner("value")) * 10.0;
									height		= parseFloat($("#sp-height").spinner("value"))* 10.0;
								}
								else{
									width		= this.papers[paper].width;
									height		= this.papers[paper].height;
								}
							}
							this.dialog.remove();
						},this)
					}
				});
				if(this.page_setup.paper != 'custom') $('#custom-paper').hide();
				$('.spinner').spinner({
					culture: 'pt-BR',
					min:	0.0,					
					page: 	1.0,
					step: 	0.1,
					numberFormat:"n1",
				});
				$("#sp-width").spinner("value",this.page_setup.width/10.0);
				$("#sp-height").spinner("value",this.page_setup.height/10.0);
				$('select#page-paper-size').selectmenu({
					style:'popup',
					width: 200,
					// use seleect callback
					select: function(event, options) {
						if (options.value == 'custom') { 
							$('#custom-paper').show();
							console.log('show');
						} else {
							$('#custom-paper').hide();
							console.log('hide');
						}
					}
				});
				$('.cp-basic').colorpicker({
					//showOn: 'focus',
					showOn:'both',
					buttonColorize: true,
					buttonImageOnly:true,
					buttonImage:'js/lib/colorpicker/images/ui-colorpicker.png',
					parts:	['header','map', 'bar', 'hex', 'preview','footer'],
					alpha: false,
					modal: false,
					mode: 's',
					layout: {
						hex:		[1, 0, 1, 1],
						preview:	[0, 0, 1, 1],
						map:		[0, 1, 2, 3],	// Left, Top, Width, Height (in table cells).
						bar:		[2, 1, 1, 3],
					}					
				});
				break
		}
	},
	getPapersDropdown:function (id,sel_key) {
		this.papers = {	"a0":		{"title":	"A0(84,1cm x  118,9cm)","width":	841,	"height":	1189},
						"a1":		{"title":	"A1(59,4cm x  84,1cm)",	"width":	594,	"height":	841},
						"a2":		{"title":	"A2(42,0cm x  59,4cm)",	"width":	420,	"height":	594},
						"a3":		{"title":	"A3(29,7cm x  42,0cm)",	"width":	297,	"height":	420},
						"a4":		{"title":	"A4(21,0cm x  29,7cm)",	"width":	210,	"height":	297},
						"a5":		{"title":	"A5(14,8cm x  21,0cm)",	"width":	148,	"height":	210},
						"a6":		{"title":	"A6(10,5cm x  14,8cm)",	"width":	105,	"height":	148},
						"a7":		{"title":	"A7(7,4cm x  10,5cm)",	"width":	74,		"height":	105},
						"a8":		{"title":	"A8(5,2cm x  7,4cm)",	"width":	52,		"height":	74},
						"a9":		{"title":	"A9(3,7cm x  5,2cm)",	"width":	37,		"height":	52},
						"a10":		{"title":	"A10(2,6cm x  3,7cm)",	"width":	26,		"height":	37},
						"custom":	{"title":	"Custom Size",			"width":	-1,		"height":	-1}};
		var dropdown = '<select name="'+id+'" id="'+id+'">';	
		for (var key in this.papers){
			dropdown += '<option value="'+key+'" ';
			if (key == sel_key) dropdown += 'selected';
			dropdown += '>'+this.papers[key].title+'</option>';
		}	
		dropdown += '</select>';
		return dropdown;
	}	
});

l_sch.Menu = Class.extend({
    NAME : "l_sch.Menu", 

    /**
     * @constructor
     * 
     */	
	init:function(container,menu_id){
		_id = (menu_id===undefined)?"":menu_id;
		this.html 		= $('<ul id="'+_id+'"></ul>');
		container.append(this.html);
		this.button		= null;
		this.prevItem 	= null;
		this.Item 		= null;
		this.ItemIndex	= 0;
		this.callbacks	= {};
	},
	addItem:function(attr){
		_id = (attr.id===undefined)?"":attr.id;
		_str =	'<li id='+_id+'><a>';
		if(attr.icon!==undefined){
			_str += '<span class="ui-icon '+attr.icon+'"></span>';
		}
		_str += attr.text+'</a></li>';
		if(attr.under!==undefined){	
			_under = this.html.find('#'+attr.under);
			if(!_under.has('ul').length){//add submenu
				_under.append('<ul></ul>');
			}			
			_item = $(_str);
			_under.find('ul').append(_item);
		}
		else{
			_item = $(_str);
			this.html.append(_item);
		}
		this.callbacks[this.ItemIndex.toString()] = attr.click;
		_item.attr('index',this.ItemIndex++);
		return this;
	},
	addSeparator:function(menu_id){
		_item = (menu_id===undefined)?this.html:this.html.find('#'+menu_id).find('ul');
		_item.append('<li class="ui-state-disabled ui-menu-separator"><a></a></li>');
		return this;
	},	
	attachToButton:function(button){
		this.button = button;	
		this.html.hide().menu();
		
		//select event
		this.html.on('menuselect',$.proxy(function(event,ui){			
			if(ui.item.has('ul').length) return; //is submenu
			index = ui.item.attr('index');
			if(this.callbacks[index] !== undefined)
				this.callbacks[index](); //item click event
			this._uncheckButton();
		},this));
		
		//focus event
		this.html.on('menufocus',$.proxy(function(event,ui){			
			this.prevItem = this.Item;
			this.Item = ui.item;
		},this));		
		
		//keydown event
		this.html.keydown($.proxy(function(event){
			console.log('keydown');
			if (event.keyCode==$.ui.keyCode.ESCAPE || event.keyCode==$.ui.keyCode.LEFT){
				if(this.prevItem.parent().attr('id') == this.html.attr('id')){
					this._uncheckButton();
				}
				this.prevItem = this.Item;
			}		
		},this));
		
		//mouse leave event
		this.html.bind('mouseleave',$.proxy(function(){
			this.timeout = setTimeout($.proxy(function(){
				if(this.html.is(':visible'))this._uncheckButton();
			},this),3000);
		},this));
		
		//mouse enter event
		this.html.bind('mouseenter',$.proxy(function(){
			clearTimeout(this.timeout);
		},this));
		
		//button click event
		this.button.click($.proxy(function(){
			if(	(this.button.is('input') && !this.button.is(':checked')) ||
				(!this.button.is('input') && this.html.is(':visible'))
			){
				this._uncheckButton();
			}
			else{			
				this.html.show().focus().position({
					my: "left bottom",
					at: "left top",
					of: this.button.is('input')?this.button.next():this.button
				});
			}
		},this));		
	},
	_uncheckButton:function(){
		if(this.button != null){
			clearTimeout(this.timeout);
			this.html.hide();
			this.button.removeAttr('checked').button( "refresh" );
		}
	}

});
