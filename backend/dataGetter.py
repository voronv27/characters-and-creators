import json
import requests

def getData(url, payload):
    response = requests.get(url, payload)
    return response.json()

def getClasses():
    url = "https://api.open5e.com/v1/classes/"
    classData = []
    while True:
        try:
            data = getData(url, {})
            classData += data['results']

            # if there's more than one page of results, get data from next page
            if data['next']:
                url = data['next']
            else:
                break
        except Exception as e:
            print(f"Error getting class data: {e}")
            break
    return classData

# TODO: create a DataGetter class that runs all get* functions once
# and caches the results instead of constantly making the same requests

if __name__ == "__main__":
    # test getClasses function
    classData = getClasses()
    for dndClass in classData:
        print(f"Class: {dndClass['name']}")
        subclasses = ', '.join([subclass['name'] for subclass in dndClass['archetypes']])
        print(f"{dndClass['subtypes_name']}: {subclasses}\n")