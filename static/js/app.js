function buildMetadata(sample) {

  let metadata_url = `metadata/${sample}`
  d3.json(metadata_url).then(function(data) {
    console.log(data);

    let myHTML = d3.select("#sample-metadata");
    myHTML.html("");
    Object.keys(data).forEach(key=>{
      myHTML.append('p').text(key+": "+data[key]);
    })
    
  })

  
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  let samples_url = `samples/${sample}`
  d3.json(samples_url).then(function(data) {

    var pie_data = [{
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      text: data.otu_labels.slice(0,10),
      type: 'pie'
    }];
    
    var pie_layout = {
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('pie', pie_data, pie_layout);

    var bubble_trace = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
      }
    };
    
    var bubble_data = [bubble_trace];
    
    var bubble_layout = {
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', bubble_data, bubble_layout);
  });
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
