
// Initializes the page with a default plot
function init() {
    
    var ditems = document.getElementById("selDataset")

    // Use d3.json() to fetch data from JSON file
    // Incoming data is internally referred to as incomingData
    d3.json("data/samples.json").then((incomingData) => {
    
    // Iterate though data and create a DOM node to populate the dropdownmenu
    for (var i = 0; i < incomingData.names.length; i++) {
        var opt = incomingData.names[i];
        var el = document.createElement("option");
        el.text = opt;
        el.value = opt;
        ditems.appendChild(el);
    }

    // Get the first indexed data
    var id = incomingData.samples[0].id;
    var otu_ids = incomingData.samples[0].otu_ids;
    var otu_labels = incomingData.samples[0].otu_labels;
    var sample_values = incomingData.samples[0].sample_values;

    // Initialize arrays for container
    var x = [];
    var y = [];

    // Combine data to sort
    var list = [];
    for (var j = 0; j < sample_values.length; j++) 
        list.push({'otu_ids': otu_ids[j], 'sample_values': sample_values[j]});

    // Sort data z
    list.sort(function compareFunction(firstNum, secondNum) {
        // resulting order is (3, 2, 1)
        return secondNum[1] - firstNum[1];
    });

    // Seperate back out
    for (var k = 0; k < list.length; k++) {
        otu_ids[k] = list[k].otu_ids;
        sample_values[k] = list[k].sample_values;
    }

    // initialize new list for prefix list
    var newArr=[];

    for(var i = 0; i<otu_ids.length; i++){
        newArr[i] = 'OTU ' + otu_ids[i];
    }

    // Slice to only top 10 & Reverse for chart layout
    x = sample_values.slice(0,10).reverse();
    y = newArr.slice(0,10).reverse();

    data = [{
        x: x,
        y: y,
        type: 'bar',
        orientation:'h'}];
    
    var barlayout = {
        title: "Top 10 Bacteria Cultures Found"
    }
    
      Plotly.newPlot("bar", data, barlayout);

  // Part 2 - Bubble chart
  var trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
        color: otu_ids,
      size: sample_values
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'Bacteria Cultures per sample',
    xaxis: { title: "OTU ID"},
    showlegend: false,
    margin: { t: 50}
  };
  
  Plotly.newPlot('bubble', data, layout);


  // LIST SAMPLES

  // Then, select panel 
  var list = d3.select("#sample-metadata");

  // Clear existing data
  list.html("");

  // Get all the metadata of sample
  var metadata = incomingData.metadata;

  // Filter the data for the object with the desired sample number
  var resultArray = metadata.filter(sampleObj => sampleObj.id == id);
  // Get the first value 
  var result = resultArray[0];
  //Using object get entries and pair
  Object.entries(result).forEach(([key, value]) => {
    list.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
  });
}


// Call updatePlotly() when a change takes place to the DOM
    d3.selectAll("#selDataset").on("change", updatePlotly);

    // dropdown menu function when item is selected
    function updatePlotly() {

        //console.log(dataset);


        d3.json("data/samples.json").then((incomingData) => {
            var dropdownMenu = d3.select("#selDataset");
            // Assign the value of the dropdown menu option 
            var dataset = dropdownMenu.property("value");
            var ind = incomingData.names.indexOf(dataset);

            var id = incomingData.samples[ind].id;
            var otu_ids = incomingData.samples[ind].otu_ids;
            var otu_labels = incomingData.samples[ind].otu_labels;
            var sample_values = incomingData.samples[ind].sample_values;

            //console.log(sample_values)
            var x = [];
            var y = [];

            // Combine data to sort
            var list = [];
            for (var j = 0; j < sample_values.length; j++) 
                list.push({'otu_ids': otu_ids[j], 'sample_values': sample_values[j]});
 
            //2) Sort data 
            list.sort(function compareFunction(firstNum, secondNum) {
                // resulting order is (3, 2, 1)
                return secondNum[1] - firstNum[1];
            });

            //3) Seperate back out
            for (var k = 0; k < list.length; k++) {
                otu_ids[k] = list[k].otu_ids;
                sample_values[k] = list[k].sample_values;
            }

            // initialize new list for prefix list
            var newArr=[];

            for(var i = 0; i<otu_ids.length; i++){
                newArr[i] = 'OTU ' + otu_ids[i];
            }


            // Slice to only top 10 & Reverse for chart layout
            x = sample_values.slice(0,10).reverse();
            y = newArr.slice(0,10).reverse();

            Plotly.restyle("bar", "x", [x]);
            Plotly.restyle("bar", "y", [y]);

            // bubble chart
            var trace2 = {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: 'markers',
                marker: {
                  color: otu_ids,
                  size: sample_values
                }
              };
              
            var data = [trace2];

            var layout = {
                title: 'Bacteria Cultures per sample',
                xaxis: { title: "OTU ID"},
                showlegend: false,
                margin: { t: 30}
              };

            Plotly.newPlot('bubble', data, layout);

              // Then, select panel 
            var panel = d3.select("#sample-metadata");

            // Clear existing data
            panel.html("");

            // Get all the metadata of sample
            var metadata = incomingData.metadata;

            // Filter the data for the object with the desired sample number
            var resultArray = metadata.filter(sampleObj => sampleObj.id == id);
            
            // Get the first value 
            var result = resultArray[0];

            Object.entries(result).forEach(([key, value]) => {
                panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });

        });


    }

init();

    