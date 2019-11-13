import os

import pandas as pd
from sklearn.cluster import KMeans


class readAssignment4Data:
    def __init__(self, iris, mtcars, wine,
                 prefix_dir='csv'):
        self.prefix_dir = prefix_dir
        if not os.path.isdir(self.prefix_dir):
            print("Expected directory '%s' but was not found" % self.prefix_dir)
            exit(1)
        self._iris = None
        self._mtcars = None
        self._wine = None
        self.iris_path = os.path.join(prefix_dir, iris)
        self.mtcars_path = os.path.join(prefix_dir, mtcars)
        self.wine_path = os.path.join(prefix_dir, wine)

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


def if_exists(csv_path: str) -> str:
    if not os.path.isfile(csv_path):
        print("Expected file '%s' was not found; no CSV to read" % csv_path)
    return csv_path


def getAssignment4Data() -> readAssignment4Data:
    rawData = readAssignment4Data('iris.csv', 'mtcars.csv', 'winequality-red.csv')
    return rawData


def readIris() -> readAssignment4Data:
    rawData = getAssignment4Data()
    return rawData.iris.to_json(orient='records')


def readWine() -> readAssignment4Data:
    rawData = getAssignment4Data()
    return rawData.wine.to_json(orient='records')


def readCar() -> readAssignment4Data:
    rawData = getAssignment4Data()
    return rawData.mtcars.to_json(orient='records')


def read_iris_correlation() -> readAssignment4Data:
    from sklearn import preprocessing
    le = preprocessing.LabelEncoder()
    rawData = getAssignment4Data().iris
    columns = rawData.columns
    label = columns[len(columns)-1]
    rawData[label] = le.fit_transform(rawData[label])
    correlation_result = rawData.corr()
    return correlation_result.to_json(orient='records')


def read_wine_correlation() -> readAssignment4Data:
    rawData = getAssignment4Data().wine
    correlation_result = rawData.corr()
    return correlation_result.to_json(orient='records')


def read_car_correlation() -> readAssignment4Data:
    from sklearn import preprocessing
    le = preprocessing.LabelEncoder()
    rawData = getAssignment4Data().iris
    columns = rawData.columns
    label = columns[len(columns)-1]
    rawData[label] = le.fit_transform(rawData[label])
    correlation_result = rawData.corr()
    return correlation_result.to_json(orient='records')


def read_iris_clustering(n_clusters=0, n_init=10, random_state=None, algorithm='auto') -> readAssignment4Data:
    rawData = getAssignment4Data().iris
    rawData_new = rawData.copy()
    columns = rawData.columns
    Y = rawData_new[columns[len(columns)-1]]
    if random_state == 'None':
        random_state = None
    else:
        random_state = int(random_state)
        if random_state < 0:
            random_state = 1
    if n_clusters < 1:
        n_clusters = Y.nunique()
    n_init = int(n_init)
    n_clusters = int(n_clusters)
    X = rawData_new.drop(columns[len(columns)-1], axis=1)
    #here we knew there will be k clusters in labels, we will adjust this value in later parameters optimization
    print("ready to clustering:", n_clusters, n_init, random_state, algorithm)
    kmeans = KMeans(n_clusters=n_clusters, n_init=n_init, random_state=random_state, algorithm=algorithm).fit(X)
    pred_y = kmeans.labels_
    rawData_new[columns[len(columns)-1]] = pred_y
    return {'df': rawData.to_json(orient='records'), 'new_df':rawData_new.to_json(orient='records')}


def read_wine_clustering(n_clusters=0, n_init=10, random_state=None, algorithm='auto') -> readAssignment4Data:
    rawData = getAssignment4Data().wine
    rawData_new = rawData.copy()
    columns = rawData.columns
    Y = rawData_new[columns[len(columns)-1]]
    if random_state == 'None':
        random_state = None
    if n_clusters < 1:
        n_clusters = Y.nunique()
    X = rawData_new.drop(columns[len(columns) - 1], axis=1)
    # here we knew there will be k clusters in labels, we will adjust this value in later parameters optimization
    kmeans = KMeans(n_clusters=n_clusters, n_init=n_init, random_state=random_state,
                    algorithm=algorithm).fit(X)
    pred_y = kmeans.labels_
    rawData_new[columns[len(columns)-1]] = pred_y
    return {'df': rawData.to_json(orient='records'), 'new_df':rawData_new.to_json(orient='records')}


def read_car_clustering(n_clusters=0, n_init=10, random_state=None, algorithm='auto') -> readAssignment4Data:
    rawData = getAssignment4Data().mtcars
    rawData_new = rawData.copy()
    columns = rawData.columns
    Y = rawData_new[columns[len(columns)-1]]
    if random_state == 'None':
        random_state = None
    if n_clusters < 1:
        n_clusters = Y.nunique()
    X = rawData_new.drop(columns[len(columns) - 1], axis=1)
    # here we knew there will be k clusters in labels, we will adjust this value in later parameters optimization
    kmeans = KMeans(n_clusters=n_clusters, n_init=n_init, random_state=random_state,
                    algorithm=algorithm).fit(X)
    pred_y = kmeans.labels_
    rawData_new[columns[len(columns)-1]] = pred_y
    return {'df': rawData.to_json(orient='records'), 'new_df':rawData_new.to_json(orient='records')}
