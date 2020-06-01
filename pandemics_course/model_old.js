pModel = {};
pModel.chance = function(probability){
  let roll = 1 + Math.floor(Math.random()*999)
  if(roll < (probability * 1000)){
    return true;
  }
  return false;
}

pModel.config = {
  population_size: 1000,
  initial_infections: 2,
  infection_constant: 0.8,
  recovery_constant: 0.9,
  lethality:0.1,
  closing_time: 14
}

pModel.current = {
  uninfected:pModel.config.population_size - pModel.config.initial_infections,
  infected: pModel.config.initial_infections,
  recovered:0,
  dead:0
}

pModel.data = {
  uninfected:[],
  infected:[],
  recovered:[],
  dead:[]
}

pModel.initialise = function(){
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
var updateInterval = 1000;

var xVal = 0;
pModel.updateChart = function () {
  let unended = pModel.current.uninfected + pModel.current.infected;
  let newly_infected = pModel.config.infection_constant * (pModel.current.infected * pModel.current.uninfected)/unended;
  //newly_infected = Math.floor(Math.random() * newly_infected);
  if(pModel.current.uninfected - newly_infected < 0){
    newly_infected = pModel.current.uninfected;
  }
  pModel.current.uninfected -= newly_infected;
  pModel.current.infected += newly_infected;

  let newly_recovered = pModel.config.recovery_constant * pModel.current.infected;
  newly_recovered = Math.floor(Math.random() * newly_recovered);
  if(pModel.current.infected - newly_recovered < 0){
    newly_recovered = pModel.current.infected;
  }
  pModel.current.infected -= newly_recovered;
  pModel.current.recovered += newly_recovered;

  let newly_dead = pModel.config.lethality * pModel.current.infected;
  newly_dead = Math.floor(Math.random() * newly_dead);
  if(pModel.current.infected - newly_dead < 0){
    newly_dead = pModel.current.infected;
  }
  pModel.current.infected -= newly_dead;
  pModel.current.recovered += newly_dead;

  for(var key in pModel.data){
		pModel.data[key].push({
			x: xVal,
			y: pModel.current[key]
		});
  }
  xVal++;
  pModel.chart.render();
  if(xVal < 1000){
    anim = requestAnimationFrame(pModel.updateChart);
  }
};

pModel.chart.render();
//pModel.updateChart(); 
//setInterval(function(){ pModel.updateChart() }, updateInterval); 
}

pModel.frame = function(){

}



