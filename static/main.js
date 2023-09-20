// Define the PICO-8 color palette
const color_palette = [
    '#B8B8D1',
    '#5B5F97',
    '#FFC145',
];

// Function to generate a random color from the PICO-8 palette
function getRandomColor() {
    const randomColorIndex = Math.floor(Math.random() * color_palette.length);
    return color_palette[randomColorIndex];
}

// Function to send a message
function sendMessage() {
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');
    const messageList = document.getElementById('messageList');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name !== '' && message !== '') {
        fetch('/sendMessage', {
            method: 'POST',
            body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.text(); // Change to text() to read the response as plain text
                } else {
                    throw new Error('Failed to send message.');
                }
            })
            .then(data => {
                nameInput.value = '';
                messageInput.value = '';

                // Create a new message element with a random color and add it to the list
                const listItem = createMessageElement(name, message);
                messageList.appendChild(listItem);
            })
            .catch(error => console.error(error));
    }
}

// Add an event listener for the "keydown" event on the message input
document.getElementById('messageInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent line break
        sendMessage();
    }
});

// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const messageList = document.getElementById('messageList');

    // Check if messageList element exists before proceeding
    if (messageList) {
        const existingMessages = messageList.querySelectorAll('li');

        // Apply styles to each existing list item
        existingMessages.forEach(element => {
            const rawJson = element.textContent;

            try {
                // Parse the raw JSON into an object
                const data = JSON.parse(rawJson);

                // Check if the data has 'name' and 'message' properties
                if (data && data.name && data.message) {
                    // Format the data as 'name: message'
                    const formattedMessage = `${data.name}: ${data.message}`;

                    // Apply a random background color from the PICO-8 palette
                    element.style.backgroundColor = getRandomColor();

                    // Set the list item text content to the formatted message
                    element.textContent = formattedMessage;

                    // Apply additional styles if needed
                    element.style.fontFamily = "Press Start 2P, Arial, sans-serif";
                    element.style.color = '#fff';
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });
    } else {
        console.error('messageList element not found.');
    }
});

// Function to create a message element with a random color
function createMessageElement(name, message) {
    const listItem = document.createElement('li');
    listItem.textContent = `${name}: ${message}`;

    // Assign a random background color from the PICO-8 palette
    listItem.style.backgroundColor = getRandomColor();

    // Apply "Press Start 2P" font and white text color
    listItem.style.fontFamily = "Press Start 2P, Arial, sans-serif";
    listItem.style.color = '#fff';

    return listItem;
}
