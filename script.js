// script.js

//Import Config for API Keys access
import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const instructionsBtn = document.getElementById('instructions-btn');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-btn');
    const startGameButton = document.getElementById('start-game-btn')
    const gameInterface = document.getElementById('game-interface');
    const coverImage = document.getElementById('cover-image');
    const audioPlayer = document.getElementById('audio-player');
    const optionButtons = document.querySelectorAll('.option-btn');
    const nextButton = document.getElementById('next-btn');
    const scoreElement = document.getElementById('score');
    const roundElement = document.getElementById('round');



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

        // Hide Start Button
        startGameButton.style.display = 'none';

        // Show Game Interface
        gameInterface.classList.remove('hidden');
    });
}); 

// Function to start the game
async function startGame() {
    console.log("Game started!");
    const tracks = await getTop50Songs();
    
    //for loop for ten rounds
        //dispay round i / 10
        //assign track 1,2,3,4  as 4 separate variables, all random tracks from the tracks varaiable (no reapeats)
        //send cover photo of track 1 to the HTML to display for each round
        //upload snipit from track 1 to be the music preview
        //replace the names of option 1 2,3,4 buttons as the names of the tracks from our varibales and randomize the order
        //make it so if a player clicks on the correct track one track the score increases and the button turns green
        //if player clicks on the wrong button it turns red and score does not increase
        //after player clicks the button a next button will aprear under all the other buttons to reset the loop with new songs

    console.log(tracks);
    let score = 0;
    let round = 1;

    // Function to handle each round
    async function playRound() {
        if (round > 10) {
            alert(`Game over! Your final score is ${score}.`);
            return;
        }

        // Update the round number
        roundElement.textContent = round;

        // Shuffle tracks and pick four unique tracks
        const shuffledTracks = shuffleArray(tracks);
        const options = shuffledTracks.slice(0, 4);
        const correctTrack = options[0];

        // Update the UI with the correct track's details
        coverImage.src = correctTrack.track.album.images[0].url;
        audioPlayer.src = correctTrack.track.preview_url;

        // Shuffle options and set button texts
        const shuffledOptions = shuffleArray(options);
        optionButtons.forEach((btn, index) => {
            btn.textContent = shuffledOptions[index].track.name;
            btn.onclick = () => checkAnswer(shuffledOptions[index], correctTrack);
            btn.className = 'option-btn'; // Reset button styles
        });

        // Hide the next button initially
        nextButton.classList.add('hidden');
    }

    // Function to check the answer
    function checkAnswer(selectedTrack, correctTrack) {
        optionButtons.forEach((btn) => {
            if (btn.textContent === correctTrack.track.name) {
                btn.classList.add('correct');
            } else if (btn.textContent === selectedTrack.track.name) {
                btn.classList.add('incorrect');
            }
        });

        if (selectedTrack.track.name === correctTrack.track.name) {
            score++;
            scoreElement.textContent = score;
        }

        // Show the next button
        nextButton.classList.remove('hidden');
    }

    // Event listener for the next button
    nextButton.addEventListener('click', () => {
        round++;
        playRound();
    });

    // Start the first round
    playRound();

    //alert("Game started!");
}

//Function to get the top 50 songs from the SPOTIFY API
async function getTop50Songs(){
    const clientId = config.clientId; 
    const clientSecret = config.clientSecret; 

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
        const playlistId = '37i9dQZEVXbLRQDuF5jeBp'; //ID for US top 50 songs
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching the top 50 songs:', error);
    }
}

 // Utility function to shuffle an array
 function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}