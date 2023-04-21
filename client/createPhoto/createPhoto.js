const captionInput = document.getElementById("caption");
const photoUrlInput = document.getElementById("photo-url");
const imagePreview = document.getElementById("image-preview");
document.getElementById('add-photo-form').addEventListener('submit', (event) => {
    event.preventDefault();
    submit();
});

// Add event listener to photo URL input
photoUrlInput.addEventListener("input", () => {
    const imageUrl = photoUrlInput.value;
    console.log(imageUrl)
    // Display image preview
    if (imageUrl) {
        imagePreview.innerHTML = `<img id="preview" src="${imageUrl}" alt="Image Preview">`;
    } else {
        imagePreview.innerHTML = `<img id="preview" src="https://thumbs.dreamstime.com/b/no-image-vector-isolated-white-background-no-image-vector-illustration-isolated-156298619.jpg" alt="Image Preview">`;
    }
});

async function submit() {
    const caption = document.getElementById('caption').value;
    const url = document.getElementById('photo-url').value;
    const aid = localStorage.getItem('addPhoto-aid');
    const datePosted = new Date().toISOString().slice(0, 10);

    try {
        const response = await fetch('http://localhost:5501/photos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({aid: aid, caption: caption, data: url, datePosted: datePosted })
        });

        if (response.status === 200) {
            const data = await response.json();

            window.location.href = '../profile/profile.html'

        } else {
            const error = await response.text();
            console.error('Error posting photo:', error);
            alert('Error logging in. Please try again.');
        }
    } catch (error) {

        console.error('Error while sending login request:', error);
        alert('An error occurred. Please try again.');
    }
}