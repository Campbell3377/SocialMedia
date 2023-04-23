document.getElementById('signup-form').addEventListener('submit', (event) => {
    event.preventDefault();
    signup();
});

async function signup() {
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const dob = document.getElementById('dob').value
    const hometown = document.getElementById('hometown').value
    const gender = document.getElementById('gender').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value

    // If any of the fields are empty
    if (firstName == '' || lastName == '' || dob == '' || hometown == '' || gender == '' || email == '' || password == '' || confirmPassword == '') {
        alert('Please make sure that all fields are filled.')
        return
    }
    //If date of birth filled incorrectly
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        alert('Please make sure that your date of birth is in the format YYYY-MM-DD')
        return
    }
    //if password and confirm password don't match
    else if (password != confirmPassword) {
        alert('Please make sure that your passwords match')
        return
    }
    // success
    else {
        try {
            const response = await fetch('http://localhost:5501/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, dob, hometown, gender, email, password })
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Account created: ', data)

                alert('Thank you for creating an account. You will be redirected to login.')
                window.location.href = '../login/login.html'
            }
            else {
                console.error('There was an error creating an account')
                throw new Error('There was an error creating an account')
            }

        } catch (error) {
            console.error('Error while sending signup request', error)
            alert('An error occured sending your signup request. Please try again.')
        }
    }

}