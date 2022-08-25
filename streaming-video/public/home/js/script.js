const socket = io();

const buttonJoin = document.getElementById('button-join');
const buttonCoin = document.getElementById('button-create');

const userName = document.getElementById('name');
const roomName = document.getElementById('nameRoom');

function createRoom(usertype) {
  if (usertype === 'admin')
    fetch('/login', {
      method: 'post',
      body: JSON.stringify({
        room: userName.value.trim(),
        usertype,
        username: roomName.value.trim(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => console.log(err));
}

buttonJoin.addEventListener('click', e => {
  e.preventDefault();
  createRoom('member');
});
