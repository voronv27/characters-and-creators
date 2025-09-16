# Characters & Creators
Project Lead: Victoria Voronina
Team Members: Victoria (Vicky) Voronina (voronv@rpi.edu), Garrett Gee (geeg@rpi.edu) 
Link to site: https://voronv27.github.io/characters-and-creators/

Overview
	There are many D&D tools online for creating character sheets, the most famous being DnD Beyond. However, D&D Beyond force its users to create an account before they can make characters, as well as paywalling certain material (even if the user owns a physical copy of the book, they’d have to purchase it on the site to use it), and, for a certain time frame, D&D Beyond stopped supporting DnD 5th edition entirely. The overall process D&D Beyond has towards character creation is very beginner-friendly and intuitive, but these issues are frustrating.
Characters & Creators is an open-source tool for making DnD 5th edition character sheets that aims to be similar to D&D Beyond, while improving on these issues. It is designed to both help beginners create their first character by guiding them through the process, and to help more experienced players by saving time and auto-filling in fields. Future additions to the site can include allowing these character sheets to be filterable, so players can look for specific abilities more easily (for example, a player may want to search for what bonus actions they have available to them).
	A user can go to the website and choose their DnD class, race, etc from a list of options, and have certain information on their character sheet auto-filled in based on what they select on each step of the process. The finalized character sheet can be edited further as need be, and can be downloaded in pdf form. No signing up through email is necessary to go through this process, and we aim to make as much D&D content accessible as possible for free with this tool. The site should make character creation as simple and quick as possible, but stay flexible for more experienced users who want to change something specific from the base rules.

Goals
The website should be able to walk the user through a step-by-step process to create a downloadable character sheet. The software should be able to upload and edit existing character sheets on the site, and be able to search created character sheets for specific information (ex: actions, bonus actions, etc). Wherever possible, values should be auto-selected or auto-filled in with the ability to edit them from the default, and important information should be displayed to help users make their choices.

Stack
For the back end we plan on using Python and Flask. The front end stack will most likely use HTML, CSS, and jQuery.

Milestones
NOTE: If a specific time isn’t listed, we aim to achieve the listed goal by the end of the month (or before RCOS presentations begin for the December goals)

September 2025
Create github repository by first week of small groups (Vicky)
Get working character sheet editor interface (Garrett)
User should be able to type in information and download the final result (Garrett)
Look into the open5e API to see what DnD 5e character information can be pulled–get flask server running and have working API calls by end of month (Vicky)
Plan website layout so it looks nice–have mockup template by end of the month (Garrett & Vicky)

October 2025
Implement open5e API into frontend by start of month (Vicky)
Set up step-by-step process UI for filling in the sheet (Garrett)
Start providing options to select from rather than having it all be typed in manually (Garrett & Vicky)
Add spellcards as extra pages on the character sheet (Vicky)
Give option to save character sheets so they can be uploaded and edited later (Garrett)

November 2025
Continue work on listing options to choose from as opposed to typing in information manually–have API calls wherever possible to get this information instead of setting it up manually (Garrett & vicky)
Store information in local storage in order to stop information from being lost when reloading
Add the option to suggest/assign “optimal” choices. For example, when deciding how to distribute stats, a strength-based class would have its highest stat value assigned to the strength stat (Vicky)
Work on website layout and aesthetics (Garrett & Vicky)
Optional: if there’s time available, start working on character sheet filtering/searching for specific values (Vicky & Garrett)

December 2025
Finish up features and ensure basic site functionality (Garrett & Vicky)
Finalize UI: make sure website looks good and is easy to use, make tweaks where needed (Garrett & Vicky)
Optional: if there’s time, and search/filtering was worked on in November, try to have that working as well (Garrett & Vicky)
Optional: implement a login system (Garrett)
