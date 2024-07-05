import './Interviewsection.css';
import amazon from './img/amazon.png'
import infosys from './img/infosys.png'
import tcs from './img/tcs.jpeg'
import wipro from './img/wipro.png'
import microsoft from './img/microsoft.jpeg'
import google from './img/google.png'
import clang from './img/c.png'
import cpp from './img/cpp.png'
import java from './img/java.png'
import python from './img/python.jpg'
import javascript from './img/js.png'
import mysql from './img/mysql.png'

function Interviewsection() {
  function goback(){
      const pics = document.querySelectorAll('.pic');
      pics.forEach(pic => {
        pic.style.transition = "0ms";
      });
      document.getElementById("homeb").style.color = "rgb(255, 94, 0)";
      document.getElementById("rinterviewsection").style.visibility = "hidden";
  }

  function start(x){
      document.getElementById("rinterviewprocess").style.visibility = "visible";
      document.getElementById("loadingscreen").style.visibility = "visible";
      document.getElementById("ibegin").style.visibility = "visible";
      sessionStorage.setItem("currcompany",x);
  }

  function logout(){
    document.getElementById("logoutb").style.visibility = "hidden";
    document.getElementById("loginb").style.visibility = "visible";
    goback();
  }

  return (
    <div id="interviewsection">

      <div id="header">
        <h1 id="logo">V PREP</h1>
        <h5 id="ihomeb" onClick={goback}>HOME</h5>
        <h5 id="aboutb">ABOUT US</h5>
        <h5 id="contactb">CONTACT US</h5>

        <h5 id="logoutb" onClick={logout}>LOG OUT</h5>
      </div>
      
      <div id="companyblock">
        <h3>CUSTOMIZE YOUR INTERVIEW!!</h3>
        <p>BY COMPANY</p>
        <div id="companieslist">

          <img id="firstpic" style={{marginLeft:'150px'}} className="pic" src={amazon} alt="" onClick={() => start("amazon")}/>
          <img className="pic" src={infosys} alt="" onClick={() => start("infosys")}/>
          <img className="pic" src={tcs} alt="" onClick={() => start("tcs")}/>
          <img className="pic" src={wipro} alt="" onClick={() => start("wipro")}/>
          <img className="pic" src={microsoft} alt="" onClick={() => start("microsoft")}/>
          <img className="pic" src={google} alt="" onClick={() => start("google")}/>
          
        </div>
      </div>

      <div id="courseblock">
        <h3>CUSTOMIZE YOUR INTERVIEW!!</h3>
        <p style={{marginLeft:'850px'}}> BY COURSE</p>
        <div id="companieslist">

          <img id="firstpic" style={{marginLeft:'150px'}} className="pic" src={clang} alt="" onClick={() => start("amazon")}/>
          <img className="pic" src={cpp} alt="" onClick={() => start("C++")}/>
          <img className="pic" src={java} alt="" onClick={() => start("java")}/>
          <img className="pic" src={python} alt="" onClick={() => start("PYTHON")}/>
          <img className="pic" src={javascript} alt="" onClick={() => start("javascript")}/>
          <img className="pic" src={mysql} alt="" onClick={() => start("MySQL")}/>
          
        </div>
      </div>

      <div id="footer" style={{bottom:"32px"}}>
        Developed by ANITS
      </div>
    
    </div>
  );
}

export default Interviewsection;
