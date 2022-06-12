function editQuestion(id){
    console.log(id);
    var questionNameId = "#questionName" + id;
    var questionCorrectId = "#correctResponse" + id;
    var questionIncorrect1Id = "#incorrectResponse1" + id;
    var questionIncorrect2Id = "#incorrectResponse2" + id;
    var questionIncorrect3Id = "#incorrectResponse3" + id;
    console.log
    var questionNameField = $(questionNameId)[0];
    var correctResponseField = $(questionCorrectId)[0];
    var incorrectResponse1Field = $(questionIncorrect1Id)[0];
    var incorrectResponse2Field = $(questionIncorrect2Id)[0];
    var incorrectResponse3Field = $(questionIncorrect3Id)[0];
    console.log(questionNameInput);

    var questionNameInput = $("#editQuestionNameInput")[0];
    var correctResponseInput = $("#editCorrectResponseInput")[0];
    var incorrectResponse1Input = $("#editIncorrectResponseInput1")[0];
    var incorrectResponse2Input = $("#editIncorrectResponseInput2")[0];
    var incorrectResponse3Input = $("#editIncorrectResponseInput3")[0];
    var questionIdInput = $("#questionIdInput")[0];

    questionIdInput.value = id;
    questionNameInput.value = questionNameField.innerHTML;
    correctResponseInput.value = correctResponseField.innerHTML;
    incorrectResponse1Input.value = incorrectResponse1Field.innerHTML;
    incorrectResponse2Input.value = incorrectResponse2Field.innerHTML;
    incorrectResponse3Input.value = incorrectResponse3Field.innerHTML;
}