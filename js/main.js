var init = function(){
  pandemicsCourse = new Course({
    name:"Pandemics",
    htmlUrl:"/pandemics_course/pandemics.html",
    jsonUrl:"/pandemics_course/content.json"
  });
  pandemicsCourse.loaded.then(()=>{
    for (key in pandemicsCourse.content) {
      if(pandemicsCourse.content[key].type == "quiz"){
        pandemicsCourse.populateQuiz(key)
      }
    }
    pandemicsCourse.cloneElements(document.body);
  });

  function setupPandemics(){
    mnml.addControl("pandemicSim",{
      label:"Infection Constant",
      name:"infection_constant",
      type:"range",
      value:0.8,
      min:0,
      max:1,
      step:0.1
    })
    mnml.addControl("pandemicSim",{
      label:"Probability of Recovery",
      name:"recovery_constant",
      type:"range",
      value:0.9,
      min:0,
      max:1,
      step:0.1
    })
    mnml.addControl("pandemicSim",{
      label:"Closing Time",
      name:"closing_time",
      type:"range",
      value:14,
      min:5,
      max:250,
      step:1
    });

    document.querySelector("#pandemicSim").addEventListener("mnmlChange",(e)=>{
      console.log(e.detail)
      pModel.config[e.detail.name] = Number(e.detail.value);
    },false);

    pModel.initialise();
  }
  
  sleepCourse = new Course({
    name:"Sleep-Health",
    htmlUrl:"/sleephealth_course/sleephealth.html",
    jsonUrl:"/sleephealth_course/sleephealth.json"
  })

  sleepCourse.loaded.then(()=>{
    sleepCourse.cloneElements(document.body);
  })

  function setupSleep(){
    var quiz = document.querySelector("#sleepQuiz");
    var alreadySelected = false;
    quiz.addEventListener("click",(e)=>{
      if(e.target != e.currentTarget.children && !alreadySelected){
        e.target.classList.add("selected");
        alreadySelected = true;
      }
    },false);

    let wordCanvas = document.querySelector("#wordCanvas");
    wordCanvas.width = window.innerWidth;
    wordCanvas.height = window.innerHeight;
    let wc = wordCanvas.getContext("2d");
    wc.font = "20px Arial";
    let anim = null;
    let words = [];
    let hasStarted = false;
    mnml.addControl("wordControls",{
      label:"word",
      name:"words",
      value:"sleep",
      type:"text"
    })
    document.querySelector("#wordControls").addEventListener("mnmlChange",(e)=>{
      let x = Math.random() * wordCanvas.width;
      let y = Math.random() * wordCanvas.height;
      x = wordCanvas.width/2;
      y = wordCanvas.height/2;
      h = Math.floor(Math.random() * 360);
      let a = Math.random() * Math.PI * 2;
      let inSet = sleepCourse.content["sleepWords"].includes(e.detail.value.toLowerCase());
      words.push({
        text:e.detail.value,
        x:x,
        y:y,
        a:a,
        h:h,
        inSet:inSet
      });

      mnml.e.controls.wordControls.elements.words.value = "";
      if(!hasStarted){
        hasStarted = true;
        renderWords();
      }
    },false);

    function angleReflect(incidenceAngle, surfaceAngle){
      var a = surfaceAngle * 2 - incidenceAngle;
      return a >= Math.PI*2 ? a - Math.PI*2 : a < 0 ? a + Math.PI*2 : a;
    }

    function renderWords(){
      wc.beginPath();
      wc.clearRect(0,0,wordCanvas.width,wordCanvas.height);
      let v = 1;
      
      words.forEach(w=>{
        let d = wc.measureText(w.text);
        let r = d.width/2;//width of word
        let x = w.x + r;
        let y = w.y - 5;
        if(w.x < 0 || w.x > wordCanvas.width - r){
          w.a = angleReflect(w.a,Math.PI/2);
        }
        if(w.y < 0 || w.y > wordCanvas.height - r){
          w.a = angleReflect(w.a,0);
        }
        w.x += v * Math.cos(w.a);
        w.y += v * Math.sin(w.a);
        
        wc.beginPath();
        wc.arc(x,y,r,0,Math.PI*2);
        wc.strokeStyle = `hsl(${w.h},50%,50%)`;
        wc.stroke();
        if(revWords && w.inSet){
          wc.fillStyle = `hsl(${w.h},50%,50%)`;
          wc.fill();
          wc.fillStyle = "#fff"
        } else {
          wc.fillStyle = "#000"
        }
        
        wc.fillText(w.text,w.x,w.y);
      });
      anim = requestAnimationFrame(renderWords);
    }
  }

  Promise.all([sleepCourse.loaded,pandemicsCourse.loaded]).then(()=>{
    mnml = new MNML();
    setupPandemics();
    setupSleep();
    mnml.e.mnml.addEventListener("viewChange",e=>{
      if(e.detail == "pandemics2"){
        pModel.chart.render();
      }
    },false)
  })
  
}

var revWords = false;
function revealWords(c){
  revWords = c.checked;
}