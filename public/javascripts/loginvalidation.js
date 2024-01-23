function validateEmail() {
    var EmailInput = document.getElementById('contact-email');
    var Emailerror = document.getElementById('Email-error');
    var Email = EmailInput.value.trim(); 
    if (Email.length === 0) {
        Emailerror.innerHTML = 'Email is required';
        return false;
    }
    if (!Email.match(/^[A-Za-z][\w.-]*@[A-Za-z]+\.[a-z]{2,4}$/)) {
        Emailerror.innerHTML='invalid email';
        return false;
    }
    Emailerror.innerHTML = '<i class="fas fa-check-circle"></i>';
    return true;
}
function validatePassword() {
    var passwordInput = document.getElementById('password');
    var passwordError = document.getElementById('password-error');
    var password = passwordInput.value.trim();

    if (password.length === 0) {
        passwordError.innerHTML = 'Password is required';
        return false;
    }

    if (password.length !== 6) {
        passwordError.innerHTML = 'Password must be exactly 6 characters';
        return false;
    }

    passwordError.innerHTML = '<i class="fas fa-check-circle"></i>';
    return true;
}


function validateForm() {
    
    var isEmailValid = validateEmail();
    var isPasswordValid =validatePassword();
    if (isEmailValid && isPasswordValid) {
      return true;
    } else {
      return false;
    }
  }