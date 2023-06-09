document.getElementById('update-profile-form').addEventListener('submit', (event) => {
    event.preventDefault()
    updateInfo()
})
document.getElementById('create-album-form').addEventListener('submit', (event) => {
    event.preventDefault()
    addAlbum()
})
async function tagPhoto(pid, text) {
    console.log(text);
    try {
        const response = await fetch('http://localhost:5501/tags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tagName: text,
                pid: pid,
            }),
        })

        if (response.ok) {
            const data = await response.json()
            console.log('The posted tag: ', data)
            return data
        }
        else {
            console.error('There was an error adding tag')
            throw new Error('There was an error adding tag')
        }

    } catch (error) {
        console.error('Error in addTag', error)
        throw error
    }
}

async function deletePhoto(pid) {
    try {
        const response = await fetch(`http://localhost:5501/deletePhoto/${pid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (response.ok) {
            const data = await response.json()
            console.log('Photo Deleted: ', data)
            return data
        }
        else {
            console.error('There was an error deleting photo')
            throw new Error('There was an error deleting photo')
        }

    } catch (error) {
        console.error('Error in deletePhoto', error)
        throw error
    }
}

async function editCaption(pid, caption) {
    try {
        const response = await fetch(`http://localhost:5501/photos/caption`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                caption: caption,
                pid: pid,
            }),
        })

        if (response.ok) {
            const data = await response.json()
            console.log('Photo Deleted: ', data)
            return data
        }
        else {
            console.error('There was an error deleting photo')
            throw new Error('There was an error deleting photo')
        }

    } catch (error) {
        console.error('Error in deletePhoto', error)
        throw error
    }
}

