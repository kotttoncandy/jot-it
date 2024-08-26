

export let currentIndex = {
    value: 0
};
export var journalData = [
    {
        text: "",
        name: "Journal 1",
        reflection: "",
        score: 0,
    },
    {
        text: "",
        name: "Journal 2",
        reflection: "",
        score: 0

    },
]



export function changeJournalData(data) {
    journalData = data;
}