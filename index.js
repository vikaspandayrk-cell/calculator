let expression = "";
const mainDisplay = document.getElementById('main-display');
const upperDisplay = document.getElementById('upper-display');

// 1. Update UI 
const updateDisplay = () => {
    // Show '0' if empty, else format symbols for users
    mainDisplay.innerText = expression === "" ? "0" : 
        expression.replace(/\*\*/g, '^').replace(/\*/g, '×').replace(/\//g, '÷');
    
    // Auto-scroll the display container to the right for long values
    const displayContainer = document.querySelector('.display');
    displayContainer.scrollLeft = displayContainer.scrollWidth;
};

// 2. Insert Values 
const insert = (val) => {
    // Basic validation: prevent starting with an operator except minus or dot
    if (expression === "" && isNaN(val) && val !== '.' && val !== '-') return;
    
    // Prevent double decimals in a single number
    if (val === '.') {
        const parts = expression.split(/[\+\-\*\/]/);
        if (parts[parts.length - 1].includes('.')) return;
    }

    expression += val;
    updateDisplay();
};

// 3. Clear Screen 
const clearAll = () => {
    expression = "";
    upperDisplay.innerText = "";
    updateDisplay();
};

// 4. Backspace/Delete 
const deleteLast = () => {
    expression = expression.toString().slice(0, -1);
    updateDisplay();
};

// 5. Square Root Logic 
const calcSqrt = () => {
    if (expression === "") return;
    try {
        const result = Math.sqrt(eval(sanitize(expression)));
        upperDisplay.innerText = `√(${expression})`;
        expression = formatResult(result);
        updateDisplay();
    } catch (e) {
        handleError();
    }
};

// 6. Sanitization Logic 
// This fixes zeros bigeners problem
const sanitize = (str) => str.replace(/\b0+(?=\d)/g, '');

// 7. Format Result (
// Handles long decimals and converts to string
const formatResult = (res) => {
    if (!Number.isInteger(res)) {
        return parseFloat(res.toFixed(10)).toString();
    }
    return res.toString();
};

// 8. Main Calculation 
const calculate = () => {
    try {
        if (expression === "") return;

        // Clean the expression 
        const cleanExpression = sanitize(expression);
        let result = eval(cleanExpression);

        upperDisplay.innerText = expression.replace(/\*\*/g, '^') + " =";
        expression = formatResult(result);
        updateDisplay();
    } catch (e) {
        handleError();
    }
};

// 9. Error Handler 
const handleError = () => {
    mainDisplay.innerText = "Syntax Error";
    expression = "";
    setTimeout(updateDisplay, 1500);
};

// Bonus: Keyboard Support 
window.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) insert(e.key);
    if (e.key === '+') insert('+');
    if (e.key === '-') insert('-');
    if (e.key === '*') insert('*');
    if (e.key === '/') insert('/');
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearAll();
});