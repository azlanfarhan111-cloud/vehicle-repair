// index.html
function signUp(event) {
    event.preventDefault()

    let users = JSON.parse(localStorage.getItem("users")) || []

    let fullName = document.getElementById("signup-full-name").value.trim()
    let email = document.getElementById("signup-email").value.trim().toLowerCase()
    let dob = document.getElementById("signup-dob").value
    let password = document.getElementById("signup-password").value
    let confirmPassword = document.getElementById("signup-confirm-password").value

    if (fullName === "") {
        alert("Please enter your name")
        return
    }

    if (email === "") {
        alert("Please enter your email address")
        return
    }

    if (dob === "") {
        alert("Please enter your Date of Birth")
        return
    }

    if (password === "") {
        alert("Please enter your password")
        return
    }

    if (confirmPassword !== password) {
        alert("Passwords do not match")
        return
    }

    let alreadyRegistered = users.find(newUser => newUser.email === email)

    if (alreadyRegistered) {
        alert("User already registered")
        return
    }

    let newUser = {
        fullName,
        email,
        dob,
        password
    }

    users.push(newUser)

    localStorage.setItem("users", JSON.stringify(users))
    window.location.href = "pages/signup-success.html"
}

function login() {
    let users = JSON.parse(localStorage.getItem("users")) || []

    let emailValue = document.getElementById("login-email").value.trim().toLowerCase()
    let passwordValue = document.getElementById("login-password").value

    let user = users.find(newUser => newUser.email === emailValue && newUser.password === passwordValue)

    if (emailValue === "" || passwordValue === "") {
        alert("Please enter your email and password")
        return
    } else if (!user) {
        alert("Invalid email or password")
        return
    }

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user))
        alert("Login successful")
        window.location.href = "pages/dashboard.html"
    }

}


// add-repair.html
let customerName = document.getElementById("customer-name")
let phoneNumber = document.getElementById("phone-number")
let vehicleModel = document.getElementById("vehicle-model")
let registrationNumber = document.getElementById("registration-number")
let repairType = document.getElementById("repair-type")
let repairCost = document.getElementById("repair-cost")
let repairStatus = document.getElementById("repair-status")
let serviceNotes = document.getElementById("service-notes")

let repairRecords = JSON.parse(localStorage.getItem("repairRecords")) || []

let editId = null

displayRepairs()
displayDashboardRepairs()

function addRepairRecord() {
    let newRepair = {
        id: Date.now(),
        customerName: customerName.value.trim(),
        phoneNumber: phoneNumber.value.trim(),
        vehicleModel: vehicleModel.value.trim(),
        registrationNumber: registrationNumber.value.trim(),
        repairType: repairType.value.trim(),
        repairCost: repairCost.value.trim(),
        repairStatus: repairStatus.value.trim(),
        serviceNotes: serviceNotes.value.trim()
    }

    if (newRepair.customerName === "" || newRepair.phoneNumber === "" || newRepair.vehicleModel === "" || newRepair.registrationNumber === "" || newRepair.repairType === "" || newRepair.repairCost === "" || newRepair.repairStatus === "") {
        alert("Please fill all the required fields")
        return
    }

    repairRecords.push(newRepair)

    localStorage.setItem("repairRecords", JSON.stringify(repairRecords))

    alert("Repair record added successfully")

    displayRepairs()
}


// repairs.html
function displayRepairs(records = repairRecords) {
    let repairTable = document.getElementById("repair-table")

    if (!repairTable) return

    repairTable.innerHTML = ""

    if (records.length === 0) {
        repairTable.innerHTML = `
        <tr>
            <td colspan="7" class="noData">
                No Repair Records Found
            </td>
        </tr>
        `;
        return
    }

    records.forEach((repair) => {
        repairTable.innerHTML += `
            <tr>
                <td><b>${repair.customerName}</b></td>
                <td>${repair.vehicleModel}</td>
                <td><code>${repair.registrationNumber}</code></td>
                <td>${repair.repairType}</td>
                <td><b>Rs ${repair.repairCost}</b></td>
                <td><span class="status ${repair.repairStatus.toLowerCase().replace(" ", "-")}">${repair.repairStatus}</span></td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editRepair(${repair.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteRepair(${repair.id})">Delete</button>
                </td>
            </tr>
        `
    })
}

