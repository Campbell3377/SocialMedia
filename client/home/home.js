// async function homeFeed() {
//       try {
//         const response = await fetch('http://localhost:5501/feed/1', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.status === 200) {
//             const data = await response.json();

//             if (data.length == 0) {
//                 console.log('Something went wrong: Photos')
//             }
//             data.forEach(post => {
//                 var pid = post.pid.toString()
//                 console.log(pid)
//                 var aid = post.aid
//                 const postContainer = document.createElement('div');
//                 postContainer.classList.add('post');
        
//                 // Set the album name
//                 const albumName = document.createElement('h1');
//                 albumName.id = 'albumName';
//                 albumName.textContent = post.albumName;
//                 albumName.addEventListener('click', (aid) => {
//                     localStorage.setItem('aid', aid);
//                     //Go to album view
//                 })
//                 postContainer.appendChild(albumName);
        
//                 // Set the image
//                 const imageContainer = document.createElement('div');
//                 imageContainer.classList.add('image-container');
//                 const image = document.createElement('img');
//                 image.src = post.data;
//                 image.alt = post.caption;
//                 imageContainer.appendChild(image);
//                 postContainer.appendChild(imageContainer);

//                 let url = `http://localhost:5501/likes/${pid}`
//                 console.log(url)
//                 try {
//                     const response = fetch(url, {
//                         method: 'GET',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         }
//                     });
            
//                     if (response.status === 200) {
//                         const data = response.json();
            
//                         if (data.length == 0) {
//                             console.log('Something went wrong: like count')
//                         }
//                         else {

//                         }
//                         const likesContainer = document.createElement('div');
//                         likesContainer.id = 'likes';
//                         likesContainer.textContent = data[0].likes;
//                         postContainer.appendChild(likesContainer);
            
//                     } else {
//                         //const error = response.text();
//                         console.error('Bad Response: Likes');   //, error
//                         //alert('Error logging in. Please try again. 1');
//                     }
//                 } catch (error) {
            
//                     console.error('Error while sending request: Likes', error);
//                     //alert('An error occurred. Please try again. 2');
//                 }
//                 try {
//                     let url = `http://localhost:5501/comments/${pid}`
//                     const response = fetch(url, {
//                         method: 'GET',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         }
//                     });
            
//                     if (response.status === 200) {
//                         const commentData = response.json();
            
//                         if (commentData.length == 0) {
//                             console.log('No Comments.')
//                         }
//                         const commentContainer = document.createElement('div');
//                         commentContainer.classList.add('comment-container');
//                         commentData.forEach(comment =>{
//                             const span = document.createElement('span');
//                             const h3 = document.createElement('h3');
//                             h3.textContent = comment.firstName + "" + comment.lastName;
//                             const p = document.createElement('p');
//                             p.textContent = comment.comment;
//                             span.appendChild(h3);
//                             span.appendChild(p);
//                             commentContainer.appendChild(span);
//                             postContainer.appendChild(commentContainer);
//                         })
                        
            
//                     } else {
//                         //const error = response.text();
//                         console.error('Bad Response: comments');    //, error
//                         //alert('Error logging in. Please try again. 3');
//                     }
//                 } catch (error) {
            
//                     console.error('Error while sending request:comments', error);
//                     //alert('An error occurred. Please try again. 4');
//                 }
//                 document.body.appendChild(postContainer);
//             });
            

//         } else {
//             const error = await response.text();
//             console.error('Bad Resonse Getting Feed:', error);
//             //alert('Error logging in. Please try again. 5');
//         }
//     } catch (error) {

//         console.error('Error while sendingrequest: Feed', error);
//         //alert('An error occurred. Please try again. 6');
//     }
    
// }

async function homeFeed() {
    document.getElementById('post-container').innerHTML = ''
    var uid = localStorage.getItem('uid');
    if (uid != 1) uid = 2;
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
    
            const likesUrl = `http://localhost:5501/likes/${pid}`;
            console.log(likesUrl);
    
            fetch(likesUrl, {
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
                //alert('An error occurred. Please try again.');
                });

            const tagsUrl = `http://localhost:5501/tags/${pid}`;
            fetch(tagsUrl, {
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

            const caption = document.createElement('p');
            caption.textContent = post.caption;
            postContainer.appendChild(caption);

            const commentsUrl = `http://localhost:5501/comments/${pid}`;
            fetch(commentsUrl, {
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