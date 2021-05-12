# Belly Button Biodiversity
## Overview
### *Purpose*
Roza is a biological researcher that discovers and documents bacteria that have the ability to synthesize proteins that taste like beef. Roza has partnered with Improbable Beef to find such species and she believes these species can be found in one’s belly button. Roza has gathered samples from a number of individuals across the country to identify the types of bacteria in their navels. With this data, Roza wished to build an interactive dashboard for participants and other researchers to visit. 

## Develop the Webpage and Charts
I created a file directory on my computer with the files samples.json, index.html, and charts.js. Within the HTML file, I created a header with the title “Bellybutton Biodiversity” and a link to the Bootstrap CDN:
```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Bellybutton Biodiversity</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>
```
Within the body of the HTML, I created two elements for the dropdown menu and the panel for the demographic information. In this code, I created a div with the class “well” to contain the dropdown menu with the id “selDataset” and another div with an id of “sample-metadata” for the information panel:
```
  <div class="container">
    <div class="row">
      <div class="col-md-12 jumbotron text-center">
        <h1>Belly Button Biodiversity Dashboard</h1>
        <p>Use the interactive charts below to explore the dataset</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2">
        <div class="well">
          <h5>Test Subject ID No.:</h5>
          <!-- <select id="selDataset"></select> -->
          <select id="selDataset" onchange="optionChanged(this.value)"></select>
        </div>
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h3 class="panel-title">Demographic Info</h3>
          </div>
          <div id="sample-metadata" class="panel-body"></div>
        </div>
      </div>
      <div class="col-md-5">
        <div id="bar"></div>
      </div>
      <div class="col-md-5">
        <div id="gauge"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div id="bubble"></div>
      </div>
    </div>
  </div>
```
Within the body, I additionally added links to the D3 CDN, Plotly, and my charts.js file:
```
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.5.0/d3.js"></script>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <script src="static/js/charts.js"></script>
```
In my charts.js file, I created an init() function that used the d3.select() method to select the dropdown menu and assign it to the variable “selector”. The function additionally used the d3.json() method to read the data from the samples.json file and assign it to the variable “data”. A variable “samplesNames” was created and assigned to the “names” array located inside the “data” object. The forEach() method was used on the “sampleNames” array to append each element in the array as a dropdown menu option:
```
unction init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();
```
I created another function called optionChanged() that calls on two additional functions when a change takes place in the dropdown menu: buildMetadata() and buildCharts() to populate the demographic information panel with a specific volunteer’s information and visualize that data:
```
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}
```
The buildMetadata() function takes in the ID number, or “sample”, as its argument and uses the d3.json() method to pull the dataset contain in the samples.json and label is as “data”. The variable “metadata” is created by accessing the “metadata” array within the “data” object. The filter() method is then called on the metadata array to filter for an object with an id property equal to the ID number/sample passed in the buildMetadata() function. The first item in the array returned from the filter() method is then selected and assigned to the variable “result”. The d3.select() method is used to select the “Demographic info” div with the id “sample-metadata” and assign it to the variable “PANEL”. The line “PANEL.html(“”)” was used to clear the contents of the panel before being populated with the selected demographic information for the corresponding ID number. The append() and text() methods are additionally chained to the “PANEL” variable to append a H6 heading and print the panel with the location of the volunteer:
```
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
```
Next, I created the “buildCharts” function that contains the argument sample selected from the dropdown menu. Within the function, I used the d3.json().then() method to retrieve the samples.json file:
```
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
```
Then, I created three variables to hold the array for all the samples, the array that contains the data from the sample chosen from the dropdown menu, and the first sample in the array:
```
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var firstsamplesArray = samplesArray[0];
    console.log(firstsamplesArray);
```
Three additional variables were created to hold the arrays for “otu_ids”, “otu_labels”, and “sample_values”:
```
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstsamplesArray.otu_ids;
    var otuLabels = firstsamplesArray.otu_labels;
    var sampleValues = firstsamplesArray.sample_values;

    console.log(otuID);
    console.log(otuLabels);
    console.log(sampleValues);
```
Following this, I created the “yticks” variable using the slice() method, as well as the map() and reverse() functions, to retrieve the top 10 “otu_ids” and sort them in descending orders:
```
    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuID.slice(0,10).map(id => `OTU ${id}`).reverse();
```
I created the “barData” object where the x values are the “sample_values” and the hover text for the bars are the “otu_labels”. The layout for the bar chart was additionally created with a title:
```
    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels,
      type: "bar", 
      orientation: "h"
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
``` 
Finally, I used the Plotly.newPlot() function to plot the chart:
```
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
```
Next, I created a “bubbleData” object for the bubble chart with the “otuID” variable assigned to the x property, the “sampleValues” variable to the y property, and the “otuLabels” variable to the text property:
```
    // Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuID,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuID, 
        }
      }];
```
I additionally created the layout for the bubble chart by adding a title, label for the x-axis, and the hovermode property:
```
    // Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        hovermode: otuLabels
      };
```
Then, I used the Plotly.newPlot() function to plot the “bubbleData” object and layout:
```
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
```
To create the gauge chart, I created the “metadataArray” variable to hold the object in the metadata array that matches the sample number:
```
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
```
Next, I created the “firstmetadataArray” variable to hold the first sample in the metadata array:
```
    // Create a variable that holds the first sample in the metadata array.
    var firstmetadataArray = metadataArray[0];
    console.log(firstmetadataArray);
```
I created the variable “washFreq” that converts the washing frequency to a floating point number:
```
    // Create a variable that holds the washing frequency.
    var washFreq = parseFloat(firstmetadataArray.wfreq);
    console.log(washFreq);
```
 The “washFreq” variable was assigned to the value property when making the gauge chart. To make the gauge chart I additionally set the type property to “indicator” and the mode property to “gauge+number”. I set the maximum range to 10, the bar colour to black, and assigned different colours as string values in increments of 2 to the steps object:
```
    // Create the trace for the gauge chart.
      var gaugeData = [{
        domain: {x: [0,1], y: [0,1]},
        value: washFreq,
        title: {text: "Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10]},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "lightgreen"},
            {range: [8,10], color: "green"}
          ],
          bar: { color: "black" }
        },
      }];
```
Then, I created the layout for the gauge chart:
```
    // Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 500,
        height: 400, 
        margin: { t: 0, b: 0 }
      };
```
Finally, I used the Plotly.newPlot() function to plot the “gaugeData” object and layout:
```
    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
```
## Customize the Dashboard
To further customize the dashboard, I added a paragraph in the jumbotron that provided additional information on the project and what each graph shows. I additionally customized the font to “courier”. The background and chart colours were similarly customized to follow a blue color theme.
