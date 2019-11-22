/**
 * This JS function comes from my assignment 2, part of the data point coordination forum is from
 *
 */
(function () {

    //define global variables;

    //define the convas size
    let width = 1200;
    let height = 850;

    //define the margin of cconvas to the full screen
    let margin = {
        top: 50,
        bottom: 150,
        left: 250,
        right: 0
    };


    //D3 has build in color schema, but I want to use customized colors
    let dataColor = d3.scaleOrdinal().range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"]); //set color scheme
    //define the D3 actual chart radius
    let radius = Math.min((height - margin.top - margin.bottom), (width - margin.left - margin.right)) / 2;
    //define the features containers for tool bar
    let convertedData = {};
    let featureNodes = [];
    let features = [];
    let featureNames = [];
    let anchorColor = [];
    let anchorLabels = [];
    let sliderClasses = [];
    //in case we want to keep both original x,y value of data node, we assign new x,y to new attribute name
    let suffix = '_after';
    //define the dataframe after normalization
    let dataAfter = [];
    //define the label of dataframe
    let target;

    let divPrefix = '';

    /**
     * different weight stretegy for star coordinates feature nodes
     * input parameters:
     *   odf: original data frame;
     *   ofeatures: origin feature data;
     *   olabels:  labels;
     *   isNormalized: it identify DF is normalized or not, in case seoond tiime process data
     * output :  the new updated  data nodes
     */
    function dataFrameConverter(odf, ofeatures, olabels, isNormalized) {
        let newodf = {};

        ofeatures.forEach(function(d,i){
            newodf[d] = [];
            newodf[d+'_max'] = 0;
            newodf[d+'_min'] = 0;
            newodf[d+'_diff'] = 0;
        });
        newodf['max'] = 0;

        odf.forEach(function(temp) {
            Object.keys(temp).forEach(function(key) {
                if(ofeatures.indexOf(key)>-1) {
                    // push must be numerical values
                    if(isNormalized) {
                        newodf[key].push(Number(temp[key+suffix]));
                    } else {
                        newodf[key].push(Number(temp[key]));
                    }
                }
            });
        });

        ofeatures.forEach(function(d,i){
            newodf[d+'_max'] = Math.max.apply(null,newodf[d]);
            newodf[d+'_min'] = Math.min.apply(null,newodf[d]);
            newodf[d+'_diff'] = newodf[d+'_max'] - newodf[d+'_min'];
            if(newodf[d+'_diff']>newodf['max']) {
                newodf['max'] = newodf[d+'_diff'];
            }
        });

        return newodf;
    }

    /**
     * locate the data node in D3 canvas, it is different from radviz,
     * everyytime drag feature nodes longer, it will entend data nodes as well
     * input parameters:
     *   tempData: detaframe;
     *   featureNames: feature names;
     *   feature attributs key/value pairs
     * output :  the new updated coordinates feature nodes
     */
    function locateNode(tempData, featureNames, features) {

        tempData.forEach(function (d) {
            let dsum = d.dsum, dx = 0, dy = 0;
            featureNames.forEach(function (k, i) {
                featureNodes.forEach(function(dd) {
                    if(dd.name == k) {
                        dx += Math.cos(features[i]) * d[k + suffix] * dd.rate;
                        dy += Math.sin(features[i]) * d[k + suffix] * dd.rate;
                    }
                });

            }); // dx & dy
            d.x0 = dx / dsum;
            d.y0 = dy / dsum;
          //  console.log("data position:",dx,dy,dsum);
            d.dist = Math.sqrt(Math.pow(dx / dsum, 2) + Math.pow(dy / dsum, 2)); // calculate r
            d.distH = Math.sqrt(Math.pow(dx / dsum, 2) + Math.pow(dy / dsum, 2)); // calculate r
            d.theta = Math.atan2(dy / dsum, dx / dsum) * 180 / Math.PI;
        });
        return tempData;
    } // end of function locateNode()


    /**
     * relocate data nodes , gives differnt angel when moving feature nodes.
     * gives new weigh for each impacted nodes.
     * input parameters:
     *   d: detaframe;
     *   newAngle: new angle after dragging
     *   tempx: the move anchor coordinate x;
     *   tempy: the mouse anchor coordinate y;
     * output :  the new updated normalized data frames
     */
    function relocateNode(d, newAngle, tempx, tempy) {
        newAngle = newAngle < 0 ? 2 * Math.PI + newAngle : newAngle;
        d.theta = newAngle;
        let newLength = Math.sqrt(tempx**2 + tempy**2);
        d.x = radius + tempx;
        d.y = radius + tempy;
        d.rate = newLength/d.origLength;
        return d;
    }


    /**
     * normalize the origin data to sclae the values
     * input parameters:
     *   data: detaframe;
     * output :  the new updated normalized data frames
     */
    function normailzeData(data, cdata) {
        //here we apply star coodrinate calculation
        data.forEach(function (d) {
            features.forEach(function (dimension) {
                d[dimension + suffix] = (Number(d[dimension])-cdata[dimension+'_min'])/(cdata[dimension+'_max']- cdata[dimension+'_min']);
            });
        });
        data.forEach(function (d) {
            let dsum = 0;
            featureNames.forEach(function (k) {
                dsum += d[k];
            }); // sum
            d.dsum = dsum;
        });
        return data;
    }//


    /**
     * the actual executed function when page loading
     * @param data : raw data from files
     */
    function init(data, div_mainpanel) {
        /*
        suppose the first row is feature names, and last column is label, it will be initilized in function
        dynamically generate the features and labels from raw data
         */
        let firstRow = Object.keys(data[0]);
        features = firstRow.slice(0, firstRow.length-1);
        //get target from first row
        target = firstRow.slice(firstRow.length-1);

        //init feature name with after suffix (new)
        featureNames = features.map(function (d) {
            return d + suffix;
        });

        //specify div id prefix
        divPrefix = div_mainpanel;

        //call function to use min-max scale values of data
        convertedData = dataFrameConverter(data, features, target, false);

        //locate main panel in haml
        let mainPanel = d3.select(div_mainpanel);

        //clean up exist element everytime refreshing page
        mainPanel.selectAll('svg').remove();

        let featureAnchor = Array.apply(null, {length: features.length}).map(Number.call, Number).map(x => x * 2 * Math.PI / (features.length)); // intial DA configration;
        featureAnchor = featureAnchor.slice();
        let titles = d3.keys(data[0]).unshift('index');

        dataAfter = data.slice();
        dataAfter = normailzeData(dataAfter, convertedData);

        //for star coodinates

        //dataAfter, include more attributes.
        dataAfter.forEach((d, i) => {
            d.index = i;
            d.id = i;
            d.color = dataColor(d[target]);
            d.shape = 'circle';
        });


        // prepare the features data
        featureNodes = features.map(function (d, i) {
            let origx = Math.cos(featureAnchor[i]) * radius;
            let origy = Math.sin(featureAnchor[i]) * radius;

            return {
                theta: featureAnchor[i], //[0, 2*PI]
                // this is going to different from radviz
                x: origx + radius,
                y: origy + radius,
                fixed: true,
                name: d,
                origLength: Math.sqrt(origx**2 + origy**2),
                rate: 1
            };
        });

        dataAfter = locateNode(dataAfter, features, featureAnchor); // locateNode. need update when DAs move.

        let svg = mainPanel.append('svg').attr('id', 'star_coordinates')
            .attr('width', width)
            .attr('height', height);


        //add hover information
        let hoverText = svg.append('g')
            .attr('class', 'tip')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('display', 'none');

        let tooltip = hoverText.selectAll('text').data(titles)
            .enter().append('g').attr('x', 0).attr('y', function (d, i) {
                return 25 * i;
            });
        tooltip.append('rect').attr('width', 150).attr('height', 25).attr('x', 0).attr('y', function (d, i) {
            return 25 * i;
        }).attr('fill', d3.rgb(200, 200, 200));
        tooltip.append('text').attr('width', 150).attr('height', 25).attr('x', 5).attr('y', function (d, i) {
            return 25 * (i + 0.5);
        }).text(d => d + ':').attr('text-anchor', 'start').attr('dominat-baseline', 'hanging');

        let center = svg.append('g').attr('class', 'center').attr('id', 'center').attr('transform', `translate(${margin.left},${margin.top})`);

        //draw a big circle as panel:
        let main_panel = center.append('circle')
            .attr('class', 'big-circle')
            .attr('stroke', 'grey')
            .attr('stroke-width', 0.2)
            .attr('fill', 'transparent')
            .attr('r', radius)
            .attr('cx', radius)
            .attr('cy', radius);

        //draw center point:
        //draw a big circle as panel:
        let centerPoint = center.append('circle')
            .attr('class', 'big-circle')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.2)
            .attr('fill', 'black')
            .attr('r', 5)
            .attr('cx', radius)
            .attr('cy', radius);

        // prepare the  tips
        svg.append('rect').attr('class', 'hoverTextContainer');
        let featuresHoverTextContainer = svg.append('g').attr('x', 0).attr('y', 0);
        let featureHoverText = featuresHoverTextContainer.append('g')
            .attr('class', 'featuresText')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('display', 'none');
        featureHoverText.append('rect');
        featureHoverText.append('text').attr('width', 150).attr('height', 25)
            .attr('x', 0).attr('y', 25)
            .text(':').attr('text-anchor', 'start').attr('dominat-baseline', 'middle');
        // prepare DT tooltip components
        svg.append('rect').attr('class', 'hoverTextSquare')
            .attr('width', 80).attr('height', 200)
            .attr('fill', 'transparent')
            .attr('backgroundColor', d3.rgb(100,100,100));
        svg.append('g')
            .attr('class', 'tip')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .attr('display', 'none');


        /**
         * dynamically rerend the data when moving anchors
         * @returns {chart}
         */
        function renderData() {
            function chart(div) {
                div.each(function() {
                    /**
                     * step 1: prepare feature nodes on canvas
                     */
                    function prepareFeatureNodes() {
                        center.selectAll('circle.featureNodes').remove();
                        center.selectAll('circle.featureNodes')
                            .data(featureNodes)
                            .enter().append('circle').attr('class', 'featureNodes')
                            .attr('fill', 'black')
                            .attr('stroke', 'black')
                            .attr('stroke-width', 1)
                            .attr('r', 1)
                            .attr('cx', d => d.x)
                            .attr('cy', d => d.y)
                            .call(d3.drag()
                                .on('start', function (d) {
                                    d3.select(this).raise().classed('active', true);
                                })
                                .on('drag', function (d, index) {
                                    d3.select(this).raise().classed('active', true);
                                    let tempx = d3.event.x - radius;
                                    let tempy = d3.event.y - radius;

                                    let newAngle = Math.atan2(tempy, tempx);
                                    d = relocateNode(d, newAngle, tempx, tempy);
                                    d3.select(this).attr('cx', d.x).attr('cy', d.y);
                                    prepareFeatureNodes();
                                    //update data points
                                    featureAnchor[index] = newAngle;
                                    locateNode(dataAfter, features, featureAnchor, d);
                                    prepareDataNodes();
                                })
                                .on('end', function (d) {
                                    d3.select(this).classed('active', false);
                                    d3.select(this).attr('stroke-width', 0);
                                })
                            );

                        //redraw each dimention line
                        center.selectAll('line.featureLines').remove();
                        center.selectAll('line.featureLines')
                            .data(featureNodes)
                            .enter()
                            .append("line").attr('class', 'featureLines')
                            .attr('stroke', 'black')
                            .attr('stroke-width', 1)
                            .attr("x1" , radius)
                            .attr("y1" , radius)

                            .attr("x2" , d=>d.x)
                            .attr("y2" , d=>d.y);


                        //add label to attributes
                        center.selectAll('text.featurelabel').remove();
                        center.selectAll('text.featurelabel')
                            .data(featureNodes).enter().append('text').attr('class', 'featurelabel')
                            .attr('x', d => d.x).attr('y', d => d.y)
                            .attr('text-anchor', d => Math.cos(d.theta) > 0 ? 'start' : 'end')
                            .attr('dominat-baseline', d => Math.sin(d.theta) < 0 ? 'baseline' : 'hanging')
                            .attr('dx', d => Math.cos(d.theta) * 15)
                            .attr('dy', d => Math.sin(d.theta) < 0 ? Math.sin(d.theta) * (15) : Math.sin(d.theta) * (15) + 10)
                            .text(d => d.name)
                            .attr('font-size', '15pt')
                            .call(d3.drag()
                                .on('start', function (d) {
                                    d3.select(this).raise().classed('active', true);
                                })
                                .on('drag', function (d, index) {
                                    d3.select(this).raise().classed('active', true);
                                    let tempx = d3.event.x - radius;
                                    let tempy = d3.event.y - radius;
                                    let newAngle = Math.atan2(tempy, tempx);
                                    d = relocateNode(d, newAngle, tempx, tempy);
                                    d3.select(this).attr('cx', d.x).attr('cy', d.y);
                                    prepareFeatureNodes();
                                    //update data points
                                    featureAnchor[index] = newAngle;
                                    locateNode(dataAfter, features, featureAnchor , d);
                                    prepareDataNodes();
                                })
                                .on('end', function (d) {
                                    d3.select(this).classed('active', false);
                                    d3.select(this).attr('stroke-width', 0);
                                })
                            );

                    }

                    prepareFeatureNodes();

                    /**
                     * step 2: prepare data nodes on convas
                     */
                    function prepareDataNodes() {
                        center.selectAll('.data-node').remove();
                        center.selectAll('.data-node')
                            .data(dataAfter).enter()
                            .append(function (d) {
                                return document.createElementNS(d3.namespaces.svg, d.shape)
                            })
                            .attr('class', 'data-node')
                            //.append("path")
                            .attr('id', d => d.index)
                            .on('mouseenter', function (d) {
                                console.log("mouse over:");
                                let mouse = d3.mouse(this); //get current mouse position.

                                let tip = svg.select('g.featuresText').selectAll('text');
                                tip.selectAll('tspan').remove();
                                let tipHeight = 0;
                                features.forEach((di, ii) => {

                                    tipHeight += 30;
                                    if(di && di.length > 0) {
                                        tip.append('svg:tspan')
                                            .attr('x', 0)
                                            .attr('dy', 20)
                                            .text(function (dddd) {
                                                return di + ' : ' + d[di];
                                            });
                                    }
                                });
                                svg.select('g.featuresText').attr('transform', `translate(${margin.left + mouse[0] - 50},${margin.top + mouse[1] - tipHeight})`);
                                // display the tip
                                svg.select('g.featuresText').attr('display', 'block').style('fill', 'black');
                                // highlight the point
                                d3.select(this).attr('stroke-width', 1).raise().transition()
                                    .attr('r', function (d) {
                                        if (d.shape == 'circle') {
                                            return 10;
                                        } else {
                                            return null;
                                        }
                                    })
                                    .attr('width', function (d) {
                                        if (d.shape == 'rect') {
                                            return 20;
                                        } else {
                                            return null;
                                        }
                                    })
                                    .attr('height', function (d) {
                                        if (d.shape == 'rect') {
                                            return 20;
                                        } else {
                                            return null;
                                        }
                                    })
                                    .attr('rx', function (d) {
                                        if (d.shape == 'ellipse') {
                                            return 20;
                                        } else {
                                            return null;
                                        }
                                    })
                                    .attr('ry', function (d) {
                                        if (d.shape == 'ellipse') {
                                            return 10;
                                        } else {
                                            return null;
                                        }
                                    });
                            })
                            .attr('r', 5)
                            .attr('cx', d => d.x0 * radius + radius)
                            .attr('cy', d => d.y0 * radius + radius)
                            //tried to apply for different shapes, but too complex to an assignment
                            .attr('r', function (d) {
                                if (d.shape == 'circle') {
                                    return 5;
                                } else {
                                    return null;
                                }
                            })
                            .attr('fill', d => d.color)
                            .style("opacity", 1.0)
                            .attr('stroke', 'black')
                            .attr('stroke-width', 0.2)


                            .on('mouseout', function (d) {
                                // close the tips.
                                svg.select('g.featuresText').attr('display', 'none');
                                // dis-highlight the point
                                d3.select(this).transition().attr('r', function (d) {
                                    if (d.shape == 'circle') {
                                        return 5;
                                    } else {
                                        return null;
                                    }
                                })
                                    .attr('width', function (d) {
                                        if (d.shape == 'rect') {
                                            return 10;
                                        } else {
                                            return null;
                                        }
                                    })
                                    .attr('height', function (d) {
                                        if (d.shape == 'rect') {
                                            return 10;
                                        } else {
                                            return null;
                                        }
                                    })
                                    .attr('rx', function (d) {
                                        if (d.shape == 'ellipse') {
                                            return 10;
                                        } else {
                                            return null;
                                        }
                                    })
                                    .attr('ry', function (d) {
                                        if (d.shape == 'ellipse') {
                                            return 5;
                                        } else {
                                            return null;
                                        }
                                    }).attr('stroke-width', 0.2);
                            });
                    }

                    prepareDataNodes();
                    anchorColor = [];
                    anchorLabels = [];
                    sliderClasses = [];
                    let featureLables = '#toolbar_featureLables';
                    let featureSliders = '#toolbar_featureSliders';
                    if(divPrefix === '#cluster_mainPanel') {
                        featureLables = '#cluster_toolbar_featureLables';
                        featureSliders = '#cluster_toolbar_featureSliders';
                    }
                    if(divPrefix === '#cluster_mainPanel_orig') {
                        featureLables = '#cluster_toolbar_featureLables_orig';
                        featureSliders = '#cluster_toolbar_featureSliders_orig';
                    }
                    d3.select(featureLables).selectAll(".circle").remove();
                    d3.select(featureLables).selectAll('.text').remove();
                    d3.select("#slider").selectAll("input").remove();

                    dataAfter.forEach(function (d, i) {
                        if (anchorColor.indexOf(d.color) < 0) {
                            anchorColor.push(d.color);
                            anchorLabels.push(d[target]);
                            sliderClasses.push(d[target]);
                        }
                    });

                    /**
                     * step 3: prepare the tool bar including:
                     * opacity slides;
                     * select file function;
                     * feature labels;
                     */
                    function prepareToolbar() {
                        //clean up canvas firstly
                        d3.select(featureLables).selectAll('svg').remove();
                        let toolbarfeatureLables = d3.select(featureLables).append('svg').append('g');
                        //add slider
                        // Slider
                        d3.select("#slider").append("input")
                            .attr("type", "range")
                            .attr("min", 0)
                            .attr("max", 100)
                            .attr("step", "1")
                            .attr("id", "color-opacity")
                            //  .style("transform", 'rotate(270deg)')
                            .style("width", '200px')


                            .on("input", function input() {
                                center.selectAll('.data-node')
                                    .transition()
                                    .duration(1000)
                                    .ease(d3.easeLinear)
                                    .style("opacity", d3.select("#color-opacity").property("value") * 1 / 100)
                                ;

                            });

                        toolbarfeatureLables.selectAll('circle.circle').data(anchorColor)
                            .enter().append('circle').attr('class', 'circle')
                            .attr('r', 5)
                            .attr('cx', 10)
                            .attr('cy', (d, i) => 10 + i * 25)
                            .attr('fill', d => d);

                        d3.select(featureSliders).selectAll('input.slider').remove();
                        d3.select(featureSliders).selectAll('input.slider').data(sliderClasses)
                            .enter().append('input').attr('class', 'slider')
                            .attr("type", "range")
                            .attr('x', 5)
                            .attr('y', (d, i) => 10 + i * 25 + 5)

                            .attr("min", 0)
                            .attr("max", 100)
                            .attr("step", "1")
                            .style("width", '200px')
                            .attr("id", d => "slider" + d)

                            .on("input", function (d) {
                                //when mouse hover, other classes will be discolored.
                                let thisOpacity = this.value;
                                mainPanel.selectAll('.data-node').nodes().forEach((element) => {
                                    let tempIndex = element.getAttribute('id');
                                    //  console.log("temp index:", tempIndex, dataAfter[tempIndex].Class, d);
                                    if (dataAfter[tempIndex][target] == d) {
                                        d3.select(element)
                                            .transition()
                                            .duration(1000)
                                            .ease(d3.easeLinear)
                                            .style("opacity", thisOpacity * 1 / 100);
                                    }
                                });
                            });

                        toolbarfeatureLables.selectAll('text.text').data(sliderClasses)
                            .enter().append('text').attr('class', 'text')
                            .attr('x', 15)
                            .attr('y', (d, i) => 10 + i * 25 + 5)
                            .text(d => d).attr('font-size', '16pt').attr('dominat-baseline', 'middle')
                            .on('mouseover', function (d) {
                                //when mouse hover, other classes will be discolored.
                                mainPanel.selectAll('.data-node').nodes().forEach((element) => {
                                    let tempIndex = element.getAttribute('id');
                                    //console.log("temp index:", tempIndex, dataAfter[tempIndex].Class, d);
                                    if (dataAfter[tempIndex][target] != d) {
                                        d3.select(element).attr('fill-opacity', 0.2).attr('stroke-width', 0);
                                    }
                                });
                            })
                            .on('mouseout', function (d) {
                                //when mouse move out, display normally.
                                mainPanel.selectAll('.data-node')
                                    .attr('fill-opacity', 1).attr('stroke-width', 0.5);
                            });
                    }
                    prepareToolbar();
                });
            }
            return chart;
        }

        //rendering table
        mainPanel.data([renderData()]).each(function(f){
            d3.select(this).call(f);
        });
    }

    // export init function from self-invokable function
    window.init = init;

})();

//because chrome some browser banner full path of selected file. so only work when you put file in the csv folder of index.html.
//let filename = './csv/iris.csv';
//let data = [];
//it reuse function from TA to trigger of page loading
document.addEventListener('DOMContentLoaded', function (event) {


    //
    // $("#selectfile").change(function (event) {
    //     let tmppath = $('input[type=file]').val();
    //     tempath = tmppath.split(/.*[\/|\\]/)[1];
    //     tempath = "./csv/" + tempath;
    //     console.log("selected file:", tempath);
    //
    //     d3.csv(tempath, function (error, data) {
    //         if (error) throw(error);
    //
    //         init(data);
    //     });
    //
    //
    // });
});
