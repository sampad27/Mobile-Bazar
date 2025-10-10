// // ========================================
// // CONFIGURATION - UPDATE THIS URL
// // ========================================
// const API_URL = 'https://script.google.com/macros/s/AKfycbzBRuHnP5GPLUmZICBV7DG_t0pHvC7HPvs5i8_4VM3MH9enxdPv4T8oqayFDyTX8AE0kg/exec';
// // Example: 'https://script.google.com/macros/s/AKfycbx.../exec'

// // ========================================
// // GLOBAL VARIABLES
// // ========================================
// var currentUser = "";
// var currentUserType = "";
// var mobilesData = [];
// var imeiStockData = [];

// // ========================================
// // API HELPER FUNCTION
// // ========================================
// async function callAPI(action, data = {}) {
//     try {
//         const response = await fetch(API_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: new URLSearchParams({
//                 action: action,
//                 data: JSON.stringify(data)
//             })
//         });
        
//         const result = await response.json();
        
//         if (result.error) {
//             throw new Error(result.error);
//         }
        
//         return result.data;
//     } catch (error) {
//         console.error('API Error:', error);
//         throw error;
//     }
// }

// // ========================================
// // TIME DISPLAY
// // ========================================
// function updateTime() {
//     const now = new Date();
//     document.getElementById("currentTime").textContent = now.toLocaleString();
// }
// setInterval(updateTime, 1000);
// updateTime();

// // ========================================
// // PAGE LOAD INITIALIZATION
// // ========================================
// document.addEventListener("DOMContentLoaded", async function () {
//     // Set today's date
//     var today = new Date();
//     var yyyy = today.getFullYear();
//     var mm = String(today.getMonth() + 1).padStart(2, "0");
//     var dd = String(today.getDate()).padStart(2, "0");
//     document.getElementById("dateField").value = yyyy + "-" + mm + "-" + dd;
    
//     // Event listeners
//     document.getElementById("qtyField").addEventListener("input", updateAmounts);
//     document.getElementById("rateField").addEventListener("input", updateAmounts);
//     document.getElementById("cgstField").addEventListener("input", updateAmounts);
//     document.getElementById("sgstField").addEventListener("input", updateAmounts);
//     document.getElementById("setNameDropdown").addEventListener("change", updateVariantDropdown);
//     document.getElementById("variantDropdown").addEventListener("change", fetchPrice);
//     document.getElementById("sendMethod").addEventListener("change", toggleSendFields);
    
//     // Form submissions
//     document.getElementById("loginForm").addEventListener("submit", handleLogin);
//     document.getElementById("invoiceForm").addEventListener("submit", handleFormSubmit);
//     document.getElementById("mobileForm").addEventListener("submit", submitMobile);
    
//     updateAmounts();
// });

// // ========================================
// // UTILITY FUNCTIONS
// // ========================================
// function toISODate(mdyString) {
//     if (!mdyString) return "";
//     if (mdyString.match(/^\d{4}-\d{2}-\d{2}$/)) return mdyString;
//     var parts = mdyString.split("/");
//     if (parts.length === 3) {
//         var m = parts[0].padStart(2, "0");
//         var d = parts[1].padStart(2, "0");
//         var y = parts[2];
//         return y + "-" + m + "-" + d;
//     }
//     return "";
// }

// function updateAmounts() {
//     var qty = parseFloat(document.getElementById("qtyField").value) || 0;
//     var rate = parseFloat(document.getElementById("rateField").value) || 0;
//     var baseAmount = qty * rate;
//     var cgstPercentage = parseFloat(document.getElementById("cgstField").value) || 0;
//     var sgstPercentage = parseFloat(document.getElementById("sgstField").value) || 0;
//     var cgstAmount = baseAmount * (cgstPercentage / 100);
//     var sgstAmount = baseAmount * (sgstPercentage / 100);
//     var grandTotal = baseAmount + cgstAmount + sgstAmount;
//     document.getElementById("amountDisplay").textContent = baseAmount.toFixed(2);
//     document.getElementById("baseAmountDisplay").textContent = baseAmount.toFixed(2);
//     document.getElementById("grandTotalDisplay").textContent = grandTotal.toFixed(2);
// }

// // ========================================
// // LOGIN FUNCTION
// // ========================================
// async function handleLogin(e) {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const username = formData.get("username");
//     const password = formData.get("password");
    
//     try {
//         const res = await callAPI('login', { username, password });
//         currentUser = res.username;
//         currentUserType = res.userType;
//         document.getElementById("currentUserField").value = currentUser;
//         document.getElementById("currentUserTypeField").value = currentUserType;
//         document.getElementById("headerUser").textContent = "Logged in as: " + currentUser;
//         document.getElementById("loginSection").style.display = "none";
//         document.getElementById("dashboardSection").style.display = "block";
        
//         if (currentUserType === "Admin") {
//             document.getElementById("adminControls").style.display = "block";
//         }
        
//         // Load sets for dropdown
//         const sets = await callAPI('getSetNames');
//         var options = "<option value=''>Select Set</option>";
//         sets.forEach(function(s) { 
//             options += "<option value='" + s + "'>" + s + "</option>"; 
//         });
//         document.getElementById("setNameDropdown").innerHTML = options;
        
//         // Get new invoice number
//         const invoiceNo = await callAPI('getNewInvoiceNumber');
//         document.getElementById("invoiceNumberField").value = invoiceNo;
        
//     } catch (err) {
//         Swal.fire("Error", err.message, "error");
//     }
// }

// // ========================================
// // FORM SUBMISSION
// // ========================================
// async function handleFormSubmit(event) {
//     event.preventDefault();
//     var formData = new FormData(event.target);
//     var obj = {};
//     formData.forEach(function (value, key) { obj[key] = value; });
    
//     try {
//         const response = await callAPI('processForm', obj);
//         Swal.fire({ 
//             title: "Success!", 
//             text: response, 
//             icon: "success", 
//             confirmButtonText: "OK" 
//         });
        
//         if (!document.getElementById("historySection").classList.contains("hidden")) {
//             loadHistory();
//         }
//     } catch (err) {
//         Swal.fire({ 
//             title: "Error!", 
//             text: "Error: " + err.message, 
//             icon: "error", 
//             confirmButtonText: "OK" 
//         });
//     }
// }

// // ========================================
// // MOBILE DROPDOWN FUNCTIONS
// // ========================================
// async function updateVariantDropdown() {
//     var setName = document.getElementById("setNameDropdown").value;
//     if (!setName) {
//         document.getElementById("variantDropdown").innerHTML = "<option value=''>Select Variant</option>";
//         return;
//     }
    
//     try {
//         const variants = await callAPI('getVariantsForSet', { setName });
//         var options = "<option value=''>Select Variant</option>";
//         variants.forEach(function (v) {
//             options += "<option value='" + v + "'>" + v + "</option>";
//         });
//         document.getElementById("variantDropdown").innerHTML = options;
//     } catch (err) {
//         console.error('Error loading variants:', err);
//     }
// }

