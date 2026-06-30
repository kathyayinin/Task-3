/* ==========================
   QUIZ DASHBOARD PRO
========================== */

let i = 0;
let score = 0;
let timer = null;
let time = 10;

let currentQuiz = [];
let answers = [];

let chartInstance = null;

/* Load leaderboard from storage */
let students =
JSON.parse(localStorage.getItem("quizStudents")) || [];

/* ==========================
   QUESTION BANK
========================== */

const quizData = [

{
q:"HTML stands for?",
opt:[
"Hyper Text Markup Language",
"High Text Machine Language",
"Hyper Tool Mark Language",
"None"
],
ans:"Hyper Text Markup Language"
},

{
q:"CSS is used for?",
opt:[
"Styling",
"Database",
"Server",
"Compiler"
],
ans:"Styling"
},

{
q:"JavaScript is a?",
opt:[
"Programming Language",
"Browser",
"Database",
"Operating System"
],
ans:"Programming Language"
},

{
q:"2 + 2 = ?",
opt:["3","4","5","6"],
ans:"4"
},

{
q:"Water formula?",
opt:["CO2","H2O","O2","NaCl"],
ans:"H2O"
},

{
q:"Sun rises in?",
opt:["North","South","East","West"],
ans:"East"
},

{
q:"React is a?",
opt:[
"Library",
"Database",
"Browser",
"Language"
],
ans:"Library"
},

{
q:"5 × 6 = ?",
opt:["20","25","30","35"],
ans:"30"
},

{
q:"Which tag creates a hyperlink?",
opt:[
"<a>",
"<p>",
"<h1>",
"<div>"
],
ans:"<a>"
},

{
q:"Which company developed JavaScript?",
opt:[
"Netscape",
"Google",
"Microsoft",
"Apple"
],
ans:"Netscape"
},

{
q:"10 - 3 = ?",
opt:["5","6","7","8"],
ans:"7"
},

{
q:"CSS full form?",
opt:[
"Cascading Style Sheets",
"Creative Style Sheets",
"Computer Style Sheets",
"None"
],
ans:"Cascading Style Sheets"
}

];

/* ==========================
   TAB SYSTEM
========================== */

function openTab(id){

document
.querySelectorAll(".tab")
.forEach(tab=>{
tab.classList.remove("active");
});

document
.getElementById(id)
.classList.add("active");

if(id === "analysis"){
drawChart();
}
}

/* ==========================
   START QUIZ
========================== */

function startQuiz(){

const studentName =
document
.getElementById("studentName")
.value
.trim();

if(!studentName){
alert("Please enter your name first.");
return;
}

/* Random 5 Questions */

currentQuiz =
[...quizData]
.sort(()=>Math.random()-0.5)
.slice(0,5);

i = 0;
score = 0;
answers = [];

openTab("quiz");

loadQuestion();

startTimer();
}

/* ==========================
   LOAD QUESTION
========================== */

function loadQuestion(){

let q = currentQuiz[i];

document.getElementById("qno")
.innerText =
`Question ${i+1}/${currentQuiz.length}`;

document.getElementById("score")
.innerText =
`Score: ${score}`;

document.getElementById("question")
.innerText =
q.q;

let box =
document.getElementById("options");

box.innerHTML = "";

/* shuffle options */

let shuffled =
[...q.opt]
.sort(()=>Math.random()-0.5);

shuffled.forEach(option=>{

let btn =
document.createElement("button");

btn.innerText = option;

btn.onclick = ()=>{

answers[i] = option;

document
.querySelectorAll("#options button")
.forEach(b=>{

b.disabled = true;

if(
b.innerText === q.ans
){
b.classList.add("correct");
}

});

if(option === q.ans){

btn.classList.add("correct");
score++;

document.getElementById("score")
.innerText =
`Score: ${score}`;

}else{

btn.classList.add("wrong");
}

};

box.appendChild(btn);

});
}

/* ==========================
   NEXT QUESTION
========================== */

function nextQ(){

if(i < currentQuiz.length-1){

i++;

resetTimer();

loadQuestion();

}else{

finish();
}
}

/* ==========================
   TIMER
========================== */