function displayDashboardRepairs() {
    let dashboardTable = document.getElementById("dashboard-repair-table")

    if (!dashboardTable) return

    dashboardTable.innerHTML = ""

    let recentRepairs = repairRecords.slice(-3).reverse()

    if (recentRepairs.length === 0) {
        dashboardTable.innerHTML = `
            <tr>
                <td colspan="7" class="noData">No Repair Records Found</td>
            </tr>
        `
        return
    }

    recentRepairs.forEach((repair) => {
        let statusClass = repair.repairStatus.toLowerCase().replace(" ", "-")

        dashboardTable.innerHTML += `
            <tr>
                <td><b>${repair.customerName}</b></td>
                <td>${repair.vehicleModel}</td>
                <td><code>${repair.registrationNumber}</code></td>
                <td>${repair.repairType}</td>
                <td><b>Rs ${repair.repairCost}</b></td>
                <td><span class="status ${statusClass}">${repair.repairStatus}</span></td>
                <td><a class="row-action" href="repairs.html">View</a></td>
            </tr>
        `
    })
}

function deleteRepair(id) {
    let confirmation = confirm("Are you sure you want to delete this repair record?")
    if (!confirmation) {
        return
    }

    repairRecords = repairRecords.filter(record => record.id !== id)

    localStorage.setItem("repairRecords", JSON.stringify(repairRecords))

    displayRepairs()

    alert("Repair record deleted successfully")
}


// edit-repair.html
function editRepair(id) {
    localStorage.setItem("editId", id)
    window.location.href = "edit-repair.html"
}

function loadEditRepair() {
    editId = Number(localStorage.getItem("editId"))
    let repair = repairRecords.find(record => record.id === editId)

    if (!repair) {
        alert("Repair record not found")
        window.location.href = "repairs.html"
        return
    }

    customerName.value = repair.customerName
    phoneNumber.value = repair.phoneNumber
    vehicleModel.value = repair.vehicleModel
    registrationNumber.value = repair.registrationNumber
    repairType.value = repair.repairType
    repairCost.value = repair.repairCost
    repairStatus.value = repair.repairStatus
    serviceNotes.value = repair.serviceNotes
}

function updateRepairRecord(event) {
    event.preventDefault()

    let repair = repairRecords.find((record) => {
        record.id === editId
    })

    if (!repair) {
        alert("Repair record not found")
        window.location.href = "repairs.html"
        return
    }

    repair.customerName = customerName.value.trim()
    repair.phoneNumber = phoneNumber.value.trim()
    repair.vehicleModel = vehicleModel.value.trim()
    repair.registrationNumber = registrationNumber.value.trim()
    repair.repairType = repairType.value
    repair.repairCost = repairCost.value
    repair.repairStatus = repairStatus.value
    repair.serviceNotes = serviceNotes.value.trim()

    localStorage.setItem("repairRecords", JSON.stringify(repairRecords))
    localStorage.removeItem("editId")
    window.location.href = "repairs.html"
}

if (location.pathname.includes("edit-repair.html")) {
    loadEditRepair()
}



// light/dark
function blackBg() {
    if (document.body.style.backgroundColor === "black") {
        document.body.style.backgroundColor = "white"
        localStorage.setItem("theme", "light")
    } else {
        document.body.style.backgroundColor = "black"
        localStorage.setItem("theme", "dark")
    }
}

if (localStorage.getItem("theme") == "dark") {
    document.body.style.backgroundColor = "black"
    document.getElementById("theme-toggle").checked = true
}

// search and sorting
function showRepairs() {
    let search = document.getElementById("search-input").value.toLowerCase()
    let status = document.getElementById("status-filter").value
    let sort = document.getElementById("sort-by").value

    let records = repairRecords.filter(repair =>
        repair.customerName.toLowerCase().includes(search) ||
        repair.vehicleModel.toLowerCase().includes(search) ||
        repair.registrationNumber.toLowerCase().includes(search)
    )

    if (status !== "all") {
        records = records.filter(repair => repair.repairStatus === status)
    }

    if (sort === "customer") {
        records.sort((a, b) => a.customerName.localeCompare(b.customerName))
    }

    if (sort === "vehicle") {
        records.sort((a, b) => a.vehicleModel.localeCompare(b.vehicleModel))
    }

    if (sort === "high-cost") {
        records.sort((a, b) => b.repairCost - a.repairCost)
    }

    if (sort === "low-cost") {
        records.sort((a, b) => a.repairCost - b.repairCost)
    }

    displayRepairs(records)
}
