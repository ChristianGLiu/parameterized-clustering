//a global varible to wait for data coming out from backend
// for assignment 1 data will use more time
let timeout = 5000;

/**
 * This function is to get HTTP REQUEST parameters
 * @param name
 * @returns {string}
 */
function getRequest(name) {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let paramValue = url.searchParams.get(name);
    return paramValue;
}

/**
 * this function is to switch back to forth of predictive and actual clustering
 */
function goToClustering() {
    $("#actual_cust").hide();
    $("#pred_cust").show();
    $("#actual_checkbox").checked = true;
}

/**
 * this function is to switch back to forth of predictive and actual clustering
 */
function goToActual() {
    $("#actual_cust").show();
    $("#pred_cust").hide();
    $("#actual_checkbox").checked = false;
}

/**
 * this function is to showing the tabular view data directly from backend REST json call
 * @param allRows JSON formatted data comes from backend
 * @param columns What columns need to be dealt with in this cased
 * @param graphOptions the addtional graphOptions to tune up the charts
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

/**
 * the automatic loading function flow after page loading
 */
document.addEventListener('DOMContentLoaded', function (event) {
    // add loading state to lock the screen when backend working with data
    // this small piece of code snippet credit to https://community.plot.ly/t/dash-loading-states/5687
    let newDiv = document.createElement('div');
    newDiv.className = '_dash-loading-callback';
    newDiv.id = 'loading';
    document.body.appendChild(
        newDiv,
        document.getElementById('content'));
    // end of loading state

    // initilize the REST URL for different calls
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
        if (typeof data.score !== 'undefined') {
            $('#ari_score').html(score);
            init(jsonObj, "#cluster_mainPanel");
            init(jsonObj_orig, "#cluster_mainPanel_orig");
            $("#error_msg").hide();
        } else {
            $("#error_msg").html(data.error);
            $("#error_msg").show();
        }

    });

    // generate tabular view on the page
    generatePlot(jsonUrl_table, generateTables,
        {
            'title': 'Retrieval Table View',
            'div': 'myDiv_table'
        });

    // whenever user tries to input hyperparameters, reset error message
    $("#cluster_toolbar_parameters input").click(function(){
        $("#error_msg").hide();
    });


    // add click event action to submit button to tune up the hyperparameters of clustering
    $("#submit").click(function () {
        let error_msg  = '';
        if(!$.isNumeric($("#n_clusters").val()) && $("#n_clusters").val() != '') {
            error_msg += '  n_clusters has to be digit number;';
            $("#error_msg").html(error_msg);
            $("#error_msg").show();
            return;
        }
        if(!$.isNumeric($("#batch_size").val()) && $("#batch_size").val() != '') {
            error_msg += '  batch_size has to be digit number;';
            $("#error_msg").html(error_msg);
            $("#error_msg").show();
            return;
        }
        if(!$.isNumeric($("#n_init").val()) && $("#n_init").val() != '') {
            error_msg += '  n_init has to be digit number;';
            $("#error_msg").html(error_msg);
            $("#error_msg").show();
            return;
        }
        newDiv = document.createElement('div');
        newDiv.className = '_dash-loading-callback';
        newDiv.id = 'loading';
        document.body.appendChild(
            newDiv,
            document.getElementById('content'));
        tuneupParameters(jsonUrl_cust, $("#n_clusters").val(), $('#n_init').val(), $('#random_state').val(), $('#batch_size').val());
    });


    // by default we hide the actual classifiction, by default we show the predictive clustering of K-man on the page
    // the can swtich one to another based on the assignment requirements
    $("#actual_cust").hide();


    /**
     * The reusable function comes from my own code of group project, it is to generate different types of plot
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
     * This function specifically tune up the parameter of K-mean clustering
     * @param jsonUrl_cust the REST service call url
     * @param n_clusters how many clusters
     * @param init what is initilized way
     * @param n_init how much levels for the initilaiztion
     * @param random_state how much randomization of data selection
     * @param batch_size what the batcch size used for clustering
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
            if (typeof data.score !== 'undefined') {
                let score = data.score;
                let jsonObj_orig = JSON.parse(data.df);
                let jsonObj = JSON.parse(data.new_df);
                $('#ari_score').html(score);
                init(jsonObj, "#cluster_mainPanel");
                init(jsonObj_orig, "#cluster_mainPanel_orig");
            } else {
                $("#error_msg").html(data.error);
                $("#error_msg").show();
            }

            setTimeout(function () {
                    document.getElementById('loading').remove();
                }, 2000);

        });
    }

    /**
     * this function is trying to resolved the issue of HTTP header returns before the data calculated in back-end
     * espeically for large data set ML
     */
    setTimeout(function () {
        $("#tabs").tabs();
        document.getElementById('loading').remove();
    }, timeout);


});

