// API URL
const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
let allIssues = [];

// লোড ইস্যু
async function loadIssues() {
    showLoading(true);
    let res = await fetch(api);
    allIssues = (await res.json()).data;
    displayIssues(allIssues.slice(0, 20));
    document.getElementById("issueCount").innerText = allIssues.length + " Issues";
    showLoading(false);
}
loadIssues();

// কার্ড প্রদর্শন
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

// মডাল খোলা
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

// মডাল বন্ধ
function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// লোডিং দেখানো/লুকানো
function showLoading(show) {
    document.getElementById("loading").style.display = show ? "block" : "none";
}