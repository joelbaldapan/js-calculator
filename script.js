const numberBtns = [...document.getElementsByClassName("btn-number")];
const operatorBtns = [...document.getElementsByClassName("btn-operator")];
const specialBtns = [...document.getElementsByClassName("btn-special")];
const displayCurrent = document.getElementById("display-current");
const displayPrevious = document.getElementById("display-previous");
const clearBtn = document.getElementById("btn-clear");
const sound = document.getElementById("sfx");

// Code
const operation = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
  multiply(a, b) {
    return a * b;
  },
  divide(a, b) {
    if (b === 0) return NaN;
    return a / b;
  },

  percent(a) {
    return a * 0.01;
  },
  sign(a) {
    return a * -1;
  },
};

function operate(firstNumber, operator, secondNumber) {
  let result;

  if (operator === "+") result = operation.add(firstNumber, secondNumber);
  if (operator === "–") result = operation.subtract(firstNumber, secondNumber);
  if (operator === "×") result = operation.multiply(firstNumber, secondNumber);
  if (operator === "÷") result = operation.divide(firstNumber, secondNumber);

  if (operator === "%") result = operation.percent(firstNumber);
  if (operator === "+/-") result = operation.sign(firstNumber);
  if (operator === "⌦") return firstNumber.slice(1);
  if (operator === "AC") return resetDisplay();
  if (operator === "C") return resetDisplay();
  if (operator === "=") return secondNumber;

  result = roundNumber(result, 5);
  return result;
}

function roundNumber(number, round) {
  const factor = Math.pow(10, round);
  return Math.round(number * factor) / factor;
}

let currNumber = "";
let operator = "+";
let prevNumber = 0;

let operatedNumber = undefined;
let specialNumber;
let previousOperator = "+";
let displayNumber;

function resetDisplay() {
  playResetSFX();
  displayNumber = 0;
  currNumber = "";
  operator = "+";
  prevNumber = 0;
  previousOperator = "+";
  operatedNumber = undefined;

  clearBtn.textContent = "AC";
  displayPrevious.textContent = "";
  displayCurrent.textContent = "0";
}

function updateCurrentDisplay(number) {
  if (number === "") return (displayCurrent.textContent = "0");
  displayNumber = formatNumber(number);
  displayCurrent.textContent = displayNumber;
}

function updatePreviousDisplay(operation) {
  if (operation !== "=") {
    return (displayPrevious.textContent = `${displayNumber} ${previousOperator}`);
  }
  displayPrevious.textContent = displayNumber;
  displayCurrent.textContent = displayNumber;
}

function formatNumber(number) {
  number = parseFloat(number); // Convert to a floating-point number

  let numberStr = number.toString(); // Convert back to string for processing
  let [integerPart, decimalPart] = numberStr.split(".");

  // Convert to scientific notation if the integer part or the decimal part is too long
  if (
    integerPart.length + (decimalPart ? decimalPart.length : 0) > 9 ||
    (decimalPart && decimalPart.length > 9)
  ) {
    return number.toExponential(2);
  }

  // Add comma every 3 places
  let numberArray = Array.from(integerPart).reverse();
  for (let i = 3; i < numberArray.length; i += 4) {
    if (numberArray[i] !== "-") numberArray.splice(i, 0, ",");
  }

  // Finalize results
  let result = numberArray.reverse().join("");
  if (numberStr.includes(".")) result += "." + decimalPart;
  return result;
}

// Number Keys
numberBtns.forEach((button) => {
  button.addEventListener("click", () => {
    // Length limit
    if (currNumber.length >= 10) return;

    if (previousOperator === "=") {
      previousOperator = "+";
      currNumber = "";
      prevNumber = 0;
    }

    // Handle decimal button
    if (button.textContent === ".") {
      if (currNumber.includes(".")) return; // Already has a decimal
      if (currNumber === "") currNumber += "0.";
      else currNumber += ".";
    } else {
      // Don't append more numbers if zero
      if (
        button.textContent === "0" &&
        currNumber === "" &&
        previousOperator !== "×"
      )
        return;
      currNumber += button.textContent;
    }

    // Display number
    specialNumber = currNumber;
    clearBtn.textContent = "C";
    playBtnSFX();
    updateCurrentDisplay(currNumber);
  });
});

// Operator Keys
operatorBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const currentOperator = button.textContent;

    // Do operations
    if (previousOperator !== "=") {
      currNumber = parseFloat(currNumber);
      console.log(prevNumber, previousOperator, currNumber);
      if (!isNaN(currNumber))
        operatedNumber = operate(prevNumber, previousOperator, currNumber);
      else currNumber = 0;
    }

    // User presses operator buttons
    previousOperator = currentOperator;
    prevNumber = currNumber;

    specialNumber = operatedNumber;
    playBtnSFX();
    updateCurrentDisplay(operatedNumber);
    updatePreviousDisplay(previousOperator);

    // Handle equals
    if (currentOperator === "=") {
      prevNumber = operatedNumber;
    } else {
      prevNumber = operatedNumber;
      currNumber = "";
      previousOperator = currentOperator;
    }
  });
});

// Special Keys
specialBtns.forEach((button) => {
  button.addEventListener("click", () => {
    playBtnSFX();

    console.table(specialNumber, currNumber);
    specialNumber = operate(specialNumber, button.textContent).toString();
    currNumber = specialNumber;

    updateCurrentDisplay(specialNumber);
  });
});

function getRandomNumber() {
  return Math.floor(Math.random() * 3) + 1;
}

function playBtnSFX() {
  let randomNumber = getRandomNumber();
  const sound = new Audio();
  sound.src = `audio/btn-${randomNumber}.mp3`;
  sound.play();
}

function playResetSFX() {
  const sound = new Audio();
  sound.src = `audio/reset.mp3`;
  sound.play();
}

// LOGO
const logo = document.getElementById("logo");
// Flag to track if animation has been reset
let animationReset = false;

// Function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to handle scroll event
function handleScroll() {
  if (isInViewport(logo) && !animationReset) {
    logo.src = logo.src; // Reset the src attribute to replay the GIF animation
    animationReset = true; // Set flag to true once animation is reset
  } else if (!isInViewport(logo)) {
    animationReset = false; // Reset flag if element goes out of view
  }
}

// Add scroll event listener to window
window.addEventListener("scroll", handleScroll);
document.addEventListener("DOMContentLoaded", handleScroll);
