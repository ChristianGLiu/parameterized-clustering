/**
 *
 * @param name
 * @returns {string}
 */
function getRequest(name){
   var url_string = window.location.href; // www.test.com?filename=test
    var url = new URL(url_string);
    var paramValue = url.searchParams.get(name);
      return paramValue;
}

/**
 *
 */
function goToClustering(){
   $("#actual_cust").hide();
   $("#pred_cust").show();
   $("#actual_checkbox").checked = true;
}

/**
 *
 */
function goToActual(){
    $("#actual_cust").show();
   $("#pred_cust").hide();
   $("#actual_checkbox").checked = false;
}

document.addEventListener('DOMContentLoaded', function (event) {

    let jsonUrl = 'http://127.0.0.1:5000/read_iris';
    let jsonUrl_corr = 'http://127.0.0.1:5000/read_iris_correlation';
    let jsonUrl_cust = 'http://127.0.0.1:5000/read_iris_clustering';

    if(getRequest('data') === 'wine') {
        jsonUrl = 'http://127.0.0.1:5000/read_wine';
        jsonUrl_corr = 'http://127.0.0.1:5000/read_wine_correlation';
        jsonUrl_cust = 'http://127.0.0.1:5000/read_wine_clustering';
    }

    if(getRequest('data') === 'car') {
        jsonUrl = 'http://127.0.0.1:5000/read_car';
        jsonUrl_corr = 'http://127.0.0.1:5000/read_car_correlation';
        jsonUrl_cust = 'http://127.0.0.1:5000/read_car_clustering';
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

        jsonObj.forEach(function(element){
            let tempArr = [];
            firstRow.forEach(function(aValue){
               tempArr.push(element[aValue]);
            });
            finalArr.push(tempArr);
        });

        generateHeadMap(firstRow, firstRow, finalArr, 'matrix_mainPanel');

    });

    //generate assignment 4 clustering new pred labels
    d3.json(jsonUrl_cust, function (error, data) {
        let jsonObj_orig = JSON.parse(data.df);
        let jsonObj = JSON.parse(data.new_df);
        init(jsonObj, "#cluster_mainPanel");
        init(jsonObj_orig, "#cluster_mainPanel_orig");

    });

    $( "#cluster_toolbar_parameters input" ).change(function() {
         tuneupParameters(jsonUrl_cust, $("#n_clusters").val(), $('#n_init').val(), $('#random_state').val(), $('#algorithm').val());
    });

    $( "#cluster_toolbar_parameters select" ).change(function() {
        //$( "select#foo option:checked" ).val();
         tuneupParameters(jsonUrl_cust, $("#n_clusters").val(), $('#n_init').val(), $('#random_state').val(), $('#algorithm').val());
    });

    $("#actual_cust").hide();

    /**
 *
 * @param jsonUrl_cust
 * @param n_clusters
 * @param init
 * @param n_init
 * @param random_state
 * @param algorithm
 */
function tuneupParameters(jsonUrl_cust, n_clusters, n_init, random_state, algorithm) {
    //generate assignment 4 clustering new pred
    let requestParameter = '?n_clusters='+n_clusters;
    requestParameter += '&n_init='+n_init;
    requestParameter += '&random_state='+random_state;
    requestParameter += '&algorithm='+algorithm;
    let finalUrl = jsonUrl_cust + requestParameter;
     $('#cluster_mainPanel').empty();
    d3.json(finalUrl, function (error, data) {
        let jsonObj_orig = JSON.parse(data.df);
        let jsonObj = JSON.parse(data.new_df);
        init(jsonObj, "#cluster_mainPanel");
        init(jsonObj_orig, "#cluster_mainPanel_orig");

    });
}

    setTimeout(function () {
        $("#tabs").tabs();
    }, 3000);




});

