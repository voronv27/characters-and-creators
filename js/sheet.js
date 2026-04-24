// sheet.js has js for the character sheet

// loads the pdf
// when fields is non-null we can update the fillable
// entries on the pdf
var fields = {};
async function loadPdf(name, id, parentId) {
	const dir = `assets/character_sheet/${name}.pdf`;
	const pdfBytes = await fetch(dir).then(res => res.arrayBuffer());
	
	const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
	const form = pdfDoc.getForm();

	// used this to find names of form fields
	/*const fieldNames = form.getFields();
	fieldNames.forEach(f => {
		console.log(`name: '${f.getName()}``);
		console.log("type", f.constructor.name);
	})*/

	// set parent aspect ratio
	const page = pdfDoc.getPages()[0];
	const {width, height} = page.getSize();
	page.setMediaBox(0, 0, width, height);
	page.setCropBox(0, 0, width, height);
	const parentCont = document.getElementById(parentId);
	parentCont.style.aspectRatio = `${width} / ${height}`;

	for (const fieldName in fields) {
		const type = fields[fieldName]["type"];
		const value = fields[fieldName]["value"];
		if (type == "text") {
			form.getTextField(fieldName).setText(value);
		} else if (type == "checkbox") {
			form.getCheckBox(fieldName).check();
		}
	}
	const updatedBytes = await pdfDoc.save();
	const pdfDataUri = await pdfDoc.saveAsBase64({dataUri: true});
	
	// removes any toolbars or margins or scroll, make zoom to fit
	const adjustments = "#view=FitV&toolbar=0&navpanes=0&scrollbar=0";
	const pdfElement = document.getElementById(id)
	pdfElement.src = pdfDataUri + adjustments;
}

async function loadPdfPages() {
	// pages
	loadPdf("CharacterSheet-1", "page1", "full-page1");
	loadPdf("CharacterSheet-2", "page2", "full-page2");
	loadPdf("CharacterSheet-3", "page3", "full-page3");

	// individual components
	// todo
	loadPdf("basic_details", "basic-info", "basic-info-block");
}
loadPdfPages();

// goes through char and populates a fields dictionary,
// then calls loadPdf to update character sheet
const charToForm = {
	"name": "CharacterName",
	"class": "ClassLevel",
	"race": "Race ",
	"subrace": "Race ",
	"background": "Background",
	"stats": {
		"Strength": "STR", 
		"Dexterity": "DEX", 
		"Constitution": "CON",
		"Intelligence": "INT", 
		"Wisdom": "WIS",
		"Charisma": "CHA"
	},
	"proficiencies": {
		"savingThrows": {
			"Strength": "Check Box 11", 
			"Dexterity": "Check Box 18", 
			"Constitution": "Check Box 19",
			"Intelligence": "Check Box 20", 
			"Wisdom": "Check Box 21",
			"Charisma": "Check Box 22"
		},
		"skills": {
		    "Acrobatics": "Check Box 23",
		    "Animal Handling": "Check Box 24",
		    "Arcana": "Check Box 25",
		    "Athletics": "Check Box 26",
		    "Deception": "Check Box 27",
		    "History": "Check Box 28",
		    "Insight": "Check Box 29",
		    "Intimidation": "Check Box 30",
		    "Investigation": "Check Box 31",
		    "Medicine": "Check Box 32",
		    "Nature": "Check Box 33",
		    "Perception": "Check Box 34",
		    "Performance": "Check Box 35",
		    "Persuasion": "Check Box 36",
		    "Religion": "Check Box 37",
		    "Sleight of Hand": "Check Box 38",
		    "Stealth": "Check Box 39",
		    "Survival": "Check Box 40"
		},
		"armors": "ProficienciesLang",
		"weapons": "ProficienciesLang",
		"tools": "ProficienciesLang"
	}
}
const textFields = new Set([
	"CharacterName", "ClassLevel", "Race ", "Background",
	"STR", "DEX", "CON", "INT", "WIS", "CHA", 
	"ProficienciesLang"
])
async function updatePdf() {
	fields = {};
	for (entry in charToForm) {
		// skip null and empty values
		if (!char[entry]) {
			continue;
		}
		if (typeof char[entry] == "object" && 
			Object.keys(char[entry]).length == 0) {
			continue;
		}

		const charEntry = char[entry];
		var formField;
		if (entry in charToForm) {
			formField = charToForm[entry];
		}

		var value = "";
		if (formField && formField in fields) {
			value = fields[formField].value;
		}

		// handle special cases (there's a lot)
		if (entry == "class") {
			for (c in charEntry) {
				if (value != "") {
					value += ", ";
				}
				value += c;
				if (charEntry[c].subclass) {
					value += ` (${charEntry[c].subclass})`
				}
				value += ` Lv ${charEntry[c].level}`;
			}
		} else if (entry == "subrace") {
			value += ` (${charEntry})`;
		} else if (entry == "stats") {
			for (s in charEntry) {
				value = charEntry[s];
				if (value) {
					const formInfo = {};
					formInfo.type = "text";
					formInfo.value = `${value}`;
					formField = charToForm["stats"][s];
					fields[formField] = formInfo;
				}
			}
			continue;
		} else if (entry == "proficiencies") {
			for (profType in charToForm["proficiencies"]) {
				if (profType == "savingThrows") {
					for (st of charEntry.savingThrows) {
						const formInfo = {};
						formInfo.type = "checkbox";
						formField = charToForm["proficiencies"]["savingThrows"][st];
						fields[formField] = formInfo;
					}
				} else if (profType == "skills") {
					for (sk of charEntry.skills) {
						const formInfo = {};
						formInfo.type = "checkbox";
						formField = charToForm["proficiencies"]["skills"][sk];
						fields[formField] = formInfo;

						console.log(sk);
						console.log(formField);
					}
				}
				else {
					value += charEntry[profType].join(", ") + "\n";
					formField = charToForm["proficiencies"][profType];
					const formInfo = {};
					formInfo.type = "text";
					formInfo.value = value;
					fields[formField] = formInfo;
				}
			}
			continue;
		} else {
			value += charEntry;
		}

		const formInfo = {};
		formInfo.type = "checkbox";
		if (textFields.has(formField)) {
			formInfo.type = "text";
			formInfo.value = value;
		}
		fields[formField] = formInfo;
	}
	await loadPdf("CharacterSheet-1", "page1", "full-page1");
}

// listens for when we reach the character sheet page and
// populates sheet with values from char
window.addEventListener('hashchange', () => {
    if (sectionNum == numSections - 1) {
    	updatePdf();
    }
});