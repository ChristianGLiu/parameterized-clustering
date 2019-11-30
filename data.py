# library used for identifying the local physical environ
import os
# library for handling the data manuplation
import pandas as pd
# library for K-MEANS clustering
from sklearn.cluster import MiniBatchKMeans
# library to evulate the clustering result
from sklearn import metrics
# scientific numeric calualtion
import numpy as np
# preprocessing the data via sklearn lib
from sklearn import preprocessing

import json

'''
The class to hold the reusable data in cache, avoiding repeatable data access to local disk
'''
class readAssignment4Data:
    def __init__(self, iris, mtcars, wine, assignment1,
                 prefix_dir='csv'):
        self.prefix_dir = prefix_dir
        if not os.path.isdir(self.prefix_dir):
            print("Expected directory '%s' but was not found" % self.prefix_dir)
            exit(1)
        self._iris = None
        self._mtcars = None
        self._wine = None
        self._assignment1 = None
        self.iris_path = os.path.join(prefix_dir, iris)
        self.mtcars_path = os.path.join(prefix_dir, mtcars)
        self.wine_path = os.path.join(prefix_dir, wine)
        self.assignment1_path = os.path.join(prefix_dir, assignment1)

    @property
    def iris(self) -> pd.DataFrame:
        if self._iris is None:
            self._iris = pd.read_csv(self.iris_path)
        return self._iris

    @property
    def mtcars(self) -> pd.DataFrame:
        if self._mtcars is None:
            self._mtcars = pd.read_csv(self.mtcars_path)
        return self._mtcars

    @property
    def wine(self) -> pd.DataFrame:
        if self._wine is None:
            self._wine = pd.read_csv(self.wine_path)
        return self._wine

    @property
    def assignment1(self) -> pd.DataFrame:
        if self._assignment1 is None:
            self._assignment1 = pd.read_csv(self.assignment1_path)
        # normalize the data
        # because capital-gain always 0, remove it.
        self._assignment1 = self._assignment1.drop(['capital-gain'], axis=1)
        return self._assignment1

'''
the function to error handling the file not existing situation
'''
def if_exists(csv_path: str) -> str:
    if not os.path.isfile(csv_path):
        print("Expected file '%s' was not found; no CSV to read" % csv_path)
    return csv_path

'''
the function to instantiate the data reader class above
'''
def getAssignment4Data() -> readAssignment4Data:
    rawData = readAssignment4Data('iris.csv', 'mtcars.csv', 'winequality-red.csv', 'new_dirty_halfbaked.csv')
    return rawData

'''
the function to returning JSON formatted data via REST call of IRIS raw data
'''
def readIris() -> readAssignment4Data:
    rawData = getAssignment4Data()
    return rawData.iris.to_json(orient='records')

'''
the function to returning JSON formatted data via REST call of WINE raw data
'''
def readWine() -> readAssignment4Data:
    rawData = getAssignment4Data()
    return rawData.wine.to_json(orient='records')

'''
the function to returning JSON formatted data via REST call of MTCARS raw data
'''
def readCar() -> readAssignment4Data:
    rawData = getAssignment4Data()
    return rawData.mtcars.to_json(orient='records')

'''
the function to returning JSON formatted data via REST call of assignment 1 raw data
'''
def readAssignment1() -> readAssignment4Data:
    rawData = getAssignment4Data()
    return rawData.assignment1.to_json(orient='records')

'''
the function to returning JSON formatted data via REST call of IRIS correlation heatmap chart
'''
def read_iris_correlation() -> readAssignment4Data:
    from sklearn import preprocessing
    le = preprocessing.LabelEncoder()
    rawData = getAssignment4Data().iris
    columns = rawData.columns
    label = columns[len(columns)-1]
    rawData[label] = le.fit_transform(rawData[label])
    correlation_result = rawData.corr()
    return correlation_result.to_json(orient='records')

'''
the function to returning JSON formatted data via REST call of WINE correlation heatmap chart
'''
def read_wine_correlation() -> readAssignment4Data:
    rawData = getAssignment4Data().wine
    correlation_result = rawData.corr()
    return correlation_result.to_json(orient='records')

'''
the function to returning JSON formatted data via REST call of MTCARS correlation heatmap chart
'''
def read_car_correlation() -> readAssignment4Data:
    from sklearn import preprocessing
    le = preprocessing.LabelEncoder()
    rawData = getAssignment4Data().iris
    columns = rawData.columns
    label = columns[len(columns)-1]
    rawData[label] = le.fit_transform(rawData[label])
    correlation_result = rawData.corr()
    return correlation_result.to_json(orient='records')

