import './Interviewprocess.css';
import { hasSelectionSupport } from '@testing-library/user-event/dist/utils';
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref , set, child , update, remove, onValue, get} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAz_mLmnfGosfEBV3DmemKtbs4SSua2aoA",
  authDomain: "interviewbot-bd88c.firebaseapp.com",
  databaseURL: "https://interviewbot-bd88c-default-rtdb.firebaseio.com",
  projectId: "interviewbot-bd88c",
  storageBucket: "interviewbot-bd88c.appspot.com",
  messagingSenderId: "533088317877",
  appId: "1:533088317877:web:623eaf42612f4a542fa9fc",
  measurementId: "G-9BFPC9DP5K"
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
//recognition.continuous = true;
recognition.interimResults = true;
window.rec = 0;
window.checkcancel = 0;

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db, "/interviewbot/qa");
const msg = new SpeechSynthesisUtterance();


var questions = [];
var answers = [];
var arr = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));

function autoscroll(){
  const el = document.getElementById('interviewingblock');
  if (el) {
  el.scrollTop = el.scrollHeight;
  }
}

function Interviewprocess() {

  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [time, setTime] = useState(0);
  const [recordedArray, setRecordedArray] = useState([]);
  const [finalscore, setscore] = useState(0);
  const [useranswer, setuanswer] = useState("");
  const [originalanswer, setoanswer] = useState("");



  useEffect(() => {
    recognition.onresult = function(event) {
      let current = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          current += event.results[i][0].transcript;
        }
      }
      setRecordedText(prevRecordedText => prevRecordedText + current);
    };

  }, []);

  useEffect(() => {
    let intervalId = null;
    if (isRecording) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && time >= 60) {
      recognition.stop();
      setTime(0);
    }
  }, [isRecording, time]);

  useEffect(() => {
    if (!isRecording && recordedText) {
      arr.push(recordedText);
      setRecordedArray(prevRecordedArray => [...prevRecordedArray, recordedText]);
      setRecordedText("");
      window.rec = 1;
    }
  }, [isRecording, recordedText]);

  function speakout(texttospeak){
    msg.text = texttospeak;
    window.speechSynthesis.speak(msg);
  }

  function startRecording(onRecordingComplete) {
    recognition.start();
    setTime(0);
    recognition.onstart = function() {
      setIsRecording(true);
    };
    recognition.onend = function() {
      setIsRecording(false);
      onRecordingComplete();
    };
  }

  const stopRecording = () => {
    recognition.stop();
    setTime(0);
  };


  function goback(){
    if(isRecording){
      stopRecording();
    }
      document.getElementById("interviewingblock").innerHTML = "";
      document.getElementById("rinterviewprocess").style.visibility = "hidden";
      document.getElementById("loadingscreen").style.visibility = "hidden";
      document.getElementById("ibegin").style.visibility = "hidden";
      document.getElementById("loadingtext").innerHTML = "";
      window.checkcancel = 1;
      arr = [];
      questions = [];
      answers = [];
  }

  async function listenanswer() {
    return new Promise((resolve) => {
      startRecording(resolve);
    }).then(() => {
      // Wait for recorded data to be pushed to array
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (window.rec === 1) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });
    }).then(() => {
      document.getElementById("interviewingblock").innerHTML += "<p id='usermes'>"+arr[arr.length-1]+"</p><br/><br/><br/><br/>";
      autoscroll();
    });
  }
    
  

  async function askquestion(ques, ans){
    speakout(ques);
    document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>"+ques+"</h3>";
    autoscroll();
    await sleep(1000);
    await listenanswer();
    return 10;
  }

  async function startinterview(){
    window.checkcancel = 0;
    onValue(dbRef, async (snapshot) => {
      let childNodes = snapshot.val();
      for (let key in childNodes) {
        questions.push(key);
        answers.push(childNodes[key]);
        await sleep(1000);
      }
      console.log(questions);
      console.log(answers);
    }, {
      onlyOnce: true
    });


    //Count Down
    document.getElementById("ibegin").style.visibility = "hidden";
    let i = 0;
    let c = 0;
    const loadingarr = ["Getting things ready" ,"Be Prepared" , "Almost there" , "Starting the interview" , "All the best"];
    while(i<10){
      document.getElementById("loadingtext").innerHTML = loadingarr[c];
      await sleep(2000);
      i+=2;
      c += 1
    }

    document.getElementById("loadingscreen").style.visibility = "hidden";

    if(window.checkcancel == 1)
    {
      return;
    }

    speakout("Let's start our interview!");
    document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>Let's start our interview!</h3>";
    await sleep(2000);

    var ar4 = [];
    for(let k = 0 ; k < questions.length; k++){
      ar4.push(k);
    }
    
    const ar4len = ar4.length;
    var randquestions=[];
    for (let n=1; n<=5; ++n)
    {
      var cc = Math.floor((Math.random() * (ar4len-n)) + 1);
      randquestions.push(ar4[cc]);
      ar4[cc] = ar4[ar4len-n];
    }
        
    var finalscore = 0;

    for(i of randquestions){
        var qscore = 0;
        await askquestion(questions[i] , answers[i]);
        var useranswer = arr[arr.length-1];
        var originalanswer = answers[i];

        originalanswer = originalanswer.split(",");
        for(let j = 0 ; j < originalanswer.length ; j++){
          var z = originalanswer[j].trim();
          var u = useranswer.toLowerCase();
          //alert(u + "       " + z);
          if(u.includes(z)){
            qscore += 1;
          }
        }
        if(qscore>10){
          qscore = 10;
        }

        finalscore += qscore;
        await sleep(1000);
    }
    await sleep(100);
    alert("Your final score : "+finalscore);
    goback();
  }

  return (
    <div id="interviewprocess">
      <button id='ibackb' onClick={goback} >Cancel</button>
      

      <div id="interviewingblock">
      </div>
      <div id="loadingscreen">
        <button id='ibegin' onClick={startinterview}>Start the Interview</button>
        <h1 id="loadingtext"></h1>
      </div>

      <div id="analysisboard">
        <h1>Your Final Score : </h1>
      </div>
        
    </div>
  );
}

export default Interviewprocess;