async function deleteAlbum(aid) {
    try {
        const response = await fetch(`http://localhost:5501/deleteAlbum/${aid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (response.ok) {
            const data = await response.json()
            console.log('Album Deleted: ', data)
            return data
        }
        else {
            console.error('There was an error deleting album')
            throw new Error('There was an error deleting album')
        }

    } catch (error) {
        console.error('Error in deletePhoto', error)
        throw error
    }
}

async function addFriend(friend_id) {
    const dateAdded = new Date().toISOString().slice(0, 10)
    const uid = localStorage.getItem('uid')
    try {
        const response = await fetch(`http://localhost:5501/friends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: uid, friend_id: friend_id, date: dateAdded
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

async function myFriends() {
    document.getElementById('friends-container').innerHTML = ''
    var uid = localStorage.getItem('uid');
    let url = `http://localhost:5501/friends/list/${uid}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const data = await response.json();

            if (data.length == 0) {
                console.log('You have no friends');
            }

            for (let friend of data) {
                let friendDiv = document.createElement('div');
                friendDiv.className = 'friend';

                let friendHeader = document.createElement('div');
                friendHeader.className = 'friend-header';

                let friendName = document.createElement('h2');
                friendName.className = 'friend-name';
                friendName.innerHTML = `${friend.firstName} ${friend.lastName}`;


                let followBackButton = document.createElement('button');
                followBackButton.innerHTML = 'Follow Back';
                followBackButton.addEventListener('click', async () => {
                    await addFriend(friend.uid);
                    myFriends();
                });

                if (friend.isFollowing) {
                    followBackButton.disabled = true;
                    followBackButton.innerHTML = 'Following';
                    followBackButton.classList.add = 'followed';
                }

                friendHeader.appendChild(friendName);

                friendDiv.appendChild(friendHeader);
                friendDiv.appendChild(followBackButton);
                document.getElementById('friends-container').appendChild(friendDiv);
            }
        }
    } catch (error) {
        console.error('Error in myFriends', error);
        throw error;
    }
}

async function myAlbums() {
    document.getElementById('albums-container').innerHTML = ''
    var uid = localStorage.getItem('uid');
    let url = `http://localhost:5501/userAlbums/${uid}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const data = await response.json();

            if (data.length == 0) {
            }

            for (let album of data) {
                console.log("Hello");
                let albumDiv = document.createElement('div');
                albumDiv.className = 'album';

                let aid = album.aid.toString();
                console.log(aid);
                let albumHeader = document.createElement('div');
                albumHeader.className = 'album-header';

                let albumTitle = document.createElement('h2');
                albumTitle.className = 'album-title';
                albumTitle.innerHTML = album.name;

                let albumButtons = document.createElement('div');
                albumButtons.className = 'album-buttons';

                let addPhotoButton = document.createElement('button');
                addPhotoButton.className = 'btn btn-primary';
                addPhotoButton.innerHTML = 'Add Photo';
                addPhotoButton.addEventListener('click', () => {
                    localStorage.setItem('addPhoto-aid', aid);
                    window.location.href = '../createPhoto/createPhoto.html';
                });

                let deleteAlbumButton = document.createElement('button');
                deleteAlbumButton.className = 'btn btn-primary';
                deleteAlbumButton.innerHTML = 'Delete Album';
                deleteAlbumButton.addEventListener('click', async () => {
                    await deleteAlbum(aid);
                    myAlbums();
                });

                albumButtons.appendChild(addPhotoButton);
                albumButtons.appendChild(deleteAlbumButton);

                albumHeader.appendChild(albumTitle);
                albumHeader.appendChild(albumButtons);
                albumDiv.appendChild(albumHeader);

                const postContainerWrapper = document.createElement('div');
                postContainerWrapper.classList.add('post-container');

                let url = `http://localhost:5501/albumPhotos/${aid}`;
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.status === 200) {
                        const data = await response.json();

                        if (data.length == 0) {
                        }
                        for (let post of data) {
                            const pid = post.pid.toString();
                            const aid = post.aid;
                            const postContainer = document.createElement('div');
                            postContainer.classList.add('post');

                            // Set the image
                            const imageContainer = document.createElement('div');
                            imageContainer.classList.add('image-container');
                            const image = document.createElement('img');
                            image.src = post.data;
                            image.alt = post.caption;
                            imageContainer.appendChild(image);
                            postContainer.appendChild(imageContainer);

                            const captionContainer = document.createElement('div');
                            captionContainer.classList.add('caption-container');

                            // Set the caption
                            const caption = document.createElement('p');
                            caption.classList.add('caption')
                            caption.textContent = post.caption;
                            const captionEdit = document.createElement('button');
                            captionEdit.classList.add('edit-btn');
                            captionEdit.textContent = 'Edit Caption';
                            captionEdit.addEventListener('click', async () => {
                                //Edit Caption
                                const text = prompt('New Caption:')
                                try {
                                    if (text == '') {
                                        alert('Please enter a new caption before submitting')
                                    }
                                    else {
                                        text.trim()
                                        await editCaption(pid, text)

                                        myAlbums()
                                    }

                                } catch (error) {
                                    console.error('Error:', error)
                                }
                            });
                            captionContainer.appendChild(caption);
                            captionContainer.appendChild(captionEdit);
                            postContainer.appendChild(captionContainer);


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
                                    if (tagData.length == -1) {
                                        console.log('No Tags.');
                                    } else {
                                        const tagContainer = document.createElement('div');
                                        tagContainer.classList.add('tag-container');
                                        tagData.forEach((tag) => {
                                            const t = document.createElement('div');
                                            t.classList.add('tag');
                                            t.textContent = tag.tag_name;
                                            tagContainer.appendChild(t);

                                        });
                                        if (tagData.length < 5) {
                                            const addTag = document.createElement('button');
                                            addTag.classList.add('tag');
                                            addTag.textContent = '+';
                                            addTag.addEventListener('click', async () => {
                                                const text = prompt('Add tag:')
                                                try {
                                                    if (text == '') {
                                                        alert('Please enter a tag before submitting')
                                                    }
                                                    else {
                                                        text.trim()
                                                        await tagPhoto(pid, text)

                                                        myAlbums()
                                                    }

                                                } catch (error) {
                                                    console.error('Error:', error)
                                                }
                                            });
                                            tagContainer.appendChild(addTag);
                                        }
                                        postContainer.appendChild(tagContainer);
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                });

                            const likesUrl = `http://localhost:5501/likes/${pid}`;
                            console.log(likesUrl);

                            const likesContainer = document.createElement('div');
                            likesContainer.id = 'likes';
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
                                        likesContainer.textContent = "Likes: " + data[0].count;
                                        postContainer.appendChild(likesContainer);
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                });

                            const separation = document.createElement('div')
                            separation.classList.add('separation')
                            postContainer.appendChild(separation)

                            const deleteButton = document.createElement('button');
                            deleteButton.classList.add('delete-button');
                            deleteButton.innerHTML = 'Delete';
                            deleteButton.addEventListener('click', async () => {
                                await deletePhoto(pid);
                                myAlbums();
                            });

                            postContainer.appendChild(deleteButton);
                            postContainerWrapper.appendChild(postContainer);
                            albumDiv.appendChild(postContainerWrapper);
                        }

                    } else {
                        const error = await response.text();
                        console.error('Bad Response Getting Feed', error);
                    }
                } catch (error) {

                    console.error('Error while sendingrequest: Feed', error);
                }
                document.getElementById('albums-container').appendChild(albumDiv);
            }
        } else {
            const error = await response.text();
            console.error('Bad Response Getting Feed', error);
        }
    } catch (error) {

        console.error('Error while sendingrequest: Feed', error);
    }

}

async function addAlbum() {
    const uid = localStorage.getItem('uid');
    console.log(uid)
    const albumName = document.getElementById('albumName').value;
    const datePosted = new Date().toISOString().slice(0, 10);
    if (albumName == '') {
        alert('Please make sure that all field is filled.')
        return
    }
    else {
        try {
            const response = await fetch('http://localhost:5501/albums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: albumName,
                    owner_id: uid,
                    datePosted: datePosted
                })
            })
            if (response.ok) {
                myAlbums()
                document.getElementById('create-album-form').reset()
            } else {
                const error = await response.text();
                console.error('Bad Response', error);
                alert('Error creating album. Please try again.');
            }
        } catch (error) {
            console.error('Error while sending request', error);
            alert('An error occurred. Please try again.');
        }
    }
}

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

