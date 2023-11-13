/*
let isDragging = false;
let offsetX, offsetY;

document.addEventListener('mousedown', (e) => {
    console.log('mousedown');
    isDragging = true;
    offsetX = e.clientX - document.body.getBoundingClientRect().left;
    offsetY = e.clientY - document.body.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    console.log('mousemove');
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        document.body.style.left = `${x}px`;
        document.body.style.top = `${y}px`;
    }
});

document.addEventListener('mouseup', () => {
    console.log('mouseup');
    isDragging = false;
});
*/