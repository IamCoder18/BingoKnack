import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref, remove, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseConfig = {
    CONFIG_HERE
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('game');
let bingoNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]

setInterval(()=>{
    let callNum = generateBingoNum()

    set(ref(db, `games/${gameId}/callNum`), {
        callNum: callNum
    });

    var msg = new SpeechSynthesisUtterance();
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1;
    msg.text = callNum.toString();
    speechSynthesis.speak(msg);
}, 5000)

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateBingoNum() {
    shuffleArray(bingoNumbers)
    return bingoNumbers.pop()
}

onValue(ref(db, `games/${gameId}/bingos`), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let keys = Object.keys(data)
        let values = Object.values(data)

        for (var i = 0; i < keys.length; i++) {
            if (values[i] == "Unknown") {
                document.querySelector("#" + keys[i]).innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"
            } else {
                document.querySelector("#" + keys[i]).innerHTML = values[i]
            }
        }
    }
})

document.querySelector("#numberBtn").addEventListener("click", () => {
    let callNum = generateBingoNum()

    set(ref(db, `games/${gameId}/callNum`), {
        callNum: callNum
    });

    var msg = new SpeechSynthesisUtterance();
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1;
    msg.text = callNum.toString();
    speechSynthesis.speak(msg);
})

document.querySelector("#deleteBtn").addEventListener("click", () => {
    remove(ref(db, "games/" + gameId))
    window.location = "/"
})