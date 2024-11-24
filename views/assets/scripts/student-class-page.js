function submitExercise(event, exerciseId) {
    event.preventDefault();
    exerciseId = parseInt(exerciseId);
    const exerciseName = event.target.closest('summary').querySelector('.exercise-name').textContent;

    if (isNaN(exerciseId)) {
        alert('Lỗi tham số');
        return;
    }

    RequestHandler.sendRequest(`ajax/submit-exercise/${exerciseId}`, {}, 'GET')
    .then(({ e, m, d }) => {
        if(e) {
            alert(e);
            return;
        }
        d.exerciseId = exerciseId;
        d.exerciseName = exerciseName;
        new ModalContent("submitExercise", d).buildModalContent(modal);
        document.body.classList.add("open-modal");
    })
    .catch(error => console.log(error));
}