import json
import requests

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

    def getClasses(self):
        if not self.classData:
            url = "https://api.open5e.com/v1/classes/"
            self.classData = getData(url)
        return self.classData


# Test DataGetter class
if __name__ == "__main__":
    dataGetter = DataGetter()
    classData = dataGetter.getClasses()
    for dndClass in classData:
        print(f"Class: {dndClass['name']}")
        subclasses = ', '.join([subclass['name'] for subclass in dndClass['archetypes']])
        print(f"{dndClass['subtypes_name']}: {subclasses}\n")
