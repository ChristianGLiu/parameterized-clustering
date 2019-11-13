function generateHeadMap(x, y, z, div) {
    trace1 = {
        uid: '1b81c623-351b-4b17-b629-552cec57015c',
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