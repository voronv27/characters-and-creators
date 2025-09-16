# Setting up local Flask Server
1) Make sure you have a version of python 3.12 installed
2) Open a terminal and cd into the backend folder
3) Run from the terminal python3 -m venv venv (try py or python instead of python3 if you get an error)
4) Run from the terminal venv\Scripts\activate (use source venv/bin/activate if on linux)
5) Run from the terminal pip install -r requirements.txt
6) if that does not work instead run pip install flask and then pip install python-dotenv
7) You are now done!

# To Run Locally
## Windows:
1) venv\Scripts\activate (if you are not already in your venv)
2) flask run (optional ->) --port [port number you want to host on]
3) To stop the server press ctrl + c on the commpand line
4) To exit the venv run deactivate on the command line

## Linux:
1) source venv/bin/activate (if you are not already in your venv)
2) flask run (optional ->) --port [port number you want to host on]
3) To stop the server press ctrl + c on the command line
4) To exit the venv run deactivate on the command line


# Note
The above instructions are only for testing the python locally but do not 
actually update the api we have running over at https://voronv.pythonanywhere.com/. 
Talk to me (Vicky/voronv27) to get any changes to the flask server deployed--I'll
update the PythonAnywhere with the new code.