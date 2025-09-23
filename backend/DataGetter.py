import json
import requests

# Local data
# List priority stats per DnD class
preferredStats = {
    "default": [],
    "artificer": ["int", "con"],
    "barbarian": ["str", "con"],
    "bard": ["cha", "dex"],
    "cleric": ["wis", "con"],
    "druid": ["wis", "con"],
    "fighter": ["str", "con"],
    "monk": ["dex", "wis"],
    "paladin": ["str", "cha"],
    "ranger": ["dex", "wis"],
    "rogue": ["dex", "int"],
    "sorcerer": ["cha", "con"],
    "warlock": ["cha", "con"],
    "wizard": ["int", "con"],
}

# Helper functions to get data from the open5e API
def getApiData(url, payload={}):
    response = requests.get(url, payload)
    return response.json()

def getData(url, payload={}):
    totalData = []
    while True:
        try:
            data = getApiData(url)
            totalData += data['results']

            # if there's more than one page of results, get data from next page
            if data['next']:
                url = data['next']
            else:
                break
        except Exception as e:
            print(f"Error getting class data: {e}")
            break
    return totalData

# DataGetter is imported by routes.py to get DnD data.
# It caches this data to avoid making extra API calls.
class DataGetter:
    """Gets and stores data from the open5e api"""
    def __init__(self):
        self.classData = None
        self.races = None
        self.backgrounds = None

    def getClasses(self):
        if not self.classData:
            url = "https://api.open5e.com/v1/classes/"
            self.classData = getData(url)
        return self.classData

    def getRaces(self):
        if not self.races:
            url = "https://api.open5e.com/v1/races/"
            races = getData(url)
            self.races = {race['name']: race for race in races}
        return self.races

    def getBackgrounds(self):
        if not self.backgrounds:
            url = "https://api.open5e.com/v2/backgrounds/"
            backgrounds = getData(url)
            self.backgrounds = {bg['name']: bg for bg in backgrounds}
        return self.backgrounds

    def preferredStats(self, classname):
        if classname in preferredStats:
            return preferredStats[classname]
        return preferredStats["default"]

# Test DataGetter class
if __name__ == "__main__":
    dataGetter = DataGetter()
    classData = dataGetter.getClasses()
    for dndClass in classData:
        print(f"Class: {dndClass['name']}")
        subclasses = ', '.join([subclass['name'] for subclass in dndClass['archetypes']])
        print(f"{dndClass['subtypes_name']}: {subclasses}\n")

    races = dataGetter.getRaces()
    print("Races:", races.keys())

    backgrounds = dataGetter.getBackgrounds()
    print("Backgrounds:", backgrounds.keys())

    print("Bard preferred stats are:", dataGetter.preferredStats["bard"])
