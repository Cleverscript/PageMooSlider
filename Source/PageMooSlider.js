/*
---
script: PageMooSlider.js

description: PageMooSlider
  - page slider
  - based on Paginator 3000 and jQuery paginator plugin v 1.0.1 
  - coded by CleverScript.ru special for free use

authors:
- Lexx
- cleverscript

requires:
core/1.2.4:   '*'

provides: [PageMooSlider, prepareHtml, makePagesTableHtml, initScrollThumb, setScrollThumbWidth, moveScrollThumb, initPageCurrentMark, setPageCurrentPointWidth, setPageCurrentPointWidth, movePageCurrentPoint, initEvents, drawPages, drawReturn, enableSelection, disableSelection]
 
license: GPL
...
*/

var PageMooSlider = new Class({
	Implements: [Options],
	options: {
	    container   : null,
		pagesTotal  : 1,
	 	pagesSpan   : 10,
	 	pageCurrent : 1,
		baseUrl     : './page/',
	 	returnOrder : false,
	 	lang        : { 
	 	    next  : "Следующая",
            last  : "Последняя",
            prior : "Предыдущая",
            first : "Первая",
            arrowRight : String.fromCharCode(8594),
            arrowLeft  : String.fromCharCode(8592)
		},
		html        : {
	       holder           : null,
		   table            : null,
		   trPages          : null, 
		   trScrollBar      : null,
		   tdsPages         : null,
		   scrollBar        : null,
		   scrollThumb      : null,
		   pageCurrentMark  : null
        },
        this_class  : null //internal access in this class
	},
	initialize: function(options){
		this.setOptions(options); //get user options and set for class
		var options = this.options;
		options.this_class = this; 
		
        options.pagesSpan = options.pagesSpan < options.pagesTotal ? options.pagesSpan : options.pagesTotal;
        options.pageCurrent = options.pagesTotal < options.pageCurrent ? options.pagesTotal : options.pageCurrent;
        if (($type(options.baseUrl) != 'function') && !options.baseUrl.match(/%page%/i)) options.baseUrl += '%page%';
        
        if (options.container)
        {
            options.html.holder = options.container;
        }
        else
        {
            alert('Error: container not found');
            return false;
        }
        
        this.prepareHtml();
        this.initScrollThumb();
        this.initPageCurrentMark();
        this.initEvents();
	},
	prepareHtml: function()
	{
	    var options = this.options;
		var html = this.options.html;
		
        html.holder.set('html', this.makePagesTableHtml() );
        html.table = html.holder.getElements('table table')[0];
        html.trPages = html.table.getElements('tr')[0];
        html.tdsPages = html.trPages.getChildren('td');
        html.scrollBar = html.holder.getElement('div.scroll_bar');
        html.scrollThumb = html.holder.getElement('div.scroll_thumb');
        html.pageCurrentMark = html.holder.getElement('div.current_page_mark');
        if (options.pagesTotal == options.pagesSpan) {
            html.holder.addClass('fullsize');
        }
	},
	makePagesTableHtml: function()
	{
		var options = this.options;
		
		var tdWidth = (100 / (options.pagesSpan + 2)) + '%';
     
        var isFunc = ($type(options.baseUrl) == 'function');

        var next_page = (parseInt(options.pageCurrent)< parseInt(options.pagesTotal)) ? parseInt(options.pageCurrent) + 1 : options.pagesTotal;
        	 
        var next  = '<a class="lr_link" href="';
           next += isFunc ? 'javascript:;' : options.baseUrl.replace(/%page%/i, next_page);
           next += '" rel="' + next_page + '">%next%</a>';
        var last  = '<a class="lr_link" href="';
           last +=  isFunc ? 'javascript:;' : options.baseUrl.replace(/%page%/i, options.pagesTotal);
           last += '" rel="' + options.pagesTotal + '">%last%</a>';

        var prior_page = (parseInt(options.pageCurrent) > 1) ? parseInt(options.pageCurrent) - 1 : 1;

        var prior = '<a class="lr_link" href="';
           prior += isFunc ? 'javascript:;' : options.baseUrl.replace(/%page%/i, prior_page);
           prior += '" rel="' + prior_page + '">%prior%</a>';
        var first = '<a class="lr_link" href="';
           first += isFunc ? 'javascript:;' : options.baseUrl.replace(/%page%/i, 1);
           first += '" rel="' + 1 + '">%first%</a>';


        if (options.returnOrder){
         var top_left       = options.lang.arrowLeft + ' ' + options.lang.next;
         var bottom_left    = options.lang.last;
         var top_right      = options.lang.prior + ' ' + options.lang.arrowRight;
         var bottom_right   = options.lang.first;
         
         if (options.pageCurrent !== options.pagesTotal){
           var top_left     = next.replace(/%next%/, top_left);
           var bottom_left  = last.replace(/%last%/, bottom_left);
         }
         
         if (options.pageCurrent !== 1){
           var top_right    = prior.replace(/%prior%/, top_right);
           var bottom_right = first.replace(/%first%/, bottom_right);
         }
         
        } else {
         var bottom_right   = options.lang.last;
         var top_right      = options.lang.next + ' ' + options.lang.arrowRight;
         var top_left       = options.lang.arrowLeft + ' ' + options.lang.prior;
         var bottom_left    = options.lang.first;
         
         if (options.pageCurrent !== options.pagesTotal){
           var top_right    = next.replace(/%next%/, top_right);
           var bottom_right = last.replace(/%last%/, bottom_right);
         }
         
         if (options.pageCurrent !== 1){
           var top_left     = prior.replace(/%prior%/, top_left);
           var bottom_left  = first.replace(/%first%/, bottom_left);
         }
        }

        var html = '' +
        '<table style="width:100%;">'+
         '<tr>' +
           '<td class="left top">' + top_left + '</td>' +
           '<td class="spaser"></td>' +
           '<td rowspan="2" align="center">' +
             '<table>' +
               '<tr>'
	             for (var i=1; i<=options.pagesSpan; i++){
		           html += '<td style="width:' + tdWidth + '"></td>';
	             }
	             html += '' +
               '</tr>' +
               '<tr>' +
	             '<td colspan="' + options.pagesSpan + '">' +
		           '<div class="scroll_bar">' + 
		             '<div class="scroll_trough"></div>' + 
			         '<div class="scroll_thumb">' + 
				        '<div class="scroll_knob"></div>' + 
			         '</div>' + 
			         '<div class="current_page_mark"></div>' + 
		           '</div>' +
	             '</td>' +
               '</tr>' +
             '</table>' +
           '</td>' + 
           '<td class="spaser"></td>' +
           '<td class="right top">' + top_right + '</td>' +
        '</tr>' + 
        '<tr>' +
          '<td class="left bottom">' + bottom_left + '</td>' + 
          '<td class="spaser"></td>' +
          '<td class="spaser"></td>' +
          '<td class="right bottom">' + bottom_right + '</td>' +
        '</tr>' +
        '</table>';

        return html;
	},
	initScrollThumb: function()
	{
	    var options = this.options;
	    var html = this.options.html;
	
        html.scrollThumb.widthMin = '8';
        html.scrollThumb.widthPercent = options.pagesSpan/options.pagesTotal * 100;
        html.scrollThumb.xPosPageCurrent = (options.pageCurrent - Math.round(options.pagesSpan/2))/options.pagesTotal * html.table.getWidth();
        if (options.returnOrder) {
            html.scrollThumb.xPosPageCurrent = html.table.getWidth() - (html.scrollThumb.xPosPageCurrent + Math.round(options.pagesSpan/2)/options.pagesTotal * html.table.getWidth());
        }
        html.scrollThumb.xPos = html.scrollThumb.xPosPageCurrent;
        html.scrollThumb.xPosMin = 0;
        html.scrollThumb.xPosMax;
        html.scrollThumb.widthActual;
        
        this.setScrollThumbWidth();
	},
	setScrollThumbWidth: function()
	{
	    var html = this.options.html;
	    
	    html.scrollThumb.setStyle('width', html.scrollThumb.widthPercent + "%");
        html.scrollThumb.widthActual = html.scrollThumb.getWidth();

        if (html.scrollThumb.widthActual < html.scrollThumb.widthMin)
            html.scrollThumb.setStyle('width', html.scrollThumb.widthMin + 'px');

        html.scrollThumb.xPosMax = html.table.getWidth() - html.scrollThumb.widthActual;
	},
	moveScrollThumb: function()
	{
	    var html = this.options.html;
	    
	    html.scrollThumb.setStyle('left', html.scrollThumb.xPos + "px");
	},
	initPageCurrentMark: function()
	{
	    var options = this.options;
	    var html = this.options.html;
	    
	    html.pageCurrentMark.widthMin = '3';
        html.pageCurrentMark.widthPercent = 100 / options.pagesTotal;
        html.pageCurrentMark.widthActual;
        
        this.setPageCurrentPointWidth();
        this.movePageCurrentPoint();
	},
	setPageCurrentPointWidth: function()
	{
	    var html = this.options.html;
	    
	    html.pageCurrentMark.setStyle('width', html.pageCurrentMark.widthPercent + '%');

        html.pageCurrentMark.widthActual = html.pageCurrentMark.getWidth();

        if (html.pageCurrentMark.widthActual < html.pageCurrentMark.widthMin)
            html.pageCurrentMark.setStyle('width', html.pageCurrentMark.widthMin + 'px');
	},
	movePageCurrentPoint: function()
	{
	    var options = this.options;
	    var html = this.options.html;
	    
	    var pos = 0;
        if (html.pageCurrentMark.widthActual < html.pageCurrentMark.getWidth()){
            pos = (options.pageCurrent - 1) / options.pagesTotal * html.table.getWidth() - html.pageCurrentMark.getWidth() / 2;
        } else {
            pos = (options.pageCurrent - 1) / options.pagesTotal * html.table.getWidth();
        }

        if (options.returnOrder) pos = html.table.getWidth() - pos - html.pageCurrentMark.getWidth(); 

        html.pageCurrentMark.setStyle('left', pos + 'px'); 	
	},
	initEvents: function()
	{
	    var options = this.options;
	    var html = this.options.html;
	    
	    this.moveScrollThumb();
	    
        options.returnOrder ? this.drawReturn() : this.drawPages();
        
        html.scrollThumb.addEvent('mousedown', function(e){
            var dx = e.page.x - html.scrollThumb.xPos;
            
            document.addEvent('mousemove', function(e) {
	            html.scrollThumb.xPos = e.page.x - dx;
            	
	            options.this_class.moveScrollThumb();
	            options.returnOrder ? options.this_class.drawReturn() : options.this_class.drawPages();
            });

            document.addEvent('mouseup', function() {
	            document.removeEvents('mousemove');
	            options.this_class.enableSelection();
            });

            options.this_class.disableSelection();
        });
        
        if ($type(options.baseUrl) == 'function'){
            html.holder.getElements('.lr_link').addEvent('click', function (e){
                options.baseUrl( parseInt(this.getProperty('rel')) );
            });
        };
        
        window.addEvent('resize', function () {
            options.this_class.setPageCurrentPointWidth();
            options.this_class.movePageCurrentPoint();
            options.this_class.setScrollThumbWidth();
        });
	},
	drawPages: function()
	{
	    var options = this.options;
	    var html = this.options.html;
	    
	    var percentFromLeft = html.scrollThumb.xPos / html.table.getWidth();
        var cellFirstValue = Math.round(percentFromLeft * options.pagesTotal);

        var data = '';

        if (cellFirstValue < 1){
            cellFirstValue = 1;
            html.scrollThumb.xPos = 0;
            this.moveScrollThumb();
        } else if (cellFirstValue >= options.pagesTotal - options.pagesSpan) {
            cellFirstValue = options.pagesTotal - options.pagesSpan + 1;
            html.scrollThumb.xPos = html.table.getWidth() - html.scrollThumb.getWidth();
            this.moveScrollThumb();
        }

        var isFunc = ($type(options.baseUrl) == 'function'); 

        for(var i=0; i < html.tdsPages.length; i++)
        {	
            var cellCurrentValue = cellFirstValue + i;
            
            if(cellCurrentValue == options.pageCurrent){
              data = '<span> <strong>' + cellCurrentValue + '</strong> </span>';
            } else {
              data = '<span> <a href="'; 
              data += isFunc ? 'javascript:;' : options.baseUrl.replace(/%page%/i, cellCurrentValue);       
              data += '">' + cellCurrentValue + '</a> </span>';
            };
            html.tdsPages[i].set('html', data);
            
            if (isFunc) {
                html.tdsPages[i].getElements('a').addEvent('click', function (e){
                    options.baseUrl(this.get('html'));
		        });  
            }
            
        }
	},
	drawReturn: function()
	{
	    var options = this.options;
	    var html = this.options.html;
	    
	    var percentFromLeft = html.scrollThumb.xPos / html.table.getWidth();
        var cellFirstValue = options.pagesTotal - Math.round(percentFromLeft * options.pagesTotal);

        var data = '';
        
        if (cellFirstValue < options.pagesSpan)
        {
            cellFirstValue = options.pagesSpan;
            html.scrollThumb.xPos = html.table.getWidth() - html.scrollThumb.getWidth();
            this.moveScrollThumb();
        } else if (cellFirstValue >= options.pagesTotal) {
            cellFirstValue = options.pagesTotal;
            html.scrollThumb.xPos = 0;
            this.moveScrollThumb();
        } 
        
        var isFunc = ($type(options.baseUrl) == 'function'); 

        for(var i=0; i < html.tdsPages.length; i++){	
            var cellCurrentValue = cellFirstValue - i;
            if(cellCurrentValue == options.pageCurrent){
              data = '<span> <strong>' + cellCurrentValue + '</strong> </span>';
            } else {
              data = '<span> <a href="'; 
              data += isFunc ? 'javascript:;' : options.baseUrl.replace(/%page%/i, cellCurrentValue);       
              data += '">' + cellCurrentValue + '</a> </span>';
            };
            html.tdsPages[i].set('html', data);
            
            if (isFunc){
                html.tdsPages[i].getElements('a').addEvent('click', function (){
  				    options.baseUrl(this.get('html'));
 			    });  
            }
            
        }
	},
	enableSelection: function()
	{
	    document.onselectstart = function() {
		    return true;
	    };
	},
	disableSelection: function()
	{
	    var html = this.options.html;
	       
	    document.onselectstart = function(){
		    return false;
	    };  
	    html.scrollThumb.focus();
	}
});