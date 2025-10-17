import json
import requests
#import random

# Local data
# Short description of class & priority stats per DnD class
localClassData = {
    "default": {
        "preferredStats": [],
        "desc": "",
    },
    "Artificer": {
        "preferredStats": ["int", "con"],
        "desc": "Masters of invention, artificers use ingenuity and magic to unlock extraordinary capabilities in objects",
    },
    "Barbarian": {
        "preferredStats": ["str", "con"],
        "desc": "Barbarians are mighty warriors who are powered by primal forces of the multiverse that manifest as a Rage"
        },
    "Bard": {
        "preferredStats": ["cha", "dex"],
        "desc": "Bards are expert at inspiring others, soothing hurts, disheartening foes, and creating illusions"
        },
    "Cleric": {
        "preferredStats": ["wis", "con"],
        "desc": "Clerics can reach out to the divine magic of the Outer Planes and channel it to bolster people and battle foes"
        },
    "Druid": {
        "preferredStats": ["wis", "con"],
        "desc": "Druids call on the forces of nature, harnessing magic to heal, transform into animals, and wield elemental destruction"
        },
    "Fighter": {
        "preferredStats": ["str", "con"],
        "desc": "Fighters all share an unparalleled prowess with weapons and armor, and are well acquainted with death, both meting it out and defying it"
        },
    "Monk": {
        "preferredStats": ["dex", "wis"],
        "desc": "Monks focus their internal reservoirs of power to create extraordinary, even supernatural, effects"
        },
    "Paladin": {
        "preferredStats": ["str", "cha"],
        "desc": "Paladins live on the front lines of the cosmic struggle, united by their oaths against the forces of annihilation"
        },
    "Ranger": {
        "preferredStats": ["dex", "wis"],
        "desc": "Rangers are honed with deadly focus and harness primal powers to protect the world from the ravages of monsters and tyrants"
        },
    "Rogue": {
        "preferredStats": ["dex", "int"],
        "desc": "Rogues have a knack for finding the solution to just about any problem, prioritizing subtle strikes over brute strength",
    },
    "Sorcerer": {
        "preferredStats": ["cha", "con"],
        "desc": "Sorcerers harness and channel the raw, roiling power of innate magic that is stamped into their very being",
    },
    "Warlock": {
        "preferredStats": ["cha", "con"],
        "desc": "Warlocks quest for knowledge that lies hidden in the fabric of the multiverse, piecing together arcane secrets to bolster their own power",
    },
    "Wizard": {
        "preferredStats": ["int", "con"],
        "desc": "Wizards cast spells of explosive fire, arcing lightning, subtle deception, and spectacular transformations",
    },
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
    return proficiencies

def getBackgroundSkills(skillDesc):
    skillList = []
    if "either" in skillDesc:
        # format: x, y, and either a, b, or c
        splitDesc = skillDesc.split('either')
        givenSkills = splitDesc[0]
        skillList += [s for s in skills if s in givenSkills]

        choiceSkills = splitDesc[1]
        skillList.append(
            {
                "choice": {
                    "count": 1,
                    "options": [s for s in skills if s in choiceSkills]
                }
            }
        )
    elif "choice" in skillDesc:
        # format: "y of your choice"
        # or "x, and any y skill(s) of your choice"
        # or "y of your choice among x, z"
        splitDesc = skillDesc.split('choice')
        givenSkills = splitDesc[0]
        skillList += [s for s in skills if s in givenSkills]

        count = next(n for n in number if n in skillDesc.lower())
        optionDesc = splitDesc[1]
        options = [s for s in skills if s in optionDesc]
        if not options:
            options = list(skills.keys())
        skillList.append(
            {
                "choice": {
                    "count": count,
                    "options": options,
                }
            }
        )
    else:
        # format: x, y, z
        skillList += [s for s in skills if s in skillDesc]

    return skillList

# DataGetter is imported by routes.py to get DnD data.
# It caches this data to avoid making extra API calls.
class DataGetter:
    """Gets and stores data from the open5e api"""
    def __init__(self):
        self.classData = None
        self.races = None
        self.backgrounds = None
        self.spells = None
        self.spellList = None
        #TODO: consider caching proficiencies?

    def getClasses(self):
        if not self.spellList:
            url = "https://api.open5e.com/v1/spelllist/"
            spellList = getData(url)
            self.spellList = {sl["name"].title(): set(sl["spells"]) for sl in spellList}
        if not self.classData:
            url = "https://api.open5e.com/v1/classes/"
            classData = getData(url)
            self.classData = {classname["name"]: classname for classname in classData}
            for classname in self.classData:
                if classname in localClassData:
                    self.classData[classname]["short_desc"] = localClassData[classname]["desc"]
                if classname in self.spellList:
                    self.classData[classname]["spells"] = self.getSpellNames(self.spellList[classname])
                else:
                    self.classData[classname]["spells"] = None
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

    def getSpells(self):
        if not self.spells:
            url = "https://api.open5e.com/v2/spells/"
            payload = {
                'document__gamesystem__key__in': '5e-2014'
            }
            spells = getData(url, payload)
            self.spells = {spell['key'].split('_')[-1]: spell for spell in spells}
        return self.spells

    # Filter out any spells not in our database and replace key with name
    def getSpellNames(self, spellList):
        if not self.spells:
            self.getSpells()
        nameSpellList = spellList & self.spells.keys()

        # spell name as the keys, lookup key as the value
        nameSpellList = {self.spells[s]["name"]: s for s in nameSpellList}
        return nameSpellList

    def preferredStats(self, classname):
        if classname in localClassData:
            return localClassData[classname]["preferredStats"]
        return localClassData["default"]["preferredStats"]

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
            subclassProfs = [p.strip() for p in subclassTraits if any(c in p for c in profConditions)]
            proficiencies["subclass"] = subclassProfs
        return proficiencies

    def getRaceProficiencies(self, race, subrace=None):
        if not self.races:
            self.getRaces()
        raceData = self.races[race]
        raceProfs = parseTraits(raceData["traits"])

        if subrace:
            subraceData = next(s for s in raceData["subraces"] if s["name"] == subrace)
            subraceProfs = parseTraits(subraceData["traits"])
            raceProfs['subrace'] = subraceProfs
        return raceProfs

    def getBackgroundProficiencies(self, background):
        proficiencies = {
            "skills": [],
            "tools": [],
        }
        if not self.backgrounds:
            self.getBackgrounds()
        backgroundData = self.backgrounds[background]["benefits"]
        for benefit in backgroundData:
            if benefit["type"] == "skill_proficiency":
                proficiencies["skills"] = getBackgroundSkills(benefit["desc"])
            elif benefit["type"] == "tool_proficiency":
                proficiencies["tools"].append(benefit["desc"])
        return proficiencies

    def getProficiencies(self, classname, race, background, subclass=None, subrace=None):
        proficiencies = {
            "class": None,
            "race": None,
            "background": None,
        }
        
        # get class proficiencies
        if classname:
            proficiencies["class"] = self.getClassProficiencies(classname, subclass)

        # get race proficiencies
        if race:
            proficiencies["race"] = self.getRaceProficiencies(race, subrace)

        # get background proficiencies
        if background:
            proficiencies["background"] = self.getBackgroundProficiencies(background)

        return proficiencies

    def getAsi(self, race, subrace=None):
        if not self.races:
            self.getRaces()
        raceData = self.races[race]
        asiData = {"race": raceData["asi"]}
        if subrace:
            subraceData = next(s for s in raceData["subraces"] if s["name"] == subrace)
            asiData["subrace"] = subraceData["asi"]
        return asiData

    def getLanguages(self, race, background):
        languages = {
            "race": None,
            "background": None,
        }

        if race:
            if not self.races:
                self.getRaces()
            raceData = self.races[race]["languages"].replace('*', '')
            raceLanguages = raceData.replace('_', '').split('.')
            languages["race"] = {
                "main": raceLanguages[1].strip(),
                "extra": '.'.join(raceLanguages[2:])
            }

        if background:
            if not self.backgrounds:
                self.getBackgrounds()
            backgroundData = self.backgrounds[background]["benefits"]
            backgroundLanguages = next((b["desc"] for b in backgroundData
                                       if b["type"] == "language"), None)
            languages["background"] = backgroundLanguages
        return languages

    def getClassEquipment(self, classname):
        equipment = []
        if not self.classData:
            self.getClasses()

        # Format: "You start with the following equipment... \n" +
        # "(*a*) option 1, (*b*) option 2, or (*c*) option 3 \n" OR "c and d \n"
        equipmentData = self.classData[classname]["equipment"].split('\n')
        for e in equipmentData[1:]:
            # For some reason, warlock and wizard have this bullet point formatted
            # the opposite of every other class, so normalize it
            equipmentDesc = e.strip().replace('*(a)*', '(*a*)')
            if not equipmentDesc:
                continue

            if '(*a*)' in equipmentDesc:
                # cut out filler to leave the actual options
                equipmentDesc = equipmentDesc.replace(' or', '').replace(',', '')
                options = [ o[4:].strip() for o in equipmentDesc.split('(*')[1:] ]
                if len(options) < 2:
                    equipment.append(options[0])
                else:
                    equipment.append({"choice": options})
            else:
                # list of choices not given, so just strip the string and add to equipment
                equipment.append(equipmentDesc.strip('*').strip())
        return equipment

    def getBackgroundEquipment(self, background):
        if not self.backgrounds:
            self.getBackgrounds()

        backgroundData = self.backgrounds[background]["benefits"]
        equipment = next((b["desc"].strip('.') for b in backgroundData if b["type"] == "equipment"), None)
        return equipment

    def getEquipment(self, classname, background):
        equipment = {
            "class": None,
            "background": None,
        }

        if classname:
            equipment["class"] = self.getClassEquipment(classname)

        if background:
            equipment["background"] = self.getBackgroundEquipment(background)

        return equipment

    # TODO: spellcards (can probably just return API spell data)

# Test DataGetter class
if __name__ == "__main__":
    dataGetter = DataGetter()
    classData = dataGetter.getClasses()
    for dndClassName in classData:
        dndClass = classData[dndClassName]
        print(f"{dndClassName} preferred stats are: {list(dataGetter.preferredStats(dndClassName))}")
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
        print("Starting equipment:", dataGetter.getEquipment(dndClassName, None))
        print()
        if dndClass["spells"]:
            print("Spells:", list(dndClass["spells"]))
        print()

    races = dataGetter.getRaces()
    for race in races:
        print(race)
        subraces = [s["name"] for s in races[race]["subraces"]]
        if subraces:
            print(f"Subraces: {', '.join(subraces)}")
            print()
            for subrace in subraces:
                print(f"Race & subrace ({subrace}) proficiencies: {dataGetter.getRaceProficiencies(race, subrace)}")
                print(f"ASI data {dataGetter.getAsi(race, subrace)}")
                print()
        else:
            print("Race proficiencies:", dataGetter.getRaceProficiencies(race))
            print(f"ASI data: {dataGetter.getAsi(race)}")
            print()
        print("Languages:", dataGetter.getLanguages(race, None))
        print()

    backgrounds = dataGetter.getBackgrounds()
    print("Backgrounds:", list(backgrounds.keys()))
    print()
    for background in backgrounds:
        print(f"{background} proficiencies: {dataGetter.getBackgroundProficiencies(background)}")
        print()
        print("Languages:", dataGetter.getLanguages(None, background))
        print()
        print("Starting equipment:", dataGetter.getEquipment(None, background))
        print()