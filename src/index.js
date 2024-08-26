import { currentIndex, journalData,  } from "./globals.js";

var iframe = document.getElementById("myFrame")
var page = iframe.src.includes("journal.html") ? 1 : 0;

function changeJournal(data, index) {
    var element = iframe.contentWindow.document.getElementById("journal")

    /*
    var arr = Array.prototype.slice.call(elements)
    var index = arr.indexOf(data)
*/

    //journalData[index].text = elements[index].value;
    currentIndex.value = index

    iframe.contentWindow.postMessage(index, '*'); // Sends message to iframe
    //element.value = journalData[index].text
    

}

function isHovered(element) {
    return window.getComputedStyle(element, ':hover').getPropertyValue('cursor') === 'pointer';
}

document.getElementById("home").onmouseenter = function () {
    document.getElementById("homeText").classList.add("homeTextShow")
}

document.getElementById("home").onmouseleave = function () {
    document.getElementById("homeText").classList.remove("homeTextShow")
}

document.getElementById("homeButton").onclick = () => {
    iframe.src = "./home.html"
    page = 0
}

for (let j = 0; j < journalData.length; j++) {
    let node = document.getElementById("journalTest").cloneNode(true);
    node.id = ""
    node.childNodes[1].id = "journalText" + j;
    var breakPoint = document.createElement("br");

    node.childNodes[1].innerHTML = journalData[j].name;
    node.onclick = function (j) {

        if (page != 1) {
            iframe.src = "./journal.html"
            page = 1
        }


        var index = this.childNodes[1].id.replace("journalText", "")
        setTimeout(() => {
            changeJournal(this, Number(index))
        }, 100)
        
    }

    node.onmouseleave = function () {
        document.querySelector("#journalText" + j).classList.remove("journalShow")
    }

    node.onmouseenter = function () {
        document.querySelector("#journalText" + j).classList.add("journalShow")

    }

    document.getElementById("journals").appendChild(node);
}

document.getElementById("journalTest").remove()