// async function fetchPrice() {
//     var setName = document.getElementById("setNameDropdown").value;
//     var variant = document.getElementById("variantDropdown").value;
//     if (!setName || !variant) return;
    
//     try {
//         const mobile = await callAPI('getMobileDetail', { setName, variant });
//         if (mobile) {
//             document.getElementById("rateField").value = mobile.price;
//             updateAmounts();
//         }
//     } catch (err) {
//         console.error('Error fetching price:', err);
//     }
// }

// // ========================================
// // SEND INVOICE FUNCTIONS
// // ========================================
// function openSendModal() {
//     document.getElementById("sendModal").style.display = "flex";
// }

// function closeSendModal() {
//     document.getElementById("sendModal").style.display = "none";
//     document.getElementById("whatsappNumber").value = "";
//     document.getElementById("emailAddress").value = "";
// }

// function toggleSendFields() {
//     var method = document.getElementById("sendMethod").value;
//     document.getElementById("whatsappField").style.display = method === "whatsapp" ? "block" : "none";
//     document.getElementById("emailField").style.display = method === "email" ? "block" : "none";
// }

// async function sendInvoice() {
//     var method = document.getElementById("sendMethod").value;
//     var number = document.getElementById("whatsappNumber").value;
//     var email = document.getElementById("emailAddress").value;
    
//     if (method === "whatsapp" && !number) {
//         Swal.fire("Error", "Please enter WhatsApp number", "error");
//         return;
//     }
    
//     if (method === "email" && !email) {
//         Swal.fire("Error", "Please enter email address", "error");
//         return;
//     }
    
//     var invoiceData = collectInvoiceData();
    
//     Swal.fire({
//         title: 'Generating PDF...',
//         text: 'Please wait while we create your invoice PDF',
//         allowOutsideClick: false,
//         didOpen: () => { Swal.showLoading(); }
//     });
    
//     try {
//         const response = await callAPI('sendInvoice', {
//             invoiceData,
//             method,
//             recipient: method === "whatsapp" ? number : email
//         });
        
//         Swal.close();
        
//         if (method === "whatsapp") {
//             if (response.url) {
//                 window.open(response.url, "_blank");
//             }
//             if (response.pdfUrl) {
//                 Swal.fire({
//                     title: "Success!",
//                     html: "WhatsApp message prepared!<br><br>PDF Invoice Link: <a href='" + response.pdfUrl + "' target='_blank'>Download PDF</a>",
//                     icon: "success",
//                     confirmButtonText: "OK"
//                 });
//             }
//         } else {
//             Swal.fire("Success", "Email with PDF invoice sent successfully!", "success");
//         }
//         closeSendModal();
//     } catch (err) {
//         Swal.close();
//         Swal.fire("Error", "Failed to send invoice: " + err.message, "error");
//     }
// }

// function collectInvoiceData() {
//     return {
//         invoiceNo: document.getElementById("invoiceNumberField").value,
//         date: document.getElementById("dateField").value,
//         name: document.querySelector('input[name="name"]').value,
//         address: document.querySelector('input[name="address"]').value,
//         contact: document.querySelector('input[name="contact"]').value,
//         setName: document.getElementById("setNameDropdown").value,
//         variant: document.getElementById("variantDropdown").value,
//         modelNo: document.querySelector('input[name="modelNo"]').value,
//         imei1: document.querySelector('input[name="imei1"]').value,
//         imei2: document.querySelector('input[name="imei2"]').value,
//         qty: document.getElementById("qtyField").value,
//         rate: document.getElementById("rateField").value,
//         baseAmount: document.getElementById("baseAmountDisplay").textContent,
//         cgst: document.getElementById("cgstField").value,
//         sgst: document.getElementById("sgstField").value,
//         grandTotal: document.getElementById("grandTotalDisplay").textContent
//     };
// }

// // ========================================
// // OTHER UTILITY FUNCTIONS
// // ========================================
// function clearForm() {
//     document.getElementById("invoiceForm").reset();
//     document.getElementById("dateField").value = "";
//     document.getElementById("amountDisplay").textContent = "0.00";
//     document.getElementById("baseAmountDisplay").textContent = "0.00";
//     document.getElementById("grandTotalDisplay").textContent = "0.00";
//     document.getElementById("currentUserField").value = currentUser;
//     document.getElementById("currentUserTypeField").value = currentUserType;
// }

// async function newInvoice() {
//     document.getElementById("historySection").classList.add("hidden");
//     document.getElementById("stockSection").style.display = "none";
//     document.getElementById("imeiStockSection").style.display = "none";
//     document.getElementById("invoiceForm").style.display = "block";
//     document.getElementById("invoiceForm").reset();
//     updateAmounts();
    
//     var today = new Date();
//     var mm = String(today.getMonth() + 1).padStart(2, "0");
//     var dd = String(today.getDate()).padStart(2, "0");
//     var yyyy = today.getFullYear();
//     document.getElementById("dateField").value = yyyy + "-" + mm + "-" + dd;
    
//     try {
//         const newInvoiceNo = await callAPI('getNewInvoiceNumber');
//         document.getElementById("invoiceNumberField").value = newInvoiceNo;
//     } catch (err) {
//         console.error('Error getting new invoice number:', err);
//     }
// }

// function toggleHistory() {
//     document.getElementById("invoiceForm").style.display = "none";
//     document.getElementById("stockSection").style.display = "none";
//     document.getElementById("imeiStockSection").style.display = "none";
//     document.getElementById("loadingIndicator").classList.remove("hidden");
//     loadHistory();
// }

// function backToInvoice() {
//     document.getElementById("historySection").classList.add("hidden");
//     document.getElementById("invoiceForm").style.display = "block";
// }

// async function loadHistory() {
//     try {
//         const data = await callAPI('getAllInvoices', { currentUser, currentUserType });
//         renderHistoryTable(data);
//         document.getElementById("loadingIndicator").classList.add("hidden");
//         document.getElementById("historySection").classList.remove("hidden");
//     } catch (err) {
//         Swal.fire("Error", "Failed to load history: " + err.message, "error");
//     }
// }

// function renderHistoryTable(data) {
//     if ($.fn.DataTable.isDataTable("#historyTable")) {
//         $("#historyTable").DataTable().clear().destroy();
//     }
//     var tbody = document.querySelector("#historyTable tbody");
//     tbody.innerHTML = "";
//     data.forEach(function (row) {
//         var tr = document.createElement("tr");
//         tr.innerHTML = `
//             <td>${row.invoiceNo}</td>
//             <td>${row.date}</td>
//             <td>${row.name}</td>
//             <td>${row.contact}</td>
//             <td>${row.setName} - ${row.variant}</td>
//             <td>${row.imeiDisplay || 'N/A'}</td>
//             <td>₹${row.baseAmount || 0}</td>
//             <td>${row.user || ""}</td>
//             <td>
//                 <button class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded" onclick="viewInvoice('${row.invoiceNo}')">
//                     View
//                 </button>
//             </td>
//         `;
//         tbody.appendChild(tr);
//     });
//     $("#historyTable").DataTable({ 
//         responsive: true, 
//         autoWidth: false, 
//         width: "100%",
//         pageLength: 25
//     });
// }

