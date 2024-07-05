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
var dbRef = ref(db, "/interviewbot/qa");
const msg = new SpeechSynthesisUtterance();


var questions = [];
var answers = [];
var arr = [];
var alluanswers = [];
var alloanswers = [];
var allpoints = [];
var allquestions = [];
var allpointcolors = [];
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
      document.getElementById("analysisboard").style.visibility = "hidden";
      document.getElementById("ibegin").style.visibility = "hidden";
      document.getElementById("loadingtext").innerHTML = "";
      document.getElementById("checkwrong").style.visibility = "hidden";
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
      //document.getElementById("interviewingblock").innerHTML += "<p id='usermes'>"+arr[arr.length-1]+"</p><br/><br/><br/><br/>";
      autoscroll();
    });
  }
    
  

  async function askquestion(ques, ans){
    speakout(ques);
    //document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>"+ques+"</h3>";
    autoscroll();
    await sleep(1000);
    await listenanswer();
    return 10;
  }

  function showdetailed(){
    document.getElementById("checkwrong").innerHTML = "";
    for(let i = 0; i < allpoints.length ; i++){
      document.getElementById("checkwrong").innerHTML += "<div id='wrongbox' ><div id='wrongleft'>Question : "+allquestions[i]+"<br/><br/>Your Answer : "+alluanswers[i]+"<br/><br/>Possible Answer : "+alloanswers[i]+"<br/></div><div id='points' style='background-color: "+allpointcolors[i]+"'>"+allpoints[i]+"/10</div></div>";
    }
    document.getElementById("checkwrong").style.visibility = "visible";
  }

  async function addtoglobalinterviews(intername, score){
    const sid = sessionStorage.getItem("userid");
    const dbref = ref(db, "/interviewbot/interviews/" + intername);
    try {
        await update(dbref, {
            [score]: ""
        });
    } catch (error) {
        console.error(error);
    }
  }

  async function addtolocalinterviews(intername, score){
    const sid = sessionStorage.getItem("userid");
    const dbref = ref(db, "/interviewbot/users/"+sid+"/interviews");
    try {
        await update(dbref, {
            [intername]: score
        });
    } catch (error) {
        console.error(error);
    }
  }

  var cnames = []

  async function calculatescore(cname,score){
    document.getElementById("currating").innerHTML = "";
    const sid = sessionStorage.getItem("userid");
    const dbRef = ref(db, "/interviewbot/interviews/"+cname);
    document.getElementById("tablerows").innerHTML = "";
    onValue(dbRef, async (snapshot) => {
      let childNodes = snapshot.val();
      for (let key in childNodes) {
        cnames.push(key);
        await sleep(1000);
      }
      
      cnames = Array.from(new Set(cnames));
      for(let j=0;j<cnames.length;j++)
      {
        cnames[j] = parseInt(cnames[j]);
      }
      cnames.sort();
      function checkscore(s) {
        return s > score;
      }
      var ind = cnames.findIndex(checkscore);
      document.getElementById("currating").innerHTML =  (ind/cnames.length) * 100;
      
    }, {
      onlyOnce: true
    });
  }

  async function startinterview(){
    allquestions = []
    alloanswers = []
    alluanswers = []
    allpoints = []
    allpointcolors = []
    window.checkcancel = 0;
    var companys = sessionStorage.getItem("currcompany");
    dbRef = ref(db, "/interviewbot/qa/"+companys);
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

    await sleep(2000);
    var uname = sessionStorage.getItem('uname');
    const time = new Date().getHours();
    var greeting;
    if (time >= 5 && time < 12) {
      greeting = "Good morning";
    } else if (time >= 12 && time < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    const greetings = [greeting+" "+uname, "how are you?" , "Okay, Let's start the interview. So"]
    for(let i = 0; i < 3; i++)
    {
    speakout(greetings[i]);
    //document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>"+greetings[i]+"</h3>";
    if(i<2)
      {
      await listenanswer();
      if(i==1 && ((arr[arr.length-1]).includes("not") || (arr[arr.length-1]).includes("bad") || (arr[arr.length-1]).includes("unwell")))
      {
        speakout("Hope you will be fine. ");
        //document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>Hope you will be fine.</h3>";
        await sleep(2000);
      }
      await sleep(1000);
      }

    }

    var ar4 = [];
    for(let k = 0 ; k < questions.length; k++){
      ar4.push(k);
    }
    
    const ar4len = ar4.length;
    var randquestions= ar4.sort( ()=>Math.random()-0.5 );
    randquestions= ar4.slice(0,5);

    function stemWord(word) {
      let stemmedWord = word;
    
      // Step 1a
      if (stemmedWord.endsWith('sses')) {
        stemmedWord = stemmedWord.slice(0, -2);
      } else if (stemmedWord.endsWith('ies')) {
        stemmedWord = stemmedWord.slice(0, -2) + 'i';
      } else if (stemmedWord.endsWith('s')) {
        stemmedWord = stemmedWord.slice(0, -1);
      }
    
      // Step 1b
      if (stemmedWord.endsWith('eed')) {
        if (stemmedWord.slice(0, -3).search(/[aeiouy]/) > -1) {
          stemmedWord = stemmedWord.slice(0, -1);
        }
      } else if (stemmedWord.endsWith('ed')) {
        if (stemmedWord.slice(0, -2).search(/[aeiouy]/) > -1) {
          stemmedWord = stemmedWord.slice(0, -2);
          if (stemmedWord.endsWith('at') || stemmedWord.endsWith('bl') || stemmedWord.endsWith('iz')) {
            stemmedWord += 'e';
          } else if ((stemmedWord.endsWith(stemmedWord.charAt(stemmedWord.length - 1)) && !stemmedWord.endsWith('l') && !stemmedWord.endsWith('s') && !stemmedWord.endsWith('z')) || stemmedWord.search(/[aeiouy][^aeiouywxY]/) > -1) {
            stemmedWord += 'e';
          }
        }
      } else if (stemmedWord.endsWith('ing')) {
        if (stemmedWord.slice(0, -3).search(/[aeiouy]/) > -1) {
          stemmedWord = stemmedWord.slice(0, -3);
          if (stemmedWord.endsWith('at') || stemmedWord.endsWith('bl') || stemmedWord.endsWith('iz')) {
            stemmedWord += 'e';
          } else if ((stemmedWord.endsWith(stemmedWord.charAt(stemmedWord.length - 1)) && !stemmedWord.endsWith('l') && !stemmedWord.endsWith('s') && !stemmedWord.endsWith('z')) || stemmedWord.search(/[aeiouy][^aeiouywxY]/) > -1) {
            stemmedWord += 'e';
          }
        }
      }
    
      // Step 1c
      if (stemmedWord.endsWith('y')) {
        if (stemmedWord.slice(0, -1).search(/[aeiouy]/) > -1) {
          stemmedWord = stemmedWord.slice(0, -1) + 'i';
        }
      }
    
      // Return the stemmed word
      return stemmedWord;
    }
    
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'of', 'for', 'with', 'without']; // add more stop words as necessary

    function removeStopWords(str,stopWords) {
      const words = str.split(' ');
      const filteredWords = words.filter(word => !stopWords.includes(word.toLowerCase()));
      return filteredWords.join(' ');
    }

    function stemWords(str) {
      const words = str.split(' ');
      const stemmedWords = words.map(word => stemWord(word));
      return stemmedWords.join(' ');
    }

    function compareAnswers(predefinedAnswer, userAnswer) {
      const predefinedWords = predefinedAnswer.split(' ');
      const userWords = userAnswer.split(' ');
    
      const uniquePredefinedWords = [...new Set(predefinedWords)]; // remove duplicates
      const uniqueUserWords = [...new Set(userWords)]; // remove duplicates
    
      const matchedWords = uniquePredefinedWords.filter(word => uniqueUserWords.includes(word));
      const score = Math.round((matchedWords.length / uniquePredefinedWords.length) * 10);
    
      return score;
    }


    

    var finalscore = 0;
    await sleep(4000);
    let kk = 0;
    for(i of randquestions){
        var qscore = 0;
        var pointcolor = "";
        await askquestion(questions[i] , answers[i]);
        var useranswer = arr[arr.length-1];
        var originalanswer = answers[i];

        if((useranswer.includes("don't know") || useranswer.includes("do not know")) && kk<4){
          speakout("That's okay. Lets move on to the next question..");
          //document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>That's okay. Lets move on to the next question..</h3>";
          autoscroll();
          await sleep(4000);
          qscore = 0;
        }
        else{
          if((useranswer.includes("listen") || useranswer.includes("understand") || useranswer.includes("hear") || useranswer.includes("repeat"))){
            speakout("Okay. The question is")
            //document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>Okay. The question is</h3>";
            autoscroll();
            await sleep(3000);
            await askquestion(questions[i] , answers[i]);
            useranswer = arr[arr.length-1];
          }

          var predefinedAnswer = originalanswer.toLowerCase();
          var userAnswer = useranswer.toLowerCase();

          predefinedAnswer = predefinedAnswer.split(',');
          userAnswer = userAnswer.split(',');
          predefinedAnswer = predefinedAnswer.join(" ")
          userAnswer = userAnswer.join(" ")

          predefinedAnswer = predefinedAnswer.split('.');
          userAnswer = userAnswer.split('.');
          predefinedAnswer = predefinedAnswer.join(" ")
          userAnswer = userAnswer.join(" ")


          const filteredPredefinedAnswer = removeStopWords(predefinedAnswer, stopWords);
          const stemmedPredefinedAnswer = stemWords(filteredPredefinedAnswer);
          const filteredUserAnswer = removeStopWords(userAnswer, stopWords);
          const stemmedUserAnswer = stemWords(filteredUserAnswer);
          qscore = compareAnswers(stemmedPredefinedAnswer, stemmedUserAnswer);
        }

        if(qscore>5){
          qscore = 10;
          pointcolor = "rgb(179, 255, 173)";
        }
        else if(qscore>3){
          qscore = 7;
          pointcolor = "rgb(242, 255, 170)";
        }
        else if(qscore>1){
          qscore = 5;
          pointcolor = "rgb(250, 225, 196)";
        }
        else if(qscore==0){
          pointcolor = "rgb(255, 130, 130)";
        }
        finalscore += qscore;

        allquestions.push(questions[i])
        alloanswers.push(answers[i])
        alluanswers.push(useranswer)
        allpoints.push(qscore)
        allpointcolors.push(pointcolor)

        await sleep(1000);
        kk += 1;
    }

    await sleep(1000);


    //document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>The interview has been completed.</h3>";
    speakout("The interview has been completed.")
    autoscroll();
    await sleep(2000);
    /*document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>Do you have any questions to ask?</h3>";
    speakout("Do you have any questions to ask?")
    autoscroll();
    await sleep(1000);
    await listenanswer();
    await sleep(1000);*/
    //document.getElementById("interviewingblock").innerHTML += "<h3 id='botmes'>All the best!</h3>";
    speakout("All the best!")
    autoscroll();
    await sleep(3000);

    

    finalscore = finalscore * 2;
    document.getElementById("analysisboard").style.visibility = "visible";
    document.getElementById("rating").innerHTML = finalscore + "%";
    var companyss = companys.toUpperCase();
    document.getElementById("ccompany").innerHTML = companyss + " INTERVIEW";

    await calculatescore(companys, finalscore);

    await addtoglobalinterviews(companys, finalscore);
    await sleep(3000);
    await addtolocalinterviews(companys, finalscore);
    
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

        <h1 id="ccompany">Company Interview</h1>
        <h1 id="scoretag">Overall Performance Score </h1>
        <div id="rating">0%</div>

        <p>Your score is better than <p id="currating"></p>% of our users</p>
        

        <button id="showwrong" onClick={showdetailed}>
          Show Detailed Analysis
        </button>
        <div id="checkwrong">
          
        </div>
        
        
        
        {/*<h3>Breakdown Analysis</h3>
        <div id="aboxes">
          <div id="abox1">
            Python
          </div>

          <div id="abox2">
            Java
          </div>

          <div id="abox3">
            OS
          </div>
        </div> */}
      </div>
        
    </div>
  );
}

export default Interviewprocess;