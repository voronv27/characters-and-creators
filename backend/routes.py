from flask import Flask
from DataGetter import DataGetter

app = Flask(__name__)
dataGetter = DataGetter()

# This serves just to test that the flask server is running
@app.route('/')
def landing():
    return "Hello world!"

# Get class names
@app.route('/classnames')
def getClassNames():
    classData = dataGetter.getClasses()
    return [dndClass['name'] for dndClass in classData]

# TODO: add more routes for other DnD info