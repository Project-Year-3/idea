// configures all the canvases

class Canvas {
  config = {
    fill:"white",
    stroke:"white"
  }

  constructor(id,chartData={}, updater=null){
    var self = this;
    if(updater != null){//custom animation, not a chart
      this.updater = updater;
      this.element = document.createElement("canvas");
      document.querySelector(`#${id}`).appendChild(this.element);
      this.ctx = this.element.getContext("2d");
      this.animationFrame = null;

      this.render = function(updater){
        var e = self.element;
        var c = self.ctx;
        self.animationFrame = requestAnimationFrame(self.render);
        c.clearRect(0,0,e.width,e.height);
        self.updater(c,e);
      }
      this.resetCanvas();
    }

    if(Object.entries(chartData).length > 0){//for charts
      this.chart = new CanvasJS.Chart(id,chartData);
      this.render = this.chart.render.bind(this.chart);
      this.element = this.chart.canvas;
    }
  }

  resetCanvas(){
    var canvas = this.element;
    var ctx = this.ctx;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fill = this.config.fill;
    ctx.stroke = this.config.stroke;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

}
