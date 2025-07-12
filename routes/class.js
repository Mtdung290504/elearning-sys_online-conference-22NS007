import express from 'express';
import middleWares from './middle-wares.js';
import Database from '../model/database/database.js';
import Utils, { PROJECT_ROOT } from '../utils.js';

import path from 'path';

const router = express.Router();
const db = new Database();

router.get('/:id', middleWares.requireClassExistence, middleWares.requireAccessToClass, async (req, res) => {
    const classId = req.params.id;
    const user = req.session.user;
    user.accessingClass = classId;
    const role = req.session.role;
    const roles = ['SV', 'GV'];
    const rootUrl = Utils.getRootUrl(req);

    try {
        const { class_name, invite_code_students, is_open_students, member_count } = await db.getClassNameAndMember(classId);
        const listOfClasses = await db.getAllClass(user.id, role);
        const listOfExerciseIds = await db.getExerciseIds(classId);
        const meetings = await db.getAllMeetingOfClass(classId);
        meetings.forEach(meeting => {
            meeting.start_time = Utils.formatToDisplayDatetime(meeting.start_time);
            meeting.end_time = Utils.formatToDisplayDatetime(meeting.end_time);
        });

        // Mảng promises chứa các promise để lấy thông tin của từng bài tập
        const promises = listOfExerciseIds.map(async ({ id }) => {
            const exerciseId = id;
            const [exerciseInfo, attachFiles] = await Promise.all([
                role == 1 ? db.getExerciseInfoForLecturer(exerciseId) : db.getExerciseInfoForStudent(exerciseId, user.id),
                db.getAttachFileOfExercise(exerciseId)
            ]);
            if (exerciseInfo) {
                exerciseInfo.attachFiles = attachFiles;
                return exerciseInfo;
            }
            return null;
        });
        
        const exercises = await Promise.all(promises); // Đợi cho tất cả các promise hoàn thành và lấy kết quả
        const validExercises = exercises.filter(exercise => exercise !== null); // Lọc
        validExercises.sort((a, b) => a.id - b.id); // Xếp

        console.log('Debug class page:', exercises, validExercises);

        validExercises.forEach(exercise => {
            exercise.start_time = Utils.formatToDisplayDatetime(exercise.start_time);
            exercise.end_time = Utils.formatToDisplayDatetime(exercise.end_time);
        });

        if (role == 1) {
            const listOfAttachFile = await db.getClassAttachFiles(classId, user.id);

            res.render('class-views/lecturer', {
                rootUrl, user,
                role: roles[role],
                listOfAttachFile,
                listOfClasses,
                className: class_name,
                members: member_count,
                exercises: validExercises,
                invite_code_students,
                is_open_students,
                meetings
            });
            return;
        }

        const lecturerId = listOfClasses[listOfClasses.findIndex(cls => cls.id == classId)]['lecturer_id'];
        const listOfAttachFile = await db.getClassAttachFiles(classId, lecturerId);
        res.render('class-views/student', {
            rootUrl, user,
            role: roles[role],
            listOfAttachFile,
            listOfClasses,
            className: class_name,
            members: member_count,
            exercises: validExercises,
            meetings
        });
    } catch (error) {
        console.error(error);
        res.send('Internal server error');
    }
});

router.get('/:id/meet/:meetingCode', (req, res) => {
    const user = req.session.user;
    const role = req.session.role;
    // res.json({ classId: req.params.id, mettingCode: req.params.meetingCode, user: JSON.stringify(user) });
    res.render(path.join(PROJECT_ROOT, 'views', 'meeting.ejs'), { user, role });
});

export default router;