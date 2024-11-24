document.querySelector('#find-class').addEventListener('input', event => {
    document.querySelectorAll('.class-box a').forEach(_class => {
        _class.style.display = _class.textContent
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase()) ? 'block' : 'none';
    });
});