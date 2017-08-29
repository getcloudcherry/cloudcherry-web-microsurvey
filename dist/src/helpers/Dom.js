var index = 0;
$("body").on('click', ".cc-button-next", function (e) {
    e.stopPropagation();
    $(".cc-survey-content .main-box").addClass('hide');
    $(".cc-survey-content .main-box").removeClass('show');
    $(".cc-survey-content .main-box").eq(index + 1).addClass('show');
    index++;
}).on('click', ".cc-button-prev", function (e) {
    e.stopPropagation();
    $(".cc-survey-content .main-box").addClass('hide');
    $(".cc-survey-content .main-box").removeClass('show');
    $(".cc-survey-content .main-box").eq(index - 1).addClass('show');
    index--;
}).on('click', ".cc-survey", function (e) {
    e.stopPropagation();
}).on('click', '#cc-button-start-survey', function (e) {
    $('#cc-welcome-question-box').removeClass('show');
    $('#cc-welcome-question-box').addClass('hide');
    $('.cc-survey').addClass('show');
    e.stopPropagation();
    $('.cc-survey').removeClass('hide');
}).on('click', '.cc-button-close', function (e) {
    e.stopPropagation();
    $('.cc-survey').addClass('hide');
    $('.cc-survey').removeClass('show');
});
//# sourceMappingURL=Dom.js.map