// function filterByDate() {
//     var start = document.getElementById("startDate").value;
//     var end = document.getElementById("endDate").value;
//     var table = $("#historyTable").DataTable();
//     $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
//         var date = data[1] || "";
//         if (date) {
//             var parts = date.split("/");
//             var invoiceDate = new Date(parts[2], parts[0] - 1, parts[1]);
//             if (start) {
//                 var startDate = new Date(start);
//                 if (invoiceDate < startDate) return false;
//             }
//             if (end) {
//                 var endDate = new Date(end);
//                 if (invoiceDate > endDate) return false;
//             }
//         }
//         return true;
//     });
//     table.draw();
//     $.fn.dataTable.ext.search.pop();
// }

// function clearFilter() {
//     document.getElementById("startDate").value = "";
//     document.getElementById("endDate").value = "";
//     $("#historyTable").DataTable().draw();
// }

// async function viewInvoice(invoiceNo) {
//     try {
//         const inv = await callAPI('getInvoiceByNo', { invoiceNo, currentUser, currentUserType });
        
//         if (!inv) {
//             Swal.fire("Not found", "No invoice found or no permission.", "error");
//             return;
//         }
        
//         document.getElementById("invoiceNumberField").value = inv.invoiceNo || "";
//         document.getElementById("dateField").value = toISODate(inv.date || "");
//         document.querySelector('input[name="name"]').value = inv.name || "";
//         document.querySelector('input[name="address"]').value = inv.address || "";
//         document.querySelector('input[name="contact"]').value = inv.contact || "";
//         document.getElementById("setNameDropdown").value = inv.setName || "";
        
//         await updateVariantDropdown();
        
//         setTimeout(function () {
//             document.getElementById("variantDropdown").value = inv.variant || "";
//             fetchPrice();
//         }, 300);
        
//         document.querySelector('input[name="modelNo"]').value = inv.modelNo || "";
//         document.querySelector('input[name="imei1"]').value = inv.imei1 || "";
//         document.querySelector('input[name="imei2"]').value = inv.imei2 || "";
//         document.getElementById("qtyField").value = inv.qty || 0;
//         document.getElementById("rateField").value = inv.rate || 0;
//         document.getElementById("cgstField").value = inv.cgstPercentage || 0;
//         document.getElementById("sgstField").value = inv.sgstPercentage || 0;
//         updateAmounts();
//         backToInvoice();
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//         Swal.fire("Error", err.message, "error");
//     }
// }

// function logout() {
//     currentUser = "";
//     currentUserType = "";
//     document.getElementById("loginSection").style.display = "flex";
//     document.getElementById("dashboardSection").style.display = "none";
//     document.getElementById("invoiceForm").reset();
//     document.getElementById("historySection").innerHTML = "";
// }

// // ========================================
// // ADMIN MOBILE MANAGEMENT
// // ========================================
// function openAddMobileModal() {
//     document.getElementById("adminModal").style.display = "flex";
//     document.getElementById("mobileForm").reset();
//     document.getElementById("mobileForm").removeAttribute("data-row");
// }

// function closeAddMobileModal() {
//     document.getElementById("adminModal").style.display = "none";
//     document.getElementById("mobileForm").reset();
//     document.getElementById("mobileForm").removeAttribute("data-row");
// }

// async function submitMobile(e) {
//     e.preventDefault();
//     var mobile = {
//         setName: document.getElementById("mobileSetName").value,
//         variant: document.getElementById("mobileVariant").value,
//         price: parseFloat(document.getElementById("mobilePrice").value) || 0,
//         imeis: document.getElementById("mobileImeis").value.split('\n').filter(imei => imei.trim() !== '')
//     };
    
//     if (mobile.imeis.length === 0) {
//         Swal.fire("Error", "Please enter at least one IMEI number", "error");
//         return;
//     }
    
//     var rowIndex = document.getElementById("mobileForm").getAttribute("data-row");
    
//     try {
//         if (rowIndex) {
//             const res = await callAPI('updateMobileRecord', { rowIndex: parseInt(rowIndex), mobile });
//             Swal.fire("Success", res, "success");
//             document.getElementById("mobileForm").removeAttribute("data-row");
//         } else {
//             const res = await callAPI('addMobile', { mobile });
//             Swal.fire("Success", res, "success");
            
//             // Refresh set names
//             const sets = await callAPI('getSetNames');
//             var options = "<option value=''>Select Set</option>";
//             sets.forEach(function(s) { 
//                 options += "<option value='" + s + "'>" + s + "</option>"; 
//             });
//             document.getElementById("setNameDropdown").innerHTML = options;
//         }
        
//         closeAddMobileModal();
//         showStock();
//     } catch (err) {
//         Swal.fire("Error", err.message, "error");
//     }
// }

// async function showStock() {
//     document.getElementById("invoiceForm").style.display = "none";
//     document.getElementById("historySection").style.display = "none";
//     document.getElementById("imeiStockSection").style.display = "none";
    
//     try {
//         const mobiles = await callAPI('getAllMobiles');
//         mobilesData = mobiles;
//         renderStock(mobilesData);
//         document.getElementById("stockSection").style.display = "block";
//     } catch (err) {
//         Swal.fire("Error", err.message, "error");
//     }
// }

// function closeStock() {
//     document.getElementById("stockSection").style.display = "none";
//     document.getElementById("invoiceForm").style.display = "block";
// }

// function renderStock(mobiles) {
//     var searchQuery = document.getElementById("stockSearchInput").value.toLowerCase();
//     var container = document.getElementById("stockContainer");
//     container.innerHTML = "";
//     mobiles.forEach(function (m) {
//         var searchTarget = (m.setName + " " + m.variant).toLowerCase();
//         if (searchTarget.indexOf(searchQuery) !== -1) {
//             var div = document.createElement("div");
//             div.className = "border p-4 rounded mb-2 flex items-center justify-between bg-gray-100";
//             div.innerHTML = `
//                 <div>
//                     <span class="font-bold">📱 ${m.setName}</span> - ${m.variant} <br>
//                     Price: ₹${m.price} | Stock: ${m.stock} units<br>
//                     <small class="text-gray-600">Based on IMEI count</small>
//                 </div>
//                 <div class="space-x-2">
//                     <button class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded" onclick="editMobile(${m.rowIndex},'${m.setName}','${m.variant}',${m.price})">Edit</button>
//                     <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded" onclick="deleteMobileRecord(${m.rowIndex})">Delete</button>
//                 </div>
//             `;
//             container.appendChild(div);
//         }
//     });
// }

// function filterStock() {
//     renderStock(mobilesData);
// }

