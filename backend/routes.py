from flask import Flask

app = Flask(__name__)

# This serves just to test that the flask server is running
@app.route('/')
def landing():
    return "Hello world!"

# TODO: routes to get DnD character data