function startTimer(){

clearInterval(timer);

time = 10;

document.getElementById("timer")
.innerText = time;

timer = setInterval(()=>{

time--;

document.getElementById("timer")
.innerText = time;

if(time <= 0){

if(i < currentQuiz.length-1){

i++;
loadQuestion();

time = 10;

}else{

finish();
}

}

},1000);
}

function resetTimer(){

clearInterval(timer);

startTimer();
}

/* ==========================
   FINISH QUIZ
========================== */

function finish(){

clearInterval(timer);

let name =
document.getElementById("studentName")
.value.trim();

let accuracy =
Math.round(
(score/currentQuiz.length)*100
);

students.push({

name:name,
score:score,
total:currentQuiz.length,
accuracy:accuracy

});

students.sort(
(a,b)=>b.score-a.score
);

localStorage.setItem(
"quizStudents",
JSON.stringify(students)
);

showReview();
showLeaderboard();
updateDashboard();

openTab("analysis");
}

/* ==========================
   REVIEW
========================== */

function showReview(){

let box =
document.getElementById("reviewBox");

box.innerHTML = "";

currentQuiz.forEach((q,index)=>{

box.innerHTML += `

<div>

<p><strong>Question:</strong>
${q.q}</p>

<p><strong>Your Answer:</strong>
${answers[index] || "Not Answered"}
</p>

<p><strong>Correct Answer:</strong>
${q.ans}
</p>

<hr>

</div>

`;

});
}

/* ==========================
   LEADERBOARD
========================== */

function showLeaderboard(){

let board =
document.getElementById("board");

board.innerHTML = "";

students.forEach((student,index)=>{

let medal = "";

if(index===0) medal="🥇";
else if(index===1) medal="🥈";
else if(index===2) medal="🥉";

board.innerHTML += `

<h3>

${medal}
#${index+1}

${student.name}

-

${student.score}/${student.total}

(${student.accuracy}%)

</h3>

`;

});

}

/* ==========================
   ANALYSIS
========================== */

function getFeedback(accuracy){

if(accuracy >= 90){
return "Excellent performance! Outstanding work. 🔥";
}

if(accuracy >= 75){
return "Very good performance. 👍";
}

if(accuracy >= 50){
return "Average performance. More practice recommended. 📘";
}

return "Needs improvement. Practice regularly. ⚠";
}

function drawChart(){

if(!currentQuiz.length){
return;
}

let accuracy =
Math.round(
(score/currentQuiz.length)*100
);

let wrong =
100 - accuracy;

document
.getElementById("analysisText")
.innerHTML = `

<h3>Accuracy: ${accuracy}%</h3>

<p>${getFeedback(accuracy)}</p>

<h4>Improvement Suggestions</h4>

<ul>
<li>Review wrong answers.</li>
<li>Practice daily quizzes.</li>
<li>Improve speed and accuracy.</li>
<li>Focus on weaker topics.</li>
</ul>

`;

const ctx =
document.getElementById("chart");

if(chartInstance){
chartInstance.destroy();
}

chartInstance =
new Chart(ctx,{

type:"doughnut",

data:{
labels:[
"Correct",
"Wrong"
],

datasets:[{

data:[
accuracy,
wrong
],

backgroundColor:[
"#22c55e",
"#ef4444"
]

}]
}

});
}

/* ==========================
   DASHBOARD STATS
========================== */

function updateDashboard(){

let playerCount =
students.length;

let topScore = 0;

students.forEach(student=>{

if(student.score > topScore){

topScore =
student.score;

}

});

let avg = 0;

if(students.length){

students.forEach(student=>{

avg +=
student.accuracy;

});

avg =
Math.round(
avg/students.length
);

}

let playerEl =
document.getElementById("playerCount");

let topEl =
document.getElementById("topScore");

let avgEl =
document.getElementById("avgScore");

if(playerEl)
playerEl.innerText = playerCount;

if(topEl)
topEl.innerText = topScore;

if(avgEl)
avgEl.innerText = avg + "%";
}

/* ==========================
   INITIAL LOAD
========================== */

showLeaderboard();
updateDashboard();