import './Profile.css';
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

function Profile() {
  function profilegoback(){
      
      document.getElementById("homeb").style.color = "rgb(255, 94, 0)";
      document.getElementById("rprofile").style.visibility = "hidden";
  }

  return (
    <div id="profilesection">
        <div id="profileblock">
            <div id="leftprofile">
                <div id="ppic">
                  
                </div>
                <div id="pdetails">
                    <p id="pname"> Thammineni Ashok Kumar </p>
                    <p id="pmobile"> 7680853931 </p>
                    <p id="pmail"> ak9000812219@gmail.com </p>
                </div>

            </div>

            <div id="rightprofile">

              <div id="profileback" onClick={profilegoback}>Back</div>

              <h3 id="totalinterviews">Total Interviews Taken : 237</h3>

              <div id="tablehead">
                <p> Interview Name </p> <p id="ascoretag"> Achieved Score </p>
              </div>

              <div id="interviewstable">
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
                <div id="interviewrow">
                  <div id="bintername"> Python Interview</div> <div id="bscoretag">85%</div>
                </div>
              </div>

            </div>
        </div>
    </div> 
  );
}

export default Profile;
