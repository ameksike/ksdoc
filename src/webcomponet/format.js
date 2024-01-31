document.addEventListener('DOMContentLoaded', () => {
    const codeTags = document.querySelectorAll('code');
    codeTags.forEach(codeTag => {
        try {
            const jsonContent = JSON.parse(codeTag.textContent);
            codeTag.textContent = JSON.stringify(jsonContent, null, 4);
        } catch (error) { }
    });
});