const form = document.querySelector('#my-form');
console.log(form)
form.addEventListener('submit', async(event) => {
    event.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const obj = {
        email,
        password
    }
    try {
        const userData = await axios.post('http://localhost:3000/user/login', obj)
        localStorage.setItem('token', userData.data.token)
        alert('success')
        window.location.href = "/public/views/homePage.html"
    } catch (error) {
        if (error.response.status == 403) {
            alert("Email Doesn't exist")
        }
        if (error.response.status == 404) {
            alert("Wrong Password")
        }
    }
})