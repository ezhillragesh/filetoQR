// script.js

var file1 = document.getElementById('file1');
document.getElementById('submit').addEventListener("click", function(){getFile(file1)})

function getFile(target) {
    const input = target;
    if ('files' in input && input.files.length > 0) {
        placeFileContent(
            document.getElementById('input_text'),
            input.files[0])
    }
}

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        target.value = content;
    }).catch(error => console.log(error));
}

function readFileContent(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}



function generateQRCodes(user_input) {
    const chunkSize = 1200;
    const inputText = user_input.value;

    // Clear existing QR codes and info message
    document.querySelector("#qr-code").innerHTML = "";
    document.getElementById("info").innerHTML = "";

    // Create a new row container
    let rowContainer = createRowContainer();
    
    let qrCounter = 0; // Counter for QR codes in the current row

    for (let i = 0; i < inputText.length; i += chunkSize) {
        let chunk = inputText.substring(i, i + chunkSize);
        generateQRCode(rowContainer, chunk);
        
        qrCounter++;

        if (qrCounter === 5) {
            // Create a new row container after 5 QR codes
            rowContainer = createRowContainer();
            qrCounter = 0; // Reset the counter
        }
    }

    // Display info message if content exceeds 1200 characters
    if (inputText.length > chunkSize * 5) {
        document.getElementById("info").innerHTML = "Note: Additional QR codes are generated for the remaining content.";
    }
}


function createRowContainer() {
    let rowContainer = document.createElement("div");
    rowContainer.classList.add("row-container");
    document.querySelector("#qr-code").appendChild(rowContainer);
    return rowContainer;
}


function generateQRCode(rowContainer, text) {
    var qrContainer = document.createElement("div");
    qrContainer.classList.add("inline-block", "mx-4");

    var qrcode = new QRCode(qrContainer, {
        text: text,
        width: 180,
        height: 180,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    rowContainer.appendChild(qrContainer);
}


function downloadAll() {
    var qrContainers = document.querySelectorAll("#qr-code > .row-container");

    qrContainers.forEach((rowContainer, rowIndex) => {
        var qrCodes = rowContainer.querySelectorAll("canvas");

        qrCodes.forEach((canvas, colIndex) => {
            var link = document.createElement("a");
            link.setAttribute("download", `qr_code_${rowIndex + 1}_${colIndex + 1}.png`);
            link.href = canvas.toDataURL();
            link.click();
        });
    });
}

let btn = document.querySelector("#button");
btn.addEventListener("click", () => {
    let user_input = document.querySelector("#input_text");
    if (user_input.value !== "") {
        document.querySelector("#qr-code").style = "";
        generateQRCodes(user_input);
    } else {
        document.querySelector("#qr-code").style = "display: none";
        console.log("not valid input");
    }
    let downloadAllBtn = document.getElementById("downloadAll")
    downloadAllBtn.addEventListener("click", downloadAll);
    
});



