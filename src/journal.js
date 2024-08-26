import Groq from "groq-sdk";
let journalData = {
    journal: [
    {
        text: "wdwdwdw <br><hr><div id=\"reflect\"><h4>Reflection:<button id=\"reflectButton\">press-here-to-auto-generate</button></h4></div><br>",
        name: "Journal 1",
        reflection: "",
        prompt: "",
        score: 0
    },
    {
        text: "hello world <br><hr> <div id=\"reflect\"><h4>Reflection:<button id=\"reflectButton\">press-here-to-auto-generate</button></h4></div><br>",
        name: "Journal 2",
        reflection: "",
        prompt: "sdadasdasdad",
        score: 0

    }
    ],
    
    "moods": []
};
let currentIndex = 0;

const initialContent = document.getElementById('journal').innerHTML;

function isEmptyOrWhitespace(str) {
    return str.trim().length === 0;
}

function getData() {

    if (!localStorage.getItem("journal")) {
        localStorage.setItem("journal", JSON.stringify(journalData));
        console.log("Wraklsfjklsjf")

    }

    var element = document.getElementById("journal");

    element.innerHTML = initialContent


    journalData = JSON.parse(localStorage.getItem("journal"));

    resetData();
}


function resetData() {
    var element = document.getElementById("journal");
    var textString = element.innerHTML

    element.innerHTML = initialContent;

    textString = textString.replace(
        `<h4 id="journalTitle">${element.childNodes[1].innerHTML}</h4>\n`,
        ""
    )

    textString = textString.replace(
        `<h4 id="journalPrompt">${element.childNodes[3].innerHTML}</h4><hr>`,
        ""
    )

    element.childNodes[1].innerHTML = `title: ${journalData.journal[currentIndex].name}`


    element.childNodes[3].innerHTML = `prompt: ${journalData.journal[currentIndex].prompt}<hr>`
   // element.childNodes[4].innerHTML = element.innerHTML.replace(textString, "")

    element.innerHTML += `${journalData.journal[currentIndex].text} `

    document.getElementById("reflectButton").onclick = async function () {
        await getGroqChatCompletion().then(content => {
            var result = content.choices[0].message.content
            result = result.replaceAll("\n", "<br>")
            resultArray = result.split(" ");
            for (let i = 0; i < resultArray.length; i++) {
                setTimeout(() => {
                    element.innerHTML += resultArray[i] + " "
                    if (i == resultArray.length - 1) {
                        element.innerHTML += "<br>"
                    }
                }, 50 * i)
            }
        })
    
    }
    
}

getData();



const groq = new Groq({ apiKey: "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", dangerouslyAllowBrowser: true });
var currentPage = 0

async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Reflect on my journal, keep it sweet and short and give ways to improve ${journalData.journal[currentIndex].text}. heres my prompt ${journalData.journal[currentIndex].prompt}. You're not in an active chat. Only provide advice, summarize, and point out key important details. Be empathetic and sympathetic.`,
            },
        ],
        model: "llama-3.1-70b-versatile",
    });


}




var resultArray = []
//result = result.replaceAll(/\*\*/g, "<br>")
//result = result.replaceAll(/\*/g, "<h1>")
/*
document.getElementById("reflectButton").onclick = async function () {
    document.getElementById("reflection").classList.add("show");

    const chatCompletion = await getGroqChatCompletion();
    // Print the completion returned by the LLM.
    var result = chatCompletion.choices[0].message.content

 
 
    document.getElementById("reflection").classList.add("show");
    document.getElementById("reflection").innerHTML = result

    result = result.replaceAll("\n", "<br>")
    resultArray = result.split(" ");
    document.getElementById("reflectionParagraph").innerHTML = "";
    for (let i = 0; i < resultArray.length; i++) {
        setTimeout(() => {
            document.getElementById("reflectionParagraph").innerHTML += resultArray[i] + " "
            if (i == resultArray.length - 1) {
                document.getElementById("reflectionParagraph").innerHTML += "<br>"
            }
        }, 50 * i)

    }

    document.getElementById("reflection").classList.add("show");

}


document.getElementById("reflectExpand").onclick = function () {
    document.getElementById("reflection").classList.add("show");
}


document.getElementById("xButton").onclick = function () {
    document.getElementById("reflection").classList.remove("show");
    document.getElementById("reflection").classList.add("hidden");
    document.getElementById("reflectExpand").classList.remove("hideReflect")
    document.getElementById("reflectExpand").classList.add("showReflect")
}


/*
 
document.getElementById("wdwdwd").addEventListener("onclick", async () => {
    alert("wasdwasd")
    const response = await ollama.chat({
        model: 'llama3.1',
        messages: [{ role: 'user', content: 'Why is the sky blue?' }],
      })
      console.log(response.message.content)
})
      */


setInterval(() => {
    var element = document.getElementById("journal");
    
    var currentJournal = journalData.journal[currentIndex]
    
    if (journalData.journal.length > 0) {



        if (element.childNodes.length > 3) {

            var textString = element.innerHTML
            textString = textString.replace(
                `<h4 id="journalTitle">${element.childNodes[1].innerHTML}</h4>\n`,
                ""
            )
    
            textString = textString.replace(
                `<h4 id="journalPrompt">${element.childNodes[3].innerHTML}</h4>\n`,
                ""
            )

            currentJournal.text = textString;

            currentJournal.name = element.childNodes[1].innerHTML.replace("title:", "")
            currentJournal.prompt = element.childNodes[3].innerHTML.replace("prompt:", "").replace("<hr>", "")
            localStorage.setItem("journal", JSON.stringify(journalData));

            if (isEmptyOrWhitespace(currentJournal.prompt)) {
                element.childNodes[3].innerHTML = "..."
                groq.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: "Generate a prompt to journal about. stuff like gratiude or just how im feeling in general. just give me the prompt nothing else. make it intetesting. keep it to 1 sentence and easy to read. no big words"
                        },
                    ],
                    model: "llama-3.1-70b-versatile",
                    
                }).then((e) => {
                    element.childNodes[3].innerHTML = `prompt: ${e.choices[0].message.content}<hr>`
                })
            }
        } else {
            currentJournal.text = element.innerHTML;
        }

    }    

    //console.log(sharedNumber)
    
}, 1 / 60)
    
document.addEventListener('keydown', function(event) {
    const nonEditableElement = document.getElementById('reflect');
    if (event.target === nonEditableElement) {
        event.preventDefault();
    }
});

// Ensure that mouse events do not change non-editable text
document.addEventListener('mousedown', function(event) {
    const nonEditableElement = document.getElementById('reflect');
    if (event.target === nonEditableElement) {
        event.preventDefault();
    }
});
    

window.addEventListener('message', function(event) {
    // Update iframe content based on message received
    currentIndex = event.data;
    //console.log(currentIndex)

    resetData();
});

