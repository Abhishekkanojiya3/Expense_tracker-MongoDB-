const form = document.querySelector('form')

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const userName = form.userName.value.trim();
    const email = form.email.value.trim();
    const phoneNumber = form.phoneNumber.value.trim();
    const password = form.password.value.trim();

    const obj = {
        userName,
        email,
        phoneNumber,
        password
    }
    if (userName == '' || email == '' || phoneNumber == '' || password == '') {
        alert('Please fill all the details')
        return;
    }
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (!validatePhone(phoneNumber)) {
        alert('Please enter a valid phone number');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password should be at least 6 characters long');
        return;
    }

    try {
        await axios.post('http://localhost:3000/user/signUp', obj)
        alert('success')
        window.location.href = "/public/views/login.html"
    } catch (err) {
        console.log(err)
        if (!err.response.data.success) {
            alert('User Exists!')
        }
    }

})

function validateEmail(email) {
    // Validate email address using regular expression
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phoneNumber) {
    // Validate phone number using regular expression
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber);
}

function validatePassword(password) {
    // Validate password length
    return password.length >= 6;
}