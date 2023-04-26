var body = document.body;
var buttons = document.getElementsByClassName("buttons")[0];
var textarea = document.getElementsByTagName("textarea")[0];

const OPERATIONS = ["=", "x", "/", "+", "-"];
const buttonNumber = Array(10).fill().map((_, i) => i).concat(
  ["C", "Backspace"],
  OPERATIONS,
);

// textarea.oninput = (e) => {
//   console.log(e);
// }

buttonNumber.forEach((btn) => {
  let button = document.createElement("button");
  button.innerText = btn;
  button.classList.add("button", "button-".concat(!OPERATIONS.find(_ => _ === btn) ? String(btn).toLocaleLowerCase() : validated(btn)))
  switch (btn) {
    case "C":
      button.onclick = () => textarea.value = "";
      break;
    case "Backspace":
      button.onclick = () => textarea.value = textarea.value.slice(0, -1);
      break;
    case "x":
    case "/":
    case "+":
    case "-":
      button.onclick = (e) => {
        let lastString = textarea.value.slice(-1);
        !OPERATIONS.find((value) => value === lastString)
          ? (textarea.value += e.target.innerText)
          : textarea.value = textarea.value.slice(0, -1) + e.target.innerText;
      };
      break;
    case "=":
      button.onclick = () => evaluate(textarea.value);
      break;
    default:
      button.onclick = (e) => {
        textarea.value += e.target.innerText;
      };
      break;
  }
  // button.addEventListener("click", () => textarea.dispatchEvent(new Event("input")))
  buttons.appendChild(button);
});

function validated(string) {
  let toText = ""
  switch (string) {
    case "x": toText = "multiply"
      break;
    case "/": toText = "divide"
      break;
    case "+": toText = "plus"
      break;
    case "-": toText = "minus"
      break;
    case "=": toText = "equals"
      break;
    default: toText = "cannot change to text"
  }
  return toText
}

function evaluate(rawValue) {
  const arrValue = rawValue.match(/\d+|\+|\-|\x|\//g)
  const number = arrValue.filter(_ => /\d+/.test(_))
  const operation = arrValue.filter(_ => /\+|\-|\x|\//g.test(_))
  console.log(number);
  console.log(operation);
  a = operation.findIndex(_=>/\x|\//g.test(_)) 
}

