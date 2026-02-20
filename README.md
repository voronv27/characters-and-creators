# Characters & Creators
Project Lead: Victoria Voronina  
Current Team Members: Victoria (Vicky) Voronina (voronv@rpi.edu), Robyn Haney (haneyr2@rpi.edu), Owen Robb (robbo@rpi.edu), Daniel Fellenzer (felled2@rpi.edu) 
Fall 2025 Members: Victoria (Vicky) Voronina (voronv@rpi.edu), Garrett Gee (geeg@rpi.edu)  
Link to site: https://voronv27.github.io/characters-and-creators/

# Overview
There are many D&D tools online for creating character sheets, the most famous being DnD Beyond. However, D&D Beyond force its users to create an account before they can make characters, as well as paywalling certain material (even if the user owns a physical copy of the book, they’d have to purchase it on the site to use it), and, for a certain time frame, D&D Beyond stopped supporting DnD 5th edition entirely. The overall process D&D Beyond has towards character creation is very beginner-friendly and intuitive, but these issues are frustrating.  
Characters & Creators is an open-source tool for making DnD 5th edition character sheets that aims to be similar to D&D Beyond, while improving on these issues. It is designed to both help beginners create their first character by guiding them through the process, and to help more experienced players by saving time and auto-filling in fields. Future additions to the site can include allowing these character sheets to be filterable, so players can look for specific abilities more easily (for example, a player may want to search for what bonus actions they have available to them).  
A user can go to the website and choose their DnD class, race, etc from a list of options, and have certain information on their character sheet auto-filled in based on what they select on each step of the process. The finalized character sheet can be edited further as need be, and can be downloaded in pdf form. No signing up through email is necessary to go through this process, and we aim to make as much D&D content accessible as possible for free with this tool. The site should make character creation as simple and quick as possible, but stay flexible for more experienced users who want to change something specific from the base rules.  

# Goals
The website should be able to walk the user through a step-by-step process to create a downloadable character sheet. The software should be able to upload and edit existing character sheets on the site, and be able to search created character sheets for specific information (ex: actions, bonus actions, etc). Wherever possible, values should be auto-selected or auto-filled in with the ability to edit them from the default, and important information should be displayed to help users make their choices.  

# Stack
For the back end we plan on using Python and Flask. The front end stack will most likely use HTML, CSS, and jQuery.  

# Milestones
NOTE: If a specific time isn’t listed, we aim to achieve the listed goal by the end of the month (or before RCOS presentations begin for the May goals)  

# February 2026
New members (Robyn, Dan, Owen): learn the Github repository setup
Create UI mockup for how we want site to look (Vicky, Dan)
Backend refactoring & optimization: change to storing data locally to fix load time (Vicky, Robyn)
Frontend: code cleanup/refactoring  (Owen)
Frontend: fix UI based on mockup (Robyn)

# March 2026
Work on character sheet navigation (Vicky, Dan)
Implement multiclass logic:
Backend: add extra multiclass info to our Flask server (Vicky, Robyn)
Frontend: update class selection to be able to order class selection (Dan)
Frontend: on the stats page, specify multiclass requirements and warn user if their stats don’t meet multiclass requirements (Owen)
Implement point buy system (Owen)
Implement languages (Robyn)
Implement spells (Dan)
Fix text overflow in spell card formatting
Implement Extra Custom Info (Dan)
Frontend: fix UI based on mockup (Vicky)

# April 2026
Add subclass implementation (Vicky)
Add subrace implementation (Dan)
Implement proficiencies (Owen)
Implement equipment (Robyn)
Add character sheet filtering (Vicky, Robyn)
Begin work on sheet export (Vicky, Robyn)
Add option to filter by source book for categories (Owen, Dan)
Frontend: fix UI based on mockup (Dan)

# May 2026
Finish work on sheet export (Vicky, Robyn)
Code cleanup - make sure everything is correctly commented, extraneous code is removed, etc. (Owen, Robyn, Vicky, Dan)
Frontend: fix UI based on mockup (Owen)
