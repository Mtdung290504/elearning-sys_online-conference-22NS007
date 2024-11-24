const [btnManageClassDocument, btnManageStudent, btnAddExercise] = [
    "#manage-class-documents",
    "#manage-student",
    "#add-exercise",
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