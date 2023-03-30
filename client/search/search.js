const searchInput = document.querySelector('.search-input')
const searchSelect = document.querySelector('.search-select')
const searchButton = document.querySelector('.search-button')
const searchReturn = document.querySelector('.search-return')

searchButton.addEventListener('click', async () => {
    const search = searchInput.value
    const searchDropdownInput = searchSelect.value

    if (search == '') {
        alert('Please fill in the search field.')
        return
    }

    // let apiEndopoint

    if (searchDropdownInput == 'people') {
        try {
            const response = await fetch('http://localhost:5501/usersSearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search })
            });

            if (response.status === 200) {
                const data = await response.json()

                searchReturn.innerHTML = ''

                data.forEach(result => {
                    const resultCardDiv = document.createElement('div')
                    resultCardDiv.classList.add('result-card')

                    const nameH3 = document.createElement('h3')
                    nameH3.classList.add('name')
                    nameH3.textContent = result.firstName + ' ' + result.lastName

                    const emailP = document.createElement('p')
                    emailP.classList.add('email')
                    emailP.textContent = result.email

                    resultCardDiv.appendChild(nameH3)
                    resultCardDiv.appendChild(emailP)

                    searchReturn.appendChild(resultCardDiv)
                })

            } else {
                const error = await response.text();
                console.error('Error logging in:', error);
                alert('Error finding users. Please try again later.')
            }
        } catch (error) {

            console.error('Error while sending login request:', error)
            alert('An error occurred. Please try again.')
        }
    }
    else if (searchDropdownInput == 'comments') {
        apiEndopoint = 'http://localhost:5501/commentSearch'
    }
    else if (searchDropdownInput == 'tags') {
        apiEndopoint = 'http://localhost:5501/searchByTag'
    }
    else {
        alert('There was an error with your search. Please try again')
        return
    }

    // const params = new URLSearchParams({
    //     search: searchBarInput
    // });

    // fetch(`${apiEndopoint}?${params.toString()}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         searchReturn.innerHTML = ""; // Clear previous results
    //         data.forEach((photo) => {
    //             const img = document.createElement("img");
    //             img.src = photo.url;
    //             searchReturn.appendChild(img);
    //         });
    //     })
    //     .catch((error) => console.error(error));
})