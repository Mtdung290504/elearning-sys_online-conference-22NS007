addActionFindDocCategory();
addActionFindSubDocCategory();
addActionEditDoc();
addActionCreateDoc();

// input to find classes
document.querySelector('#find-class').addEventListener('input', event => {
    document.querySelectorAll('.class-box a').forEach(_class => {
        _class.style.display = _class.textContent
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase()) ? 'block' : 'none';
    });
});

// input to find document categories
function addActionFindDocCategory() {
    document.querySelector('#find-document').addEventListener('input', event => {
        event.target.closest('.big-ctn').querySelectorAll('.document-category:not(.big-category)').forEach(dc => {
            dc.parentElement.style.display = dc.textContent.toLocaleLowerCase()
            .includes(event.target.value.toLocaleLowerCase()) ? 'block' : 'none';
        });
    });
}

// input to find quest lib
// document.querySelector('#find-quest-lib').addEventListener('input', event => {
//     event.target.closest('.big-ctn').querySelectorAll('.document-category:not(.big-category)').forEach(dc => {
//         dc.parentElement.style.display = dc.textContent.toLocaleLowerCase()
//         .includes(event.target.value.toLocaleLowerCase()) ? 'block' : 'none';
//     });
// });

// input to find sub document in document categories
function addActionFindSubDocCategory() {
    document.querySelectorAll('details .detail input[type="text"]').forEach(ipt => {
        ipt.addEventListener('input', event =>{
            ipt.parentElement.querySelectorAll('a').forEach(a => {
                a.style.display = a.textContent.toLocaleLowerCase()
                .includes(event.target.value.toLocaleLowerCase()) ? 'block' : 'none';
            });
        });
    });
}

// btn to edit doc category and it docs
function addActionEditDoc() {
    document.querySelectorAll('.icon.edit-icon.edit-doc-icon').forEach(icon => {
        icon.addEventListener('click', event => {
            event.preventDefault();
            const docCategoryId = icon.closest('summary').dataset.docCategoryId;
            openModal('editDocument', docCategoryId);
        });
    });    
}

// btn to edit quest lib and it quests
document.querySelectorAll('.icon.edit-icon.edit-quest-lib-icon').forEach(icon => {
    icon.addEventListener('click', event => {
        event.preventDefault();
        const questLibId = icon.closest('summary').dataset.questLibId;
        openModal('editQuestLib', questLibId);
    });
});

// btn to download all file in doccategory
document.querySelectorAll('.icon.download-icon').forEach(icon => {
    icon.addEventListener('click', event => {
        event.preventDefault();
        const docCategoryId = icon.closest('summary').dataset.docCategoryId;
        //Send ajax request to get necesary data
    });
});

// btn to create class
document.querySelector('#create-class').addEventListener('click', async ()=>{
    const className = prompt('Tên lớp học:');
    if(!className) return;
    if(className.length > 49) {
        alert('Tên lớp học quá dài!')
        return;
    }

    RequestHandler.sendRequest('ajax/add-class', {
        'class-name': className
    }).then(({ e, m, d }) => {
        if(e) alert(e);
        if(d) {
            const { navItem, gridItem } = d;
            document.querySelector('.class-box').innerHTML += gridItem;
            document.querySelector('.side-nav').innerHTML += navItem;
        }
        alert(m);
    }).catch(error => {
        console.log(error);
    });
});

// btn to create new doc category
function addActionCreateDoc() {
    document.querySelector('#new-doc-category').addEventListener('click', async () => {
        const categoryName = prompt('Tên danh mục tài liệu:');
        if(!categoryName) return;
        if(categoryName.length > 49) {
            alert('Tên danh mục tài liệu quá dài!');
            return;
        }

        RequestHandler.sendRequest('ajax/add-doc-category', {
            'doc-category-name': categoryName
        }).then(({ e, m, d }) => {
            if(e) alert(e);
            if(d) {
                const { docCategoryItem } = d;
                document.querySelector('#document-category-container').innerHTML += docCategoryItem;
                addActionEditDoc();
                addActionCreateDoc();
                addActionFindDocCategory();
                addActionFindSubDocCategory();
                alert(m);
            }
        }).catch(error => {
            console.log(error);
        });
    });
}