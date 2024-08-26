import Groq from "groq-sdk";
import { journalData } from "./globals";
const groq = new Groq({ apiKey: "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", dangerouslyAllowBrowser: true });

var highestScore = 0;
var highestIndex = 0;

setTimeout(() => {
    document.getElementById("prompt").classList.add("promptShow")
    gradeJournals()
    groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Generate a prompt to journal about. stuff like gratiude or just how im feeling in general. just give me the prompt nothing else. make it intetesting. keep it to 1 sentence"
            },
        ],
        model: "llama-3.1-70b-versatile",
    }).then((e) => {
        document.getElementById("prompt").getElementsByTagName("p")[0].innerHTML += e.choices[0].message.content
    })

}, 10)

function gradeJournals() {

    

    for (let i = 0; i < journalData.length; i++) {
        var evaluation = groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Give my journal a score from 1 - 100 based on clarity, emotion, and everything else about mental health. Give me just a number from 1 to zero nothing else, nothing else. JUST A NUMBER dont say anything. if u cant give a score, give it a zero nothing else${journalData[i].text}`,
                },
            ],
            model: "llama-3.1-70b-versatile",
        }).then((e) => {
            if (highestScore < Number(e.choices[0].message.content)) {
                highestScore = Number(e.choices[0].message.content);
                highestIndex = i;
            }

        });
    }

    var text = journalData[highestIndex].text.split(" ");


    for (let i = 0; i < text.length; i++) {

        if (i < 25) {
            document.getElementsByClassName("data")[0].innerHTML += text[i] + (i < 24 ? " " : "")
        } else {
            document.getElementsByClassName("data")[0].innerHTML += "..."
            break
        }
    }
}

