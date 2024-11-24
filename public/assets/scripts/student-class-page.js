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

function joinMeeting(event, meetingCode) {
    event.preventDefault();
    // Lấy URL hiện tại và đảm bảo có dấu `/` ở cuối
    let baseUrl = window.location.href;
    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }
    // Tạo URL cho phòng họp
    const meetingUrl = `${baseUrl}meet/${meetingCode}`;
    // Mở URL trong một tab mới
    window.open(meetingUrl, '_blank');
}