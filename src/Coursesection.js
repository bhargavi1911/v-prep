import './Coursesection.css';
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

var courses = [];

const sleep = ms => new Promise(r => setTimeout(r, ms));



function Coursesection() {
  function cgoback(){
      const pics = document.querySelectorAll('.acourse');
      pics.forEach(pic => {
        pic.style.transition = "0ms";
      });
      document.getElementById("homeb").style.color = "rgb(255, 94, 0)";
      document.getElementById("rcoursesection").style.visibility = "hidden";
      document.getElementById("courseform").style.visibility = "hidden";
      document.getElementById("courseinput").value = "";
  }


  function logout(){
    document.getElementById("logoutb").style.visibility = "hidden";
    document.getElementById("loginb").style.visibility = "visible";
    cgoback();
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
            const pics = document.querySelectorAll('.acourse');
            pics.forEach(pic => {
              pic.style.transition = "300ms";
            });
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

  async function courseadding(coursename){
    const sid = sessionStorage.getItem("userid");
    var dbref = ref(db, "/interviewbot/users/" + sid + "/courses");
    try {
      await update(dbref, {
        [coursename]: ""
      });
      alert("Course added successfully");
    } catch (error) {
      alert("Cannot add the specified course!");
    }
    await sleep(1000);
    courses = [];
    await hidecourse();
    await loadcourses();
    
  }
 

  async function removecourse(r){
    const sid = sessionStorage.getItem("userid");
    remove(ref(db, "/interviewbot/users/"+sid+"/courses/"+r));
    courses = [];
    await loadcourses();
  }


  function showcourse(){
    document.getElementById("courseform").style.visibility = "visible";
  }

  

  async function addcourse(){
    var x = document.getElementById("courseinput").value;
    if(x ==="")
    {
        alert("Please enter any valid course");
        return;
    }
    await courseadding(x);
    
  }

 
  return (
    <div id="coursesection">

      <div id="header">
        <h1 id="logo">V PREP</h1>
        <h5 id="ihomeb" onClick={cgoback}>HOME</h5>
        <h5 id="aboutb">ABOUT US</h5>
        <h5 id="contactb">CONTACT US</h5>
        <h5 id="logoutb" onClick={logout}>LOG OUT</h5>
      </div>

      <div id="coursetop">
        <h3>Registered courses</h3>
        <button id="courseregister" onClick={showcourse}>Add</button>

        <table id="coursetable">
          <tr>
            <th id="columnh1">Course Name</th><th>Remove</th>
          </tr>
        </table>

        <div id="tablepanel">
          <table id="tablerows">
          </table>
        </div>

        {/*<p>*A notification will be sent to your registered mobile number whenever these courses are available.</p>*/}
        

      </div>

      <div id="coursebottom">
        <h3>Avaialable Courses</h3>
        <div id="coursepanelbot">
          <div id="availcourses">
            <div id="availtemp">
            
            </div>
          </div>
        </div>
      </div>


      <div id="courseform">
        <input type="text" id="courseinput" placeholder='Enter your course name'/> <br/>
        <div id="coursebuttons">
        <button id="addcoursebutton" onClick={addcourse}>SUBMIT</button>
        <button id="cancelcoursebutton" onClick={hidecourse}>CANCEL</button>
        </div>
      </div>
      
      <div id="footer" style={{bottom:"32px"}}>
        Developed by ANITS
      </div>
    
    </div>
  );
}

export default Coursesection;
