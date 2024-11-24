import bcrypt from "bcrypt";

class Account {
    constructor(userId, loginId, hashedPassword, enteredPassword) {
        Object.assign(this, { userId, loginId, hashedPassword, enteredPassword });
    }

    async checkPassword() {
        try {
            const isMatch = await bcrypt.compare(
                this.enteredPassword,
                this.hashedPassword
            );
            return isMatch;
        } catch (error) {
            throw new Error("Error checking password");
        }
    }
}

class User {
    constructor(id, name, phoneNumber, email) {
        Object.assign(this, { id, name, phoneNumber, email });
        this.listOfClasses = [];
    }

    withListOfClasses(listOfClasses) {
        const idMap = this.listOfClasses.map((cls) => cls.id);
        this.listOfClasses.push(
            ...listOfClasses.filter((cls) => !idMap.includes(cls.id))
        );
        return this;
    }
}

class Lecturer extends User {
    constructor(id, name, phoneNumber, email) {
        super(...arguments);
    }
}

class Document {
    constructor({ doc_id, file_name, doc_category_id, category_name }) {
        Object.assign(this, { 
            id: doc_id,
            fileName: file_name, 
            categoryId: doc_category_id, 
            categoryName: category_name
        });
    }

    static buildDocLib(listOfDocument) {
        const documentLib = {};

        listOfDocument.forEach(({ id, fileName, categoryId, categoryName }) => {
            const categoryInLib = documentLib[categoryId];

            if (categoryInLib) {
                categoryInLib.listOfDocument.push({ id, fileName });
            } else {
                documentLib[categoryId] = {
                    categoryName,
                    listOfDocument: [{ id, fileName }],
                };
            }
        });

        return documentLib;
    }
}

class Student extends User {
    constructor(id, name, phoneNumber, email) {
        super(...arguments);
    }
}

class Class {
    constructor(id, name) {
        Object.assign(this, { id, name });
        this.listOfExercises = [];
    }
}

class Exercise {
    constructor(id, startTime, endTime, name, description) {
        Object.assign(this, { id, startTime, endTime, name, description });
        this.listOfAttachFiles = [];
    }

    withListOfAttachFiles(listOfAttachFiles) {
        const idMap = this.listOfAttachFiles.map((attachFile) => attachFile.id);
        this.listOfAttachFiles.push(
            ...listOfAttachFiles.filter(
                (attachFile) => !idMap.includes(attachFile.id)
            )
        );
        return this;
    }
}

export {
    Account,
    Class,
    Document,
    Exercise,
    Lecturer,
    Student,
    User,
};

// const lec1 = new Lecturer(1, 'lecturer1', '0987654321', 'lec1@gmail.com');
// console.log(lec1);

// const std1 = new Student(2, 'student1', '0987654322', 'std1@gmail.com').withIdentify('std1')
// .withListOfClasses([
//     new Class(1, 'lap trinh di dong (11)'),
//     new Class(2, 'lap trinh di dong (14)')
// ]).withListOfClasses([
//     new Class(1, 'lap trinh di dong (11)'),
//     new Class(2, 'lap trinh di dong (14)'),
//     new Class(3, 'lap trinh di dong (4)')
// ])
// console.log('std1: ', std1);