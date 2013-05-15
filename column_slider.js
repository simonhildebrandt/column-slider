$.widget( "bnm.column_slider", {
 
    // default options
    options: {
      column_class: '.column',
      minColumnWidth: 128,
      speed: 2,
      logdiv: null,
      buttonCallback: null,
    },
 
    content: null,
    columns: [],
    touchdown: null,
    travel: [0, 0],

    maskWidth: function(){
      return this.element.parent().width();
    },

    offset: function(){
      return this.element.position().left;
    },

    leftBorder: function(){
      return -1 * this.offset();
    },

    rightBorder: function(){
      return this.leftBorder() + this.maskWidth();
    },

    columnLeftEdge: function(i){
      var column = this.columns[i];
      return column.left;
    },

    columnRightEdge: function(i){
      var column = this.columns[i];
      return column.left + column.width;
    },

    offsetToMatchColumnRightEdge: function(i){
      var rightEdge = this.columnRightEdge(i);
      return this.maskWidth() - rightEdge;
    },

    offsetToMatchColumnLeftEdge: function(i){
      var leftEdge = this.columnLeftEdge(i);
      return -1 * leftEdge;
    },

    stepRight: function(distance){
      var column_index = 0;
      if (distance == 'column') {
        var destination = this.rightBorder();
      } else {
        var destination = this.rightBorder() + this.maskWidth() - this.options.minColumnWidth;
      }
      while (column_index < this.columns.length - 1 && this.columnRightEdge(column_index) < destination) {
        column_index++;
      }
      var left = this.offsetToMatchColumnRightEdge(column_index);
      this.slideTo(left);
    },

    stepLeft: function(distance){
      var column_index = this.columns.length - 1;
      if (distance == 'column') {
        var destination = this.leftBorder();
      } else {
        var destination = this.leftBorder() - this.maskWidth() + this.options.minColumnWidth;
      }
      while (column_index > 0 && this.columnLeftEdge(column_index) > destination) { 
        column_index--;
      }
      var left = this.offsetToMatchColumnLeftEdge(column_index);
      this.slideTo(left);
    },

    slideTo: function(left) {
      var duration = Math.abs(left - this.offset()) / this.options.speed;
      // Clamp sliding to displayable width
      left = Math.min(0, left);
      left = Math.max(this.leftLimit(), left);
      this.element.animate({left: left}, {duration: duration, complete: $.proxy(this.notifyButtonCallback, this)});
    },

    moveTo: function(left) {
      this.element.css({left: left});
      this.notifyButtonCallback();
    },

    notifyButtonCallback: function() {
      if (!this.options.buttonCallback) return;
      this.options.buttonCallback({
        left: this.offset() < 0,
        right: (this.element.width() + this.offset()) > this.maskWidth(),
      });
    },

    leftLimit: function(){
      return Math.min(0, this.maskWidth() - this.element.width());
    },

    touchEvent: function(evt) {
      evt.preventDefault();
      var touch = evt.originalEvent.touches[0];
      //console.log('event ' + evt.type);
      if (evt.type == 'touchstart') {
        this.touchdown = {clientX: touch.clientX, clientY: touch.clientY};
      }
      if (evt.type == 'touchmove') {
        this.travel = {clientX: touch.clientX - this.touchdown.clientX, clientY: touch.clientY - this.touchdown.clientY};
        this.moveTo(this.offset() + this.travel.clientX);
        this.touchdown = {clientX: touch.clientX, clientY: touch.clientY};
      }
      if (evt.type == 'touchend') {
        if (this.travel.clientX < 0) {
          this.stepRight('column');
        } else {
          this.stepLeft('column');
        }
      }
      if (evt.type == 'touchcancel') {

      }
      if (evt.type == 'touchleave' ) {

      }

      this.log(evt.timeStamp+ ' - ' +evt.type+ ' - ' + this.element);
    },

    log: function(string) {
      if (this.options.logdiv) {
        $(this.options.logdiv).prepend($('<div>'+string+'</div>'));
      }
    },

    children: function() {
      return this.element.children(this.options.column_class);
    },

    _create: function() {
      this.initialize();
    },

    initialize: function() {
      if (this.children().size() == 0) { return; }
      var tw = 0;
      this.children().each(function(i, o){
        tw += $(o).outerWidth(true);
      });
      this.element.width(tw);
      this.columns = this.children().map(function(i, o){
        return {
          object: o,
          width: $(o).outerWidth(true),
          left: $(o).position().left
        };
      });

      this.element.on('touchstart', $.proxy(this.touchEvent, this));
      this.element.on('touchmove', $.proxy(this.touchEvent, this));
      this.element.on('touchend', $.proxy(this.touchEvent, this));
      this.element.on('touchcancel', $.proxy(this.touchEvent, this));
      this.element.on('touchleave', $.proxy(this.touchEvent, this));

      this.notifyButtonCallback();
    }
  });
