function buildMetadata(sample) {

  // Fetch the metadata for a sample
  var metadataURL = "/metadata/" + sample;

  // Select the panel 
  var metadataPanel = d3.select("#sample-metadata");

  // Clear any existing metadata
  metadatPanel.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  d3.json(metadataURL).then(function (data) {
    Object.entries(data).forEach(([key, value]) => {
      metadataPanel.append("h6").text(`${key}: ${value}`
      );
    })

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  //var level = data.WFREQ;

function buildCharts(sample) {

  // Fetch the sample data for the plots
  var chartsURL = "/samples/" + sample;
  d3.json(chartsURL).then(function (data) {

  // Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values,
    
        colorscale: "Earth"
      }
    };
    var trace1 = [trace1];
    var layout = {
      showlegend: false,
      height: 600,
      width: 1500
    };

    Plotly.newPlot('bubble', trace1, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace2 = {
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      //hoverinfo: data.otu_labels.slice(0, 10)
      type: 'pie'
    };

    // data
    var piedata = [trace2];

    
    var layout2 = {
      title: 'Belly Button Bacteria Types',
      showlegend: true,
      height: 400,
      width: 400
    };

    Plotly.newPlot("pie", piedata, layout2);

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
