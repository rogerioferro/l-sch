
l_sch.View = draw2d.Canvas.extend({
    
    init:function(id,app){
        this.app    = app;
        this.sheet  = null;
        this.calcBounds();
        $("#"+id).width(this.max_width).height(this.max_height);
        this._super(id);
        this.setScrollArea("#"+id);
        this.saveMinSize();
        this.drawPaper();
        
        /*
        var rect = new draw2d.shape.basic.Rectangle();
        rect.setDimension(150,100);
        rect.setBackgroundColor('#ffffff');
        //rect.setSelectable(false);
        rect.setDraggable(false);
        this.addFigure(rect,10.5,10.5);
        */
        
        var figure1 = new draw2d.shape.analog.ResistorVertical();
        var figure2 = new draw2d.shape.analog.VoltageSupplyVertical();
        this.addFigure(figure1,200.5,120.5);
        this.addFigure(figure2,100.5,100.5);
    },
    updatePaper: function(){
        this.calcBounds();
        this.html.width(this.max_width).height(this.max_height);
        this.saveMinSize();
        this.paper.setSize(this.min_width,this.min_height);
        this.drawPaper();
        this.app.contentLayout.resizeAll();
    },
    calcBounds:function(){
        with(this.app.page_setup){
            //console.log('w:'+this.getWidth()+'h:'+this.getHeight());
            var sheet_w = (orientation == 'portrait'?width:height);
            var sheet_h = (orientation == 'portrait'?height:width);
            this.sheet_x        = '10mm';
            this.sheet_y        = '10mm';            
            this.sheet_width    = sheet_w + 'mm'
            this.sheet_height   = sheet_h + 'mm'
            this.max_width      = sheet_w+20+'mm';
            this.max_height     = sheet_h+20+'mm';
            console.log('w:'+this.max_width+'h:'+this.max_height);
        }
    },
    saveMinSize:function(){
        this.min_width  = this.getWidth();
        this.min_height = this.getHeight();
    },
    drawPaper:function(){
        if(this.sheet == null){
            this.sheet = this.paper.rect(this.sheet_x,this.sheet_y,
                                         this.sheet_width,this.sheet_height);
        }
        else{
            this.sheet.attr({
                width   : this.sheet_width,
                height  : this.sheet_height
            });
        }
        this.sheet.attr({
            fill      : '#ffffff',
            stroke    : '#cacaca'
            
        });
    },
    resize:function(){
        var w0  = this.min_width;
        var w1  = this.getWidth();
        var h0  = this.min_height;
        var h1  = this.getHeight();
        var w   = w1>w0?w1:w0;
        var h   = h1>h0?h1:h0;
        this.paper.setSize(w,h);
        
        this.html.css("overflow-x", (w == w1)?"hidden":"auto");
        this.html.css("overflow-y", (h == h1)?"hidden":"auto");
        
        //this.html.show();
        //this.html.css("overflow", "auto");
        //this.html.scrollLeft(0);
        
        
        console.log('window size');
        w = this.html.prop('scrollWidth');
        h = this.html.prop('scrollHeight');
        console.log('w:'+w+'/h:'+h);
        console.log('Paper size:');
        w = this.paper.width;
        h = this.paper.height;
        console.log('w:'+w+'/h:'+h);
        console.log('Min Paper size');
        w = this.min_width;
        h = this.min_height;
        console.log('w:'+w+'/h:'+h);
    }
    
});
