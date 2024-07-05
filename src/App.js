import './App.css';
import homebg from './img/homebg.jpg'

function App() {

  function displaylogin(){
    document.getElementById("login").style.visibility = "visible";
    document.getElementById("register").style.visibility = "visible";
  }

  function logout(){
    document.getElementById("logoutb").style.visibility = "hidden";
    document.getElementById("loginb").style.visibility = "visible";
    document.getElementById("registerform").style.transition = "1000ms";
    document.getElementById("profileb").style.visibility = "hidden";
    document.getElementById("availcourses").innerHTML = "";
    sessionStorage.setItem("loginto","nothing");
    alert("logged out succesfully");
  }

  function openinterviewhome(){

        var vis = window.getComputedStyle(document.querySelector('#loginb')).visibility
        if(vis==="visible")
        {
          sessionStorage.setItem("loginto","interview");
          displaylogin();
        }
        else{
          const pics = document.querySelectorAll('.pic');
          pics.forEach(pic => {
            pic.style.transition = "300ms";
          });
          document.getElementById("rinterviewsection").style.visibility = "visible";
        }
        
    }

    function opencoursehome(){

      var vis = window.getComputedStyle(document.querySelector('#loginb')).visibility
      if(vis==="visible")
      {
        sessionStorage.setItem("loginto","course");
        displaylogin();
      }
      else{
        const pics = document.querySelectorAll('.acourse');
        pics.forEach(pic => {
          pic.style.transition = "300ms";
        });
        document.getElementById("rcoursesection").style.visibility = "visible";
      }
      
  }

  function openprofile(){
    document.getElementById("rprofile").style.visibility = "visible";
  }

  

  return (
    <div id="body1">
      <div id="header">
        <h1 id="logo">V PREP</h1>
        <h5 id="homeb">HOME</h5>
        <h5 id="aboutb">ABOUT US</h5>
        <h5 id="contactb">CONTACT US</h5>

        <h5 id="loginb" className='loginb' onClick={displaylogin}>SIGN IN</h5>
        <h5 id="logoutb" onClick={logout}>LOG OUT</h5>

        <h5 id="profileb" onClick={openprofile}>PROFILE</h5>
      </div>


      <img id="homebg" src={homebg} alt="" height={'200px'} width={'200px'}/>
      
      
      <div id="homeblock">
        <h4>HERE V GO!</h4>
        <h1>IMPROVE YOUR INTERVIEW <br/>SKILLS WITH US</h1>
        <button id="interviewb" onClick={openinterviewhome}>INTERVIEWS</button>
        <button id="courseb" onClick={opencoursehome}>COURSES</button>
      </div>


      <div id="footer">
        Developed by ANITS
      </div>


    </div>
  );
}

export default App;
