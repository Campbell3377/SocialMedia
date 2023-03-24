document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    login();
});

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5501/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.status === 200) {
            const data = await response.json();

            if (data.length == 0) {
                alert('Invalid User Credentials. Please try again.')
            }
            else {
                localStorage.setItem('uid', data[0].uid)
                window.location.href = '../home/home.html'
            }

        } else {
            const error = await response.text();
            console.error('Error logging in:', error);
            alert('Error logging in. Please try again.');
        }
    } catch (error) {

        console.error('Error while sending login request:', error);
        alert('An error occurred. Please try again.');
    }
}