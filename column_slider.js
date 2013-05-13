$.widget( "bnm.column_slider", {
 
    // default options
    options: {
      column_class: '.column',
      minColumnWidth: 128,
      speed: 2,
    },
 
    total_width: 0,
    content: null,
    columns: [],

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

    stepRight: function(){
      var column_index = 0;
       while (column_index < this.columns.length - 1 && this.columnRightEdge(column_index) < this.rightBorder() + this.maskWidth() - this.options.minColumnWidth) {
        column_index++;
      }
      var left = this.offsetToMatchColumnRightEdge(column_index);
      this.slideTo(left);
    },

    stepLeft: function(){
      var column_index = this.columns.length - 1;
      while (column_index > 0 && this.columnLeftEdge(column_index) > this.leftBorder() - this.maskWidth() + this.options.minColumnWidth) { 
        column_index--;
      }
      var left = this.offsetToMatchColumnLeftEdge(column_index);
      this.slideTo(left);
    },

    slideTo: function(left) {
      var duration = Math.abs(left - this.offset()) / this.options.speed;
      this.element.animate({left: left}, duration);
    },

    _create: function() {
      this.initialize();
    },

    initialize: function() {
      var tw = 0;
      this.columns = this.element.children(this.options.column_class).each(function(i, o){
        tw += $(o).width();
      });
      this.element.width(tw);
      this.columns = this.element.children(this.options.column_class).map(function(i, o){
        return {
          object: o,
          width: $(o).width(),
          left: $(o).position().left
        };
      });
      this.stepLeft();
    }
  });
