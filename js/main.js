const api = "https://phi-lab-server.vercel.app/api/v1/lab/issues"

let allIssues = []

async function loadIssues(){

showLoading(true)

let res = await fetch(api)
let data = await res.json()

allIssues = data.data

displayIssues(allIssues)

document.getElementById("issueCount").innerText = allIssues.length + " Issues"

showLoading(false)

}

loadIssues()

function displayIssues(issues){

let container = document.getElementById("issuesContainer")

container.innerHTML = ""

issues.forEach(issue => {

let card = document.createElement("div")

card.classList.add("card")

if(issue.status === "open"){
card.classList.add("open")
}else{
card.classList.add("closed")
}

card.innerHTML = `
<h3>${issue.title}</h3>
<p>${issue.description}</p>
<p><b>Status:</b> ${issue.status}</p>
<p><b>Category:</b> ${issue.category}</p>
<p><b>Author:</b> ${issue.author}</p>
<p><b>Priority:</b> ${issue.priority}</p>
<p><b>Label:</b> ${issue.label}</p>
<p>${issue.createdAt}</p>
`

card.onclick = () => openModal(issue.id)

container.appendChild(card)

})

}

function filterIssues(status){

let filtered = allIssues.filter(issue => issue.status === status)

displayIssues(filtered)

}

async function openModal(id){

let res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
let data = await res.json()

let issue = data.data

document.getElementById("modal").style.display = "block"

document.getElementById("modalBody").innerHTML = `
<h2>${issue.title}</h2>
<p>${issue.description}</p>
<p>Status: ${issue.status}</p>
<p>Category: ${issue.category}</p>
<p>Author: ${issue.author}</p>
<p>Priority: ${issue.priority}</p>
<p>Label: ${issue.label}</p>
<p>${issue.createdAt}</p>
`

}

function closeModal(){
document.getElementById("modal").style.display = "none"
}

async function searchIssues(){

let text = document.getElementById("searchInput").value

let res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
let data = await res.json()

displayIssues(data.data)

}

function showLoading(show){

let loading = document.getElementById("loading")

loading.style.display = show ? "block" : "none"

}

function setActive(buttonId){

document.getElementById("allBtn").classList.remove("active");
document.getElementById("openBtn").classList.remove("active");
document.getElementById("closedBtn").classList.remove("active");

document.getElementById(buttonId).classList.add("active");

}