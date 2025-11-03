const resultEl = document.querySelector(".result");
const numButtons = document.querySelectorAll(".num");
const opButtons = document.querySelectorAll(".op");
const clearButton = document.querySelector(".clear");
const dotButton = document.querySelector(".dot");
const plusminusButton = document.querySelector(".plusminus");
const percentButton = document.querySelector(".percent");

let result = "0";

function sanitizeResult(res) {
  if (!/^-?\d*\.?\d*(?:[+\-*/]\d*\.?\d*)*$/.test(res)) {
    return "Error";
  }
  if (/[+\-*/]{2,}/.test(res)) {
    return "Error";
  }
  return res;
}

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

opButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (result === "Error") return;
    if (button.textContent === "=") {
      try {
        result = result.replace("x", "*").replace("÷", "/");
        result = sanitizeResult(result);
        result = eval(result).toString();
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
      ? lastNumber.slice(1)
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
