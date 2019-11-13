from __future__ import print_function # In python 2.7
import data
import sys
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
assignment4Data = data.getAssignment4Data()


@app.route('/')
def hello_world():
    return render_template('index.html')

'''
main http service call via REST to get jsonified data format
'''
@app.route('/read_iris')
def read_iris():
    return jsonify(data.readIris())


@app.route('/read_iris_correlation')
def read_iris_correlation():
    return jsonify(data.read_iris_correlation())


@app.route('/read_iris_clustering')
def read_iris_clustering():
    n_clusters = request.args.get('n_clusters', default=0, type=int)
    n_init = request.args.get('n_init', default=10, type=int)
    random_state = request.args.get('random_state', default='None')
    algorithm = request.args.get('algorithm', default='auto')
    df = data.read_iris_clustering(n_clusters, n_init, random_state, algorithm)
    return jsonify(df)


@app.route('/read_wine')
def read_wine():
    return jsonify(data.readWine())


@app.route('/read_wine_correlation')
def read_wine_correlation():
    return jsonify(data.read_wine_correlation())


@app.route('/read_wine_clustering')
def read_wine_clustering():
    n_clusters = request.args.get('n_clusters', default=0, type=int)
    n_init = request.args.get('n_init', default=10, type=int)
    random_state = request.args.get('random_state', default='None')
    algorithm = request.args.get('algorithm', default='auto')
    df = data.read_wine_clustering(n_clusters,  n_init, random_state, algorithm)
    return jsonify(df)


@app.route('/read_car')
def read_car():
    return jsonify(data.readCar())


@app.route('/read_car_correlation')
def read_car_correlation():
    return jsonify(data.read_car_correlation())


@app.route('/read_car_clustering')
def read_car_clustering():
    n_clusters = request.args.get('n_clusters', default=0, type=int)
    n_init = request.args.get('n_init', default=10, type=int)
    random_state = request.args.get('random_state', default='None')
    algorithm = request.args.get('algorithm', default='auto')
    df = data.read_car_clustering(n_clusters, n_init, random_state, algorithm)
    return jsonify(df)


if __name__ == '__main__':
    app.run(debug=True)
