const message_player = document.querySelector('.guess-message-player');
const message_bot = document.querySelector('.guess-message-bot');
const input = document.querySelector('.guess');
const submit = document.querySelector('.guess-btn');
const restart = document.querySelector('.restart');
const guessList_player = document.querySelector('.guessList-player');
const guessList_bot = document.querySelector('.guessList-bot');
const modal = document.querySelector('.modal');
const result = document.querySelector('.result');

let noGuesses = 0;
let isPlayersTurn = true;
let number = start();
console.log(number)
let prevGuesses_player = [];
let prevGuesses_bot = [];
let lower_limit = 0;
let upper_limit = 0;

const computerGuess = () => {
    let guess_bot = Math.floor(Math.random()*(101-lower_limit-upper_limit))+lower_limit;
    return guess_bot
}

function start() {
    let number = Math.floor(Math.random()*101);
    return number
}

const addGuess = (currentGuess) => {
    if(isPlayersTurn){
        prevGuesses_player.push(currentGuess);
        guessList_player.innerText += ` ${currentGuess}`;
    } else {
        prevGuesses_bot.push(currentGuess);
        guessList_bot.innerText += ` ${currentGuess}`;
    }
}

const switchTurns = () => {
    if(isPlayersTurn) {
        isPlayersTurn = false
    } else {
        isPlayersTurn = true;
    }
}

const correct = (winner) => {
    modal.showModal();
    result.innerText = `${winner} wins! The correct number was ${number}!`
}

const play = () =>{
    noGuesses++;
    let guess_player = input.value;
    input.value = ''

    let play_player = checkGuess(guess_player); //Returns 'tooHigh' or 'tooLow'
    if(play_player === true) return; // To prevent bot from winning when guessing the same
    addGuess(guess_player);
    limits(play_player, guess_player);
    switchTurns();

    let bot_guess = computerGuess()
    let play_bot = checkGuess(bot_guess); //
    addGuess(bot_guess);
    limits(play_bot, bot_guess);
    switchTurns();

    input.focus();
    input.select();
    if(noGuesses == 5){
        OutOfGuesses();
    }
}

const limits = (feedback, guess) => {
    if(feedback == 'tooLow'){
        lower_limit = Number(guess) + 1;
        console.log('The lower limit is now: ' + lower_limit)
        return
    } else if(feedback == 'tooHigh'){
        if(noGuesses == 1){
            upper_limit = 101 - Number(guess);
            console.log('upper limit: ' + (101- upper_limit));
            return
        } else if((upper_limit) > (101 - Number(guess))){
            console.log('upper limit is still: ' + (101- upper_limit));
            return
        } else {
            upper_limit = 101 - Number(guess);
            console.log('upper limit: ' + (101- upper_limit));
            return
        }
    }
}

const checkGuess = (guess) => {
    if(isPlayersTurn){
        if(guess < number){
            message_player.innerText = 'Too low!'
            return 'tooLow';
        } else if(guess > number){
            message_player.innerText = 'Too High!'
            return 'tooHigh';
        } else if (guess == number){
            correct("Player");
            return true;
        }
    }
    if(!isPlayersTurn){
        if(guess < number){
            message_bot.innerText = 'Too low!'
            return 'tooLow';
        } else if(guess > number){
            message_bot.innerText = 'Too High!'
            return 'tooHigh';
        } else if (guess == number){
            correct("Bot");
            return true;
        }
    }
}

const OutOfGuesses = () => {
        modal.showModal();
        result.innerText = `Game over, the correct number was ${number}!`
}

const reset = () => {
    modal.close();
    noGuesses = 0;
    message_bot.innerText = 'Guess a number between 0-100';
    message_player.innerText = 'Guess a number between 0-100';
    number = start();
    console.log(number);
    guessList_bot.innerText = '';
    guessList_player.innerText = '';
}

const send = (e) => {
    if(e.keyCode == 13){
        play();
    }
}

submit.addEventListener('click', play)
restart.addEventListener('click', reset)
input.addEventListener('keydown', send)
