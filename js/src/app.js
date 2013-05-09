// declare the namespace for this app
var l_sch = {};

l_sch.App = Class.extend(
{
    NAME : "l_sch.App", 

    /**
     * @constructor
     * 
     */
    init : function()
    {
	    //this.view    = new example.View("canvas");
	    this.toolbar = new l_sch.Toolbar("toolbar",this);
	       
	    //layout the body
	    this.siteLayout = $('#container').layout({
			resizeWithWindowDelay : 10,
			north:{
				  resizable:false,
				  closable:false,
				  spacing_open:0,
				  spacing_closed:0,
				  size:24,
				  paneSelector: "#sitebar"
			},
			center: {
				  resizable:false,
				  closable:false,
				  spacing_open:0,
				  spacing_closed:0,
				  resizeWhileDragging:true,
				  paneSelector: "#l-sch-container"
			}
		});
	      
		//layout l-sch
	    this.appLayout = $('#l-sch-container').layout({
			north:{
				  resizable:false,
				  closable:false,
				  spacing_open:0,
				  spacing_closed:0,
				  //size:40,
				  paneSelector: "#toolbar"
			},
			center: {
				  resizable:true,
				  closable:true,
				  resizeWhileDragging:true,
				  paneSelector: "#content"
			}
		});
		
		//layout content
		this.contentLayout = $('#content').layout({
			west: {
				resizable:true,
				closable:true,
				minSize: 200,
				maxSize: 500,
				resizeWhileDragging:true,
				slideTrigger_open: "mouseover",
				togglerLength_closed:32,
				togglerAlign_closed:"top",
				hideTogglerOnSlide: true,
				togglerLength_open:0,
				togglerAlign_open:"top",
				spacing_closed:20,
				spacing_open:3,
				fxName:	"slide",
				fxSpeed_open:100,
				fxSpeed_close:400,
				paneSelector: "#library"
			},
			center: {
			  resizable:false,
			  closable:false,
			  spacing_open:0,
			  spacing_closed:0,
			  paneSelector: "#canvas"
			}
		});
		
		$("<span></span>").attr("id", "west-closer" ).addClass("ui-widget").prependTo( "#content > #library" );
		this.contentLayout.addCloseBtn("#west-closer", "west");
		
		this.appLayout.allowOverflow("north");
	},
	libraryShow:function(flag){
		if(flag == false)
			this.contentLayout.hide("west");
		else
			this.contentLayout.show("west",true);
	}
});
