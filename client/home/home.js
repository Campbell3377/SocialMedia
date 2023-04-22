async function homeFeed() {
    document.getElementById('post-container').innerHTML = ''
    var uid = localStorage.getItem('uid');
    // if (uid != 1) uid = 2;
    let url = `http://localhost:5501/feed/${uid}`;
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
                console.log('Something went wrong: Photos');
            }

            for (let post of data) {
                const pid = post.pid.toString();
                //console.log(pid);
                const aid = post.aid;
                const postContainer = document.createElement('div');
                postContainer.classList.add('post');

                // Set the album name
                const albumName = document.createElement('h1');
                albumName.id = 'albumName';
                albumName.textContent = post.albumName;
                albumName.addEventListener('click', () => {
                    localStorage.setItem('aid', aid);
                    // Go to album view
                });
                postContainer.appendChild(albumName);

                // Set the image
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                const image = document.createElement('img');
                image.src = post.data;
                image.alt = post.caption;
                imageContainer.appendChild(image);
                postContainer.appendChild(imageContainer);


                const caption = document.createElement('p');
                caption.classList.add('caption')
                caption.textContent = post.caption;
                postContainer.appendChild(caption);

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
                                t.textContent = tag.tag_name;
                                tagContainer.appendChild(t);
                                postContainer.appendChild(tagContainer);
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        //alert('An error occurred. Please try again.');
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
                        //alert('An error occurred. Please try again.');
                    });

                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('buttonContainer');
                postContainer.appendChild(buttonContainer)

                const likeButton = document.createElement('button');
                likeButton.classList.add('post-button');
                likeButton.textContent = 'Like';
                buttonContainer.appendChild(likeButton);

                likeButton.addEventListener('click', async () => {
                    try {
                        const updateLikes = await likePhoto(pid)
                        likesContainer.textContent = "Likes: " + updateLikes
                    } catch (error) {
                        console.error('Error:', error);
                    }
                })

                const commentButton = document.createElement('button');
                commentButton.classList.add('post-button');
                commentButton.textContent = 'Comment';
                buttonContainer.appendChild(commentButton);

                commentButton.addEventListener('click', async () => {
                    const text = prompt('Please enter your comment here:')
                    try {
                        if (text == '') {
                            alert('Please enter a comment before submitting')
                        }
                        else {
                            text.trim()
                            await commentPhoto(pid, text)

                            homeFeed()
                        }

                    } catch (error) {
                        console.error('Error:', error)
                    }
                })

                const separation = document.createElement('div')
                separation.classList.add('separation')
                postContainer.appendChild(separation)

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
                                postContainer.appendChild(commentContainer);
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        //alert('An error occurred. Please try again.');
                    });
                document.getElementById('post-container').appendChild(postContainer);
                // document.body.appendChild(postContainer);
            }
        } else {
            const error = await response.text();
            console.error('Bad Response Getting Feed', error);
            //alert('Error logging in. Please try again. 5');
        }
    } catch (error) {

        console.error('Error while sendingrequest: Feed', error);
        //alert('An error occurred. Please try again. 6');
    }

}

async function likePhoto(pid) {
    const uid = localStorage.getItem('uid')

    try {
        const response = await fetch('http://localhost:5501/likes',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    pid: pid,
                }),
            })
        if (response.ok) {
            const updatedLikeCount = await response.json();
            console.log('updatedLikeCount:', updatedLikeCount);

            const likeCountResponse = await fetch(`http://localhost:5501/likes/${pid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (likeCountResponse.status === 200) {
                const data = await likeCountResponse.json();
                if (data.length == 0) {
                    console.log('Something went wrong: like count');
                } else {
                    return data[0].count;
                }
            } else {
                throw new Error('Bad Response: Likes');
            }
        } else {
            console.error('Error adding like');
            throw new Error('Error adding like');
        }
    } catch (error) {
        console.error('Error in likePhoto function', error);
        throw error;
    }
}

async function commentPhoto(pid, text) {
    const uid = localStorage.getItem('uid')
    const datePosted = new Date().toISOString().slice(0, 10)

    try {
        const response = await fetch('http://localhost:5501/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                uid: uid,
                date: datePosted,
                pid: pid,
            }),
        })

        if (response.ok) {
            const data = await response.json()
            console.log('The posted comment: ', data)
            return data
        }
        else {
            console.error('There was an error adding comment')
            throw new Error('There was an error adding comment')
        }

    } catch (error) {
        console.error('Error in commentPhoto', error)
        throw error
    }
}

function logout() {
    localStorage.clear()
    window.location.href = '../login/login.html'
}
