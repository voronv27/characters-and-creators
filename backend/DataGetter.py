import json
import requests
#import random

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

# Mapping of word to number for API parsing purposes
number = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
}

# DnD skills and the corresponding stat they use (not in API)
skills = {
    "Athletics": "str",
    "Acrobatics": "dex",
    "Sleight of Hand": "dex",
    "Stealth": "dex",
    "Arcana": "int",
    "History": "int",
    "Investigation": "int",
    "Nature": "int",
    "Religion": "int",
    "Animal Handling": "wis",
    "Insight": "wis",
    "Medicine": "wis",
    "Perception": "wis",
    "Survival": "wis",
    "Deception": "cha",
    "Intimidation": "cha",
    "Performance": "cha",
    "Persuasion": "cha",
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

# The open5e API lists skills in the format "Choose x skills from a, b, c, and d" or "Choose any x"
# We want to parse this into a dictionary of { "count": x, "options": [a, b, c, d] }
def getSkills(skillDesc):
    count = 0
    options = []

    # Remove filler words
    fillerWords = ["Choose ", "from ", "skills ", "and "]
    filteredDesc = skillDesc
    for fillerWord in fillerWords:
        filteredDesc = filteredDesc.replace(fillerWord, "")
    splitDesc = filteredDesc.split()
    if splitDesc[0] == "any":
        countWord = splitDesc[1]
        options = list(skills.keys())
    else:
        countWord = splitDesc[0]
        filteredDesc = filteredDesc.replace(f"{countWord} ", "")
        options = filteredDesc.split(", ")

    return {"count": number[countWord], "options": options}

# The open5e API lists race proficiencies as a string which we'd like to parse
def parseTraits(traitsDesc):
    proficiencies = {
        "skills": [],
        "other": [],
    }
    traitsProficiencies = [ trait for trait in traitsDesc.split('.') if "proficiency" in trait ]
    for prof in traitsProficiencies:
        if "skill" in prof:
            skillList = []
            if "choice" in prof:
                # x skill[s] of your choice
                count = [number[n] for n in number if n in prof][0]
                choiceSkills = [s for s in skills if s in prof]
                if not choiceSkills:
                    # if skills not specified, assume any skills
                    choiceSkills = list(skills.keys())
                skillList.append(
                    {
                        "choice": {
                            "count": count,
                            "options": choiceSkills
                        }
                    }
                )
            else:
                skillList = [s for s in skills if s in prof]
            proficiencies["skills"] += skillList
        elif "proficiency with" in prof:
            otherProfs = prof.split('proficiency with ')[1]
            proficiencies["other"] = otherProfs
    print(proficiencies)
    return proficiencies

# DataGetter is imported by routes.py to get DnD data.
# It caches this data to avoid making extra API calls.
class DataGetter:
    """Gets and stores data from the open5e api"""
    def __init__(self):
        self.classData = None
        self.races = None
        self.backgrounds = None
        #TODO: consider caching proficiencies?

    def getClasses(self):
        if not self.classData:
            url = "https://api.open5e.com/v1/classes/"
            classData = getData(url)
            self.classData = {classname["name"]: classname for classname in classData}
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

    def getClassProficiencies(self, classname, subclass=None):
        proficiencies = {
            "weapons": None,
            "armors": None,
            "tools": None,
            "skills": None,
            "savingThrows": None,
            "subclass": None,
        }
        if not self.classData:
            self.getClasses()

        classData = self.classData[classname]
        proficiencies["armors"] = classData["prof_armor"].split(", ")
        proficiencies["weapons"] = classData["prof_weapons"].split(", ")
        proficiencies["tools"] = classData["prof_tools"].split(", ")
        proficiencies["savingThrows"] = classData["prof_saving_throws"].split(", ")
        proficiencies["skills"] = getSkills(classData["prof_skills"])
        if subclass:
            subclassData = [s for s in classData["archetypes"] if s["name"] == subclass][0]
            subclassTraits = subclassData["desc"].split("\n")

            # we want to avoid flagging statements like "8 + proficiency bonus",
            # which doesn't actually refer to proficiencies
            profConditions = ["proficiency in", "proficiency with", "proficiency."]
            subclassProfs = [p for p in subclassTraits if any(c in p for c in profConditions)]
            proficiencies["subclass"] = subclassProfs
        return proficiencies

    def getRaceProficiencies(self, race, subrace=None):
        if not self.races:
            self.getRaces()
        raceData = self.races[race]
        # TODO: get subrace proficiencies
        return parseTraits(raceData["traits"])

    def getProficiencies(self, classname, race, background):
        proficiencies = {
            "class": None,
            "race": None,
            "background": None,
        }
        if not self.races:
            self.getRaces()
        if not self.backgrounds:
            self.getBackgrounds()

        # get class proficiencies
        proficiencies["class"] = self.getClassProficiencies(classname)

        # get race proficiencies
        proficiencies["race"] = self.getRaceProficiencies(race)

        # get background proficiencies
        # TODO

        return proficiencies

# Test DataGetter class
if __name__ == "__main__":
    dataGetter = DataGetter()
    classData = dataGetter.getClasses()
    for dndClassName in classData:
        dndClass = classData[dndClassName]
        print(f"{dndClassName} preferred stats are: {list(dataGetter.preferredStats(dndClassName.lower()))}")
        print()
        subclasses = [subclass['name'] for subclass in dndClass['archetypes']]
        if subclasses:
            print(f"{dndClass['subtypes_name']}: {', '.join(subclasses)}\n")
            for subclass in subclasses:
                print(f"Class + subclass ({subclass}) proficiencies are {dataGetter.getClassProficiencies(dndClassName, subclass)}")
                print()
        else:
            print(f"{dndClassName} class proficiencies are {dataGetter.getClassProficiencies(dndClassName)}")
            print()

    races = dataGetter.getRaces()
    for race in races:
        print(race)
        dataGetter.getRaceProficiencies(race)
        print()

    backgrounds = dataGetter.getBackgrounds()
    print("Backgrounds:", list(backgrounds.keys()))
    print()

    # TODO: asi for race, subrace, class, subclass, background(?)