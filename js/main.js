(function() {
  Math.randomRange = function(max, min) {
    var _min = min === undefined ? 0 : min;
    return parseInt(Math.random() * (max - _min)) + _min;
  };
  Boolean.random = function(percent) {
    return percent >= Math.random();
  };

  var canvas_dom = document.getElementById('bg-canvas');
  var ctx = canvas_dom.getContext('2d');

  var canvas = ctx.canvas;
  var stars = [];
  canvas.width = window.parent.screen.width;
  canvas.height = window.parent.screen.height;
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var width_center = width / 2;
  var height_center = height / 2;
  var create_width = width / 14;
  var create_height = height / 14;


  _(1500).times(function() {
    stars.push(Star(Math.randomRange(0, width), Math.randomRange(0, height)));
  });

  function Star(x, y) {
    return new(function(x, y) {
      this.x = x;
      this.y = y;
      this.type = Math.randomRange(0, 100);
      this.size = Math.randomRange(1, 4);
      var tx = this.x - width_center;
      var ty = this.y - height_center;
      var rad = Math.atan2(tx, ty);
      this.vx = Math.sin(rad);
      this.vy = Math.cos(rad);
      this.r = this.g = this.b = 255;
      if (Boolean.random(0.1)) {
        this.r = Math.randomRange(100, 255);
      }
      if (Boolean.random(0.1)) {
        this.g = Math.randomRange(100, 255);
      }
      if (Boolean.random(0.1)) {
        this.b = Math.randomRange(100, 255);
      }
      if (Math.randomRange(0, 20) < 16) this.size = 1;
      this.enable = true;
      this.update = function() {
        this.old++;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.y < 0 || this.x > width || this.y > height) {
          this.enable = false;
        }
        if (this.type == 100) {
          if (this.old % 10 === 0) {
            this.r = Math.randomRange(100, 255);
            this.g = Math.randomRange(100, 255);
            this.b = Math.randomRange(100, 255);
          }
          if (this.old % 100 === 0) {
            this.vy = Math.randomRange(0, 10) - 5;
            this.vx = Math.randomRange(0, 10) - 5;
          }
        }
      };
      this.old = Math.randomRange(0, 200);
      this.draw = function(ctx) {
        if (this.type % 40 == 1) {
          ctx.fillStyle = 'rgb(255, 255, 0)';
        } else if (this.type % 40 == 2) {
          ctx.fillStyle = 'rgb(105, 105, 200)';
        } else if (this.type % 40 == 3) {
          ctx.fillStyle = 'rgb(255, 105, 100)';
        } else {
          ctx.fillStyle = 'rgb(255, 255, 255)';
        }
        ctx.fillStyle = 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';

        if (this.type < 5) {
          if (this.old % 45 < 20) ctx.fillRect(this.x - this.size, this.y - this.size, this.size, this.size);
        } else {
          ctx.fillRect(this.x - this.size, this.y - this.size, this.size, this.size);
        }
      };
    })(x, y);
  }

  function draw(stars) {
    if (!canvas || !canvas.getContext) {
      return false;
    }
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0,0.5)';
    ctx.fillRect(0, 0, width, height);

    _.each(stars, function(star) {
      star.draw(ctx);
    });

    ctx.closePath();
    ctx.stroke();
  }

  var time = 0;
  (function loop() {
    time += 1;
    _(10).times(function() {
      stars.push(Star(Math.randomRange(width_center - create_width, width_center + create_width), Math.randomRange(height_center - create_height, height_center + create_height)));
    });
    _.each(stars, function(star) {
      star.update();
    });
    stars = _.filter(stars, function(star) {
      return star.enable;
    });
    draw(stars);
    setTimeout(function() {
      loop();
    }, 10);
  })();
})();
