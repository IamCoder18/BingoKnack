import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, remove, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseConfig = {
    CONFIG_HERE
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('game');

document.querySelector("#gameCode").innerHTML = gameId

onValue(ref(db, `games/${gameId}/players`), (snapshot) => {
    const data = snapshot.val();
    if(data){
        document.querySelector("#players").innerHTML = Object.keys(data).toString()
    }
});

document.querySelector("#startBtn").addEventListener("click", ()=>{
    remove(ref(db, `games/${gameId}/acceptingPlayers`)).then(()=>{window.location = "/game.html?game=" + gameId})
})