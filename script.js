const timeoutInput = document.getElementById('timeout');
const countdownPlace= document.getElementById('countdownPlace');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const favButton = document.getElementsByClassName('favTime');
const notesArea = document.getElementById('notes');
const steering = document.getElementsByClassName('steering');
const testButton = document.getElementById('testButton');


const token = localStorage.getItem('token'); // I know, I know
const gistId = 'c447b5c8919e9741b00c740b51758384';

    
function postGist(txt){
    const gistData = {
    description: 'update',
    public: true,
    files: {
        'minutesPerHourCSV.csv': {
        content: txt
        }
    }
    };
    fetch(`https://api.github.com/gists/${gistId}`,{method:"POST",headers: {
        'Authorization' :`Bearer ${token}`,
        'Content-Type': 'application/json'
      },body: JSON.stringify(gistData)})
      .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}


testButton.addEventListener('click',()=>{
});
class Record{
    constructor(day,month,year,hour,minutesCount){
        this.day = day;
        this.month = month;
        this.year = year;
        this.hour = hour;
        this.minutesCount = minutesCount;
    }
    static recordFromDate(date){
        return new Record(date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),0);
    }
    compareHours(other){
        return other.day == this.day && other.month == this.month && other.year == this.year &&other.hour == this.hour;
    }
    toString(){
        return `\n${this.day},${this.month},${this.year},${this.hour},${this.minutesCount}`;
    }
    
}
const URL = "https://gist.githubusercontent.com/jagodek/c447b5c8919e9741b00c740b51758384/raw/minutesPerHourCSV.csv";
let secondsInMinute = 60; //for testing purposes
let time;
let interval;

//pause focus break stop

const clock = {
    mode:"s",
    record:[],
    startperiod:undefined,
    endperiod:undefined,
    start : function(){
        
    },
    pushRecord : function(date){
        this.record.push({mode:this.mode,D:date.getDate(),M:date.getMonth()+1,Y:date.getFullYear(),h:date.getHours(),m:date.getMinutes()});
    }
}  

const recordArray = [];
let timeLeft=0;
let firstStart = true;
let isRunning =false;
let isPaused = false;
setDisplay(0,0,0);

let measureStart;
let measureEnd;
setTime(+localStorage.getItem('time'));
notesArea.textContent = localStorage.getItem('notes');
const sound = new Audio("./resources/samsung1.mp3");
const tickSound = new Audio("./resources/tick.mp3");
let minutesCount = 0;
let currentDate = new Date();
let currentRecord = Record.recordFromDate(currentDate);
let textRemote;

function validate(val){
    let r = new RegExp("^[0-9]*$");
    if(!r.test(val)){
        timeoutInput.value = time;
        return false;
    }
    if(val<0||val>99){
        timeoutInput.value = 0;
        return false;
    }
    return true;
}

function setAnything(val, domObj, variable){
    if(!isNaN(val)){
        variable = +val;
    }
    else{
        variable = val;
    }
    localStorage.setItem(Object.keys({variable})[0],val);
    domObj.value = val;
}

function setTime(value){
    time = +value;
    localStorage.setItem('time',String(+time));
    timeoutInput.value = time;
    if(isRunning){

    }
}
timeoutInput.addEventListener('input',(ev)=>{
    if(validate(ev.target.value))
        setTime(ev.target.value);
});

setInterval(()=>{
    let now = new Date();
    console.log("interval");
    if(now.getMinutes()==59){
        
        const newLast = new Record(now.getDate(),now.getMonth()+1,now.getFullYear(),now.getHours(),minutesCount);
        textRemote += newLast.toString();
        postGist(textRemote);

        countMinutes = 0;
    }
},60000);




function start(){
    if(interval){
        clearInterval(interval);
    }
    let now = new Date();
    let end = new Date(now.getTime()+timeLeft*secondsInMinute*1000);
    clock.mode="f";
    clock.pushRecord(now);
    
    // if(compareHours(now,record));

    

    interval = setInterval(function(){ 
    isRunning = true;
    now = new Date();
    // if(now.getSeconds()==0){
    //     console.log(now.getUTCDate());
    // }
    distance = end - now;
    timeLeft = distance/secondsInMinute/1000;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if(seconds == 0){
        tickSound.play();
        minutesCount++;
    }
    // if(now.getMinutes()==59){
    //     const newLast = new Record(now.getDate(),now.getMonth()+1,now.getFullYear(),now.getHours(),minutesCount);

    //     minutesCount = 0;
    // }
    
    setDisplay(hours,minutes,seconds);
    
    if(distance <=0){
        // console.log(now.getVarDate());
        clearInterval(interval);
        clock.mode= "b"
        clock.pushRecord(new Date());
        sound.play();
        console.warn("whhaat");
    }
    },1000);
}

function setDisplayMinutes(minutes){
    let hours = Math.floor(minutes / 60);
    setDisplay(hours,minutes,0);
}

function setDisplay(hours,minutes,seconds){
    countdownPlace.innerHTML = Math.max(hours,0) + "h "
    + Math.max(minutes,0) + "m " + Math.max(seconds,0) + "s ";
}

startButton.addEventListener('click',(ev)=>{
    timeLeft = time;
    firstStart = false;
    start();
});

pauseButton.addEventListener('click',(ev)=>{
    if(timeLeft>0){
        if(isRunning){
            clearInterval(interval);
            isRunning= false;
            pauseButton.innerText="resume";
            clock.mode = "b";
            clock.pushRecord(new Date());
        }
        else{
            start();
            isRunning=true;
            pauseButton.innerText="pause";

        }
    }
});

stopButton.addEventListener('click',()=>{
    clearInterval(interval);
    isRunning = false;
    isPaused = false;
    timeLeft = 0;
    clock.mode="s";
    clock.pushRecord(new Date());

    setDisplayMinutes(0);
})

for(button of favButton){
    button.addEventListener('click',(ev)=>{
        setTime(ev.target.value);
    })
}

for(button of steering){
    button.addEventListener('click',(ev)=>{
        setTimeout(()=>{
            console.log(clock.record);
        },10)
    })
}

let notesTimeout;
notesArea.addEventListener('input',(ev)=>{

    if(!notesTimeout){
        notesTimeout = setTimeout(()=>{
            console.log("2s");
            clearTimeout(notesTimeout);
            notesTimeout = undefined;
            localStorage.setItem('notes',ev.target.value);
        },2000);
    }

});
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

window.addEventListener("beforeunload", function (e) {
    let now = new Date();
    const newLast = new Record(now.getDate(),now.getMonth()+1,now.getFullYear(),now.getHours(),minutesCount);
    textRemote += newLast.toString();
    postGist(textRemote);
    sleep(1000);
    this.localStorage.setItem('testclose',"imcuriousdddddddddddddd");
});


notesArea.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      let start = this.selectionStart;
      let end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
  
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 1;
    }
});


function compareHours(date,record){
    if(date.getDate() == record.day && date.getMonth()+1 == record.month 
        && date.getFullYear() == record.year && date.getHours()==record.hour)
        return true;
    return false;
}


function updateLastAndPost(){

}


const response = fetch(URL,{cache: "reload"})
.then(response => response.text())
.then(v => {
    textRemote = v;
    const lines = v.split('\n');
    
    for(line of lines){
        const vals = line.split(',');
        let record = new Record(...vals);
        recordArray.push(record);
    }
    let last = recordArray[recordArray.length-1];
    // if(compareHours(currentDate,last)){
    //     minutesCount = last.minutesCount;
    // }
    console.log(recordArray);
    console.log(minutesCount);


})

// timeoutInput.addEventListener('click',(ev)=>{noNegative(ev)});