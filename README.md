# Assingment 4 Christian Gang Liu - B000415613
##### There is additional document "README - assignment4 - Christian Gang Liu - B00415613.pdf"
##### To specifically answer the answers of assignment4 with screenshots.

Repository for CSCI 6612 Assignment 4.

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