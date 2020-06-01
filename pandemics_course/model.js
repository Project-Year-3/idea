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
  recovery_constant: 0.05,
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

pModel.reset = function(){
  xVal = 0;
  for(var key in pModel.data){
    pModel.data[key].length = 0;
  }
  pModel.current.uninfected=pModel.config.population_size - pModel.config.initial_infections;
  pModel.current.infected=pModel.config.initial_infections;
  pModel.current.recovered=0;
  pModel.current.dead=0;
}

pModel.reset();

pModel.initialise = function(){
  document.querySelector("#renderCanvas").addEventListener("click",(e)=>{
    pModel.reset();
    pModel.updateChart();
  },false);
  
  pModel.chart = new Canvas("pModelChart", {
    title :{
      text: "Pandemics Model"
    },
    axisY: {
      includeZero: false
    },
    data: [
      {
        showInLegend:true,
        type: "spline",
        name:"uninfected",
        markerSize: 0,
        dataPoints: pModel.data.uninfected 
      },
      {
        showInLegend:true,
        type: "spline",
        name:"infected",
        markerSize: 0,
        dataPoints: pModel.data.infected 
      },
      {
        showInLegend:true,
        type: "spline",
        name:"recovered",
        markerSize: 0,
        dataPoints: pModel.data.recovered 
      },
      {
        showInLegend:true,
        type: "spline",
        name:"dead",
        markerSize: 0,
        dataPoints: pModel.data.dead 
      }
  ]
  });
var updateInterval = 1000;


pModel.updateChart = function () {
  let newly_infected = 0;
  for(let i=0; i<pModel.current.infected; i++){
    newly_infected += pModel.config.infection_constant * Math.random();
  }
  newly_infected = Math.floor(newly_infected);

  if(pModel.current.uninfected - newly_infected < 0){
    newly_infected = pModel.current.uninfected;
  }
  pModel.current.uninfected -= newly_infected;
  pModel.current.infected += newly_infected;

  //let newly_recovered = pModel.config.recovery_constant * pModel.current.infected;
  let newly_recovered = 0;
  for(let i=0; i<pModel.current.infected; i++){
    newly_recovered += pModel.config.recovery_constant * Math.random();
  }
  newly_recovered = Math.floor(newly_recovered);

  if(pModel.current.infected - newly_recovered < 0){
    newly_recovered = pModel.current.infected;
  }
  pModel.current.infected -= newly_recovered;
  pModel.current.recovered += newly_recovered;

  //let newly_dead = pModel.config.lethality * pModel.current.infected;
  let newly_dead = 0;
  for(let i=0; i<pModel.current.infected; i++){
    newly_dead += Math.random() * pModel.config.lethality;
  }
  newly_dead = Math.floor(newly_dead);

  if(pModel.current.infected - newly_dead < 0){
    newly_dead = pModel.current.infected;
  }
  pModel.current.infected -= newly_dead;
  pModel.current.dead += newly_dead;

  for(var key in pModel.data){
		pModel.data[key].push({
			x: xVal,
			y: pModel.current[key]
		});
  }
  xVal += 1;
  pModel.chart.render();
  let unended = pModel.current.uninfected + pModel.current.infected;
  if(xVal < 100 && unended > 20){
    anim = requestAnimationFrame(pModel.updateChart);
  }
};

for(var key in pModel.data){
  pModel.data[key].push({
    x: xVal,
    y: pModel.current[key]
  });
}

pModel.chart.render();
//pModel.updateChart(); 
//setInterval(function(){ pModel.updateChart() }, updateInterval); 
}

pModel.frame = function(){

}