// async function editMobile(rowIndex, setName, variant, price) {
//     document.getElementById("adminModal").style.display = "flex";
//     document.getElementById("mobileSetName").value = setName;
//     document.getElementById("mobileVariant").value = variant;
//     document.getElementById("mobilePrice").value = price;
//     document.getElementById("mobileForm").setAttribute("data-row", rowIndex);
    
//     try {
//         const imeis = await callAPI('getAvailableImeis', { setName, variant });
//         document.getElementById("mobileImeis").value = imeis.join('\n');
//     } catch (err) {
//         console.error('Error loading IMEIs:', err);
//     }
// }

// async function deleteMobileRecord(rowIndex) {
//     if (confirm("Are you sure you want to delete this mobile record?")) {
//         try {
//             const res = await callAPI('deleteMobile', { rowIndex });
//             Swal.fire("Deleted", res, "success");
//             showStock();
//         } catch (err) {
//             Swal.fire("Error", err.message, "error");
//         }
//     }
// }

// // ========================================
// // IMEI STOCK FUNCTIONS
// // ========================================
// async function showImeiStock() {
//     document.getElementById("invoiceForm").style.display = "none";
//     document.getElementById("historySection").style.display = "none";
//     document.getElementById("stockSection").style.display = "none";
    
//     try {
//         const imeiData = await callAPI('getAllImeiStock');
//         imeiStockData = imeiData;
//         renderImeiStock(imeiStockData);
//         document.getElementById("imeiStockSection").style.display = "block";
//     } catch (err) {
//         Swal.fire("Error", err.message, "error");
//     }
// }

// function closeImeiStock() {
//     document.getElementById("imeiStockSection").style.display = "none";
//     document.getElementById("invoiceForm").style.display = "block";
// }

// function renderImeiStock(imeiData) {
//     if ($.fn.DataTable.isDataTable("#imeiStockTable")) {
//         $("#imeiStockTable").DataTable().clear().destroy();
//     }
//     var tbody = document.querySelector("#imeiStockTable tbody");
//     tbody.innerHTML = "";
//     imeiData.forEach(function (row) {
//         var tr = document.createElement("tr");
//         var statusClass = row.status === "AVAILABLE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
//         tr.innerHTML = `
//             <td>${row.setName}</td>
//             <td>${row.variant}</td>
//             <td><code>${row.imei}</code></td>
//             <td><span class="px-2 py-1 rounded text-xs font-bold ${statusClass}">${row.status}</span></td>
//             <td>${row.dateAdded}</td>
//         `;
//         tbody.appendChild(tr);
//     });
//     $("#imeiStockTable").DataTable({ 
//         responsive: true, 
//         autoWidth: false, 
//         width: "100%",
//         pageLength: 25
//     });
// }

// function filterImeiStock() {
//     var searchQuery = document.getElementById("imeiSearchInput").value.toLowerCase();
//     var table = $("#imeiStockTable").DataTable();
//     table.search(searchQuery).draw();
// }










// ========================================
// CONFIGURATION - UPDATE THIS URL
// ========================================
const API_URL = 'https://script.google.com/macros/s/AKfycbzBRuHnP5GPLUmZICBV7DG_t0pHvC7HPvs5i8_4VM3MH9enxdPv4T8oqayFDyTX8AE0kg/exec';

// ========================================
// GLOBAL VARIABLES
// ========================================
var currentUser = "";
var currentUserType = "";
var mobilesData = [];
var imeiStockData = [];
var historyDataTable = null;

// ========================================
// API HELPER FUNCTION
// ========================================
async function callAPI(action, data = {}) {
    try {
        showLoading();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: action,
                data: JSON.stringify(data)
            })
        });
        
        const result = await response.json();
        hideLoading();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        return result.data;
    } catch (error) {
        hideLoading();
        console.error('API Error:', error);
        throw error;
    }
}

// ========================================
// LOADING INDICATOR
// ========================================
function showLoading() {
    document.getElementById("loadingIndicator").classList.remove("hidden");
}

function hideLoading() {
    document.getElementById("loadingIndicator").classList.add("hidden");
}

