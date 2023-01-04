document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Submit handler
  document.querySelector("#compose-form").addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Get the emails for that mailbox and user
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    //Loop email
    emails.forEach(email => {

      console.log(email);

      //Create div for each email
      const newEmail = document.createElement('div');
      newEmail.innerHTML = `
        <h6>Sender: ${email.sender}</h6>
        <h5>Subject: ${email.subject}</h5>
        <p>${email.timestamp}</p>
      `;
      newEmail.addEventListener('click', function() {
        console.log('This email has been clicked!')
      });
      document.querySelector('#emails-view').append(newEmail);
    });
  });
}

function send_email(event){
  event.preventDefault();

  //Store fields
  const recipients =document.querySelector('#compose-recipients').value;
  const subject =document.querySelector('#compose-subject').value;
  const body =document.querySelector('#compose-body').value;

  //Send data to back
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body,
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result)
    load_mailbox('sent');
  });
}