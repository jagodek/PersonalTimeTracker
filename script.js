const timeoutInput = document.getElementById('timeout');
const countdownPlace= document.getElementById('countdownPlace');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');


let time;
upDate(+localStorage.getItem('time'));
let timeLeft=0;
let firstStart = true;
let interval;
let isRunning =false;
setDisplay(0,0,0);

function validate(val){
    console.log({val});
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

function upDate(value){
    time = +value;
    localStorage.setItem('time',String(+time));
    timeoutInput.value = time;
}
timeoutInput.addEventListener('input',(ev)=>{
    if(validate(ev.target.value))
        upDate(ev.target.value);
});



function start(){
    if(interval){
        clearInterval(interval);
    }
    let now = new Date();
    let end = new Date(now.getTime()+timeLeft*10*1000);

    interval = setInterval(function(){ 
    now = new Date();
    distance = end - now;
    timeLeft = distance/10/1000;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    setDisplay(hours,minutes,seconds);
    
    if(distance <0){
        clearInterval(interval);
        let sound = new Audio("/resources/lego.mp3");
        sound.play();
    }
    },1000);
}

function setDisplay(hours,minutes,seconds){
    countdownPlace.innerHTML = Math.max(hours,0) + "h "
    + Math.max(minutes,0) + "m " + Math.max(seconds,0) + "s ";
}

startButton.addEventListener('click',(ev)=>{
    timeLeft = time;
    firstStart = false;
    console.log('beginning');
    start();
});

pauseButton.addEventListener('click',(ev)=>{
    if(timeLeft>0){
        if(isRunning){
            clearInterval(interval);
            isRunning= false;
            pauseButton.innerText="resume";
        }
        else{
            start();
            isRunning=true;
            pauseButton.innerText="pause";
        }
    }
});

stopButton.addEventListener('click',()=>{

})

// timeoutInput.addEventListener('click',(ev)=>{noNegative(ev)});