// ========================================
// TIME DISPLAY
// ========================================
function updateTime() {
    const now = new Date();
    document.getElementById("currentTime").textContent = now.toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();

// ========================================
// PAGE LOAD INITIALIZATION
// ========================================
document.addEventListener("DOMContentLoaded", async function () {
    // Set today's date
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    document.getElementById("dateField").value = yyyy + "-" + mm + "-" + dd;
    
    // Event listeners
    document.getElementById("qtyField").addEventListener("input", updateAmounts);
    document.getElementById("rateField").addEventListener("input", updateAmounts);
    document.getElementById("cgstField").addEventListener("input", updateAmounts);
    document.getElementById("sgstField").addEventListener("input", updateAmounts);
    document.getElementById("setNameDropdown").addEventListener("change", updateVariantDropdown);
    document.getElementById("variantDropdown").addEventListener("change", fetchPrice);
    document.getElementById("sendMethod").addEventListener("change", toggleSendFields);
    
    // Form submissions
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("invoiceForm").addEventListener("submit", handleFormSubmit);
    document.getElementById("mobileForm").addEventListener("submit", submitMobile);
    
    updateAmounts();
});

// ========================================
// UTILITY FUNCTIONS
// ========================================
function toISODate(mdyString) {
    if (!mdyString) return "";
    if (mdyString.match(/^\d{4}-\d{2}-\d{2}$/)) return mdyString;
    var parts = mdyString.split("/");
    if (parts.length === 3) {
        var m = parts[0].padStart(2, "0");
        var d = parts[1].padStart(2, "0");
        var y = parts[2];
        return y + "-" + m + "-" + d;
    }
    return "";
}

function updateAmounts() {
    var qty = parseFloat(document.getElementById("qtyField").value) || 0;
    var rate = parseFloat(document.getElementById("rateField").value) || 0;
    var baseAmount = qty * rate;
    var cgstPercentage = parseFloat(document.getElementById("cgstField").value) || 0;
    var sgstPercentage = parseFloat(document.getElementById("sgstField").value) || 0;
    var cgstAmount = baseAmount * (cgstPercentage / 100);
    var sgstAmount = baseAmount * (sgstPercentage / 100);
    var grandTotal = baseAmount + cgstAmount + sgstAmount;
    document.getElementById("amountDisplay").textContent = baseAmount.toFixed(2);
    document.getElementById("baseAmountDisplay").textContent = baseAmount.toFixed(2);
    document.getElementById("grandTotalDisplay").textContent = grandTotal.toFixed(2);
}

// ========================================
// LOGIN FUNCTION
// ========================================
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    
    try {
        const res = await callAPI('login', { username, password });
        currentUser = res.username;
        currentUserType = res.userType;
        document.getElementById("currentUserField").value = currentUser;
        document.getElementById("currentUserTypeField").value = currentUserType;
        document.getElementById("headerUser").textContent = "Logged in as: " + currentUser;
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("dashboardSection").style.display = "block";
        
        if (currentUserType === "Admin") {
            document.getElementById("adminControls").style.display = "block";
        }
        
        // Load sets for dropdown
        const sets = await callAPI('getSetNames');
        var options = "<option value=''>Select Set</option>";
        sets.forEach(function(s) { 
            options += "<option value='" + s + "'>" + s + "</option>"; 
        });
        document.getElementById("setNameDropdown").innerHTML = options;
        
        // Get new invoice number
        const invoiceNo = await callAPI('getNewInvoiceNumber');
        document.getElementById("invoiceNumberField").value = invoiceNo;
        
    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}

// ========================================
// FORM SUBMISSION
// ========================================
async function handleFormSubmit(event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    var obj = {};
    formData.forEach(function (value, key) { obj[key] = value; });
    
    try {
        const response = await callAPI('processForm', obj);
        Swal.fire({ 
            title: "Success!", 
            text: response, 
            icon: "success", 
            confirmButtonText: "OK" 
        });
        
        if (!document.getElementById("historySection").classList.contains("hidden")) {
            loadHistory();
        }
    } catch (err) {
        Swal.fire({ 
            title: "Error!", 
            text: "Error: " + err.message, 
            icon: "error", 
            confirmButtonText: "OK" 
        });
    }
}

// ========================================
// MOBILE DROPDOWN FUNCTIONS
// ========================================
async function updateVariantDropdown() {
    var setName = document.getElementById("setNameDropdown").value;
    if (!setName) {
        document.getElementById("variantDropdown").innerHTML = "<option value=''>Select Variant</option>";
        return;
    }
    
    try {
        const variants = await callAPI('getVariantsForSet', { setName });
        var options = "<option value=''>Select Variant</option>";
        variants.forEach(function (v) {
            options += "<option value='" + v + "'>" + v + "</option>";
        });
        document.getElementById("variantDropdown").innerHTML = options;
    } catch (err) {
        console.error('Error loading variants:', err);
    }
}

async function fetchPrice() {
    var setName = document.getElementById("setNameDropdown").value;
    var variant = document.getElementById("variantDropdown").value;
    if (!setName || !variant) return;
    
    try {
        const mobile = await callAPI('getMobileDetail', { setName, variant });
        if (mobile) {
            document.getElementById("rateField").value = mobile.price;
            updateAmounts();
        }
    } catch (err) {
        console.error('Error fetching price:', err);
    }
}

// ========================================
// SEND INVOICE FUNCTIONS
// ========================================
function openSendModal() {
    document.getElementById("sendModal").style.display = "flex";
}

function closeSendModal() {
    document.getElementById("sendModal").style.display = "none";
    document.getElementById("whatsappNumber").value = "";
    document.getElementById("emailAddress").value = "";
}

function toggleSendFields() {
    var method = document.getElementById("sendMethod").value;
    document.getElementById("whatsappField").style.display = method === "whatsapp" ? "block" : "none";
    document.getElementById("emailField").style.display = method === "email" ? "block" : "none";
}

async function sendInvoice() {
    var method = document.getElementById("sendMethod").value;
    var number = document.getElementById("whatsappNumber").value;
    var email = document.getElementById("emailAddress").value;
    
    if (method === "whatsapp" && !number) {
        Swal.fire("Error", "Please enter WhatsApp number", "error");
        return;
    }
    
    if (method === "email" && !email) {
        Swal.fire("Error", "Please enter email address", "error");
        return;
    }
    
    var invoiceData = collectInvoiceData();
    
    Swal.fire({
        title: 'Generating PDF...',
        text: 'Please wait while we create your invoice PDF',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });
    
    try {
        const response = await callAPI('sendInvoice', {
            invoiceData,
            method,
            recipient: method === "whatsapp" ? number : email
        });
        
        Swal.close();
        
        if (method === "whatsapp") {
            if (response.url) {
                window.open(response.url, "_blank");
            }
            if (response.pdfUrl) {
                Swal.fire({
                    title: "Success!",
                    html: "WhatsApp message prepared!<br><br>PDF Invoice Link: <a href='" + response.pdfUrl + "' target='_blank'>Download PDF</a>",
                    icon: "success",
                    confirmButtonText: "OK"
                });
            }
        } else {
            Swal.fire("Success", "Email with PDF invoice sent successfully!", "success");
        }
        closeSendModal();
    } catch (err) {
        Swal.close();
        Swal.fire("Error", "Failed to send invoice: " + err.message, "error");
    }
}

function collectInvoiceData() {
    return {
        invoiceNo: document.getElementById("invoiceNumberField").value,
        date: document.getElementById("dateField").value,
        name: document.querySelector('input[name="name"]').value,
        address: document.querySelector('input[name="address"]').value,
        contact: document.querySelector('input[name="contact"]').value,
        altContact: (document.getElementById("altContact") ? document.getElementById("altContact").value : ""),
        setName: document.getElementById("setNameDropdown").value,
        variant: document.getElementById("variantDropdown").value,
        modelNo: document.querySelector('input[name="modelNo"]').value,
        imei1: document.querySelector('input[name="imei1"]').value,
        imei2: document.querySelector('input[name="imei2"]').value,
        qty: document.getElementById("qtyField").value,
        rate: document.getElementById("rateField").value,
        baseAmount: document.getElementById("baseAmountDisplay").textContent,
        cgst: document.getElementById("cgstField").value,
        sgst: document.getElementById("sgstField").value,
        grandTotal: document.getElementById("grandTotalDisplay").textContent
    };
}

// ========================================
// DOWNLOAD PDF (Client-side) using provided template
// ========================================
function buildInvoicePdfHtml(invoice) {
    var qty = parseFloat(invoice.qty || 0) || 0;
    var rate = parseFloat(invoice.rate || 0) || 0;
    var baseAmount = parseFloat((invoice.baseAmount || '').toString().replace(/,/g, ''));
    if (isNaN(baseAmount)) {
        baseAmount = qty * rate;
    }
    var cgstPct = parseFloat(invoice.cgst || 0) || 0;
    var sgstPct = parseFloat(invoice.sgst || 0) || 0;
    var cgstAmt = baseAmount * (cgstPct / 100);
    var sgstAmt = baseAmount * (sgstPct / 100);
    var grandTotal = parseFloat((invoice.grandTotal || '').toString().replace(/,/g, ''));
    if (isNaN(grandTotal)) {
        grandTotal = baseAmount + cgstAmt + sgstAmt;
    }
    var altContactHtml = invoice.altContact ? `
        <div class="detail-row">
            <div class="detail-label">Alt Contact No.:</div>
            <div class="detail-value">${invoice.altContact}</div>
        </div>
    ` : '';

    var imei2Value = (invoice.imei2 && invoice.imei2.trim().length > 0) ? invoice.imei2 : 'N/A';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; background: white; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; }
        .header { background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { margin: 3px 0; font-size: 14px; }
        .details-section { display: table; width: 100%; margin-bottom: 30px; }
        .details-left, .details-right { display: table-cell; width: 50%; vertical-align: top; padding: 10px; }
        .detail-row { margin-bottom: 15px; }
        .detail-label { font-weight: bold; color: #555; font-size: 13px; margin-bottom: 5px; }
        .detail-value { font-size: 14px; color: #333; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background-color: #dbeafe; color: #1e40af; padding: 12px; text-align: left; border: 1px solid #cbd5e1; font-size: 14px; }
        .items-table td { padding: 12px; border: 1px solid #cbd5e1; font-size: 13px; }
        .items-table tr:nth-child(even) { background-color: #f9fafb; }
        .totals-section { margin-bottom: 30px; padding: 20px; background-color: #f3f4f6; border-radius: 5px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .total-row.grand { font-size: 18px; font-weight: bold; color: #1e40af; margin-top: 15px; padding-top: 15px; border-top: 2px solid #cbd5e1; }
        .terms-section { margin-bottom: 30px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; }
        .terms-section h3 { font-size: 14px; margin-bottom: 10px; color: #92400e; }
        .terms-section ul { margin-left: 20px; font-size: 12px; color: #78350f; }
        .terms-section li { margin-bottom: 5px; }
        .signature-section { text-align: right; margin-top: 50px; }
        .signature-section p { font-size: 13px; margin-bottom: 5px; }
        .signature-line { display: inline-block; width: 200px; border-top: 1px solid #333; margin-top: 40px; }
        @media print { body { padding: 0; } .invoice-container { padding: 15px; } }
    </style>
    <title>Invoice ${invoice.invoiceNo}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>MOBILE BAZAR NATNA</h1>
            <p>Address: Natna</p>
            <p>GSTIN: 09CEOPS1586K1ZL</p>
        </div>
        <div class="details-section">
            <div class="details-left">
                <div class="detail-row">
                    <div class="detail-label">Customer Name:</div>
                    <div class="detail-value">${invoice.name || ''}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Address:</div>
                    <div class="detail-value">${invoice.address || ''}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Contact No.:</div>
                    <div class="detail-value">${invoice.contact || ''}</div>
                </div>
                ${altContactHtml}
            </div>
            <div class="details-right">
                <div class="detail-row">
                    <div class="detail-label">Invoice No.:</div>
                    <div class="detail-value">${invoice.invoiceNo || ''}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Date:</div>
                    <div class="detail-value">${invoice.date || ''}</div>
                </div>
            </div>
        </div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Description Of Goods</th>
                    <th style="width: 80px;">Qty.</th>
                    <th style="width: 100px;">Rate</th>
                    <th style="width: 120px;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>Set Name:</strong> ${invoice.setName || ''}<br>
                        <strong>Variant:</strong> ${invoice.variant || ''}
                    </td>
                    <td>${qty}</td>
                    <td>₹${rate.toFixed(2)}</td>
                    <td><strong>₹${baseAmount.toFixed(2)}</strong></td>
                </tr>
                <tr>
                    <td colspan="4">
                        <strong>Model No.:</strong> ${invoice.modelNo ? invoice.modelNo : 'N/A'}
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <strong>IMEI No. 1:</strong> ${invoice.imei1 || ''}
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <strong>IMEI No. 2:</strong> ${imei2Value}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="totals-section">
            <div class="total-row">
                <span>Total Amount:</span>
                <span><strong>₹${baseAmount.toFixed(2)}</strong></span>
            </div>
            <div class="total-row">
                <span>Add: CGST @ ${cgstPct}%</span>
                <span>₹${cgstAmt.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Add: SGST @ ${sgstPct}%</span>
                <span>₹${sgstAmt.toFixed(2)}</span>
            </div>
            <div class="total-row grand">
                <span>GRAND TOTAL:</span>
                <span>₹${grandTotal.toFixed(2)}</span>
            </div>
        </div>
        <div class="terms-section">
            <h3>E & O.E - TERMS & CONDITIONS:</h3>
            <ul>
                <li>All Subject to Kaushambi Jurisdiction</li>
                <li>Goods once sold will not be taken back</li>
                <li>Will be valid as per the service center.</li>
                <li>Opened goods will not be returned or exchanged.</li>
                <li>Broken and open boxes will not be returned.</li>
                <li>For warranty-related complaints, please contact the service center directly.</li>
            </ul>
        </div>
        <div class="signature-section">
            <p>For: MOBILE BAZAR NATNA</p>
            <div class="signature-line"></div>
            <p>Authorized Signature</p>
        </div>
    </div>
</body>
</html>`;
}

async function downloadPdf() {
    try {
        var invoice = collectInvoiceData();
        var html = buildInvoicePdfHtml(invoice);
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.innerHTML = html;
        document.body.appendChild(container);
        const opt = {
            margin:       [10, 10, 10, 10],
            filename:     `Invoice_${invoice.invoiceNo || 'invoice'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(container).save();
    } catch (err) {
        Swal.fire('Error', 'Failed to generate PDF: ' + err.message, 'error');
    } finally {
        var tempDivs = document.querySelectorAll('body > div');
        tempDivs.forEach(function(div) {
            if (div && div.style && div.style.left === '-9999px') {
                div.remove();
            }
        });
    }
}

// ========================================
// HISTORY FUNCTIONS - CORRECTED
// ========================================
function toggleHistory() {
    document.getElementById("invoiceForm").style.display = "none";
    document.getElementById("stockSection").style.display = "none";
    document.getElementById("imeiStockSection").style.display = "none";
    document.getElementById("historySection").classList.remove("hidden");
    
    loadHistory();
}

function backToInvoice() {
    document.getElementById("historySection").classList.add("hidden");
    document.getElementById("invoiceForm").style.display = "block";
    document.getElementById("stockSection").style.display = "none";
    document.getElementById("imeiStockSection").style.display = "none";
}

async function loadHistory() {
    try {
        const data = await callAPI('getAllInvoices', { currentUser, currentUserType });
        renderHistoryTable(data);
    } catch (err) {
        Swal.fire("Error", "Failed to load history: " + err.message, "error");
    }
}

function renderHistoryTable(data) {
    // Destroy existing DataTable if it exists
    if (historyDataTable) {
        historyDataTable.destroy();
    }
    
    var tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";
    
    if (data.length === 0) {
        var tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="9" class="text-center py-4">No invoices found</td>`;
        tbody.appendChild(tr);
    } else {
        data.forEach(function (row) {
            var tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.invoiceNo || ''}</td>
                <td>${row.date || ''}</td>
                <td>${row.name || ''}</td>
                <td>${row.contact || ''}</td>
                <td>${(row.setName || '') + ' - ' + (row.variant || '')}</td>
                <td>${row.imeiDisplay || (row.imei1 || '') + (row.imei2 ? ', ' + row.imei2 : '')}</td>
                <td>₹${parseFloat(row.baseAmount || 0).toFixed(2)}</td>
                <td>${row.user || ""}</td>
                <td class="history-actions">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm" onclick="viewInvoice('${row.invoiceNo}')">
                        View
                    </button>
                    <button class="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-sm ml-1" onclick="printInvoice('${row.invoiceNo}')">
                        Print
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    // Initialize DataTable with proper configuration
    historyDataTable = $("#historyTable").DataTable({ 
        responsive: true,
        autoWidth: false,
        pageLength: 25,
        order: [[1, 'desc']], // Sort by date descending
        dom: '<"flex justify-between items-center mb-4"lf>rt<"flex justify-between items-center mt-4"ip>',
        language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        }
    });
}

function filterByDate() {
    var start = document.getElementById("startDate").value;
    var end = document.getElementById("endDate").value;
    
    if (!start && !end) {
        historyDataTable.search('').draw();
        return;
    }
    
    // Custom filtering function for dates
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            var dateStr = data[1]; // Date is in second column
            if (!dateStr) return false;
            
            // Parse the date - handle different formats
            var invoiceDate;
            if (dateStr.includes('/')) {
                // MM/DD/YYYY format
                var parts = dateStr.split('/');
                invoiceDate = new Date(parts[2], parts[0] - 1, parts[1]);
            } else if (dateStr.includes('-')) {
                // YYYY-MM-DD format
                invoiceDate = new Date(dateStr);
            } else {
                return false;
            }
            
            var startDate = start ? new Date(start) : null;
            var endDate = end ? new Date(end) : null;
            
            if (startDate && endDate) {
                return invoiceDate >= startDate && invoiceDate <= endDate;
            } else if (startDate) {
                return invoiceDate >= startDate;
            } else if (endDate) {
                return invoiceDate <= endDate;
            }
            
            return true;
        }
    );
    
    historyDataTable.draw();
    $.fn.dataTable.ext.search.pop(); // Remove the filter function
}

function clearFilter() {
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    historyDataTable.search('').draw();
}

async function viewInvoice(invoiceNo) {
    try {
        const inv = await callAPI('getInvoiceByNo', { invoiceNo, currentUser, currentUserType });
        
        if (!inv) {
            Swal.fire("Not found", "No invoice found or no permission.", "error");
            return;
        }
        
        // Populate form fields
        document.getElementById("invoiceNumberField").value = inv.invoiceNo || "";
        
        // Handle date format conversion
        var dateValue = inv.date || "";
        if (dateValue.includes('/')) {
            var parts = dateValue.split('/');
            if (parts.length === 3) {
                dateValue = parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
            }
        }
        document.getElementById("dateField").value = dateValue;
        
        document.querySelector('input[name="name"]').value = inv.name || "";
        document.querySelector('input[name="address"]').value = inv.address || "";
        document.querySelector('input[name="contact"]').value = inv.contact || "";
        
        // Set mobile dropdowns
        var setName = inv.setName || "";
        var variant = inv.variant || "";
        
        document.getElementById("setNameDropdown").value = setName;
        
        // Wait for variants to load
        await updateVariantDropdown();
        
        // Small delay to ensure dropdown is populated
        setTimeout(function() {
            document.getElementById("variantDropdown").value = variant;
            
            // Set other fields
            document.querySelector('input[name="modelNo"]').value = inv.modelNo || "";
            document.querySelector('input[name="imei1"]').value = inv.imei1 || "";
            document.querySelector('input[name="imei2"]').value = inv.imei2 || "";
            document.getElementById("qtyField").value = inv.qty || 0;
            document.getElementById("rateField").value = inv.rate || 0;
            document.getElementById("cgstField").value = inv.cgstPercentage || 0;
            document.getElementById("sgstField").value = inv.sgstPercentage || 0;
            
            updateAmounts();
            
            // Return to invoice view
            backToInvoice();
            window.scrollTo({ top: 0, behavior: "smooth" });
            
        }, 500);
        
    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}

async function printInvoice(invoiceNo) {
    try {
        const inv = await callAPI('getInvoiceByNo', { invoiceNo, currentUser, currentUserType });
        
        if (!inv) {
            Swal.fire("Not found", "No invoice found or no permission.", "error");
            return;
        }
        
        // Create a temporary print view
        var printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${inv.invoiceNo}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20mm; }
                    .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                    .section { margin-bottom: 15px; }
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .total { font-weight: bold; font-size: 1.1em; }
                    @media print {
                        @page { margin: 20mm; }
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>MOBILE BAZAR NATNA</h1>
                    <p>Address: Natna</p>
                    <p>GSTIN: 09CEOPS1586K1ZL</p>
                </div>
                
                <div class="section">
                    <p><strong>Invoice No:</strong> ${inv.invoiceNo}</p>
                    <p><strong>Date:</strong> ${inv.date}</p>
                </div>
                
                <div class="section">
                    <p><strong>Customer:</strong> ${inv.name}</p>
                    <p><strong>Address:</strong> ${inv.address}</p>
                    <p><strong>Contact:</strong> ${inv.contact}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${inv.setName} - ${inv.variant}<br>
                                Model: ${inv.modelNo || 'N/A'}<br>
                                IMEI1: ${inv.imei1}<br>
                                IMEI2: ${inv.imei2 || 'N/A'}
                            </td>
                            <td>${inv.qty}</td>
                            <td>₹${inv.rate}</td>
                            <td>₹${inv.baseAmount}</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="section">
                    <p class="total">Total Amount: ₹${inv.baseAmount}</p>
                    <p>CGST @${inv.cgstPercentage}%: ₹${(inv.baseAmount * inv.cgstPercentage / 100).toFixed(2)}</p>
                    <p>SGST @${inv.sgstPercentage}%: ₹${(inv.baseAmount * inv.sgstPercentage / 100).toFixed(2)}</p>
                    <p class="total">GRAND TOTAL: ₹${inv.grandTotal}</p>
                </div>
                
                <div class="section">
                    <p><strong>Terms & Conditions:</strong></p>
                    <ul>
                        <li>All Subject to Kaushambi Jurisdiction</li>
                        <li>Goods once sold will not be taken back</li>
                        <li>Will be valid as per the service center.</li>
                    </ul>
                </div>
                
                <div class="section" style="text-align: right;">
                    <p>For: MRI</p>
                    <p>Signature</p>
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        
    } catch (err) {
        Swal.fire("Error", "Failed to print invoice: " + err.message, "error");
    }
}

// ========================================
// OTHER UTILITY FUNCTIONS
// ========================================
function clearForm() {
    document.getElementById("invoiceForm").reset();
    
    // Set today's date
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    document.getElementById("dateField").value = yyyy + "-" + mm + "-" + dd;
    
    document.getElementById("amountDisplay").textContent = "0.00";
    document.getElementById("baseAmountDisplay").textContent = "0.00";
    document.getElementById("grandTotalDisplay").textContent = "0.00";
    document.getElementById("currentUserField").value = currentUser;
    document.getElementById("currentUserTypeField").value = currentUserType;
    
    // Get new invoice number
    callAPI('getNewInvoiceNumber').then(function(invoiceNo) {
        document.getElementById("invoiceNumberField").value = invoiceNo;
    }).catch(function(err) {
        console.error('Error getting new invoice number:', err);
    });
}

async function newInvoice() {
    document.getElementById("historySection").classList.add("hidden");
    document.getElementById("stockSection").style.display = "none";
    document.getElementById("imeiStockSection").style.display = "none";
    document.getElementById("invoiceForm").style.display = "block";
    
    clearForm();
}

function logout() {
    currentUser = "";
    currentUserType = "";
    document.getElementById("loginSection").style.display = "flex";
    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("invoiceForm").reset();
    document.getElementById("historySection").classList.add("hidden");
}

// ========================================
// ADMIN MOBILE MANAGEMENT
// ========================================
function openAddMobileModal() {
    document.getElementById("adminModal").style.display = "flex";
    document.getElementById("mobileForm").reset();
    document.getElementById("mobileForm").removeAttribute("data-row");
}

function closeAddMobileModal() {
    document.getElementById("adminModal").style.display = "none";
    document.getElementById("mobileForm").reset();
    document.getElementById("mobileForm").removeAttribute("data-row");
}

async function submitMobile(e) {
    e.preventDefault();
    var mobile = {
        setName: document.getElementById("mobileSetName").value,
        variant: document.getElementById("mobileVariant").value,
        price: parseFloat(document.getElementById("mobilePrice").value) || 0,
        imeis: document.getElementById("mobileImeis").value.split('\n').filter(imei => imei.trim() !== '')
    };
    
    if (mobile.imeis.length === 0) {
        Swal.fire("Error", "Please enter at least one IMEI number", "error");
        return;
    }
    
    var rowIndex = document.getElementById("mobileForm").getAttribute("data-row");
    
    try {
        if (rowIndex) {
            const res = await callAPI('updateMobileRecord', { rowIndex: parseInt(rowIndex), mobile });
            Swal.fire("Success", res, "success");
            document.getElementById("mobileForm").removeAttribute("data-row");
        } else {
            const res = await callAPI('addMobile', { mobile });
            Swal.fire("Success", res, "success");
            
            // Refresh set names
            const sets = await callAPI('getSetNames');
            var options = "<option value=''>Select Set</option>";
            sets.forEach(function(s) { 
                options += "<option value='" + s + "'>" + s + "</option>"; 
            });
            document.getElementById("setNameDropdown").innerHTML = options;
        }
        
        closeAddMobileModal();
        showStock();
    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}

async function showStock() {
    document.getElementById("invoiceForm").style.display = "none";
    document.getElementById("historySection").style.display = "none";
    document.getElementById("imeiStockSection").style.display = "none";
    
    try {
        const mobiles = await callAPI('getAllMobiles');
        mobilesData = mobiles;
        renderStock(mobilesData);
        document.getElementById("stockSection").style.display = "block";
    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}

function closeStock() {
    document.getElementById("stockSection").style.display = "none";
    document.getElementById("invoiceForm").style.display = "block";
}

function renderStock(mobiles) {
    var searchQuery = document.getElementById("stockSearchInput").value.toLowerCase();
    var container = document.getElementById("stockContainer");
    container.innerHTML = "";
    
    var filteredMobiles = mobiles.filter(function(m) {
        var searchTarget = (m.setName + " " + m.variant).toLowerCase();
        return searchTarget.indexOf(searchQuery) !== -1;
    });
    
    if (filteredMobiles.length === 0) {
        container.innerHTML = '<div class="text-center py-4 text-gray-500">No mobiles found</div>';
        return;
    }
    
    filteredMobiles.forEach(function (m) {
        var div = document.createElement("div");
        div.className = "border p-4 rounded mb-2 flex items-center justify-between bg-gray-100";
        div.innerHTML = `
            <div>
                <span class="font-bold">📱 ${m.setName}</span> - ${m.variant} <br>
                Price: ₹${m.price} | Stock: ${m.stock} units<br>
                <small class="text-gray-600">Based on IMEI count</small>
            </div>
            <div class="space-x-2">
                <button class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded" onclick="editMobile(${m.rowIndex},'${m.setName}','${m.variant}',${m.price})">Edit</button>
                <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded" onclick="deleteMobileRecord(${m.rowIndex})">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function filterStock() {
    renderStock(mobilesData);
}

async function editMobile(rowIndex, setName, variant, price) {
    document.getElementById("adminModal").style.display = "flex";
    document.getElementById("mobileSetName").value = setName;
    document.getElementById("mobileVariant").value = variant;
    document.getElementById("mobilePrice").value = price;
    document.getElementById("mobileForm").setAttribute("data-row", rowIndex);
    
    try {
        const imeis = await callAPI('getAvailableImeis', { setName, variant });
        document.getElementById("mobileImeis").value = imeis.join('\n');
    } catch (err) {
        console.error('Error loading IMEIs:', err);
    }
}

async function deleteMobileRecord(rowIndex) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
        try {
            const res = await callAPI('deleteMobile', { rowIndex });
            Swal.fire("Deleted", res, "success");
            showStock();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    }
}

// ========================================
// IMEI STOCK FUNCTIONS
// ========================================
async function showImeiStock() {
    document.getElementById("invoiceForm").style.display = "none";
    document.getElementById("historySection").style.display = "none";
    document.getElementById("stockSection").style.display = "none";
    
    try {
        const imeiData = await callAPI('getAllImeiStock');
        imeiStockData = imeiData;
        renderImeiStock(imeiStockData);
        document.getElementById("imeiStockSection").style.display = "block";
    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
}

function closeImeiStock() {
    document.getElementById("imeiStockSection").style.display = "none";
    document.getElementById("invoiceForm").style.display = "block";
}

function renderImeiStock(imeiData) {
    if ($.fn.DataTable.isDataTable("#imeiStockTable")) {
        $("#imeiStockTable").DataTable().destroy();
    }
    var tbody = document.querySelector("#imeiStockTable tbody");
    tbody.innerHTML = "";
    imeiData.forEach(function (row) {
        var tr = document.createElement("tr");
        var statusClass = row.status === "AVAILABLE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
        tr.innerHTML = `
            <td>${row.setName}</td>
            <td>${row.variant}</td>
            <td><code>${row.imei}</code></td>
            <td><span class="px-2 py-1 rounded text-xs font-bold ${statusClass}">${row.status}</span></td>
            <td>${row.dateAdded}</td>
        `;
        tbody.appendChild(tr);
    });
    $("#imeiStockTable").DataTable({ 
        responsive: true, 
        autoWidth: false, 
        width: "100%",
        pageLength: 25
    });
}

function filterImeiStock() {
    var searchQuery = document.getElementById("imeiSearchInput").value.toLowerCase();
    var table = $("#imeiStockTable").DataTable();
    table.search(searchQuery).draw();
}
