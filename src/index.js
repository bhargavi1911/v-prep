import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Interviewprocess from './Interviewprocess';
import Interviewsection from './Interviewsection';
import Login from './Login';
import Register from './Register';
import Coursesection from './Coursesection';
import Profile from './Profile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

const interview = ReactDOM.createRoot(document.getElementById('rinterviewsection'));
interview.render(
    <Interviewsection />
);

const course = ReactDOM.createRoot(document.getElementById('rcoursesection'));
course.render(
    <Coursesection />
);


const interviewmain = ReactDOM.createRoot(document.getElementById('rinterviewprocess'));
interviewmain.render(
    <Interviewprocess/>
);

const register = ReactDOM.createRoot(document.getElementById('register'));
register.render(
    <Register />
);

const login = ReactDOM.createRoot(document.getElementById('login'));
login.render(
    <Login />
);

const profile = ReactDOM.createRoot(document.getElementById('rprofile'));
profile.render(
    <Profile />
);
