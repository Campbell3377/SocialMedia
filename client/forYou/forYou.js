async function recommendedFriends() {
    const uid = localStorage.getItem('uid')
    try {
        const response = await fetch(`http://localhost:5501/recommendedFriends/${uid}`);
        const recommendedFriends = await response.json();

        const friendRecommendations = document.getElementById('friend-recommendations');
        const friendList = document.createElement('ul');
        friendList.className = 'recommended-friends';

        recommendedFriends.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.className = 'friendListItem';
            listItem.textContent = `Name: ${friend.firstName} ${friend.lastName}, Mutual Friends: ${friend.mutual_friends_count}`;
            friendList.appendChild(listItem);
        });

        friendRecommendations.parentNode.insertBefore(friendList, friendRecommendations.nextSibling);

    } catch (error) {
        console.error('Error sending recommendation request:', error);
    }
}

recommendedFriends();

function logout() {
    localStorage.clear()
    window.location.href = '../login/login.html'
}