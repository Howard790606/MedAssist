// Convenient function for DOM manipulation
const element = id => {
    return document.getElementById(id);
};

// Getting Elements
const status = element("status");
const messages = element("messages");
const textarea = element("textarea");
const username = element("username");
const userid = element("userid");
const clearBtn = element("clear");

userid.focus(); //網頁一打開就先focus在username


// Setting default status
let statusDefault = status.textContent;

const setStatus = s => {
    // Setting status
    status.textContent = s;

    // Resetting status to default every x seconds
    if (s !== statusDefault) {
        setTimeout(() => {
            setStatus(statusDefault);
        }, 2000);
    }
};

// Connecting to socket.io
const socket = io.connect("http://localhost:3000");

// Checking for connection
if (socket !== undefined) {
    console.log("Connected to sockets!");

    const updateList = data => {
        for (let x = 0; x < data.length; x++) {
            // Building out message div
            const message = document.createElement("div");
            message.setAttribute("class", "chat-message");
            message.textContent = data[x].name + ": " + data[x].body + " added by " + data[x].nameid;
            messages.appendChild(message);
            //            messages.insertBefore(message, messages.firstChild)
        }
    };

    const clearList = () => {
        messages.textContent = "";
        username.value = "";
        userid.value = "";
        userid.focus();
    };

    // Handling initialization
    socket.on("init", data => {
        if (data.length && messages.childNodes.length === 0) updateList(data);
    });

    // Handling Output
    socket.on("output", data => {
        if (data.length) updateList(data);
    });

    // Getting Status From Server
    socket.on("status", data => {
        setStatus(typeof data === "object" ? data.message : data);

        // If status is clear, clear text
        if (data.clear) {
            textarea.value = "";
        }
    });

    // Handle Input
    textarea.addEventListener("keydown", event => {
        if (event.which === 13 && event.shiftKey == false) {
            // Emit to server input
            socket.emit("input", {
                name: username.value,
                body: textarea.value,
                nameid: userid.value 
            });

            event.preventDefault();
        }
    });

    // Handle Chat Clear
    clearBtn.addEventListener("click", () => {
        clearList();
        socket.emit("clear");
    });

    // Clear Message
    socket.on("cleared", () => {
        clearList();
    });
}
