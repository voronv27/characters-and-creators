// sheet.js has js for the character sheet

// loads the pdf
// when we pass in fieldnames and values we can update the
// fillable entries on the pdf
async function loadPdf(name, id, parentId, fields=null) {
	const dir = `assets/character_sheet/${name}.pdf`;
	const pdfBytes = await fetch(dir).then(res => res.arrayBuffer());
	
	const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
	const form = pdfDoc.getForm();

	// used this to find names of form fields
	/*const fieldNames = form.getFields();
	fieldNames.forEach(f => {
		console.log("name", f.getName());
		console.log("type", f.constructor.name);
	})*/

	// set parent aspect ratio
	const page = pdfDoc.getPages()[0];
	const {width, height} = page.getSize();
	page.setMediaBox(0, 0, width, height);
	page.setCropBox(0, 0, width, height);
	const parentCont = document.getElementById(parentId);
	parentCont.style.aspectRatio = `${width} / ${height}`;

	if (fields) {
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
	}
	const pdfDataUri = await pdfDoc.saveAsBase64({dataUri: true});
	
	// removes any toolbars or margins or scroll, make zoom to fit
	const adjustments = "#view=FitV&toolbar=0&navpanes=0&scrollbar=0";
	const pdfElement = document.getElementById(id)
	pdfElement.src = pdfDataUri + adjustments;
}

loadPdf("CharacterSheet-1", "page1", "full-page1");
loadPdf("CharacterSheet-2", "page2", "full-page2");
loadPdf("basic_details", "basic-info", "basic-info-block");