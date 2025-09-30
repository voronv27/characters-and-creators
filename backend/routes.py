"""
File for the Flask server which gets information from the open5e API along with local data
and returns it in an easy-to-use form for the frontend. For the structure of the returned
json, you can reference 'serverExamples.txt'
"""
from flask import Flask, request
from flask_cors import CORS, cross_origin
from DataGetter import DataGetter

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes
dataGetter = DataGetter()

# This serves just to test that the flask server is running
@app.route('/')
def landing():
    return "Hello world!"

# This returns all general info that the character sheet creator will need
@app.route('/general-info')
def getGeneralInfo():
    data = dict()
    # Classes as { class name: class info }
    data["classes"] = dataGetter.getClasses()

    # Data in the form of { race: race info }
    data["races"] = dataGetter.getRaces()

    # { background: background info }
    data["backgrounds"] = dataGetter.getBackgrounds()

    return data

# Given class name as a parameter, return the stats that should be highest
@app.route('/preferred-stats')
def preferredStats():
    classname = request.args.get('class', default = None)
    return dataGetter.preferredStats(classname)

# Given class name, background, and race as parameters, return proficiencies
@app.route('/proficiencies')
def getProficiencies():
    # TODO: update to get background and race when that is implemented
    classname = request.args.get('class', default = None)
    return dataGetter.getProficiencies(classname, None, None)

# TODO: add more routes for other DnD info