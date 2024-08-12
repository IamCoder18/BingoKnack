import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseConfig = {
    CONFIG_HERE
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let previousBingoNumbers = []

document.querySelector("#btnJoin").addEventListener("click", () => {
    document.querySelector("#home").style.display = "none"
    document.querySelector("#join").style.display = "block"
})

document.querySelector("#gamecode").addEventListener("input", () => {
    if (document.querySelector("#gamecode").value.length == 6) {
        get(ref(db, `games/${document.querySelector("#gamecode").value}/acceptingPlayers/`)).then((snapshot) => {
            if (snapshot.exists()) {
                document.querySelector("#gameCodeGroup").style.display = "none"
                document.querySelector("#usernameGroup").style.display = "block"
            } else {
                document.querySelector("#gameJoinWarning").style.display = "block"
            }
        })
    }
})

function generateBingoNum() {
    let currNumber = Math.floor(Math.random() * (99) + 1)
    if (previousBingoNumbers.includes(currNumber)) {
        return generateBingoNum()
    } else {
        previousBingoNumbers.push(currNumber)
        return currNumber
    }
}

document.querySelector("#btnJoin2").addEventListener("click", () => {
    let username = document.querySelector("#username").value
    if (username != "") {
        let bingoCard = [[generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum()], [generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum()], [generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum()], [generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum()], [generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum(), generateBingoNum()]]
        set(ref(db, `games/${document.querySelector("#gamecode").value}/players/${username}`), {
            name: username,
            board: bingoCard
        });
        document.querySelector("#join").style.display = "none"
        window.location = `/play.html?card=${bingoCard.toString()}&game=${document.querySelector("#gamecode").value}&player=${username}`
    }
})

document.querySelector("#btnHost").addEventListener("click", () => {
    document.querySelector("#home").style.display = "none"
    document.querySelector("#host").style.display = "block"
    let gameId = Math.floor(100000 + Math.random() * 900000)
    set(ref(db, 'games/' + gameId), {
        acceptingPlayers: {value: "true"},
        bingos: {r1: "Unknown", r2: "Unknown", r3: "Unknown", r4: "Unknown", r5: "Unknown", c1: "Unknown", c2: "Unknown", c3: "Unknown", c4: "Unknown", c5: "Unknown", d1: "Unknown", d2: "Unknown", bl: "Unknown"}
    }).then(() => {
        window.location = "/host.html?game=" + gameId
    });
})