# Assingment 4 Christian Gang Liu - B00415613
##### There is additional document "README - assignment4 - Christian Gang Liu - B00415613.pdf"
##### To specifically answer the answers of assignment4 with screenshots.

This project requires **Python 3.6+** to run.
        
## Install Dependencies:

`pip install -r requirements.txt`

## Production deployment (directly open it):

Application was already deployed on AWS:

http://assignment4-dev.us-east-2.elasticbeanstalk.com

## Run Server on local:

In linux like system:

`export FLASK_ENV=development && export FLASK_APP=application.py && flask run`

In windows:

`set FLASK_APP=application.py
 set FLASK_ENV=development
 flask run`
 
AWS style:
 
`python application.py`

![image](../master/img/ui-layout.png){:height="50%" width="50%"}

---
abstract: |
    *Important Notes: because I am principle programmer of our "outliers"
    group project implementation, so you might find similar coding on our
    project as well.*

    1.  Project technical used: General speaking, the project is based on JS
        and Python 3.4+ as required by assignment 4 instruction.

        -   Flask: A python framework used for quick REST services
            establishment;

        -   D3: A Javascript library used for generating the interactive ML
            graphic charts;

        -   Plotly: A popular javascript library which based on D3 provides
            the complicated chart view (here I only used it for show the
            tabular table view on the page, this requirement is not asked by
            assignment, I used it only to demonstrate how data comes from
            backend framework (Flask);

        -   Others: JQuery / Bootstrap (only for UI layout and event
            triggering)

        -   IDE: PyCharm;

        -   AWS (extra work): public cloud
            deployment:$http://assignment4-dev.us-east-2.elasticbeanstalk.com/$

    2.  Project structure:

        ![image](img/project-structure){width="0.7\columnwidth"}

        As you can see above, I constructed project structure to comply with
        the AWS elastic sever standardization, in order to deploy on AWS for
        public access.

        I utilized FLASK framework to quickly establish this lightweight
        project, like what I did for my group project as well
        $http://flask-env.zsewpnnzda.us-east-2.elasticbeanstalk.com/$.

        In order to simplify the assignment 4 review work. I planned to
        deploy it on AWS for quickly reviewing. Anyhow you can always open
        my project source folder to execute command: python application.py
        to exam it on local.

    3.  Execution: the execution instruction is also mentioned at the beginning of this README
        file under project folder.
        
    4.  General UI introduction (the details will be described specifically
        to each of questions of assignment 4):

        ![image](../master/img/ui-layout){width="0.7\columnwidth"}

        -   Left Menu: they are four different tables which are required by
            assignment 4:

            -   Iris

            -   Wine

            -   Mtcars

            -   Assignment 1 dataset (bonus)

        -   Main Menu:

            -   Tabular view on Html page (extra work): it shows tabular
                view directly from JSON response of Flask REST services:

            -   Radviz: The assignment 2 functionality for each of tables;

            -   Correlation Matrix: Heatmap of each table;

            -   Clustering: there will be a comparison between original
                labels (classification) and clustering by K-means, as well
                as a measurement score showing on the page.

            -   Notes: the Bonus requirement of assignment 1 dataset will
                share the same functionalities.
author:
- 'Christian Gang Liu (B00415613)'
title: |
    Assignment 4

    on

    CSCI 6610 Visual Analytics
---

\maketitle
Assignment 4 Qeustions And Answers
==================================

**The specific answers to the assignment 4 questions:**

1

:   *\[10 Marks\] Create a backend that will provide the data and
    metadata that can be used to display the visualization a. Use an
    HTTP request to retrieve data from the back-end and use it to
    generate the visualization on the front-end. b. Tip: You can return,
    along with the data, some metadata like column names or other
    information that could be useful to handle and/or display the data
    in the front-end.*

    **answer:** Front-end ( JS retrievals JSON data, sends to html
    page):

    ![image](img/q1-1){width="0.7\columnwidth"} Back-end Flask WSGI
    endpoint (REST services) -- Code snippets:

    ![image](img/q1-2){width="0.7\columnwidth"}

    ![image](img/q1-3){width="0.7\columnwidth"} The returning JSON
    sample like this:
    ($http://assignment4-dev.us-east-2.elasticbeanstalk.com/read\_iris$)

    ![image](img/q1-4){width="0.7\columnwidth"} The list of REST
    services showing below (hostname is http://assignment4-dev.us-east-
    2.elasticbeanstalk.com):

    -   application.route('/')

    -   application.route('/read\_iris')

    -   application.route('/read\_iris\_correlation')

    -   application.route('/read\_iris\_clustering')

    -   application.route('/read\_wine')

    -   application.route('/read\_wine\_correlation')

    -   application.route('/read\_wine\_clustering')

    -   application.route('/read\_car')

    -   application.route('/read\_car\_correlation')

    -   application.route('/read\_car\_clustering')

    -   application.route('/read\_assignment1')

    -   application.route('/read\_assignment1\_correlation')

    -   application.route('/read\_assignment1\_clustering')

    -   application.route('/show\_table')

2

:   *\[20 Marks\] Add an option on the interface to choose a different
    dataset (iris or winequality) a. The backend will return the new
    dataset*

    **Answer:**

    Front-end: when you click any option in left panel, the back-end
    will return corresponding response:

    ![image](img/q2-1){width="0.7\columnwidth"} **Back-end returning:**

    -   IRIS:
        http://assignment4-dev.us-east-2.elasticbeanstalk.com/read\_iris

    -   WINE:
        http://assignment4-dev.us-east-2.elasticbeanstalk.com/read\_wine

    -   MTCARS:
        http://assignment4-dev.us-east-2.elasticbeanstalk.com/read\_car

    -   ASSIGNMENT1:
        http://assignment4-dev.us-east-2.elasticbeanstalk.com/read\_assignment1

    *b. You can keep a state on the front-end and send it on every
    request to identify the current dataset in use.*

    I am using the request parameter $/?data=[dataset\_name]$ to
    identify current dataset using:

    Like $/?data=[iris\|wine\|assignment1\|car]$

3

:   *3. \[20 Marks\] When hovering an instance of a given cluster, show
    (as a tooltip or in other available space) the correlation matrix
    for instances of that cluster. a. The correlation matrix should be
    calculated and returned by the back-end.*

    **Answer:**

    Front-end:

    ![image](img/q3-1){width="0.7\columnwidth"}

    Back-end:

    ``` {frame="single"}
    @application.route('/read_wine_correlation') 
    def read_wine_correlation():
    return jsonify(data.read_wine_correlation())
    ```

    So whenever you click "correlation matrix" tab, it will send REST
    call like(giving an example):

    ``` {frame="single"}
    def read_wine_correlation() 
    -> readAssignment4Data: 
    rawData = getAssignment4Data().wine correlation_result = rawData.corr()
    return correlation_result.to_json(orient='records')
    ```

    *b. This should be displayed on the front-end through a color
    matrix. See example of such matrix below (Tip: feel free to use
    libraries to help you):*

    So I utilize the corr() function of pandas to generate correlation
    heatmap

4

:   *\[40 Marks\] Implement a button that requests the backend to
    clusterize the data using one of: K-Means or DBScan a. You should
    color the instances using the clustering information*

    **Answer:**

    ![image](img/q4-1){width="0.7\columnwidth"}

    *b. Add a switch button to choose between the color modes: cluster
    colors or class-based colors.*

    **Answer:**

    ![image](img/q4-2){width="0.7\columnwidth"}

    After we switch back to actual classification:

    ![image](img/q4-3){width="0.7\columnwidth"}

    **Answer:**

    Since $/?data=[dataset\_name]$ remembers the current dataset.
    Clustering tab will go further to call

    -   \@application.route('/read\_iris\_clustering')

    -   \@application.route('/read\_wine\_clustering')

    -   \@application.route('/read\_car\_clustering')

    -   \@application.route('/read\_assignment1\_clustering')

    Page will show corresponding result to current dataset:

    ![image](img/q4-4){width="0.7\columnwidth"}
    ![image](img/q4-5){width="0.7\columnwidth"}
    ![image](img/q4-6){width="0.7\columnwidth"}
    ![image](img/q4-7){width="0.7\columnwidth"}

    **Answer:**

    K-MEAN

    *e. You may use existing implementations of the clustering
    algorithms.*

    **Answer:**

    SKLearn.cluster.kmean

5

:   *\[10 Marks\] Add one (or more) options to configure the parameters
    of the clustering algorithm a. Clicking the button should make a new
    clusterization with the new parameters and update the colors on the
    visualization.*

    **Answer:**

    Here I am going to tune up four major different parameters (Quoted
    from https://scikit-
    learn.org/stable/modules/generated/sklearn.cluster.MiniBatchKMeans.html)

    -   n\_clusters : int, optional, default: 8 The number of clusters
        to form as well as the number of centroids to generate.

    -   batch\_size : int, optional, default: 100 Size of the mini
        batches.

    -   random\_state : int, RandomState instance or None (default)
        Determines random number generation for centroid initialization
        and random reassignment. Use an int to make the randomness
        deterministic.

    -   n\_init : int, default=3 Number of random initializations that
        are tried. In contrast to KMeans, the algorithm is only run
        once, using the best of the n\_init initializations as measured
        by inertia.

    The UI toolbar looks like this
    ![image](img/q5-1){width="0.7\columnwidth"}

    It will allow us to adjust four different major parameters of k-mean
    , let us see the effects:

    Originally we have:

    ![image](img/q5-2){width="0.7\columnwidth"}

    **let us see how hyperparameters tunning up:**

    -   K-cluster:

        ![image](img/q5-3){width="0.7\columnwidth"}

    -   N\_init adjustment:

        ![image](img/q5-4){width="0.7\columnwidth"}

    -   random\_states:

        ![image](img/q5-5){width="0.7\columnwidth"}

    -   Batch\_size adjustment:

        ![image](img/q5-6){width="0.7\columnwidth"}

    **You can see the result will slightly different as we tune the
    parameters based on the measurement score.**

6

:   *\[+30 Bonus Mganr4k1s7\] 1A2d6d
    -anCohpritsiotinanonGthaenginLteirufa-ceBt0o0c0h4o1o5se61to3see the
    preprocessed dataset generated by your A1 assignment. a.
    RadViz/StarCoordinates should only show the numerical columns as
    anchor points*

    **Answer:**

    Using sklearn normalization library to scale and label the columns
    as digit numbers

    *b. The Categorical columns should be shown as the color of the
    plot. Make an input box selector in the interface to choose the
    categorical column to be shown as the color.*

    **Answer:**

    Make the salary as label: \<50K = 0, \>50K = 1

    Assignment 1 dataset will share same functionalities as three other
    datasets:

    **Correlation:**

    ![image](img/a6-1){width="0.7\columnwidth"}

    **tabular view:**

    ![image](img/q6-2){width="0.7\columnwidth"}

    **clustering:**

    ![image](img/q6-3){width="0.7\columnwidth"}

    **original Redviz:**

    ![image](img/q6-4){width="0.7\columnwidth"}

Miscellaneous: Error Handling
=============================

I added error message box just in the form to show any error messages,
whenever clustering has the problem at the back-end. Eg: when user tries
to input random\_state = 9000, which is not valid for k-means, then
front-page will honestly record the error messages returning from
back-end, like this:

![image](img/q7-1){width="0.7\columnwidth"}

Referencing
===========

1

:   D3: https://d3js.org/

2

:   Plotly: https://plot.ly/

3

:   Flask:https://realpython.com/tutorials/flask/

4

:   Jinja2 Template: https://jinja.palletsprojects.com/en/2.10.x/

5

:   Jquery: https://api.jquery.com/

6

:   Bootstrap: https://getbootstrap.com/

7

:   AWS: https://www.awseducate.com/
