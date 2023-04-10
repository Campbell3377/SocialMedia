const current_uid = localStorage.getItem('uid');
const leaderboardTable = document.querySelector('.leaderboard tbody');

function highlightCurrentUserRow(row) {
  row.classList.add('highlight');
}

function populateLeaderboardTable(data) {
  leaderboardTable.innerHTML = '';

  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    const rankTd = document.createElement('td');
    const userTd = document.createElement('td');
    const scoreTd = document.createElement('td');
    const postsTd = document.createElement('td');
    const commentsTd = document.createElement('td');

    rankTd.textContent = index + 1;
    userTd.textContent = `${row.firstName} ${row.lastName}`;
    scoreTd.textContent = row.score * 100;
    if (row.pscore == null) postsTd.textContent = 0;
    else postsTd.textContent = row.pscore;
    if (row.cscore == null) commentsTd.textContent = 0 
    else commentsTd.textContent = row.cscore;

    if (row.uid === current_uid) {
      highlightCurrentUserRow(tr);
    }

    tr.appendChild(rankTd);
    tr.appendChild(userTd);
    tr.appendChild(scoreTd);
    tr.appendChild(postsTd);
    tr.appendChild(commentsTd);

    leaderboardTable.appendChild(tr);
  });
}

function fetchLeaderboardData() {
  fetch('http://localhost:5501/contributionScore')
    .then(response => response.json())
    .then(data => {
      populateLeaderboardTable(data);
    })
    .catch(error => {
      console.error('Error fetching leaderboard data:', error);
    });
}

fetchLeaderboardData();
