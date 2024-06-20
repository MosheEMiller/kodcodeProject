const { Document } = require("mongoose");
const {
  specializationsFlags,
  areasFlags,
  generalFlags,
  errorFlags,
} = require("./flags");

function searchByTreatment() {
  const treatmentType = document.getElementById("treatment-type").value;
  const location = document.getElementById("location").value;
  let preferredTime = document.getElementById("preferred-time").value;
  console.log(
    `specialization=${treatmentType}&area=${location}&date=${String(
      preferredTime
    )}`
  );
  if (!preferredTime) {
    preferredTime = "All";
  }
  // Perform request to server with treatmentType, location, preferredTime
  sendRequest(
    `specialization=${treatmentType}&area=${location}&date=${preferredTime}`
  );
}
function searchByTherapist() {
  const therapistName = document.getElementById("therapist-name").value;
  // Perform request to server with therapistName
  sendRequest(`specialization=all&area=all&date=all&name=${therapistName}`);
}
function switchToSearchByTherapist() {
  document.getElementById("categorical-search-form").style.display = "none";
  document.getElementById("search-form-therapist").style.display = "block";
  document.getElementById("search-form-therapist").style.textAlign = "center";
}
function switchToSearchByTreatment() {
  document.getElementById("search-form-therapist").style.display = "none";
  document.getElementById("categorical-search-form").style.display = "block";
}
async function sendRequest(query) {
  const autho = localStorage.getItem("userOfMentalHealthSystem");
  const jsonautho = JSON.parse(autho);
  console.log("Sending request with params:", query);
  const url = `http://localhost:5000/api/therapists`;

  const fullUrl = url + `?` + query;
  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        Authorization: jsonautho.userId,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Filtered data from server:", data);
    const jsonString = JSON.stringify(data);
    localStorage.setItem("user", jsonString);

    data.data.forEach((item) => {
      const cardList = document.getElementById("results");
      // Create cards for each object in the data array
      const card = document.createElement("div");
      card.className = "container";
      card.id = item.name;
      cardList.appendChild(card);
      card.innerHTML = `<div class="top-part"><strong>${item.name}</strong><p>addres: ${item.address} area: ${item.area}</p><br /></div><div class="bottom-part">tl:${item.phone} email: ${item.mail}specialization:${item.specialization}<br /><button class="openform" onclick="openForm(${item.name})">to make an appintment</button><div id="${item.name}><${item._id}}"`;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function openForm(id) {
  document.getElementById("theIdForAppontment").innerHTML =
    getElementById(id).innerText;
  document.getElementById("myForm").style.display = "block";
  if (document.getElementById("preferred-time").value) {
    document.getElementById("input1").value =
      document.getElementById("preferred-time").value;
  }
}
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("preferred-time").innerHTML = '<inputtype="date"id="preferred-time"placeholder="Enter preferred time"/>'
}

function appontment() {
  const idTerapist = getElementById("theIdForAppontment").innerText;
  const idUser = JSON.parse(localStorage.getItem("userOfMentalHealthSystem")._id);
  const date = document.getElementById("input1").value;
  const hour = document.getElementById("input2").value;
  document.getElementById("myForm").innerText = "your appontment was seccfull";
}
function convertToHourString(num) {
  if (Number.isInteger(num)) {
    let hour = num.toString();
    return hour + ":00";
  } else if (typeof num === "number") {
    let hours = Math.floor(num).toString();
    let minutes = (num % 1) * 60;
    let minutesString =
      minutes < 10
        ? "0" + Math.round(minutes).toString()
        : Math.round(minutes).toString();
    return hours + ":" + minutesString;
  } else {
    return "Invalid input";
  }
}