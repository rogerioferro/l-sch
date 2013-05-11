/**
 * File     : app.js
 * Author   : Rogério Ferro do Nascimento
 *
 *  Main app
 **/


/**
 * Declare the namespace for this app
 **/
var l_sch = {};

/**
 * Class    : l_sch.App
 *      is responsible for layout and dialogs
 *
 **/
l_sch.App = Class.extend(
{
    NAME : "l_sch.App",

    /**
     * Constructor
     */
    init : function()
    {
        this.page_setup = {
            orientation :   'landscape',
            paper       :   'a3',
            width       :   297,
            height      :   420,
            color       :   '#ffffff'
        };
        //this.view    = new l_sch.View("canvas");
        this.toolbar = new l_sch.Toolbar("toolbar",this);
        this.createLayout();

    },
    /**
     *  libraryShow:
     *      Hide/Show Library panel
     **/
    libraryShow:function(flag){
        if(flag == false)
            this.contentLayout.hide("west");
        else
            this.contentLayout.show("west",true);
    },
    /**
     * createLayout:
     *      configure the panels layout
     **/
    createLayout:function(){
        //layout the body
        this.siteLayout = $('#container').layout({
            resizeWithWindowDelay       :   10,
            north:{
                resizable               :   false,
                closable                :   false,
                spacing_open            :   0,
                spacing_closed          :   0,
                size                    :   24,
                paneSelector            :   "#sitebar"
            },
            center: {
                resizable               :   false,
                closable                :   false,
                spacing_open            :   0,
                spacing_closed          :   0,
                resizeWhileDragging     :   true,
                paneSelector            :   "#l-sch-container"
            }
        });
        //layout l-sch
        this.appLayout = $('#l-sch-container').layout({
            north:{
                resizable               :   false,
                closable                :   false,
                spacing_open            :   0,
                spacing_closed          :   0,
                paneSelector            :   "#toolbar"
            },
            center: {
                resizable               :   true,
                closable                :   true,
                resizeWhileDragging     :   true,
                paneSelector            :   "#content"
            }
        });
        //layout content
        this.contentLayout = $('#content').layout({
            west: {
                resizable               :   true,
                closable                :   true,
                minSize                 :   200,
                maxSize                 :   500,
                resizeWhileDragging     :   true,
                slideTrigger_open       :   "mouseover",
                togglerLength_closed    :   32,
                togglerAlign_closed     :   "top",
                hideTogglerOnSlide      :   true,
                togglerLength_open      :   0,
                togglerAlign_open       :   "top",
                spacing_closed          :   20,
                spacing_open            :   3,
                fxName                  :   "slide",
                fxSpeed_open            :   100,
                fxSpeed_close           :   400,
                paneSelector            :   "#library"
            },
            center: {
                resizable               :   false,
                closable                :   false,
                spacing_open            :   0,
                spacing_closed          :   0,
                paneSelector            :   "#canvas"
            }
        });
       
        //add custom Close Button
        $("<span/>")
            .attr("id", "west-closer")
            .hover(
                function(){
                    $(this).addClass("ui-layout-button-close-hover");
                },
                function(){
                    $(this).removeClass("ui-layout-button-close-hover");
                }
            )
            .prependTo("#content > #library");
            
        this.contentLayout.addCloseBtn("#west-closer", "west");
        
        //Enable popup menu on #toolbar
        this.appLayout.allowOverflow("north");
    },
    showDialog:function(dialog){
        switch(dialog)
        {
            default:
            case 'page_setup':
                this.showDlgPageSetup();
                break
        }
    },
    showDlgPageSetup:function(){
        var orientation = $('<fildset/>')
            .append($('<p/>').append($('<b/>').text('Orientation')))
            .append($('<input/>').attr({
                name    :   "page-orientation",
                type    :   "radio",
                value   :   "portrait"
            }).prop("checked",this.page_setup.orientation=='portrait'))
            .append($('<label/>').text('Portrait'))
            .append($('<span/>').css("padding-left","30px"))
            .append($('<input/>').attr({
                name    :   "page-orientation",
                type    :   "radio",
                value   :   "landscape"
            }).prop("checked",this.page_setup.orientation=='landscape'))
            .append($('<label/>').text('Landscape'));
        var paper_size  = $('<fildset/>')
            .append($('<p/>').append($('<b/>').text('Paper size')))
            .append(this.getPapersDropdown('page-paper-size',this.page_setup.paper));
        var custom_size = $('<fildset id="custom-paper"/>')
            .append($('<p/>')
                .append($('<label for="sp-width"/>').text('Width:'))
                .append($('<input/>').attr({id:"sp-width",size:"6",class:"spinner"}))
                .append($('<label for="sp-width"/>').text('cm'))
                .append($('<label for="sp-height"/>').text('Height:'))
                .append($('<input/>').attr({id:"sp-height",size:"6",class:"spinner"}))
                .append($('<label for="sp-height"/>').text('cm'))
            );
        var page_color  = $('<fildset/>')
            .append($('<p/>').append($('<b/>').text('Page color')))
            .append($('<input/>').attr({
                id      :   "page-color",
                type    :   "text",
                size    :   "7"
                }).val(this.page_setup.color)
            );
        var form = $('<form/>')
            .append(orientation)
            .append(paper_size)
            .append(custom_size)
            .append(page_color);

        this.dlgPageSetup=$('<div title="Page Setup"/>')
            .append(form)
            .dialog({
                height      :   'auto',
                width       :   'auto',
                minHeight   :   320,
                minWidth    :   220,
                modal       :   true,
                buttons     :   {
                    Cancel  :   function(){$(this).remove();},
                    Ok      :   $.proxy(function(){
                        with(this.page_setup){
                            paper       = $('#page-paper-size').selectmenu("value");
                            color       = $('#page-color').val();
                            orientation = $('input:radio[name="page-orientation"]:checked').val();
                            console.log(orientation);
                            if(paper == 'custom'){
                                width       = parseFloat($("#sp-width").spinner("value")) * 10.0;
                                height      = parseFloat($("#sp-height").spinner("value"))* 10.0;
                            }
                            else{
                                width       = this.papers[paper].width;
                                height      = this.papers[paper].height;
                            }
                        }
                        this.dlgPageSetup.remove();
                    },this)
                }
            });
        if(this.page_setup.paper != 'custom') $('#custom-paper').hide();
        $('.spinner').spinner({
            culture: 'pt-BR',
            min:    0.0,
            page:   1.0,
            step:   0.1,
            numberFormat:"n1",
        });
        $("#sp-width").spinner("value",this.page_setup.width/10.0);
        $("#sp-height").spinner("value",this.page_setup.height/10.0);
        $('select#page-paper-size').selectmenu({
            style:'popup',
            width: 200,
            // Select callback
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
        $('#page-color').colorpicker({
            //showOn: 'focus',
            showOn:'both',
            buttonColorize: true,
            buttonImageOnly:true,
            buttonImage:'css/colorpicker/images/ui-colorpicker.png',
            parts:  ['header','map', 'bar', 'hex', 'preview','footer'],
            alpha: false,
            modal: false,
            mode: 's',
            layout: {
                hex:        [1, 0, 1, 1],
                preview:    [0, 0, 1, 1],
                map:        [0, 1, 2, 3],   // Left, Top, Width, Height (in table cells).
                bar:        [2, 1, 1, 3],
            }
        });
    },
    getPapersDropdown:function (id,sel_key) {
        this.papers = { "a0":       {"title":   "A0(84,1cm x  118,9cm)","width":    841,    "height":   1189},
                        "a1":       {"title":   "A1(59,4cm x  84,1cm)", "width":    594,    "height":   841},
                        "a2":       {"title":   "A2(42,0cm x  59,4cm)", "width":    420,    "height":   594},
                        "a3":       {"title":   "A3(29,7cm x  42,0cm)", "width":    297,    "height":   420},
                        "a4":       {"title":   "A4(21,0cm x  29,7cm)", "width":    210,    "height":   297},
                        "a5":       {"title":   "A5(14,8cm x  21,0cm)", "width":    148,    "height":   210},
                        "a6":       {"title":   "A6(10,5cm x  14,8cm)", "width":    105,    "height":   148},
                        "a7":       {"title":   "A7(7,4cm x  10,5cm)",  "width":    74,     "height":   105},
                        "a8":       {"title":   "A8(5,2cm x  7,4cm)",   "width":    52,     "height":   74},
                        "a9":       {"title":   "A9(3,7cm x  5,2cm)",   "width":    37,     "height":   52},
                        "a10":      {"title":   "A10(2,6cm x  3,7cm)",  "width":    26,     "height":   37},
                        "custom":   {"title":   "Custom Size",          "width":    -1,     "height":   -1}};
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
