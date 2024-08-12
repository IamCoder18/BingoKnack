import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, onValue, ref, set} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseConfig = {
    CONFIG_HERE
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get('state') == "1"){
    document.location = "/"
}

const card = urlParams.get('card').split(",");
const gameId = urlParams.get('game');
const username = urlParams.get('player');

const url = new URL(window.location);
url.searchParams.delete('card');
url.searchParams.delete('game');
url.searchParams.delete('player');
url.searchParams.append('state', '1');
window.history.pushState(null, '', url.toString());

let bingoCard = [[card[0], card[1], card[2], card[3], card[4]],
[card[5], card[6], card[7], card[8], card[9]],
[card[10], card[11], card[12], card[13], card[14]],
[card[15], card[16], card[17], card[18], card[19]],
[card[20], card[21], card[22], card[23], card[24]]]

let allCalls = []
let currentCall = null
let bingos = {}
let selectedBoxes = []

let bingoDatabaseUpdate = (id) => {
    set(ref(db, `games/${gameId}/bingos/${id}`), username.toString())
}

let checker = (ar1, ar2) => {return ar1.every(r => ar2.includes(r))};

let checkForBingo = () => {
    if (bingos.r1 == "Unknown" && checker(["00", "01", "02", "03", "04"], selectedBoxes)){
        bingoDatabaseUpdate("r1")
    }
    if (bingos.r2 == "Unknown" && checker(["10", "11", "12", "13", "14"], selectedBoxes)){
        bingoDatabaseUpdate("r2")
    }
    if (bingos.r3 == "Unknown" && checker(["20", "21", "22", "23", "24"], selectedBoxes)){
        bingoDatabaseUpdate("r3")
    }
    if (bingos.r4 == "Unknown" && checker(["30", "31", "32", "33", "34"], selectedBoxes)){
        bingoDatabaseUpdate("r4")
    }
    if (bingos.r5 == "Unknown" && checker(["40", "41", "42", "43", "44"], selectedBoxes)){
        bingoDatabaseUpdate("r5")
    }
    if (bingos.c1 == "Unknown" && checker(["00", "10", "20", "30", "40"], selectedBoxes)){
        bingoDatabaseUpdate("c1")
    }
    if (bingos.c2 == "Unknown" && checker(["01", "11", "21", "31", "41"], selectedBoxes)){
        bingoDatabaseUpdate("c2")
    }
    if (bingos.c3 == "Unknown" && checker(["02", "12", "22", "32", "42"], selectedBoxes)){
        bingoDatabaseUpdate("c3")
    }
    if (bingos.c4 == "Unknown" && checker(["03", "13", "23", "33", "43"], selectedBoxes)){
        bingoDatabaseUpdate("c4")
    }
    if (bingos.c5 == "Unknown" && checker(["04", "14", "24", "34", "44"], selectedBoxes)){
        bingoDatabaseUpdate("c5")
    }
    if (bingos.d1 == "Unknown" && checker(["00", "11", "22", "33", "44"], selectedBoxes)){
        bingoDatabaseUpdate("d1")
    }
    if (bingos.d2 == "Unknown" && checker(["40", "31", "22", "13", "04"], selectedBoxes)){
        bingoDatabaseUpdate("d2")
    }
    if (bingos.bl == "Unknown" && checker(["00", "01", "02", "03", "04", "10", "11", "12", "13", "14", "20", "21", "22", "23", "24", "30", "31", "32", "33", "34", "40", "41", "42", "43", "44"], selectedBoxes)){
        bingoDatabaseUpdate("bl")
    }
}

let checkForSuggestions = () => {
    allCalls.forEach((e)=>{
        if (card.includes(e.toString())){
            document.querySelector("#b" + Math.floor(index / 5).toString().concat((index % 5).toString())).classList.add("suggested")
        }
    })
}


document.querySelector("#card .card-body #bingo-card").innerHTML = `
<table class="table table-primary table-bordered">
    <tbody>
        <tr>
            <td id="b00">${bingoCard[0][0]}</td>
            <td id="b01">${bingoCard[0][1]}</td>
            <td id="b02">${bingoCard[0][2]}</td>
            <td id="b03">${bingoCard[0][3]}</td>
            <td id="b04">${bingoCard[0][4]}</td>
        </tr>
        <tr id="1">
            <td id="b10">${bingoCard[1][0]}</td>
            <td id="b11">${bingoCard[1][1]}</td>
            <td id="b12">${bingoCard[1][2]}</td>
            <td id="b13">${bingoCard[1][3]}</td>
            <td id="b14">${bingoCard[1][4]}</td>
        </tr>
        <tr id="2">
            <td id="b20">${bingoCard[2][0]}</td>
            <td id="b21">${bingoCard[2][1]}</td>
            <td id="b22">${bingoCard[2][2]}</td>
            <td id="b23">${bingoCard[2][3]}</td>
            <td id="b24">${bingoCard[2][4]}</td>
        </tr>
        <tr id="3">
            <td id="b30">${bingoCard[3][0]}</td>
            <td id="b31">${bingoCard[3][1]}</td>
            <td id="b32">${bingoCard[3][2]}</td>
            <td id="b33">${bingoCard[3][3]}</td>
            <td id="b34">${bingoCard[3][4]}</td>
        </tr>
        <tr id="4">
            <td id="b40">${bingoCard[4][0]}</td>
            <td id="b41">${bingoCard[4][1]}</td>
            <td id="b42">${bingoCard[4][2]}</td>
            <td id="b43">${bingoCard[4][3]}</td>
            <td id="b44">${bingoCard[4][4]}</td>
        </tr>
        </tbody>
</table>
`
const boxes = document.querySelectorAll("td");

for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener("click", (event) => {
        if (allCalls.includes(parseInt(boxes[i].innerHTML))) {
            boxes[i].classList.add("selected");
            let index = card.indexOf(boxes[i].innerText.toString())
            selectedBoxes.push(Math.floor(index / 5).toString().concat((index % 5).toString()))
            checkForBingo()
        }
    });
}


onValue(ref(db, `games/${gameId}/callNum`), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        allCalls.push(data.callNum)
        document.querySelector("#callNum").innerHTML = data.callNum
        currentCall = data.callNum

        checkForSuggestions()
    }
});

onValue(ref(db, `games/${gameId}/bingos`), (snapshot) => {
    const data = snapshot.val();
    if (data) {
        bingos = data
    }
});