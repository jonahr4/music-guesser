# Music Guesser

Music Guesser is a browser-based trivia game that challenges players to identify hit songs by listening to short Spotify previews. I wanted to build something interactive that explored the Spotify Web API, so this project focuses on recreating the feeling of a quick-fire music quiz while keeping the setup light and front-end only.

## Hosted Demo
- Live site: https://jonahrothman.com/music-guesser/

## How It Works
- Fetches Billboard Hot 100 tracks through the Spotify API using the Client Credentials flow.
- Plays a 5-second preview and shows four possible answers per round.
- Reveals the album art once a choice is made and keeps score over ten rounds.
- Tracks high score locally during the session.

## Tech Stack
- HTML, CSS, and vanilla JavaScript
- Spotify Web API (Client Credentials)

## Local Setup
1. **Clone or download** this repository.
2. **Create a Spotify application** at https://developer.spotify.com/dashboard/, then copy the Client ID and Client Secret.
3. **Create a `config.js` file** at the project root with your credentials:
   ```javascript
   const config = {
     clientId: 'YOUR_SPOTIFY_CLIENT_ID',
     clientSecret: 'YOUR_SPOTIFY_CLIENT_SECRET'
   };

   export default config;
   ```
4. **Run a local web server** from the project root (module imports do not load correctly from the `file://` protocol). For example:
   - Python: `python3 -m http.server 5173`
   - Node (serve): `npx serve .`
5. **Open the site** at the server URL (e.g., http://localhost:5173) and click `START` to begin.

> The game uses Spotify's Client Credentials flow, so tracks are fetched without user authentication. Spotify rotates featured playlists frequently; if the playlist becomes unavailable you can swap the ID in `script.js` (`playlistId`) for any public playlist containing previewable tracks.

## Development Notes
- Round filtering ensures each question only uses tracks with playable previews that are at least 15 seconds long.
- Styling and UI are intentionally lightweight to keep the focus on interactivity.
- Feel free to tweak the playlist ID, round count, or timing to create different challenge modes.
