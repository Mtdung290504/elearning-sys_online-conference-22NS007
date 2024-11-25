const [btnManageClassDocument, btnManageStudent, btnAddExercise, btnAddMeeting] = [
    "#manage-class-documents",
    "#manage-student",
    "#add-exercise",
    "#add-meeting"
].map((selector) => document.querySelector(selector));

btnManageClassDocument.addEventListener("click", () => {
    resetModal();
    RequestHandler.sendRequest("ajax/get-all-doc-and-doc-categories", { classId: getClassId() })
        .then(({ e, m, d }) => {
            if (e) {
                alert(e);
                return;
            }
            // console.log(d);
            new ModalContent("editClassFileAttaches", d).buildModalContent(modal);
            document.body.classList.add("open-modal");
        })
        .catch((error) => {
            console.log(error);
        });
});

btnManageStudent.addEventListener("click", () => {
    resetModal();
    RequestHandler.sendRequest(`ajax/student-from-class/${getClassId()}`, {}, "GET")
        .then(({ e, m, d }) => {
            if (e) {
                alert(e);
                return;
            }
            // console.log(d);
            new ModalContent("manageStudent", d).buildModalContent(modal);
            document.body.classList.add("open-modal");
        })
        .catch((error) => {
            console.log(error);
        });
});

btnAddExercise.addEventListener("click", () => {
    resetModal();
    RequestHandler.sendRequest("ajax/get-all-doc-and-doc-categories", { classId: getClassId() })
        .then(({ e, m, d }) => {
            if (e) {
                alert(e);
                return;
            }
            // console.log(d);
            new ModalContent("addExercise", d).buildModalContent(modal);
            document.body.classList.add("open-modal");
        })
        .catch((error) => {
            console.log(error);
        });
});

btnAddMeeting.addEventListener("click", () => {
    resetModal();
    new ModalContent('addMeeting', null).buildModalContent(modal);
    document.body.classList.add("open-modal");
});

function deleteExercise(event, exerciseId) {
    event.preventDefault();
    const exerciseBox = event.target.closest('.exercise');
    exerciseId = parseInt(exerciseId);

    if (isNaN(exerciseId)) {
        alert('Lỗi tham số');
        return;
    }
    
    if(!confirm('Xác nhận xóa bài tập này?'))
        return;

    RequestHandler.sendRequest('ajax/exercise', { exerciseId: Number(exerciseId) }, 'DELETE')
    .then(({ e, m, d }) => {
        if (e) {
            alert(e);
            return;
        }
        alert(m);
        const exercisesContainer = exerciseBox.parentNode;
        exercisesContainer.removeChild(exerciseBox);
        if(exercisesContainer.childElementCount == 0)
            exercisesContainer.innerHTML = '<h3 style="margin: 10px">CHƯA CÓ BÀI TẬP NÀO</h3>';
    }).catch(error => console.log(error));
}

function deleteMeeting(event, meetingId) {
    event.preventDefault();
    const meetingBox = event.target.closest('.meeting');
    meetingId = parseInt(meetingId);

    if (isNaN(meetingId)) {
        alert('Lỗi tham số');
        return;
    }
    
    if(!confirm('Xác nhận xóa buổi học này?'))
        return;

    RequestHandler.sendRequest('ajax/meeting', { meetingId: Number(meetingId) }, 'DELETE')
    .then(({ e, m, d }) => {
        if (e) {
            alert(e);
            return;
        }
        alert(m);
        const meetingContainer = meetingBox.parentNode;
        meetingContainer.removeChild(meetingBox);
        if(meetingContainer.childElementCount == 0) meetingContainer.innerHTML = '<h3 style="margin: 10px">CHƯA CÓ BUỔI HỌC NÀO</h3>';
    }).catch(error => console.log(error));
}

function editExercise(event, exerciseId) {
    event.preventDefault();
    exerciseId = parseInt(exerciseId);

    if (isNaN(exerciseId)) {
        alert('Lỗi tham số');
        return;
    }

    RequestHandler.sendRequest(`ajax/exercise/${exerciseId}`, {}, 'GET')
    .then(({ e, m, d }) => {
        if (e) {
            alert(e);
            return;
        }
        // console.log(d);
        new ModalContent("editExercise", d).buildModalContent(modal);
        document.body.classList.add("open-modal");
    })
    .catch((error) => {
        console.log(error);
    });
}

function editMeeting(event, meetingId) {
    event.preventDefault();
    meetingId = parseInt(meetingId);

    if (isNaN(meetingId)) {
        alert('Lỗi tham số');
        return;
    }

    RequestHandler.sendRequest(`ajax/meeting/${meetingId}`, {}, 'GET')
    .then(({ e, m, d }) => {
        if (e) {
            alert(e);
            return;
        }console.log(d);
        new ModalContent("editMeeting", d).buildModalContent(modal);
        
        document.body.classList.add("open-modal");
    })
    .catch((error) => {
        console.log(error);
    });
}

function viewDetailExercise(event, exerciseId) {
    event.preventDefault();
    exerciseId = parseInt(exerciseId);
    const exerciseBox = event.target.closest('.exercise');
    const exerciseName = exerciseBox.querySelector('summary .exercise-name').textContent;

    if (isNaN(exerciseId)) {
        alert('Lỗi tham số');
        return;
    }

    RequestHandler.sendRequest(`ajax/class/${getClassId()}/submitted-exercise/${exerciseId}`, { classId: getClassId() }, 'GET')
    .then(({ e, m, d }) => {
        if (e) {
            alert(e);
            return;
        }
        // console.log(d);
        d.exerciseId = exerciseId;
        d.exerciseName = exerciseName;
        new ModalContent("viewSubmissionStatus", d).buildModalContent(modal);
        document.body.classList.add("open-modal");
    })
    .catch((error) => {
        console.log(error);
    });
}

function editClassName() {
    const newName = prompt('Nhập tên lớp mới', document.querySelector('.class-name').textContent);
    if(!newName) {
        return;
    }
    if(newName.length > 49) {
        alert('Tên lớp quá dài');
        return;
    }

    RequestHandler.sendRequest('ajax/class-name', { classId: getClassId(), newName }, 'PUT')
    .then(({ e, m, d }) => {
        if(e) {
            alert(e);
            return;
        }
        if(m == 'ok') {
            document.querySelector('.class-name').textContent = newName;
            alert('Cập nhật thành công');
        }

    }).catch(error => console.log(error));
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

document.getElementById('copy-button').addEventListener('click', () => {
    const link = document.getElementById('invite-link');
    link.select(); // Chọn toàn bộ nội dung
    link.setSelectionRange(0, 99999); // Đảm bảo hoạt động trên mobile
    navigator.clipboard.writeText(link.value).then(() => {
        alert("Đã sao chép mã mời!");
    });
});

document.getElementById('invite-toggle').addEventListener('input', function () {
    RequestHandler.sendRequest('ajax/toggle-invite-link', { classId: getClassId(), currentStatus: this.checked }, 'POST')
    .then(({ e, m, d }) => {
        if(e) {
            alert(e);
            return;
        }
        if(m) {
            console.log(m);
        }
    }).catch(error => console.log(error));
});