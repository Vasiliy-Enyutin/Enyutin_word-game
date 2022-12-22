const clickedColor = "#f6bf6d";
const unclickedColor = "white";
const synonymsDictionary = 
{
    "Светило": "Солнце",
    "Лицо": "Морда",
    "Супруга": "Жена",
    "Ходить": "Слоняться",
    "Выговор": "Порицание"
};

var containerGui;
var dynamicZoneElement;
var spawnedPhrases = [];
var firstClickedPhrase;
var secondClickedPhrase;
var pointsCounter;
var currentUserPoints = 0;
var pointsIncreaser = 100;

function configure() 
{
    dynamicZoneElement = document.getElementById("dynamicZone");
    containerGui = document.getElementById("containerGUI")
    pointsCounter = document.getElementById("pointsCounter")
    spawnPhrases(synonymsDictionary);
    createPointsCounter();
}

function onPhraseClick(phraseElement) 
{
    let clickedPhrase = spawnedPhrases.find(phrase => phrase.element == phraseElement);
    clickedPhrase.changeColor(clickedColor);
    if (firstClickedPhrase == null)
    {
        firstClickedPhrase = clickedPhrase;
    }
    else
    {
        secondClickedPhrase = clickedPhrase;
        compareClickedPhrases();
    }
}

function spawnPhrases(dictionary) // принимает массив со словами из-за разных игр
{
    let positionTop = 0;
    let positionTopIncreaser = 8;
    for (let i = 0; i < Object.keys(dictionary).length * 2; i++)
    {
        let phraseElement = getPhraseElement(positionTop);
        let phrase = new Phrase(phraseElement);
        spawnedPhrases.push(phrase);
        dynamicZoneElement.appendChild(phraseElement);
        positionTop += positionTopIncreaser;
    }

    let counter = 0;
    let randomNumbers = generateArrayRandomNumbers(0, spawnedPhrases.length - 1)   // Для выбора рандомной фразы
    for (const [key, value] of Object.entries(dictionary))  // Устанавливаю текст фразы
    {
        spawnedPhrases[randomNumbers[counter++]].setText(key);
        spawnedPhrases[randomNumbers[counter++]].setText(value);
    }
}

function compareClickedPhrases() 
{
    let firstPhraseText = firstClickedPhrase.element.innerText;
    let secondPhraseText = secondClickedPhrase.element.innerText;
    let matched = false;
    if (firstPhraseText in synonymsDictionary && synonymsDictionary[firstPhraseText] == secondPhraseText)
    {
        matched = true;
    }
    else if (secondPhraseText in synonymsDictionary && synonymsDictionary[secondPhraseText] == firstPhraseText)
    {
        matched = true;
    }

    if (matched == true)
    {
        deleteMatchedPhrases();
        currentUserPoints += pointsIncreaser;
    }
    else
    {
        currentUserPoints -= pointsIncreaser;
    }

    updatePointsCounter();
    clearClickedPhrases();
}

function deleteMatchedPhrases()
{
    // Удаление совпадающих фраз из spawnedPhrases
    let index = spawnedPhrases.indexOf(firstClickedPhrase);
    spawnedPhrases.splice(index, 1);
    index = spawnedPhrases.indexOf(secondClickedPhrase);
    spawnedPhrases.splice(index, 1);

    // Удаление div элемента фраз (заметно пользователю)
    spawnedPhrases.find(phrase => phrase.element == firstClickedPhrase);
    firstClickedPhrase.element.remove();
    secondClickedPhrase.element.remove();
}

function clearClickedPhrases()
{
    firstClickedPhrase.changeColor(unclickedColor);
    secondClickedPhrase.changeColor(unclickedColor);
    firstClickedPhrase = null;
    secondClickedPhrase = null;
}

function getPhraseElement(positionTop) 
{
    let phraseElement = document.createElement("div");
    phraseElement.setAttribute("class", "phrase");
    phraseElement.style.top = `${positionTop}%`;
    phraseElement.style.left = `${Math.random() * 85}%`;
    phraseElement.style.backgroundColor = unclickedColor;
    phraseElement.setAttribute("onClick", "onPhraseClick(this)");
    return phraseElement;
}

class Phrase 
{
    constructor(element) 
    {
        this.element = element;
    }

    changeColor(newColor) 
    {
        this.element.style.backgroundColor = newColor;
    }

    setText(newContent) 
    {
        this.element.innerText = newContent;
    }
}

function createPointsCounter() 
{
    text = document.createTextNode("Points: " + currentUserPoints);
    pointsCounter.appendChild(text);
}

function updatePointsCounter()
{
    pointsCounter.innerText = "Points: " + currentUserPoints;
}

// function hidePointsCounter() 
// {
//     this.pointsCounterText.visible = false;
// }

// function hideTimer() 
// {
//     this.timerText.visible = false;
// }

// function isTimerEnded() 
// {
//     return this.totalTime - this.elapsedTime <= 0;
// }

// Генерация случайного неповторяющегося числа
function generateArrayRandomNumbers(min, max)
{
    var totalNumbers        = max - min + 1,
        arrayTotalNumbers   = [],
        arrayRandomNumbers  = [],
        tempRandomNumber;
    while (totalNumbers--) {
        arrayTotalNumbers.push(totalNumbers + min);
    }
    
    while (arrayTotalNumbers.length) {
        tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
        arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
        arrayTotalNumbers.splice(tempRandomNumber, 1);
    }
    return arrayRandomNumbers;
}