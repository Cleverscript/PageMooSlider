PageMooSlider
PageMooSlider is a small but powerful MooTools plugin that allows you to create navigation on your site

How to Use
PageMooSlider can be initialized at any time but is generally initialized at the top of the document during the page's normal load. Any of these methods

#JS
/* scrollspy instance */
window.addEvent('domready', function() {
           var page = /page=([^#&]*)/.exec(window.location.href);
			page = page ? page[1] : 400;
					
			new PageMooSlider({
			    container: $('page_slider1'),
			    pagesTotal: 400,
				pagesSpan: 10,
				pageCurrent: page,
				baseUrl: 'index.html?page='
		    });
		    
		    new PageMooSlider({
			    container: $('page_slider2'),
			    pagesTotal: 400,
				pagesSpan: 10,
				pageCurrent: page,
				returnOrder: true,
				baseUrl: 'index.html?page=%page%'
		    });
		    
		    new PageMooSlider({
			    container: $('page_slider3'),
			    pagesTotal: 400,
				pagesSpan: 10,
				pageCurrent: page,
				returnOrder: true,
				baseUrl: function(page) { alert('Your selected '+page) }
		    });
		    
		    new PageMooSlider({
			    container: $('page_slider4'),
			    pagesTotal: 400,
				pagesSpan: 10,
				pageCurrent: page,
				baseUrl: 'index.html?page=%page%',
				lang: {
					next  : "Next",
					last  : "Last",
					prior : "Prior",
					first : "First",
					arrowRight : String.fromCharCode(8594),
					arrowLeft  : String.fromCharCode(8592)
				}
		    });
		});


http://cleverscript.ru/index.php/javascript/mootools/15-pagemooslider
(c) 2010 PageMooSlider