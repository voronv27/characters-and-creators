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

@app.route('/refresh-route')
def refreshData():
    try:
        return dataGetter.refreshData()
    except Exception as e:
        return "Error"

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

    # { spell key: spell info }
    data["spells"] = dataGetter.getSpells()

    return data

@app.route('/specific-info')
def getSpecificInfo():
    data = dict()
    
    # get url params
    classname = request.args.get('class', default = None)
    subclass = request.args.get('subclass', default = None)
    race = request.args.get('race', default = None)
    subrace = request.args.get('subrace', default = None)
    background = request.args.get('background', default = None)
    
    # Given class name as a parameter, return the stats that should be highest
    data["preferred-stats"] = dataGetter.preferredStats(classname)

    # Given class name, background, and race as parameters, return proficiencies
    data["proficiencies"] = dataGetter.getProficiencies(classname, race, background, subclass, subrace)

    # Given race and subrace, return the ASI (stat increases)
    if race:
        data["asi"] = dataGetter.getAsi(race, subrace)
    else:
        data["asi"] = None

    # Given race and background, return the languages the character speaks
    data["languages"] = dataGetter.getLanguages(race, background)

    # Given class and background, return starting equipment
    data["equipment"] = dataGetter.getEquipment(classname, background)

    return data
