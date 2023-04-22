const searchInput = document.querySelector('.search-input')
const searchSelect = document.querySelector('.search-select')
const searchButton = document.querySelector('.search-button')
const searchReturn = document.querySelector('.search-return')
const tagSelect = document.querySelector('.tag-select')

searchSelect.addEventListener('change', () => {
    searchReturn.innerHTML = ''
    if (searchSelect.value === 'tags') {
        tagSelect.style.display = 'inline-block'
    } else {
        tagSelect.style.display = 'none'
    }
})

tagSelect.addEventListener('change', () => {
    searchReturn.innerHTML = ''
})

async function addFriend(friend_id) {
    const dateAdded = new Date().toISOString().slice(0, 10)
    const uid = localStorage.getItem('uid')
    console.log('fid: ', friend_id)
    try {
        const response = await fetch(`http://localhost:5501/friends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid:uid, friend_id: friend_id, date: dateAdded
            }),
        })

        if (response.ok) {
            const data = await response.json()
            console.log('Friend Added: ', data)
            return data
        }
        else {
            console.error('There was an error adding friend')
            throw new Error('There was an error adding friend')
        }

    } catch (error) {
        console.error('Error in addFriend', error)
        throw error
    }
}

searchButton.addEventListener('click', async () => {
    const search = searchInput.value
    const searchDropdownInput = searchSelect.value
    const uid = localStorage.getItem('uid')

    if (search == '') {
        alert('Please fill in the search field.')
        return
    }
    if (searchDropdownInput == 'people') {
        try {
            const response = await fetch('http://localhost:5501/usersSearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search, uid })
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

                    const followBackButton = document.createElement('button') 
                    // followBackButton.classList.add = 'btn btn-primary';
                    followBackButton.innerHTML = 'Follow'
                    followBackButton.addEventListener('click', async () => {
                        await addFriend(result.uid)
                        followBackButton.disabled = true;
                        followBackButton.innerHTML = 'Following';
                        //myFriends()
                    })

                    if (result.isFollowing) {
                        followBackButton.disabled = true;
                        followBackButton.innerHTML = 'Following';
                        //followBackButton.classList.add = 'followed';
                    }

                    resultCardDiv.appendChild(nameH3)
                    resultCardDiv.appendChild(emailP)
                    resultCardDiv.appendChild(followBackButton)

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
        try {
            const response = await fetch('http://localhost:5501/commentSearch', {
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


                    const commentCount = document.createElement('p')
                    commentCount.classList.add('commentCount')
                    commentCount.textContent = `Matching Comments #: ${result.matching_comments_count}`
                    resultCardDiv.appendChild(commentCount)

                    resultCardDiv.appendChild(nameH3)
                    resultCardDiv.appendChild(emailP)
                    resultCardDiv.appendChild(commentCount)

                    searchReturn.appendChild(resultCardDiv)
                })
            }
            else {

                const error = await response.text();
                console.error('Error finding comments:', error);
                alert('Error finding comments. Please try again later.')
            }

        } catch (error) {
            console.error('An error occured:', error)
            alert('Error while searching for comments. Please Try again later')
        }
    }
    else if (searchDropdownInput == 'tags') {
        const tagSelectInput = tagSelect.value
        const uid = localStorage.getItem('uid')
        const tag = search
        const tags = search

        if (tagSelectInput == 'all-photos') {
            try {
                const response = await fetch(`http://localhost:5501/searchAllByTag/${tag}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.status === 200) {
                    const data = await response.json()
                    searchReturn.innerHTML = ''

                    for (let post of data) {
                        const pid = post.pid.toString();
                        console.log(pid);
                        const aid = post.aid;
                        const resultCard = document.createElement('div');
                        resultCard.classList.add('post');

                        // Set the album name
                        const albumName = document.createElement('h1');
                        albumName.id = 'albumName';
                        albumName.textContent = post.albumName;
                        albumName.addEventListener('click', () => {
                            localStorage.setItem('aid', aid);
                            // Go to album view
                        });
                        resultCard.appendChild(albumName);

                        // Set the image
                        const imageContainer = document.createElement('div');
                        imageContainer.classList.add('image-container');
                        const image = document.createElement('img');
                        image.src = post.data;
                        image.alt = post.caption;
                        imageContainer.appendChild(image);
                        resultCard.appendChild(imageContainer);

                        const caption = document.createElement('p');
                        caption.textContent = post.caption;
                        resultCard.appendChild(caption);

                        const tagsUrl = `http://localhost:5501/tags/${pid}`;
                        await fetch(tagsUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    throw new Error('Bad Response: Tags');
                                }
                            })
                            .then((tagData) => {
                                if (tagData.length == 0) {
                                    console.log('No Tags.');
                                } else {
                                    const tagContainer = document.createElement('div');
                                    tagContainer.classList.add('tag-container');
                                    tagData.forEach((tag) => {
                                        const t = document.createElement('div');
                                        t.classList.add('tag');
                                        // t.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                                        t.textContent = tag.tag_name;
                                        tagContainer.appendChild(t);
                                        resultCard.appendChild(tagContainer);
                                    });
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                                //alert('An error occurred. Please try again.');
                            });

                        const likesUrl = `http://localhost:5501/likes/${pid}`;
                        console.log(likesUrl);

                        await fetch(likesUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    throw new Error('Bad Response: Likes');
                                }
                            })
                            .then((data) => {
                                if (data.length == 0) {
                                    console.log('Something went wrong: like count');
                                } else {
                                    const likesContainer = document.createElement('div');
                                    likesContainer.id = 'likes';
                                    likesContainer.textContent = "Likes: " + data[0].count;
                                    resultCard.appendChild(likesContainer);
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            });


                        const separation = document.createElement('div')
                        separation.classList.add('separation')
                        resultCard.appendChild(separation)

                        const commentsUrl = `http://localhost:5501/comments/${pid}`;
                        await fetch(commentsUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    throw new Error('Bad Response: Comments');
                                }
                            })
                            .then((commentData) => {
                                if (commentData.length == 0) {
                                    console.log('No Comments.');        //Maybe Add Some UI elements to this if and else for adding a comment
                                } else {
                                    const commentContainer = document.createElement('div');
                                    commentContainer.classList.add('comment-container');
                                    commentData.forEach((comment) => {
                                        const span = document.createElement('span');
                                        const h3 = document.createElement('h3');
                                        h3.textContent = comment.firstName + ' ' + comment.lastName;
                                        const p = document.createElement('p');
                                        p.textContent = comment.comment;
                                        span.appendChild(h3);
                                        span.appendChild(p);
                                        commentContainer.appendChild(span);
                                        resultCard.appendChild(commentContainer);
                                    });
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                        searchReturn.appendChild(resultCard);
                    }

                }

            } catch (error) {
                console.error("There was an error searching for all photos by tag: ", error)
                alert('Something went wrong with your search. Please try again.')
            }
        }
        else if (tagSelectInput == 'your-photos') {
            try {
                const response = await fetch(`http://localhost:5501/searchYoursByTag/${tags}/${uid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (response.status === 200) {
                    const data = await response.json()
                    searchReturn.innerHTML = ''

                    for (let post of data) {

                        console.log(post)

                        const pid = post.pid.toString();
                        console.log(pid);

                        const aid = post.aid;
                        const resultCard = document.createElement('div');
                        resultCard.classList.add('post');

                        // Set the album name
                        const albumName = document.createElement('h1');
                        albumName.id = 'albumName';
                        albumName.textContent = post.albumName;
                        albumName.addEventListener('click', () => {
                            localStorage.setItem('aid', aid);
                            // Go to album view
                        });
                        resultCard.appendChild(albumName);

                        // Set the image
                        const imageContainer = document.createElement('div');
                        imageContainer.classList.add('image-container');
                        const image = document.createElement('img');
                        image.src = post.data;
                        image.alt = post.caption;
                        imageContainer.appendChild(image);
                        resultCard.appendChild(imageContainer);

                        const caption = document.createElement('p');
                        caption.textContent = post.caption;
                        resultCard.appendChild(caption);

                        const tagsUrl = `http://localhost:5501/tags/${pid}`;
                        await fetch(tagsUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    throw new Error('Bad Response: Tags');
                                }
                            })
                            .then((tagData) => {
                                if (tagData.length == 0) {
                                    console.log('No Tags.');
                                } else {
                                    const tagContainer = document.createElement('div');
                                    tagContainer.classList.add('tag-container');
                                    tagData.forEach((tag) => {
                                        const t = document.createElement('div');
                                        t.classList.add('tag');
                                        // t.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                                        t.textContent = tag.tag_name;
                                        tagContainer.appendChild(t);
                                        resultCard.appendChild(tagContainer);
                                    });
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                                //alert('An error occurred. Please try again.');
                            });

                        const likesUrl = `http://localhost:5501/likes/${pid}`;
                        console.log(likesUrl);

                        await fetch(likesUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    throw new Error('Bad Response: Likes');
                                }
                            })
                            .then((data) => {
                                if (data.length == 0) {
                                    console.log('Something went wrong: like count');
                                } else {
                                    const likesContainer = document.createElement('div');
                                    likesContainer.id = 'likes';
                                    likesContainer.textContent = "Likes: " + data[0].count;
                                    resultCard.appendChild(likesContainer);
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            });


                        const separation = document.createElement('div')
                        separation.classList.add('separation')
                        resultCard.appendChild(separation)

                        const commentsUrl = `http://localhost:5501/comments/${pid}`;
                        await fetch(commentsUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    throw new Error('Bad Response: Comments');
                                }
                            })
                            .then((commentData) => {
                                if (commentData.length == 0) {
                                    console.log('No Comments.');        //Maybe Add Some UI elements to this if and else for adding a comment
                                } else {
                                    const commentContainer = document.createElement('div');
                                    commentContainer.classList.add('comment-container');
                                    commentData.forEach((comment) => {
                                        const span = document.createElement('span');
                                        const h3 = document.createElement('h3');
                                        h3.textContent = comment.firstName + ' ' + comment.lastName;
                                        const p = document.createElement('p');
                                        p.textContent = comment.comment;
                                        span.appendChild(h3);
                                        span.appendChild(p);
                                        commentContainer.appendChild(span);
                                        resultCard.appendChild(commentContainer);
                                    });
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                        searchReturn.appendChild(resultCard);



                    }

                }

            } catch (error) {
                console.error("There was an error searching for all photos by tag: ", error)
                alert('Something went wrong with your search. Please try again.')
            }
        }

    }
    else {
        alert('There was an error with your search. Please try again')
        return
    }
})

function logout() {
    localStorage.clear()
    window.location.href = '../login/login.html'
}