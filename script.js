var body = document.body;
var buttons = document.getElementsByClassName("buttons")[0];
var textarea = document.getElementsByTagName("textarea")[0];
const OPERATIONS = ["=", "x", "/", "+", "-"];
const BUTTONS = Array(10)
    .fill(null)
    .map((_, i) => String(i))
    .concat(["C", "Backspace"], OPERATIONS);
textarea.onkeydown = (e) => {
    !/\d+|Backspace|Arrow+/.test(e.key) && e.preventDefault();
};
BUTTONS.forEach((btn) => {
    const button = document.createElement("button");
    const isValidClassName = OPERATIONS.find((_) => _ === btn);
    button.innerText = btn;
    button.classList.add("button", "button-".concat(!isValidClassName ? String(btn).toLocaleLowerCase() : validated(btn)));
    switch (btn) {
        case "C":
            button.onclick = () => (textarea.value = "");
            break;
        case "Backspace":
            button.onclick = () => (textarea.value = textarea.value.slice(0, -1));
            break;
        case "x":
        case "/":
        case "+":
        case "-":
            button.classList.add("operation");
            button.onclick = (evt) => {
                let lastString = textarea.value.slice(-1);
                let target = evt.target;
                !OPERATIONS.find((value) => value === lastString)
                    ? (textarea.value += target.innerText)
                    : (textarea.value = textarea.value.slice(0, -1) + target.innerText);
            };
            break;
        case "=":
            button.onclick = () => textarea.value = String(evaluate(textarea.value));
            break;
        default:
            button.onclick = (evt) => {
                let target = evt.target;
                textarea.value += target.innerText;
            };
            break;
    }
    buttons.appendChild(button);
});
function validated(string) {
    const OPERATIONS_TEXT = {
        "=": "equals",
        "x": "multiply",
        "/": "divide",
        "+": "plus",
        "-": "minus",
    };
    return OPERATIONS_TEXT[string];
}
function evaluate(rawValue) {
    const arrValue = rawValue.match(/\d+|\+|\-|\x|\//g);
    const operand = arrValue.filter((_) => /\d+/.test(_)).map((_) => Number(_));
    const operation = arrValue.filter((_) => /\+|\-|\x|\//g.test(_));
    let index = 0;
    while (index < operation.length) {
        if (["x", "/"].find((_) => _ === operation[index])) {
            operand.splice(index, 2, operate(operand[index], operation[index], operand[index + 1]));
            operation.splice(index, 1);
        }
        else
            index++;
    }
    index = 0;
    let result = operand.reduce((prev, curr, index) => operate(prev, operation[index - 1], curr));
    return result;
}
function operate(firstNumber, operator, secondNumber) {
    const result = {
        "x": firstNumber * secondNumber,
        "/": firstNumber / secondNumber,
        "+": firstNumber + secondNumber,
        "-": firstNumber - secondNumber,
    };
    return result[operator];
}
