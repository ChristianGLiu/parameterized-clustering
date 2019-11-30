/**
 * This function is to generate the correlation heatmap based on plotly lib
 * @param x the xaxis values
 * @param y the yaxis values
 * @param z the density of coordinates of heatmap
 * @param div the div element used for showing the heatmap
 */
function generateHeadMap(x, y, z, div) {
    trace1 = {
        type: 'heatmap',
        x: x,
        y: y,
        z: z,
        colorscale: 'YlOrRd',
        reversescale: true
    };
    let data = [trace1];
    layout = {
        title: {text: 'Correlation Matrix for variables'},
        width: 800,
        xaxis: {tickfont: {size: 8}},
        yaxis: {tickfont: {size: 8}},
        height: 600,
        margin: {l: 200},
        autosize: false
    };
    Plotly.plot(div, {
        data: data,
        layout: layout
    });
}