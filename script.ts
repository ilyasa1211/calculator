var body = document.body as HTMLBodyElement;
var buttons = document.getElementsByClassName(
  "buttons",
)[0] as HTMLButtonElement;
var textarea = document.getElementsByTagName(
  "textarea",
)[0] as HTMLTextAreaElement;

const OPERATIONS: Array<string> = ["=", "x", "/", "+", "-"];

const BUTTONS: Array<string> = Array(10)
  .fill(null)
  .map((_, i) => String(i))
  .concat(["C", "Backspace"], OPERATIONS);

textarea.onkeydown = (e: KeyboardEvent) => {
  !/\d+|Backspace|Arrow+/.test(e.key) && e.preventDefault();
};
BUTTONS.forEach((btn: string) => {
  const button: HTMLButtonElement = document.createElement("button");
  const isValidClassName: string | undefined = OPERATIONS.find((_) =>
    _ === btn
  );

  button.innerText = btn;
  button.classList.add(
    "button",
    "button-".concat(
      !isValidClassName ? String(btn).toLocaleLowerCase() : validated(btn),
    ),
  );
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
      button.classList.add("operation")
      button.onclick = (evt: MouseEvent) => {
        let lastString: string = textarea.value.slice(-1);
        let target = evt.target as HTMLElement;
        !OPERATIONS.find((value) => value === lastString)
          ? (textarea.value += target.innerText)
          : (textarea.value = textarea.value.slice(0, -1) + target.innerText);
      };
      break;
    case "=":
      button.onclick = () => textarea.value = String(evaluate(textarea.value));
      break;
    default:
      button.onclick = (evt: MouseEvent) => {
        let target = evt.target as HTMLElement;
        textarea.value += target.innerText;
      };
      break;
  }
  buttons.appendChild(button);
});

function validated(string: string): string {
  const OPERATIONS_TEXT: Record<string, string> = {
    "=": "equals",
    "x": "multiply",
    "/": "divide",
    "+": "plus",
    "-": "minus",
  };
  return OPERATIONS_TEXT[string];
}

function evaluate(rawValue: string): number {
  const arrValue: RegExpMatchArray = rawValue.match(/\d+|\+|\-|\x|\//g)!;
  const operand: Array<number> = arrValue.filter((_) => /\d+/.test(_)).map(
    (_) => Number(_),
  );
  const operation: Array<string> = arrValue.filter((_) =>
    /\+|\-|\x|\//g.test(_)
  );
  let index = 0;
  while (index < operation.length) {
    if (["x", "/"].find((_) => _ === operation[index])) {
      operand.splice(
        index,
        2,
        operate(operand[index], operation[index], operand[index + 1]),
      );
      operation.splice(index, 1);
    } else index++;
  }
  index = 0;
  let result = operand.reduce((prev: number, curr: number, index: number) =>
    operate(prev, operation[index - 1], curr)
  );
  return result;
}

function operate(
  firstNumber: number,
  operator: string,
  secondNumber: number,
): number {
  const result: Record<string, number> = {
    "x": firstNumber * secondNumber,
    "/": firstNumber / secondNumber,
    "+": firstNumber + secondNumber,
    "-": firstNumber - secondNumber,
  };
  return result[operator];
}
