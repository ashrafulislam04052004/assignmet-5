// API URL
const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let allIssues = [];


async function loadIssues() {
    showLoading(true);
    let res = await fetch(api);
    allIssues = (await res.json()).data;
    displayIssues(allIssues.slice(0, 20));
    document.getElementById("issueCount").innerText = allIssues.length + " Issues";
    showLoading(false);
}
loadIssues();

function displayIssues(issues) {
    let container = document.getElementById("issuesContainer");
    container.innerHTML = "";
    issues.forEach(issue => {
        let card = document.createElement("div");
        card.className = `card ${issue.status}`;
        card.innerHTML = `
            <div class="card-header">
                <span class="status-icon"></span>
                <span class="priority ${issue.priority.toLowerCase()}">${issue.priority}</span>
            </div>
            <h3 class="title">${issue.title}</h3>
            <p class="desc">${issue.description}</p>
            <div class="labels">
                <span class="bug">${issue.category || "BUG"}</span>
                <span class="help">${issue.label || "HELP WANTED"}</span>
            </div>
            <div class="card-footer">
                <span>#${issue.id} by ${issue.author}</span>
                <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>`;
        card.onclick = () => openModal(issue.id);
        container.appendChild(card);
    });
}


async function openModal(id) {
    let res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    let issue = (await res.json()).data;
    let modal = document.getElementById("modal");
    modal.style.display = "block";
    document.getElementById("modalBody").innerHTML = `
        <h2 class="modal-title">${issue.title}</h2>
        <div class="modal-meta">
            <span class="status ${issue.status}">${issue.status}</span>
            <span>Opened by ${issue.author}</span>
            <span>${issue.createdAt}</span>
        </div>
        <div class="modal-labels">
            <span class="bug">${issue.category || "BUG"}</span>
            <span class="help">${issue.label || "HELP WANTED"}</span>
        </div>
        <p class="modal-desc">${issue.description}</p>
        <div class="modal-bottom">
            <div><p>Assignee:</p><b>${issue.author}</b></div>
            <div><p>Priority:</p><span class="priority ${issue.priority.toLowerCase()}">${issue.priority}</span></div>
        </div>
        <button class="close-btn" onclick="closeModal()">Close</button>`;
}


function closeModal() {
    document.getElementById("modal").style.display = "none";
}


function showLoading(show) {
    document.getElementById("loading").style.display = show ? "block" : "none";
}

// Filter Issues
function filterIssues(status){

let filtered = allIssues.filter(issue => issue.status === status);

displayIssues(filtered);

document.getElementById("issueCount").innerText =
filtered.length + " " + status + " Issues";

}


// Search Issues
async function searchIssues(){

let text = document.getElementById("searchInput").value;

let res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);

let data = await res.json();

displayIssues(data.data);

}


// Active Button
function setActive(buttonId){

document.getElementById("allBtn").classList.remove("active");
document.getElementById("openBtn").classList.remove("active");
document.getElementById("closedBtn").classList.remove("active");

document.getElementById(buttonId).classList.add("active");

}