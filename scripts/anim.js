app.anim = (function(){

  window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
  } )();

  function Anim(canvas, page){
    //need canvas context stuff
    this.currFrame = 0;
    this.currRow = 0;
    this.currCol = 0;
    this.MAX_COL = 7; //#of cols in sprite sheet -1
    this.MAX_ROW = 3; //#of rows in sprite sheet -1
    this.frameWidth = 1024;
    this.frameHeight = 768;
    this.imageReady = false;
    this.destFrame;
    this.reached = false;
    this.canvas = canvas;
    this.page = page;


    this.setUp(canvas, page);

  }
  Anim.prototype.setUp = function(canvas, page) {
    console.log("anim setUp page: " + page);

    this.ctx = canvas.getContext("2d");

    //store object referrence...
    var that = this;

    //image to become the current img
    var img = new Image();

    //load images before doing anything else

    // create array
    var imageObjs =[];
    
    // set image list
    var images = ["butt.png","images/about.png","images/work.png","images/contact.png"];

    //create object for all images
    var allImages;

    // start preloading
    for(var i=0; i<=images.length-1; i++) 
    {
      imageObj = new Image();
      imageObj.src=images[i];
      imageObjs[i] = imageObj;
    }

    $(imageObj).load(function(){
      console.log("LOADED IMAGES!");
      allImages = {
        home: imageObjs[0],
        about: imageObjs[1],
        work : imageObjs[2],
        contact: imageObjs[3]
      }
      that.allImages = allImages;
      
      that.img = allImages[page];


      if(page != 'home'){
        //we are showing the default screen
        that.destFrame = $('a.bbq-current').data("frame");
      }

      $(window).trigger( 'hashchange' );
      $( "#accordion" ).accordion();

      //anim loaded
      that.imageReady = true;
      if(!that.img){
        that.img = img;
      }

      that.resize();

      $(".loading").hide();
    });
  };
  Anim.prototype.resize = function() {
    // body...
    console.log('resize');
    this.canvas.width = this.canvas.parentNode.clientWidth; 
    this.canvas.height = this.canvas.parentNode.clientHeight;
    // debugger;
    this.redraw(); 

  };
  Anim.prototype.update = function(request) {
    if(this.currFrame == this.destFrame){
      //draw last frame
      this.redraw();
      this.reached = true;
      $(window).trigger( 'hashchange' );
    }else{
        //draw frame
        this.reached =false;
        if(this.destFrame > this.currFrame){
          this.advanceFrame();
        }
        if(this.destFrame < this.currFrame){
          this.reverseFrame();
        }
    }
    //reset frame count
    if (this.currCol == 0 && this.currRow == 0){
      this.currFrame = 0;
    }
  };
  Anim.prototype.switch = function(newPage){
    //reset anim from 0
    // this.img = this.allImages
    console.log("SWITCH!! - " + newPage);

    this.img = this.allImages[newPage];


    this.currFrame = 0;
    this.currRow = 0;
    this.currCol = 0;


    this.reached = false;
    this.destFrame = $('a.bbq-current').data("frame");

    var that = this;
    $(this.img).load(function(){
      //anim loaded
      that.imageReady = true;
      that.resize();
    });




    
  }
  Anim.prototype.advanceFrame = function() {
    //advance
    this.currFrame++; 
    this.redraw(); 
    if(this.currCol < this.MAX_COL){
      this.currCol++;
    }else{
      //reset col
      this.currCol = 0
      this.currRow++;
      if(this.currRow > this.MAX_ROW){
        //reached last frame
        this.reached = true;
        this.currRow = 0;
      }
    }
  };
  Anim.prototype.reverseFrame = function() {
    //reverse
    this.currFrame--;
    this.redraw();
    if(this.currCol > 0){
      this.currCol--;
    }else{
      //reset col
      this.currCol = this.MAX_COL
      this.currRow--;
      if(this.currRow < 0){
        this.currRow = this.MAX_ROW;
      }
    }
  };
  Anim.prototype.redraw = function() {
    this.ctx.fillStyle = '#FBFCFC'; 
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); 
    // debugger;

    if (this.imageReady){
      this.ctx.drawImage(this.img, this.currCol*this.frameWidth, this.currRow*this.frameHeight, this.frameWidth, this.frameHeight, 0, 0, this.canvas.width, this.canvas.height);
    }
  };
  Anim.prototype.getCurrFrame = function() {
    // body...
    return this.currFrame;
  };
  Anim.prototype.setDestFrame = function(destFrame) {
    this.destFrame = destFrame;
  };
  Anim.prototype.getDestFrame = function() {
    return this.destFrame;
  };
  Anim.prototype.setReached = function(reached){
    this.reached = reached;
  }
  //Public interface
  return{
    Anim : Anim
    //someVar : someVar,
    //someFunc : someFunc
  }
})();