// script.js
document.addEventListener('DOMContentLoaded', () => {
    const instructionsBtn = document.getElementById('instructions-btn');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-btn');
    const startGameButton = document.getElementById('start-game-btn')

    instructionsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // Optional: Hide overlay when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });

    // Add event listener for the start game button
    startGameButton.addEventListener('click', () => {
        startGame();

        //Hide Start Button
        startGameButton.style.display = 'none';
    });
}); 

// Function to start the game
function startGame() {
    console.log("Game started!");

    getTop50Songs();


    alert("Game started!");
}

//Function to get the top 50 songs from the SPOTIFY API
async function getTop50Songs(){
    const clientId = '70a1b72acae74012ba2ade4a50667edc'; // Replace with your client ID
    const clientSecret = '18421d89fc6b4f7a9dd0d7e2e3c53778'; // Replace with your client secret

    try {
        // Fetch the access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch the top 50 songs
        const playlistId = '37i9dQZEVXbLRQDuF5jeBp';
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        displayTop50Songs(data.items);
    } catch (error) {
        console.error('Error fetching the top 50 songs:', error);
    }
}

// Function to display the top 50 songs
function displayTop50Songs(tracks) {
    const songsContainer = document.createElement('div');
    songsContainer.id = 'songs-container';
    document.body.appendChild(songsContainer);

    tracks.forEach((item, index) => {
        const track = item.track;
        const songElement = document.createElement('div');
        songElement.className = 'song';
        songElement.innerHTML = `
            <p><strong>${index + 1}. ${track.name}</strong> by ${track.artists.map(artist => artist.name).join(', ')}</p>
            <p>Album: ${track.album.name}</p>
            <img src="${track.album.images[1].url}" alt="${track.name} album cover" width="100">
            <audio controls>
                <source src="${track.preview_url}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        songsContainer.appendChild(songElement);
    });
}