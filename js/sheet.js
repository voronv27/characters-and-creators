async function loadPdf(name, id) {
	const dir = `assets/character_sheet/${name}.pdf`;
	const pdfBytes = await fetch(dir).then(res => res.arrayBuffer());
	const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

	const pdfDataUri = await pdfDoc.saveAsBase64({dataUri: true});
	document.getElementById(id).src = pdfDataUri;
}

loadPdf("CharacterSheet-1", "page1");
loadPdf("basic_details", "basic-info");