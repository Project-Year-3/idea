pModel = {};
pModel.chance = function(probability){
  let roll = 1 + Math.floor(Math.random()*999)
  if(roll < (probability * 1000)){
    return true;
  }
  return false;
}

pModel.config = {
  uninfected_size: 1000,
  initial_infections: 2,
  infection_constant: 1,
  prob_of_recovery: 0.9,
  closing_time: 10
}

pModel.initialise = function(){
  let uninfected = [];
  for(var i=0; i<pModel.config.uninfected_size; i++){
    uninfected.push(i);
  }
  let infected = [];
  for(var i=0; i<pModel.config.initial_infections; i++){
    infected.push([1,0])
  }
  let recovered = [];
  let died = [];
  let final_plot = [];

  pModel.chart = new Canvas("pModelChart", {
    exportEnabled: true,
    title :{
      text: "Pandemics Model"
    },
    axisY: {
      includeZero: false
    },
    data: [
      {
        type: "spline",
        name:"uninfected",
        markerSize: 0,
        dataPoints: pModel.data.uninfected 
      },
      {
        type: "spline",
        name:"infected",
        markerSize: 0,
        dataPoints: pModel.data.infected 
      },
      {
        type: "spline",
        name:"recovered",
        markerSize: 0,
        dataPoints: pModel.data.recovered 
      },
      {
        type: "spline",
        name:"dead",
        markerSize: 0,
        dataPoints: pModel.data.dead 
      }
  ]
  });
  var xVal = 0;
var yVal = 100;
var updateInterval = 1000;
var dataLength = 50; // number of dataPoints visible at any point

pModel.updateChart = function (count) {
	count = count || 1;
	// count is number of times loop runs to generate random dataPoints.
	//for (var j = 0; j < count; j++) {	
  for(var key in pModel.data){
		yVal = yVal + Math.round(5 + Math.random() *(-5-5));
		pModel.data[key].push({
			x: xVal,
			y: yVal
		});
		xVal++;
	}
	pModel.chart.render();
};

pModel.updateChart(); 
setInterval(function(){ pModel.updateChart() }, updateInterval); 
}

pModel.data = {
  uninfected:[],
  infected:[],
  recovered:[],
  dead:[]
}

pModel.frame = function(){

}



