const billElement = document.querySelector('[data-bill]');
const tipOptionElements = document.querySelectorAll('[data-tip-option]');
const tipOptionCustomElement = document.querySelector('[data-tip-option-custom]');
const peopleNumberElement = document.querySelector('[data-people-number]');
const tipAmountElement = document.querySelector('[data-tip-amount]');
const totalAmountElement = document.querySelector('[data-total-amount]');
const resetBtnElement = document.querySelector('[data-reset]');

// Validation
function displayValid(element) {
	const rowElement = element.parentElement.parentElement;
	rowElement.classList.add('valid');
	rowElement.classList.remove('invalid');
}

function displayInvalid(element, message) {
	const rowElement = element.parentElement.parentElement;
	rowElement.classList.add('invalid');
	rowElement.classList.remove('valid');
	rowElement.querySelector('[data-error-message]').innerText = message;
}

function validateBill() {
	const bill = billElement.value.trim();
	if (/^0+$/.test(bill)) {
		displayInvalid(billElement, 'Cannot be 0');
		return false;
	} else if (/^(?!0+)\d+\.?\d*$/.test(bill)) {
		displayValid(billElement);
		return true;
	} else {
		displayInvalid(billElement, 'Invalid');
		return false;
	}
}

function validateTip() {
	if (Array.from(tipOptionElements).some((element) => element.querySelector('input').checked)) {
		return true;
	} else {
		const tipCustom = tipOptionCustomElement.querySelector('input').value.trim();
		if (tipCustom === '') return true;
		else if (/^(?!0+)\d+$/.test(tipCustom)) {
			displayValid(tipOptionCustomElement);
			return true;
		} else {
			displayInvalid(tipOptionCustomElement, 'Invalid');
			return false;
		}
	}
}

function validatePeopleNumber() {
	const peopleNumber = peopleNumberElement.value.trim();
	if (/^0+$/.test(peopleNumber)) {
		displayInvalid(peopleNumberElement, 'Cannot be 0');
		return false;
	} else if (/^(?!0+)\d+$/.test(peopleNumber)) {
		displayValid(peopleNumberElement);
		return true;
	} else {
		displayInvalid(peopleNumberElement, 'Invalid');
		return false;
	}
}

// Calculate
function calculate() {
	const bill = parseFloat(billElement.value);
	const peopleNumber = parseInt(peopleNumberElement.value);
	const tip = getTipValue();

	if (isNaN(bill) || isNaN(peopleNumber)) return;
	if (validateBill() && validateTip() && validatePeopleNumber()) {
		tipAmountElement.innerText = ((bill * tip) / peopleNumber).toFixed(2);
		totalAmountElement.innerText = ((bill * (1 + tip)) / peopleNumber).toFixed(2);
	}
}

// Bill input
billElement.addEventListener('input', () => {
	validateBill();
	calculate();
});

// Tip input
function uncheckTipCustom() {
	tipOptionCustomElement.querySelector('input').value = null;
	const rowElement = tipOptionCustomElement.parentElement.parentElement;
	rowElement.classList.remove('valid');
	rowElement.classList.remove('invalid');
}

function uncheckTips() {
	tipOptionElements.forEach((element) => {
		element.querySelector('input').checked = false;
		displaySelectedTip();
	});
}

function displaySelectedTip() {
	tipOptionElements.forEach((element) => {
		if (element.querySelector('input').checked) {
			element.classList.add('checked');
		} else {
			element.classList.remove('checked');
		}
	});
}

function getTipValue() {
	const tipGiven = Array.from(tipOptionElements)
		.map((element) => element.querySelector('input'))
		.filter((tipInput) => tipInput.checked)
		.reduce((tipAmount, tipInput) => tipAmount + parseFloat(tipInput.value), 0);
	const tipCustom = parseFloat(tipOptionCustomElement.querySelector('input').value / 100);

	return tipGiven || tipCustom;
}

tipOptionElements.forEach((element) => {
	element.addEventListener('click', () => {
		element.querySelector('input').checked = !element.querySelector('input').checked;
		uncheckTipCustom();
		displaySelectedTip();
		calculate();
	});
});

tipOptionCustomElement.querySelector('input').addEventListener('input', () => {
	uncheckTips();
	validateTip();
	calculate();
});

// Number of People input
peopleNumberElement.addEventListener('input', () => {
	validatePeopleNumber();
	calculate();
});

// Reset
resetBtnElement.addEventListener('click', () => {
	document.querySelectorAll('[data-input-row]').forEach((element) => {
		element.classList.remove('valid');
		element.classList.remove('invalid');
	});

	billElement.value = null;
	peopleNumberElement.value = null;

	uncheckTips();
	uncheckTipCustom();

	tipAmountElement.innerText = '0.00';
	totalAmountElement.innerText = '0.00';
});
