function init() {
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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

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

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var firstsamplesArray = samplesArray[0];
    console.log(firstsamplesArray);

    // Create a variable that holds the first sample in the metadata array.
    var firstmetadataArray = metadataArray[0];
    console.log(firstmetadataArray);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstsamplesArray.otu_ids;
    var otuLabels = firstsamplesArray.otu_labels;
    var sampleValues = firstsamplesArray.sample_values;

    console.log(otuID);
    console.log(otuLabels);
    console.log(sampleValues);

    // Create a variable that holds the washing frequency.
    var washFreq = parseFloat(firstmetadataArray.wfreq);
    console.log(washFreq);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuID.slice(0,10).map(id => `OTU ${id}`).reverse();
    
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
      title: "Top 10 Bacteria Cultures Found", 
      font: {family: "courier"}
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuID,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuID, 
          colorscale: 'YlGnBu'
        }
      }];
    
    // Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        hovermode: otuLabels,
        font: {family: "courier"}
      };
    
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

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
            {range: [0,2], color: "blue"},
            {range: [2,4], color: "royalblue"},
            {range: [4,6], color: "dodgerblue"},
            {range: [6,8], color: "lightskyblue"},
            {range: [8,10], color: "lightcyan"}
          ],
          bar: { color: "black" }
        },
      }];
        
    // Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 500,
        height: 400, 
        margin: { t: 0, b: 0 },
        font: {family: "courier"}
      };
    
    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};
