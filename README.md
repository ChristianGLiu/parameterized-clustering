# InstaCart Dashboard

Repository for CSCI 6612 Visual Analysis Group Project.

This project requires **Python 3.7+** to run.

## Insert Data

Download the data from Kaggle and place the `.csv` files into the `data` subdirectory.

## Install Dependencies

`pip install -r requirements.txt`

## Run Server

In the root directory of the project:

`export FLASK_ENV=development && export FLASK_APP=application.py && flask run`

In windows:

`set FLASK_APP=application.py
 set FLASK_ENV=development
 flask run`