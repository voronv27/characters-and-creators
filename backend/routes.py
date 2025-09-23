from flask import Flask, request
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

# Returns { race: race info }
@app.route('/races')
def getRaces():
    return dataGetter.getRaces()

# Returns { background: background info }
@app.route('/backgrounds')
def getBackgrounds():
    return dataGetter.getBackgrounds()

# Given class name as a parameter, return the stats that should be highest
@app.route('/preferred-stats')
def preferredStats():
    classname = request.args.get('class', default = None)
    return dataGetter.preferredStats(classname)


# TODO: add more routes for other DnD info