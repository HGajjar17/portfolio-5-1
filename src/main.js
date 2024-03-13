// importing the sass stylesheet for bundling
import "./../sass/styles.scss";
// importing spin.js and its css
import { Spinner } from "spin.js";

// import JQuery
import $ from "jquery";

import "spin.js/spin.css";
// import getJSONData function from Toolkit
import { getJSONData } from "./Toolkit";

// retrieve server sided script
const RETRIEVE_SCRIPT = "http://www.seanmorrow.ca/_lessons/portfolioData.php";

// received JSON Data
let jsonData;
// number of samples
let sampleCount = 0;

// references to objects on page
let sampleList;
let txtName;
let txtDescription;
let lnkUrl;
let imgSample1,imgSample2,imgSample3,imgSample4;
let loadingOverlay;
let viewAll;
let viewSelected;

let spinner = new Spinner({ color: "#FFFFFF", lines: 12 }).spin(document.querySelector(".g-loading-overlay"));

// ------------------------------------------------------- private methods
function populateMe() {
    // populate the dropdown menu
    for (let i = 0; i < sampleCount; i++) {
        // create element for dropdown
        let option = document.createElement("option");
        option.text = jsonData.samples[i].name;
        // store each sample's data in the option element object
        let sample = jsonData.samples[i];
        option.id = sample.id;
        option.name = sample.name;
        option.description = sample.description;
        option.url = sample.url;
        option.image1 = sample.images[0].filename;
        option.image2 = sample.images[1].filename;
        option.image3 = sample.images[2].filename;
        option.image4 = sample.images[3].filename;
        
        // add element to lstSamples as a new option
        sampleList.add(option);

        // get reference to sampleTemplate div
        let sampleTemplate = document.getElementById("sampleTemplate");
        // clone it
        let sampleNode = sampleTemplate.cloneNode(true);
        sampleNode.id = `sample${i}`;
        // populate it using HTML DOM
        sampleNode.querySelector("img").src = `images/${option.image1}`;
        sampleNode.querySelector(".title").innerHTML = option.name;
        sampleNode.querySelector(".description").innerHTML =
        option.description;
        sampleNode.querySelector("a").innerHTML = option.url;
        sampleNode.querySelector("a").href = option.url;
        // make it visible now
        sampleNode.style.display = "flex";
        // append it to the viewAll div
        viewAll.appendChild(sampleNode);
    }

    sampleList.addEventListener("change", onChanged);
    // add event listeners to radio buttons
    document.querySelectorAll("input")[0].addEventListener("change", onViewChanged);
    document.querySelectorAll("input")[1].addEventListener("change", onViewChanged);
}

// ------------------------------------------------------- event handlers
function onChanged(e) {
    // reference to option in sample
    let option = sampleList.selectedOptions[0];
    // updating interface
    txtName.innerHTML = option.name;
    txtDescription.innerHTML = option.description;
    lnkUrl.innerHTML = option.url;
    lnkUrl.href = option.url;
    lnkUrl.target = "_blank";
    imgSample1.src = "images/" + option.image1;
    imgSample2.src = "images/" + option.image2;
    imgSample3.src = "images/" + option.image3;
    imgSample4.src = "images/" + option.image4;
}

function onViewChanged() {
    if (viewAll.style.display == "none") {
        viewAll.style.display = "block";
        viewSelected.style.display = "none";
    } else {
        viewAll.style.display = "none";
        viewSelected.style.display = "flex";
    }
}

// ---------------------------------- challenge solution
function onResponse(data) {
    jsonData = data;
    sampleCount = jsonData.samples.length;
    if (sampleCount > 0) {
        populateMe();
        onChanged();
        // all loading complete - hide loading overlay
        loadingOverlay.style.display = "none";
    }
}

function onError(error) {
    console.log(`*** Error has occurred : ${error.message}`);
}
// ------------------------------------------------------

// ------------------------------------------------------- main method
function main() {
    // setup references to controls
    sampleList = document.querySelector("#s-navigation select");
    txtName = document.querySelector(".title");
    txtDescription = document.querySelector(".description");
    lnkUrl = document.querySelector("#s-content a");
    imgSample1 = document.querySelectorAll("#s-content img")[0];
    imgSample2 = document.querySelectorAll("#s-content img")[1];
    imgSample3 = document.querySelectorAll("#s-content img")[2];
    imgSample4 = document.querySelectorAll("#s-content img")[3];
    viewSelected = document.querySelector("#p-selected-view");
    viewAll = document.querySelector("#p-all-view");
    loadingOverlay = document.querySelector(".g-loading-overlay");

    viewAll.style.display = "none";

    // fetching JSON data from web API
    getJSONData(RETRIEVE_SCRIPT, onResponse, onError);


    // ----------------------- JQuery implementation
    $("#s-content img:first").on("mouseenter", (e) => {
        // console.log("enter!");

        // // APPROACH I : Vanilla JS
        // e.target.defaulfSrc = e.target.src;
        // e.target.src = "images/play.png";

        // APPROACH II : JQuery
        $(e.target).prop("defaultSrc", $(e.target).prop("src"));
        $(e.target).prop("src","images/play.png");
    });

    $("#s-content img:first").on("mouseleave", (e) => {
        // APPROACH I : Vanilla JS
        // e.target.src = e.target.defaultSrc;

        // APPROACH II : JQurey
        $(e.target).prop("src", $(e.target).prop("defaultSrc"));
    });

    $("#linkAbout").on("click", (e) => {
        // $("#about").toggle();
        $("#about").slideToggletoggle();
    });

}

main();