
import './Register.css';

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set,onValue } from "firebase/database";


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


const sleep = ms => new Promise(r => setTimeout(r, ms));

function Register() {

  function slidetologin(){
    document.getElementById("registerform").style.animation = "closeregister 800ms 1";
    document.getElementById("loginform").style.animation = "openlogin 800ms 1";
    document.getElementById("registerform").style.zIndex = 1;
    document.getElementById("loginform").style.zIndex = 2;
    document.getElementById("loginform").style.transform = "scale(1)";
    document.getElementById("loginform").style.marginTop = "100px";
    document.getElementById("registerform").style.marginTop = "100px";
  }
  
  function registerfun(){
            var rname = document.getElementById("name").value;
            var rnumber = document.getElementById("mobile").value;
            var rmail = document.getElementById("email").value;
            var rpass = document.getElementById("password").value;
            var rcpass = document.getElementById("repassword").value;
            var passtemp = rpass;
            var CryptoJS = require("crypto-js");
            rpass = CryptoJS.AES.encrypt(rpass, "anits").toString();;

            if(rname ==="" || rnumber ==="" || passtemp === "" || rmail === "" )
            {
                alert("Please fill all details!");
                return;
            }

            if(rnumber.length !== 10)
            {
              alert("Invalid number!");
              return;
            }

            if(passtemp!==rcpass)
            {
              alert("Passwords mismatch!");
              return;
            }

          
            var dbref = ref(db, "/interviewbot/users/" + rnumber);

            
            onValue(dbref, async (snapshot) => {
    
                if (snapshot.exists()) {
                  alert("User already registered! Please login");
                }
                else {
                    set(dbref, {
                        name: rname,
                        mobile: rnumber,
                        password: rpass,
                        mail: rmail,
                        score:0,
                    })
                        .then(async () => {
                            alert("registration successfull");
                            slidetologin();

                        })
                        .catch(async () => {
                            alert("Registration failed!");
                            
                        });
                }
    
            }
                , {
                    onlyOnce: true
                }
            );
            

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
    <div id="registerblock">
      <div id="registerform">
      <p id="cancellog" onClick={hidelogin}>X</p>
        <h1>V PREP Registration</h1><br/><br/>
        <input type="text" id="name" placeholder='Enter your name' /> <br/><br/>
        <input type="text" id="mobile" placeholder='Enter your mobile number' /> <br/><br/>
        <input type="mail" id="email" placeholder='Enter your email ID' /> <br/><br/>
        <input type="password" id="password" placeholder='Enter your password' /> <br/><br/>
        <input type="password" id="repassword" placeholder='Confirm your password' /> <br/><br/>
        <button onClick={registerfun}>Register</button> <br/><br/>
        <b onClick={slidetologin}>Login</b>
      </div>
    </div>
  );
}

export default Register;
