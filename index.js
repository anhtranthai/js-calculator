const resultEl = document.querySelector(".result");
const numButtons = document.querySelectorAll(".num");
const opButtons = document.querySelectorAll(".op");
const clearButton = document.querySelector(".clear");
const dotButton = document.querySelector(".dot");
const plusminusButton = document.querySelector(".plusminus");
const percentButton = document.querySelector(".percent");

let result = "0";

numButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (result === "Error") return;
    if (result === "0") {
      result = "";
    }
    result += button.textContent;
    resultEl.textContent = result;
  });
});

function sanitizeResult(expr) {
  expr = expr.replace(/×|x/g, "*").replace(/÷/g, "/").replace(/\s+/g, "");
  const valid = /^-?\d+(?:\.\d+)?(?:[+\-*/]-?\d+(?:\.\d+)?)*$/;
  return valid.test(expr) ? expr : "Error";
}

function getPrecedence(char) {
  switch (char) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
      return 2;
    default:
      return 0;
  }
}

function applyOperation(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  if (!isFinite(a) || !isFinite(b)) throw new Error("Invalid number");
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) throw new Error("Division by zero");
      return a / b;
    default:
      throw new Error("Unknown op");
  }
}

function evaluateExpression(expr) {
  if (expr === "Error") throw new Error("Invalid expression");

  const nums = [];
  const ops = [];
  let i = 0;
  let cur = "";

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === "-" && (i === 0 || /[+\-*/]/.test(expr[i - 1]))) {
      cur += ch;
      i++;
      continue;
    }

    if (ch === "." || /\d/.test(ch)) {
      cur += ch;
      i++;
      while (i < expr.length && /[\d.]/.test(expr[i])) {
        cur += expr[i++];
      }
      nums.push(cur);
      cur = "";
      continue;
    }

    // operator
    if (/[+\-*/]/.test(ch)) {
      while (
        ops.length > 0 &&
        getPrecedence(ops[ops.length - 1]) >= getPrecedence(ch)
      ) {
        const op = ops.pop();
        const b = nums.pop();
        const a = nums.pop();
        nums.push(applyOperation(a, b, op).toString());
      }
      ops.push(ch);
      i++;
      continue;
    }

    throw new Error("Invalid token");
  }

  while (ops.length > 0) {
    const op = ops.pop();
    const b = nums.pop();
    const a = nums.pop();
    nums.push(applyOperation(a, b, op).toString());
  }

  if (nums.length !== 1) throw new Error("Malformed expression");
  return nums[0].toString();
}

opButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (result === "Error") return;
    if (button.textContent === "=") {
      try {
        let normalized = sanitizeResult(result);
        if (normalized === "Error") {
          result = "Error";
        } else {
          result = evaluateExpression(normalized);
        }
      } catch {
        result = "Error";
      }
    } else {
      result += button.textContent;
    }
    resultEl.textContent = result;
  });
});

clearButton.addEventListener("click", () => {
  result = "0";
  resultEl.textContent = result;
});

plusminusButton.addEventListener("click", () => {
  if (result === "0" || result === "Error") return;
  const lastNumberMatch = result.match(/(-?\d+\.?\d*)$/);
  if (lastNumberMatch) {
    const lastNumber = lastNumberMatch[0];
    const toggledNumber = lastNumber.startsWith("-")
      ? lastNumber.length === result.length
        ? lastNumber.slice(1)
        : "+" + lastNumber.slice(1)
      : "-" + lastNumber;
    result = result.slice(0, lastNumberMatch.index) + toggledNumber;
    resultEl.textContent = result;
  }
});

percentButton.addEventListener("click", () => {
  if (result === "0" || result === "Error") return;
  const lastNumberMatch = result.match(/(\d+\.?\d*)$/);
  if (lastNumberMatch) {
    const lastNumber = lastNumberMatch[0];
    const percentValue = (parseFloat(lastNumber) / 100).toString();
    result = result.slice(0, lastNumberMatch.index) + percentValue;
    resultEl.textContent = result;
  }
});

dotButton.addEventListener("click", () => {
  if (result === "0" || result === "Error") return;
  const lastNumberMatch = result.match(/(\d*\.?\d*)$/);
  if (lastNumberMatch) {
    const lastNumber = lastNumberMatch[0];
    if (!lastNumber.includes(".")) {
      result += ".";
      resultEl.textContent = result;
    }
  }
});
