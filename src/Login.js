import './Login.css';
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


const app = initializeApp(firebaseConfig);
const db = getDatabase();

const current = new Date();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

sessionStorage.setItem("loginto","nothing");



function Login() {


  var courses =[];
  function loginfun(){
          function dispinfo(sid){
              get(child(ref(db), "interviewbot/users/" + sid)).then((snapshot) => {
                  if (snapshot.exists()) {
                  var name = snapshot.child('name').val();
                  var mobile = snapshot.child('mobile').val();
                  var mail = snapshot.child('mail').val();
                  document.getElementById("pname").innerHTML = " Name : "+name;
                  document.getElementById("pmobile").innerHTML = " Mobile : "+mobile;
                  document.getElementById("pmail").innerHTML = " Mail : "+mail;
                  }
              });
          }

          async function loadinterviews(){
            document.getElementById("totalinterviews").innerHTML = "Total Interviews taken : 0";
            const sid = sessionStorage.getItem("userid");
            const dbRef = ref(db, "/interviewbot/users/"+sid+"/interviews");
            document.getElementById("interviewstable").innerHTML = "";
            var cinterview = 0;
            onValue(dbRef, async (snapshot) => {
              let childNodes = snapshot.val();
              for (let key in childNodes) {
                cinterview += 1;
                var keyy = key.toLowerCase();
                document.getElementById("totalinterviews").innerHTML = "Total Interviews taken : "+ cinterview;
                document.getElementById("interviewstable").innerHTML += "<div id='interviewrow'><div id='bintername'>"+keyy+" Interview</div> <div id='bscoretag'>"+childNodes[key]+"%</div></div>";
                await sleep(1000);
              }
            }, {
              onlyOnce: true
            });
          }

          async function loadavailable(){
            const sid = sessionStorage.getItem("userid");
            const dbRef = ref(db, "/interviewbot/courses");
            document.getElementById("availcourses").innerHTML = "";
            onValue(dbRef, async (snapshot) => {
              let childNodes = snapshot.val();
              var cc = 0;
              for (let key in childNodes) {
                for (let i = 0; i < courses.length; i++) {
                  var tt = key.toLowerCase()
                  if(tt.includes(courses[i]) && cc<7)
                  {
                    document.getElementById("availcourses").innerHTML += "<a target={'_blank'} href='"+childNodes[key]+"'><div class='acourse' >"+key+"</div></a>";
                    cc += 1;
                  }
                }
                await sleep(1000);
              }
            }, {
              onlyOnce: true
            });
          }
        

          async function loadcourses(){
            const sid = sessionStorage.getItem("userid");
            const dbRef = ref(db, "/interviewbot/users/"+sid+"/courses");
            document.getElementById("tablerows").innerHTML = "";

            try {
              const snapshot = await get(dbRef);
              const childNodes = snapshot.val();
              for (let key in childNodes) {
                courses.push(key);
                document.getElementById("tablerows").innerHTML += "<tr><td id='columnd1'>" + key + "</td><td><button id='removebutton' value='" + key + "'>X</button></td></tr>";
                await sleep(1000);
                const boxes = document.querySelectorAll('#removebutton');
                boxes.forEach(box => {
                  box.addEventListener('click', function handleClick(_event) {
                    removecourse(box.value);
                  });
                });
              }
              await new Promise(resolve => setTimeout(resolve, 0));
              loadavailable();
            } catch (error) {
              console.log(error);
              alert("Cannot retrieve the courses!");
            }
          }

          async function hidecourse(){
            document.getElementById("courseform").style.visibility = "hidden";
            document.getElementById("courseinput").value = "";
          }

            
          async function removecourse(r){
            const sid = sessionStorage.getItem("userid");
            remove(ref(db, "/interviewbot/users/"+sid+"/courses/"+r));
            courses = [];
            await loadcourses();
          }

          var sid = document.getElementById("unumber").value;
          var spass = document.getElementById("upass").value;
          if(sid ==="" || spass === "")
              {
                  alert("Please fill all details!");
              }

          try{
 
            get(child(ref(db), "interviewbot/users/" + sid)).then(async (snapshot) => {

                if (snapshot.exists()) {
                    var pass = snapshot.child('password').val();
                    var uname = snapshot.child('name').val();
                    sessionStorage.setItem('uname',uname);
                    var CryptoJS = require("crypto-js");
                    pass = CryptoJS.AES.decrypt(pass, "anits").toString(CryptoJS.enc.Utf8);
                    if (pass === spass) {
                        document.getElementById("homeblock").style.visibility="visible";
                        document.getElementById("unumber").value="";
                        document.getElementById("upass").value="";
                        document.getElementById("name").value="";
                        document.getElementById("mobile").value="";
                        document.getElementById("email").value="";
                        document.getElementById("password").value="";
                        document.getElementById("repassword").value="";
                        document.getElementById("login").style.visibility="hidden";
                        document.getElementById("register").style.visibility="hidden";
                        document.getElementById("loginb").style.visibility = "hidden";
                        document.getElementById("logoutb").style.visibility = "visible";
                        document.getElementById("profileb").style.visibility = "visible";
                        document.getElementById("registerform").style.transition = "0ms";
                        

                        dispinfo(sid);

                        if(sessionStorage.getItem("loginto")==="interview"){
                          document.getElementById("rinterviewsection").style.visibility = "visible";
                          const pics = document.querySelectorAll('.pic');
                          pics.forEach(pic => {
                            pic.style.transition = "300ms";
                          });
                        }
                        else if(sessionStorage.getItem("loginto")==="course"){
                          document.getElementById("rcoursesection").style.visibility = "visible";
                          const pics = document.querySelectorAll('.acourse');
                          pics.forEach(pic => {
                            pic.style.transition = "300ms";
                          });
                        }

                        sessionStorage.setItem("loginto","nothing");
                        sessionStorage.setItem("userid",sid);
                        await loadinterviews();
                        await loadcourses();
                    }
                    else {
                        alert("Wrong password");
                    }
                }
                else{
                    alert("Invalid user");
                }
            });
          }
          catch{
            alert("Please check your internet connection.")
          }

    
  }



  async function slidetoregister(){
    document.getElementById("loginform").style.animation = "closelogin 800ms 1";
    document.getElementById("registerform").style.animation = "openregister 800ms 1";
    document.getElementById("registerform").style.zIndex = 2;
    document.getElementById("loginform").style.zIndex = 1;
    document.getElementById("registerform").style.transform = "scale(1)";
    document.getElementById("loginform").style.marginTop = "100px";
    document.getElementById("registerform").style.marginTop = "100px";
  }

  async function hidelogin(){
    document.getElementById("registerform").style.transition = "0ms";
    document.getElementById("login").style.visibility="hidden";
    document.getElementById("register").style.visibility="hidden";
    document.getElementById("homeblock").style.visibility="visible";
    document.getElementById("unumber").value="";
    document.getElementById("upass").value="";
    document.getElementById("name").value="";
    document.getElementById("mobile").value="";
    document.getElementById("email").value="";
    document.getElementById("password").value="";
    document.getElementById("repassword").value="";
    await sleep(500);
    document.getElementById("registerform").style.transition = "1000ms";
  }

  return (
    <div id="loginblock">
      <div id="loginform">
        <p id="cancellog" onClick={hidelogin}>X</p>
        <h1>V PREP Login</h1><br/><br/>
        <input type="text" id="unumber" placeholder='Enter your mobile number' /> <br/><br/>
        <input type="password" id="upass" placeholder='Enter your password' /> <br/><br/>
        <button onClick={loginfun}>Login</button> <br/><br/>
        <b onClick={slidetoregister}>Register</b>
      </div>
    </div>
  );
}

export default Login;
