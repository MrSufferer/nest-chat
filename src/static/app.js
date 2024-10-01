/* eslint-disable prettier/prettier */

const socket = io('http://localhost:3000');
const msgBox = document.getElementById('inputMessage');
const msgCon = document.getElementById('messages-container');
const username = document.getElementById('inputUsername');
const sendBtn = document.getElementById('buttonMessage');

const messages = [];
function getMessages() {
    fetch('http://localhost:3000/api/chat').then((response) => response.json()).then((data) => {
        loadData(data);
        data.forEach((el) => messages.push(el));
    }).catch((error) => console.error(error));
}

getMessages();

// global send event function to prevent duplicated codes
function sendEvent(username, e) {
    sendMessage({ username: username.value, text: e.target.value });
    e.target.value = '';
}

// send message when user press enter
msgBox.addEventListener('keydown', e => {
    if (e.keyCode !== 13) return;
    sendEvent(username, e);
})

// send message when user press button
sendBtn.addEventListener('click', e => {
    sendMessage({ username: username.value, text: msgBox.value });
})

// display messages
function loadData(data) {
    let messages = '';
    data.map(message => {
        messages += `<li class="bg-success p-2 rounded mb-2 text-light">
            <span class="fw-bolder">${message.username}</span>
            ${message.text}
        </li>`
    });
    msgCon.innerHTML = messages;
}

// for socket.io - emit sendMessage event
function sendMessage(message) {
    socket.emit('sendMessage', message);
}

// listen to recMessageEvent
socket.on('recMessage', (message) => {
    messages.push(message);
    loadData(messages);
})