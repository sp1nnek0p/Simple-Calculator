class Calculator {
  constructor(
    previousOperandTextElement,
    currentOperandTextElement,
    memoryOperandTextElement
  ) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.memoryOperandTextElement = memoryOperandTextElement;
    this.memory = '';
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  memoryOperation(operation) {
    if (this.memory === '') this.memory = 0;
    switch (operation) {
      case 'M+': {
        if (this.currentOperand === '') return;
        this.memory = parseFloat(this.memory) + parseFloat(this.currentOperand);
        this.currentOperand = this.memory.toString();

        break;
      }
      case 'M-': {
        if (this.currentOperand === '') return;
        this.memory = parseFloat(this.memory) - parseFloat(this.currentOperand);
        this.currentOperand = this.memory.toString();

        break;
      }
      case 'MC': {
        this.memory = 0;

        break;
      }
      case 'MR': {
        this.currentOperand = this.memory.toString();
        break;
      }
      default:
        return;
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    let prev = parseFloat(this.previousOperand);
    let current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case 'x':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation !== null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    }

    if (this.operation === undefined) {
      this.previousOperandTextElement.innerText = '';
    }
    memoryOperandTextElement.innerText = `MEMORY: ${this.getDisplayNumber(
      this.memory
    )}`;
  }
}

const memoryButtons = document.querySelectorAll('[data-memory-operator]');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector(
  '[data-previous-operand]'
);
const currentOperandTextElement = document.querySelector(
  '[data-current-operand]'
);
const memoryOperandTextElement = document.querySelector(
  '[data-memory-operand]'
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement,
  memoryOperandTextElement
);

memoryButtons.forEach((button) =>
  button.addEventListener('click', () => {
    calculator.memoryOperation(button.innerText);
    calculator.updateDisplay();
  })
);

numberButtons.forEach((button) =>
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  })
);

operationButtons.forEach((button) =>
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
);

equalsButton.addEventListener('click', (button) => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', (button) => {
  calculator.delete();
  calculator.updateDisplay();
});
