document.querySelector('.btn').addEventListener('click', () => {
    document.querySelector('.body').classList.toggle('open-side-nav');
});

// document.querySelectorAll('summary').forEach(smr => {
//     smr.setAttribute('title', 'More...');
// })

// document.querySelectorAll('details').forEach(dts => {
//     dts.addEventListener('dblclick', event => {
//         event.stopPropagation();
//         if(dts.getAttribute('open') == '')
//             dts.removeAttribute('open');
//     })
// })

const modal = document.querySelector('.modal-container');
modal.addEventListener('click', event => {
    if(Array.from(event.target.classList).includes('modal-container')) {
        document.body.classList.remove('open-modal');
        if(document.querySelector('.documents')) {
            unGroupDoc();
            groupDoc();
        }
    }
});

function openModal(type, docCategoryId) {
    let endpoint = '', 
        data = null, 
        callBack = null;

    switch (type) {
        case 'editDocument': {
            endpoint = 'get-doc-by-doc-category';
            data = { 'doc-category-id': docCategoryId };
            callBack = ({ e, m, d }) => {
                if(e) {
                    alert(e);
                    return;
                }
                console.log(d);
                new ModalContent(type, d).buildModalContent(modal);
                document.body.classList.add('open-modal');
            };
            break;            
        }

        case 'editQuestLib':
            
            break;

        case 'editClassFileAttaches': {
            endpoint = 'get-all-doc-and-doc-categories';
            data = {};
            callBack = ({ e, m, d }) => {
                if(e) {
                    alert(e);
                    return;
                }
                console.log(d);
                new ModalContent(type, d).buildModalContent(modal);
                document.body.classList.add('open-modal');
            };
            break;
        }
        default:
            break;
    }

    if(!callBack) return;

    RequestHandler.sendRequest('ajax/' + endpoint, data).then(callBack).catch(error => {
        console.log(error);
    });
}

function resetModal(body = true, header = true) {
    if(header)
        document.body.querySelector('.modal .modal-header').innerHTML = '';
    if(body)
        document.body.querySelector('.modal .modal-body').innerHTML = '';
}

function groupDoc() {
    const container = document.querySelector('.documents');
    const listOfDocument = container.querySelectorAll('a[data-file-id]');
    const docCategoryAndDoc = {};

    if(container.querySelector('h3')) return;
    if(container.childElementCount === 0) {
        container.innerHTML = '<h3 style="margin: 10px">CHƯA CÓ TÀI LIỆU NÀO</h3>';
    }
    
    container.innerHTML = '';

    listOfDocument.forEach(document => {
        const categoryName = document.dataset.categoryName;
        const listDocumentOfCategory = docCategoryAndDoc[categoryName];

        if(listDocumentOfCategory) {
            listDocumentOfCategory.push(document);
            listDocumentOfCategory.sort((a, b) => a.textContent.localeCompare(b.textContent));
            return;
        }

        docCategoryAndDoc[categoryName] = [document];
        container.innerHTML += `<h3 class="title">${categoryName}</h3><div style="margin-left: 15px;" data-category-name="${categoryName}"></div>`;
    });

    for (const docCategory in docCategoryAndDoc) {
        if (Object.hasOwnProperty.call(docCategoryAndDoc, docCategory)) {
            docCategoryAndDoc[docCategory].forEach(document => {
                container.querySelector(`div[data-category-name="${docCategory}"]`).appendChild(document);
            });
        }
    }
}

function unGroupDoc() {
    const container = document.querySelector('.documents');
    const listOfDocument = container.querySelectorAll('a[data-file-id]');

    container.innerHTML = '';

    const sortedListOfDocument = Array.from(listOfDocument).sort((a, b) => a.textContent.localeCompare(b.textContent));
    sortedListOfDocument.forEach(document => container.appendChild(document));
    if(container.childElementCount === 0) {
        container.innerHTML = '<h3 style="margin: 10px">CHƯA CÓ TÀI LIỆU NÀO</h3>';
    }
}

if(document.querySelector('.documents')) {
    groupDoc();
}