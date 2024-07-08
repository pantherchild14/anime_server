
// enable and disable back-to-top button
function switchBackToTop() {
	var backToTopCheckbox = document.querySelector('.backToTopCheckbox');
	var backToTop = document.querySelector('#back-to-top');
	if (backToTopCheckbox.checked == true) {
		backToTop.classList.remove('d-none')
	}
	else if (backToTopCheckbox.checked == false) {
		backToTop.classList.add('d-none')
	}
}

// change password
function changePassword() {
	var changePasswordBtn = document.querySelector('#changePassword');
	var inputField = document.querySelector('#reEnterPassword');
	var closeInputField = document.querySelector('#closePassword');

	changePasswordBtn.addEventListener('click', () => {
		inputField.classList.remove('d-none');
	})
	closeInputField.addEventListener('click', () => {
		inputField.classList.add('d-none');
	})
}
changePassword();
