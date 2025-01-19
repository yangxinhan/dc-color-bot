// colorManager.js

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function isValidColor(color) {
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    return hexRegex.test(color);
}

module.exports = {
    getRandomColor,
    isValidColor
};