// script.js

//Import Config for API Keys access
import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const instructionsBtn = document.getElementById('instructions-btn');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-btn');
    const startGameButton = document.getElementById('start-game-btn');
    const startBtnWrapper = document.querySelector('.start-btn-wrapper');
    const gameInterface = document.getElementById('game-interface');
    const albumCover = document.getElementById('album-cover');
    const coverImage = document.getElementById('cover-image');
    const audioPlayer = document.getElementById('audio-player');
    const optionButtons = document.querySelectorAll('.option-btn');
    const nextButton = document.getElementById('next-btn');
    const retryButton = document.getElementById('retry-btn');
    const scoreElement = document.getElementById('score');
    const roundElement = document.getElementById('round');


    //Initialize these Vars
    let tracks = [];
    let highscore = 0;
    let score = 0;
    let round = 1;
    let choosenAnswer = false;


    instructionsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    //Hide overlay when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });


    // Add event listener for the start game button
    startGameButton.addEventListener('click', async () => {
        // Fetch the tracks before starting the game
        tracks = await getTop50Songs()
        
        // Hide Start Button
        startBtnWrapper.style.display = 'none';

        // Show Game Interface
        gameInterface.classList.remove('hidden');

        // Start the first round
        playRound();
    });

    // Event listener for the next button
    nextButton.addEventListener('click', async () => {
        round++;
        await playRound();
    });

    // Event listener for the retry button
    retryButton.addEventListener('click', async () => {
        round=0;
        document.querySelector("#round").textContent = round;
        score=0;
        document.querySelector("#score").textContent = score;
        await playRound();
    });

    // Function to handle each round
    async function playRound() {
        if (round > 10) {
            alert("Congrats you got a score of "+score);
            retryButton.classList.remove('hidden');
            nextButton.classList.add('hidden');
            return;
        }

        //reblur album cover
        albumCover.classList.add('blur');

        //rehide retry btn
        retryButton.classList.add('hidden');


        choosenAnswer = false;
        // Update the round number
        document.querySelector("#round").textContent = round;

        // Shuffle tracks and pick four unique tracks
        const shuffledTracks = shuffleArray(tracks);

        // Remove tracks with invalid preview URLs and ensure duration is >= 15 seconds (15000 milliseconds)
        const filteredTracks = shuffledTracks.filter(track => 
            track.track.preview_url && 
            track.track.preview_url !== "" &&
            track.track.duration_ms >= 15000
        );

        console.log(`Tracks remaining after filtering: ${filteredTracks.length}`);

        if (filteredTracks.length < 4) {
            console.error("Not enough tracks with valid preview URLs and duration.");
            return;
        }

        const options = filteredTracks.slice(0, 4);
        const correctTrack = options[0];


        
        // Update the UI with the correct track's details
        coverImage.src = correctTrack.track.album.images[0].url;
        audioPlayer.src = correctTrack.track.preview_url;
        console.log(correctTrack.track.preview_url);

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

        //when clicked remove album cover blur
        albumCover.classList.remove('blur');


        optionButtons.forEach((btn) => {
            if (btn.textContent === correctTrack.track.name) {
                btn.classList.add('correct');
            } else if (btn.textContent === selectedTrack.track.name) {
                btn.classList.add('incorrect');
            }
        });

        if (selectedTrack.track.name === correctTrack.track.name) {
            if(choosenAnswer == false){
                score++;
                // Update the score number
                if(score>highscore){
                    highscore = score;
                }
                document.querySelector("#score").textContent = score;
                document.querySelector("#highscore").textContent = highscore;

            }
        }

        choosenAnswer = true;

        // Show the next button
        nextButton.classList.remove('hidden');
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
            //const playlistId = '37i9dQZEVXbLRQDuF5jeBp'; //ID for US top 50 songs
            const playlistId ='6UeSakyzhiEt4NB3UAd6NQ';//ID for billboard top 100
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const data = await response.json();
            console.log(data.items);
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

}); 