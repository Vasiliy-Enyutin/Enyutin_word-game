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

const associationsDictionary = 
{
    "Тарелка": "Посуда",
    "Корабль": "Море",
    "Школа": "Урок",
    "Подсолнух": "Жёлтый",
    "Овощ": "Морковка"
};

const antonymsDictionary = 
{
    "Мир": "Война",
    "Тепло": "Холодно",
    "Свет": "Тьма",
    "Громкий": "Тихий",
    "Мало": "Много"
};

var currentGameStep = 0;    // какая по счёту сейчас игра заупщена (0, 1 или 2)
var gameOrderArray = [];    // случайный порядок цифр 0-2, чтобы игра рандомилась
var currentGameDictionary = [];     // текущий словарь слов (зависит от игры)
var spawnedPhrases = [];    // созданные фразы
var containerGui;   // хранятся кнопки
var dynamicZoneElement;     // игровая зона
var firstClickedPhrase;     // первая нажатая фраза
var secondClickedPhrase;    // вторая нажатая фраза
var globalPointsContainer;           // контейнер для общего количества очков
var pointsCounterContainer;          // контейнер для счётчика очков
var gameTaskContainer;               // контейнер для хранения задания
var globalUserPoints;     // сумма очков пользователя за всё время
var currentUserPoints;  // текущее количество очков пользователя за одну игру
var pointsIncreaser = 100;  // прирост/уменьшение очков за правильный/неправильный ответ

function checkName()
{
    if(document.getElementById("username").value != "")
        document.location.href = "phrases.html";
}

function configure() 
{
    gameOrderArray = generateArrayRandomNumbers(0, 2);
    dynamicZoneElement = document.getElementById("dynamicZone");
    containerGui = document.getElementById("containerGUI")
    globalPointsContainer = document.getElementById("globalPointsContainer")
    pointsCounterContainer = document.getElementById("pointsCounterContainer")
    gameTaskContainer = document.getElementById("gameTaskContainer")
    createGlobalPoints();
    createPointsCounter();
    createGameTask();
    startGame();
}

function login()
{
    
}

function startGame()
{
    console.log(localStorage.getItem('globalUserPoints'));
    if (localStorage.getItem('globalUserPoints') != null)
        globalUserPoints = +localStorage.getItem('globalUserPoints')
    else
        globalUserPoints = 0;
    updateGlobalPoints();
    currentGameDictionary = chooseGameDictionary();
    spawnPhrases(currentGameDictionary);
    updateGameTask();
    currentUserPoints = 0;
    updatePointsCounter();
}

function chooseGameDictionary()
{
    if (gameOrderArray[currentGameStep] == 0)
        return synonymsDictionary;
    else if (gameOrderArray[currentGameStep] == 1)
        return associationsDictionary;
    else if (gameOrderArray[currentGameStep] == 2)
        return antonymsDictionary;

    return 0;
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
    if (firstPhraseText in currentGameDictionary && currentGameDictionary[firstPhraseText] == secondPhraseText)
    {
        matched = true;
    }
    else if (secondPhraseText in currentGameDictionary && currentGameDictionary[secondPhraseText] == firstPhraseText)
    {
        matched = true;
    }

    if (matched == true)
    {
        currentUserPoints += pointsIncreaser;
        updatePointsCounter();
        deleteMatchedPhrases();
    }
    else
    {
        currentUserPoints -= pointsIncreaser;
        updatePointsCounter();
        clearClickedPhrases();
    }
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

    clearClickedPhrases();

    if (spawnedPhrases.length == 0)
    {
        globalUserPoints += currentUserPoints;
        localStorage.setItem('globalUserPoints', globalUserPoints)
        currentGameStep++;
        startGame();
    }
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

function createGlobalPoints()
{
    text = document.createTextNode("Общее количество очков: " + globalUserPoints);
    globalPointsContainer.appendChild(text);
}

function updateGlobalPoints()
{
    globalPointsContainer.innerText = "Общее количество очков: " + globalUserPoints;
}

function createPointsCounter() 
{
    text = document.createTextNode("Очки: " + currentUserPoints);
    pointsCounterContainer.appendChild(text);
}

function updatePointsCounter()
{
    pointsCounterContainer.innerText = "Очки: " + currentUserPoints;
}

function createGameTask()
{
    text = document.createTextNode("Задание: ");
    gameTaskContainer.appendChild(text);
}

function updateGameTask()
{
    if (gameOrderArray[currentGameStep] == 0)
        gameTaskContainer.innerText = "Задание: выбрать синонимы"
    if (gameOrderArray[currentGameStep] == 1)
        gameTaskContainer.innerText = "Задание: выбрать ассоциации"
    if (gameOrderArray[currentGameStep] == 2)
        gameTaskContainer.innerText = "Задание: выбрать антонимы"
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