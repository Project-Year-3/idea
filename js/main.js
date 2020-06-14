var init = function(){
  pandemicsCourse = new Course({
    name:"Pandemics",
    htmlUrl:"pandemics_course/pandemics.html",
    jsonUrl:"pandemics_course/content.json"
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
    htmlUrl:"sleephealth_course/sleephealth.html",
    jsonUrl:"sleephealth_course/sleephealth.json"
  })

  sleepCourse.loaded.then(()=>{
    sleepCourse.cloneElements(document.body);
    populateTailorSleep();
  })

  function setupSleep(){
    var quiz = document.querySelector("#sleepQuiz");
    var alreadySelected = false;
    quiz.addEventListener("touchend",(e)=>{
      if(e.target != e.currentTarget.children && !alreadySelected){
        e.target.classList.add("selected");
        alreadySelected = true;
      }
    },false);
    quiz.addEventListener("click",(e)=>{
      if(e.target != e.currentTarget.children && !alreadySelected){
        e.target.classList.add("selected");
        alreadySelected = true;
      }
    },false);
   }

   alreadySelected = false;
   selectME = function(target){
     if(!alreadySelected){
       alreadySelected = true;
       target.classList.add("selected");
     }
   }

  Promise.all([sleepCourse.loaded,pandemicsCourse.loaded]).then(()=>{
    mnml = new MNML();
    setupPandemics();
    //setupSleep();
    mnml.e.mnml.addEventListener("viewChange",e=>{
      if(e.detail == "pandemics2"){
        pModel.chart.render();
      }
    },false)
  })
}

function populateTailorSleep(){
    let Qs = sleepCourse.content["tailor"];
    let parentEl = document.querySelector("#tailorSleep > .subview-wrap");
    let lastChild = document.querySelector("#tailorSleep #lastChild");
    for(let i in Qs.questions){
      subview = document.createElement("div"); subview.classList.add("subview"); subview.dataset.index = i;
      qEl = document.createElement("div"); qEl.classList.add("question");
      qEl.innerText = Qs.questions[i].Question;
      let oEL = null;
      if(Qs.questions[i].Type == "single"){
        oEl = document.createElement("select"); oEl.classList.add("oel"); oEl.name = "tailor"+i;
        for(let j of Qs.questions[i].Options){
          let option = document.createElement("option");
          option.innerText = j;
          option.value = j;
          oEl.appendChild(option);
        }
      } else {//multiple
        oEl = document.createElement("div"); oEl.classList.add("oel");
        for(let j of Qs.questions[i].Options){
          let optionWrapper = document.createElement("div"); optionWrapper.classList.add("option-wrapper");
          let option = document.createElement("input"); option.name="tailor"+i; option.type="checkbox";
          option.value = j;
          let optionLabel = document.createElement("label");
          optionLabel.innerText = j;
          optionWrapper.appendChild(option); optionWrapper.appendChild(optionLabel);
          oEl.appendChild(optionWrapper);
        }
      }
      subview.appendChild(qEl); subview.appendChild(oEl);
      parentEl.insertBefore(subview,lastChild);
    }
}

function recordTailorResponses(){
  sleepCourse.responses = {};
  let inputs = document.querySelectorAll("*[name^=tailor]");
  for(var i=0; i<inputs.length; i++){
    let name = inputs[i].name;
    let type = inputs[i].type;
    let value = inputs[i].value;
    if(!(name in sleepCourse.responses)){
      sleepCourse.responses[name] = []
    }
    if(type == "select-one" || inputs[i].checked){
      sleepCourse.responses[name].push(value);
    }
  }
  populateTailorContent();
}

wordList = [];
function addWordToList(){
  let value = document.querySelector("#sleepInfluenceText").value.toLowerCase();
  let item = document.createElement("li"); item.innerText = value;
  let parent = document.querySelector("#wordList");
  parent.appendChild(item);
  wordList.push(value);
  document.querySelector("#sleepInfluenceText").value = "";
}

function populateRevealWords(){
  let compiledList = [];
  let correct = document.querySelector("#revealWordsCorrect");
  let missed = document.querySelector("#revealWordsMissed");
  for(let arr of sleepCourse.content["sleepWords"]){
    let thereBeWords = false;
    for(let w of wordList){
      if(arr.includes(w)){
        thereBeWords = true;
        compiledList.push([w,true]);
        break;
      }
    }
    if(!thereBeWords){
      compiledList.push([arr[0],false]);
    }
  }
  
  // make the elements
  correct.innerHTML = "";
  missed.innerHTML = "";
  for(let a of compiledList){
    let li = document.createElement("li");
    li.innerText = a[0];
    if(a[1]){
      correct.appendChild(li);
    } else {
      missed.appendChild(li);
    }
  }
}

function populateTailorContent(){
  let content = sleepCourse.content["tailorContent"];
  for(item of content){
    let q = sleepCourse.responses["tailor"+item.qindex];
    let included = q.includes(item.ans);
    let element = document.getElementById(item.id);
    if(!included && item.reverse == null){continue;}

    if(item.type == "input"){
      if(included){
        element.innerText = item.text;
      } else if(!included && item.reverse != null){
        element.innerText = item.reverse;
      }
    } else if(item.type == "show"){
      if(included){
        element.style.display = "initial";
      } else {
        element.style.display = "none";
      }
    } else if(item.type == "hide"){
      if(included){
        element.style.display = "none";
      }
    }
  }
}

function setSetting(el){
  let setting = el.dataset.var;
  if(setting == "sansForget"){
    if(el.checked){
      document.documentElement.style.setProperty("--bodyFont","SansForgetica");
    } else {
      document.documentElement.style.setProperty("--bodyFont","OpenSans");
    }
  }
}