document.getElementById("submitQuiz").addEventListener("click", setAnswer);

var questionsId = [];
var answersSelectedId = [];
var results = "";
initQuestionsId();

function initQuestionsId(){
    var questions = document.getElementsByClassName('question');
    for(i=0; i<questions.length; i++){
        console.log(questions[i].id);
        //let id = questions[i].id.substring(1);
        questionsId.push(questions[i].id);
    }
}

function setAnswer(){
    while(questionsId.length != 0){
        console.log(questionsId.length);
        var id = questionsId.pop();
        console.log(id);
        var ele = document.getElementsByName(id);
        console.log(ele);
        for(i=0; i<ele.length ; i++){
            if(ele[i].checked){
                answersSelectedId.push(ele[i].value);
                results = results + ele[i].value + "#";
                console.log(ele[i].value)
            }
        }
    }
    results = results.substring(0, results.length - 1);
    var inputForm = $("#results")[0];
    inputForm.value = results;
    
}