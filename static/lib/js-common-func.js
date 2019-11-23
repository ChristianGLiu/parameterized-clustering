//a global varible to wait for data coming out from backend
// for assignment 1 data will use more time
let timeout = 5000;

/**
 *
 * @param name
 * @returns {string}
 */
function getRequest(name) {
    let url_string = window.location.href; // www.test.com?filename=test
    let url = new URL(url_string);
    let paramValue = url.searchParams.get(name);
    return paramValue;
}

/**
 *
 */
function goToClustering() {
    $("#actual_cust").hide();
    $("#pred_cust").show();
    $("#actual_checkbox").checked = true;
}

/**
 *
 */
function goToActual() {
    $("#actual_cust").show();
    $("#pred_cust").hide();
    $("#actual_checkbox").checked = false;
}

/**
 *
 * @param allRows
 * @param columns
 * @param graphOptions
 */
function generateTables(allRows, graphOptions) {

    let columns = Object.keys(allRows);

    function toArray(column) {
        let map_y = new Map(Object.entries(allRows[column]));
        let Y = Array.from(map_y.values());
        return Y;
    }

    let values = [];
    let dataValues = [];
    for (ii = 0; ii < columns.length; ii++) {
        let Y = toArray(columns[ii]);
        values.push(Y);
        dataValues.push(["<b>" + columns[ii] + "</b>"]);
    }


    let data = [{
        type: 'table',
        header: {
            values: dataValues,
            align: "center",
            line: {width: 1, color: 'black'},
            fill: {color: "grey"},
            font: {family: "Arial", size: 12, color: "white"}
        },
        cells: {
            values: values,
            align: "center",
            line: {color: "black", width: 1},
            font: {family: "Arial", size: 11, color: ["black"]}
        }
    }];


    Plotly.plot(graphOptions['div'], data);
}

document.addEventListener('DOMContentLoaded', function (event) {
    // add loading state
    let newDiv = document.createElement('div');
    newDiv.className = '_dash-loading-callback';
    newDiv.id = 'loading';
    document.body.appendChild(
        newDiv,
        document.getElementById('content'));
    // end of loading state

    let jsonUrl = '/read_iris';
    let jsonUrl_corr = '/read_iris_correlation';
    let jsonUrl_cust = '/read_iris_clustering';
    let jsonUrl_table = '/show_table?table=iris';
    timeout = 3000;

    if (getRequest('data') === 'wine') {
        jsonUrl = '/read_wine';
        jsonUrl_corr = '/read_wine_correlation';
        jsonUrl_cust = '/read_wine_clustering';
        jsonUrl_table = '/show_table?table=wine';
        timeout = 3000;
    }

    if (getRequest('data') === 'car') {
        jsonUrl = '/read_car';
        jsonUrl_corr = '/read_car_correlation';
        jsonUrl_cust = '/read_car_clustering';
        jsonUrl_table = '/show_table?table=car';
        timeout = 3000;
    }

    if (getRequest('data') === 'assignment1') {
        jsonUrl = '/read_assignment1';
        jsonUrl_corr = '/read_assignment1_correlation';
        jsonUrl_cust = '/read_assignment1_clustering';
        jsonUrl_table = '/show_table?table=assignment1';
        timeout = 10000;
    }

    console.log("jsonUrl:", jsonUrl);

    //generate assignment 2 Radviz from backend REST service response
    d3.json(jsonUrl, function (error, data) {
        let jsonObj = JSON.parse(data);

        init(jsonObj, "#mainPanel");

    });

    //generate Heatmap from backend REST service response
    d3.json(jsonUrl_corr, function (error, data) {
        let jsonObj = JSON.parse(data);
        let firstRow = Object.keys(jsonObj[0]);

        let finalArr = [];

        jsonObj.forEach(function (element) {
            let tempArr = [];
            firstRow.forEach(function (aValue) {
                tempArr.push(element[aValue]);
            });
            finalArr.push(tempArr);
        });

        generateHeadMap(firstRow, firstRow, finalArr, 'matrix_mainPanel');

    });

    //generate assignment 4 clustering new pred labels
    d3.json(jsonUrl_cust, function (error, data) {
        let score = data.score;
        let jsonObj_orig = JSON.parse(data.df);
        let jsonObj = JSON.parse(data.new_df);
        $('#ari_score').html(score);
        init(jsonObj, "#cluster_mainPanel");
        init(jsonObj_orig, "#cluster_mainPanel_orig");

    });

    generatePlot(jsonUrl_table, generateTables,
        {
            'title': 'Retrieval Table View',
            'div': 'myDiv_table'
        });

    $("#submit").click(function () {
        newDiv = document.createElement('div');
        newDiv.className = '_dash-loading-callback';
        newDiv.id = 'loading';
        document.body.appendChild(
            newDiv,
            document.getElementById('content'));
        tuneupParameters(jsonUrl_cust, $("#n_clusters").val(), $('#n_init').val(), $('#random_state').val(), $('#batch_size').val());
    });


    $("#actual_cust").hide();


    /**
     *
     * @param jsonUrl
     * @param func
     * @param columns
     * @param graphOptions
     */
    function generatePlot(jsonUrl, func, graphOptions) {
        console.log("generate plot " + jsonUrl);
        d3.json(jsonUrl, function (error, data) {
            if (error) {
                console.warn(error);
            }
            //console.log("generate plot" + data);
            func(data, graphOptions)
        });
    }

    /**
     *
     * @param jsonUrl_cust
     * @param n_clusters
     * @param init
     * @param n_init
     * @param random_state
     * @param batch_size
     */
    function tuneupParameters(jsonUrl_cust, n_clusters, n_init, random_state, batch_size) {
        //generate assignment 4 clustering new pred
        let requestParameter = '?n_clusters=' + n_clusters;
        requestParameter += '&n_init=' + n_init;
        requestParameter += '&random_state=' + random_state;
        requestParameter += '&batch_size=' + batch_size;
        let finalUrl = jsonUrl_cust + requestParameter;
        $('#cluster_mainPanel').empty();
        d3.json(finalUrl, function (error, data) {
            let score = data.score;
            let jsonObj_orig = JSON.parse(data.df);
            let jsonObj = JSON.parse(data.new_df);
            $('#ari_score').html(score);
            init(jsonObj, "#cluster_mainPanel");
            init(jsonObj_orig, "#cluster_mainPanel_orig");

            setTimeout(function () {
                document.getElementById('loading').remove();
            }, 2000);

        });
    }


//
// generatePlot('/show_table?department_id=1', generateTables,
//         ['product_id', 'product_name', 'order_hour_of_day', 'order_dow', 'counts'], {
//             'title': 'Retrieval Table View',
//             'div': 'myDiv_table'
//         });

    setTimeout(function () {
        $("#tabs").tabs();
        document.getElementById('loading').remove();
    }, timeout);


});

