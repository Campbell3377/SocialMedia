document.getElementById('update-profile-form').addEventListener('submit', (event) => {
    event.preventDefault()
    updateInfo()
})

async function updateInfo() {
    const uid = localStorage.getItem('uid')
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const hometown = document.getElementById('hometown').value
    const gender = document.getElementById('gender').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value

    if (firstName == '' || lastName == '' || hometown == '' || gender == '' || password == '' || confirmPassword == '') {
        alert('Please make sure that all fields are filled.')
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
            const response = await fetch(`http://localhost:5501/users/${uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, hometown, gender, password, id: uid })
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Profile Updated ', data)


                alert('Your profile has been updated')
                document.getElementById('update-profile-form').reset()
                // return data
            }
            else {
                console.error('There was an error updating your profile')
                throw new Error('There was an error updating your profile')
            }

        } catch (error) {
            console.error('Error while sending profile update request', error)
            alert('An error occured sending your profile update request. Please try again.')
        }
    }

}


function logout() {
    localStorage.clear()
    window.location.href = '../login/login.html'
}