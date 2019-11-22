import data
from flask import Flask, jsonify, render_template, request

application = Flask(__name__)
assignment4Data = data.getAssignment4Data()


@application.route('/')
def index():
    return render_template('index.html')

'''
main http service call via REST to get jsonified data format
'''
@application.route('/read_iris')
def read_iris():
    return jsonify(data.readIris())


@application.route('/read_iris_correlation')
def read_iris_correlation():
    return jsonify(data.read_iris_correlation())


@application.route('/read_iris_clustering')
def read_iris_clustering():
    n_clusters = request.args.get('n_clusters', default=0, type=int)
    n_init = request.args.get('n_init', default=10, type=int)
    random_state = request.args.get('random_state', default='None')
    batch_size = request.args.get('batch_size', default=100, type=int)
    df = data.read_iris_clustering(n_clusters, n_init, random_state, batch_size)
    return jsonify(df)


@application.route('/read_wine')
def read_wine():
    return jsonify(data.readWine())


@application.route('/read_wine_correlation')
def read_wine_correlation():
    return jsonify(data.read_wine_correlation())


@application.route('/read_wine_clustering')
def read_wine_clustering():
    n_clusters = request.args.get('n_clusters', default=0, type=int)
    n_init = request.args.get('n_init', default=10, type=int)
    random_state = request.args.get('random_state', default='None')
    batch_size = request.args.get('batch_size', default=100, type=int)
    df = data.read_wine_clustering(n_clusters, n_init, random_state, batch_size)
    return jsonify(df)


@application.route('/read_car')
def read_car():
    return jsonify(data.readCar())


@application.route('/read_car_correlation')
def read_car_correlation():
    return jsonify(data.read_car_correlation())


@application.route('/read_car_clustering')
def read_car_clustering():
    n_clusters = request.args.get('n_clusters', default=0, type=int)
    n_init = request.args.get('n_init', default=10, type=int)
    random_state = request.args.get('random_state', default='None')
    batch_size = request.args.get('batch_size', default=100, type=int)
    df = data.read_car_clustering(n_clusters, n_init, random_state, batch_size)
    return jsonify(df)


@application.route('/read_assignment1')
def read_assignment1():
    return jsonify(data.readAssignment1())


@application.route('/read_assignment1_correlation')
def read_assignment1_correlation():
    return jsonify(data.read_assignment1_correlation())


@application.route('/read_assignment1_clustering')
def read_assignment1_clustering():
    n_clusters = request.args.get('n_clusters', default=0, type=int)
    n_init = request.args.get('n_init', default=10, type=int)
    random_state = request.args.get('random_state', default='None')
    batch_size = request.args.get('batch_size', default=100, type=int)
    df = data.read_assignment1_clustering(n_clusters, n_init, random_state, batch_size)
    return jsonify(df)


@application.route('/show_table')
def show_table():
    table_name = request.args.get('table')
    return jsonify(data.show_table(table_name))


if __name__ == '__main__':
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()
