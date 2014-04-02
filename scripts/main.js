//tutorial
//http://www.webappers.com/2013/02/08/how-to-make-sprite-animations-with-html5-canvas/

app.main = (function(){
	window.requestAnimFrame = (function(){ 
    return window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame || 
    function( callback ){ 
      window.setTimeout(callback, 1000 / 60); 
    }; 
  })();
  window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
  } )();


  var cache = {
    // If url is '' (no fragment), display this div's content.
    '': $('.bbq-default')
  };

  // Bind an event to window.onhashchange that, when the history state changes,
  // gets the url from the hash and displays either our cached content or fetches
  // new content to be displayed.
  $(window).bind( 'hashchange', function(e) {
    
    // Get the hash (fragment) as a string, with any leading # removed. Note that
    // in jQuery 1.4, you should use e.fragment instead of $.param.fragment().
    var url = $.param.fragment();
    
    // Remove .bbq-current class from any previously "current" link(s).
    $( 'a.bbq-current' ).removeClass( 'bbq-current' );
    console.log("url: " + url);

    if(url){
      // Hide any visible ajax content.
      $( '.bbq-content' ).children( ':visible' ).hide();
    }

    
    // Add .bbq-current class to "current" nav link(s), only if url isn't empty.
    url && $( 'a[href="#' + url + '"]' ).addClass( 'bbq-current' );

    //if we are not on default page
    if($('a.bbq-current').data("page")){
      console.log("yes");
      if(anim.reached == true){
        console.log("reached");
        //we are either at the last frame in the anim or at the beginning after reversing
        if(anim.getCurrFrame() != 0){
          //we are at the end! either load ajax or reverse
          console.log("at the end of an anim!")

          if(contentDisplayed == false){
            console.log('load content');
            loadContent(cache, url);
            contentDisplayed = true;
          }else{
            //reverse
            console.log("REVERSE!");
            anim.setDestFrame(0);
            anim.setReached(false);
            contentDisplayed = false;

          }
        }else{
          //we have reversed and need to load a new anim
          console.log("finished reversing!!");
          anim.setReached(true);
          makeAnim();
        }

        update();
      }else{
        //starting a new anim from zero
        console.log("NOT REACHED!!");
        makeAnim();
      }
    }
    // frame = 0;
    //do some shit with frame and destFrame

    console.log("--------end hashchange----------");
  })
  function makeAnim(){
    page = $('a.bbq-current').data("page");
    anim = new app.anim.Anim(canvas,page);
    update();
  }
  function loadContent(cache, url){
    if ( cache[ url ] ) {
      // Since the element is already in the cache, it doesn't need to be
      // created, so instead of creating it again, let's just show it!

      cache[ url ].show();
      
    } else {
      // Show "loading" content while AJAX content loads.
      $( '.bbq-loading' ).show();
      
      // Create container for this url's content and store a reference to it in
      // the cache.
      cache[ url ] = $( '<div class="bbq-item"/>' )
        
        // Append the content container to the parent container.
        .appendTo( '.bbq-content' )
        
        // Load external content via AJAX. Note that in order to keep this
        // example streamlined, only the content in .infobox is shown. You'll
        // want to change this based on your needs.
        .load( url, function(){
          // Content loaded, hide "loading" content.
          $( '.bbq-loading' ).hide();
        });
    }
    contentDisplayed = true;
  }

  var canvas = null;
  var lastUpdateTime = 0; 
  var acDelta = 0; 
  var msPerFrame = 50;
  var contentDisplayed = false;


  var anim;
  
  function init() {
    console.log("init");
    reached = false;
    canvas = document.getElementById('animCanvas');
    var page = 'default';

    //load images before doing anything else

    // create object
    imageObj = new Image();


    // set image list
    images = ["images/about.png","images/contact.png","images/work.png"]

    // start preloading
    for(var i=0; i<=images.length-1; i++) 
    {
      imageObj.src=images[i];
    }
    $(imageObj).load(function(){
      anim = new app.anim.Anim(canvas,page);
      $(window).on('resize', function(){
        anim.resize();
      });

      $(window).trigger( 'hashchange' );
      console.log('accordion');
      $( "#accordion" ).accordion();

      $(".loading").hide();
    });
    

  }  
  function update() { 
    var request = requestAnimFrame(update); 
    var delta = Date.now() - lastUpdateTime; 
    
    if (acDelta > msPerFrame) {
      // console.log("frame: " + frame);
      //draw frame
      acDelta = 0;

      //check if we reached the destFrame
      if(anim.reached == false){
        anim.update(request);
      }else{
        //cancel request if so
        cancelRequestAnimFrame(request);

      }
      
    } else { 
      //dont draw frame
      acDelta += delta; 
    } 
    
    lastUpdateTime = Date.now();
  }
  
  

	//Public interface
	return{
		init : init
		//someVar : someVar,
		//someFunc : someFunc
	}
})();