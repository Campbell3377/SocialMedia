localStorage.setItem('see', 'see-all');

function openTab(event, tabName) {
    var i, tablinks;

    localStorage.setItem('see', tabName);

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";
    getTaggedPhotos();

}

function populateTrendingTags(tags) {
    let trendingTags = document.getElementById('trendingTags');
    tags.forEach(tag => {
        let tagElement = document.createElement('a');
        tagElement.classList.add('tag');
        tagElement.innerText = tag.tag_name;
        tagElement.onclick = () => {
            localStorage.setItem('tag', tag.tag_name);
            getTaggedPhotos();
        }
        trendingTags.appendChild(tagElement);
    });
}

async function fetchTrendingTags() {
    await fetch('http://localhost:5501/trendingTags')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('mostTrending', data[0].tag_name);
            populateTrendingTags(data);
        })
        .catch(error => {
            console.error('Error fetching tag data:', error);
        });
}



async function getTaggedPhotos() {
    let tag = localStorage.getItem('tag');
    document.getElementById('post-container').innerHTML = ''
    var uid = localStorage.getItem('uid');
    if (uid != 1) uid = 2;
    var url;
    if (localStorage.getItem('see') == 'see-all') url = `http://localhost:5501/photosByTag/${tag}`;
    else url = `http://localhost:5501/yourPhotosByTag/${tag}/${uid}`;
    console.log(url);
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
                console.log(pid);
                const aid = post.aid;
                const postContainer = document.createElement('div');
                postContainer.classList.add('post');

                // Set the album name
                const albumName = document.createElement('h1');
                albumName.id = 'albumName';
                albumName.textContent = post.albumName;
                albumName.addEventListener('click', () => {
                    localStorage.setItem('aid', aid);
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
                            postContainer.appendChild(likesContainer);
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });


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
                            console.log('No Comments.');
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
                    });
                document.getElementById('post-container').appendChild(postContainer);
            }
        } else {
            const error = await response.text();
            console.error('Bad Response Getting Feed', error);
        }
    } catch (error) {

        console.error('Error while sendingrequest: Feed', error);
    }

}

function logout() {
    localStorage.clear()
    window.location.href = '../login/login.html'
}