'''
This is the function to deal with the assignment 1 dataset correlation
'''
def read_assignment1_correlation() -> readAssignment4Data:
    from sklearn import preprocessing
    le = preprocessing.LabelEncoder()
    rawData = getAssignment4Data().assignment1
    columns = rawData.columns
    label = columns[len(columns)-1]
    rawData[label] = le.fit_transform(rawData[label])
    correlation_result = rawData.corr()
    return correlation_result.to_json(orient='records')


def get_sorted_uniques(column) -> []:
    new_arr = []
    from collections import Counter
    import operator
    c = Counter(column)

    sorted_x = sorted(c.items(), key=operator.itemgetter(1))
    print("sorted_x:",sorted_x)
    for a_item in sorted_x:
        new_arr.append(a_item[0])
    print("sorted_x:", new_arr)
    return new_arr


def convert_label_values(column, old, new) -> pd.Series:

    new_column = column.copy()
    mapping = {}
    for i in range(len(old)):
        mapping[old[i]] = new[i]
    print("converting:", column.nunique(), old, new, mapping)
    new_column = new_column.map(mapping)
    return new_column


def resuable_clustering_func(rawData, n_clusters, n_init, random_state, batch_size):
    rawData_new = rawData.copy()
    columns = rawData.columns
    label = columns[len(columns) - 1]
    kmeans = None
    returns = {}
    unique_labels_df = None
    unique_labels_new_df = None
    Y = rawData_new[label]
    unique_labels_df = get_sorted_uniques(Y)
    # le = preprocessing.LabelEncoder()
    # Y = pd.Series(le.fit_transform(Y))

    print("encoded wine Y:", Y.nunique(), Y.shape)
    if random_state == 'None':
        random_state = None
    if n_clusters < 2:
        n_clusters = Y.nunique()

    X = rawData_new.drop([label], axis=1)
    # here we knew there will be k clusters in labels, we will adjust this value in later parameters optimization
    # error handling
    try:
        kmeans = MiniBatchKMeans(n_clusters=n_clusters, n_init=n_init, random_state=random_state,
                             batch_size=batch_size).fit(X)
        pred_y = kmeans.labels_
        unique_labels_new_df = get_sorted_uniques(pred_y)
        if Y.nunique() == pd.Series(pred_y).nunique():
            pred_y = convert_label_values(pd.Series(pred_y), unique_labels_new_df, unique_labels_df)
        measurement = metrics.adjusted_rand_score(Y, pred_y)
        X_copy = X.copy()
        X_copy[label] = pred_y
        rawData_new = X_copy.copy()
        returns = {'score': measurement, 'unique_labels_df': pd.Series(unique_labels_df).to_json(orient='values'),
            'unique_labels_new_df': pd.Series(unique_labels_new_df).to_json(orient='values'),
            'df': rawData.to_json(orient='records'),
            'new_df': rawData_new.to_json(orient='records')}
    except Exception as e:
        returns = {'error': str(e)}
    return returns


'''
the function to returning JSON formatted data via REST call of IRIS clustering using K-MEAN
'''
def read_iris_clustering(n_clusters=0, n_init=10, random_state=None, batch_size=100) -> readAssignment4Data:
    rawData = getAssignment4Data().iris
    return resuable_clustering_func(rawData, n_clusters, n_init, random_state, batch_size)

'''
the function to returning JSON formatted data via REST call of WINE clustering using K-MEAN
'''
def read_wine_clustering(n_clusters=0, n_init=10, random_state=None, batch_size=100) -> readAssignment4Data:
    rawData = getAssignment4Data().wine
    return resuable_clustering_func(rawData, n_clusters, n_init, random_state, batch_size)

'''
the function to returning JSON formatted data via REST call of CAR clustering using K-MEAN
'''
def read_car_clustering(n_clusters=0, n_init=10, random_state=None, batch_size=100) -> readAssignment4Data:
    rawData = getAssignment4Data().mtcars
    return resuable_clustering_func(rawData, n_clusters, n_init, random_state, batch_size)

'''
the function to returning JSON formatted data via REST call of assignment 1 clustering using K-MEAN
'''
def read_assignment1_clustering(n_clusters=0, n_init=10, random_state=None, batch_size=100) -> readAssignment4Data:
    rawData = getAssignment4Data().assignment1
    return resuable_clustering_func(rawData, n_clusters, n_init, random_state, batch_size)

'''
reusable function to return the data for showing tabular formatted data on page
'''
def show_table(table='iris') -> readAssignment4Data:
    rawData = None
    if table=='iris':
        rawData = getAssignment4Data().iris
    if table=='assignment1':
        rawData = getAssignment4Data().assignment1
    if table=='car':
        rawData = getAssignment4Data().mtcars
    if table=='wine':
        rawData = getAssignment4Data().wine
    return rawData.to_dict()
