async function loadPdf(name, id, parentId) {
	const dir = `assets/character_sheet/${name}.pdf`;
	const pdfBytes = await fetch(dir).then(res => res.arrayBuffer());
	const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

	// set parent aspect ratio
	const page = pdfDoc.getPages()[0];
	const {width, height} = page.getSize();
	const parentCont = document.getElementById(parentId);
	parentCont.style.aspectRatio = `${width} / ${height}`;
	
	const pdfDataUri = await pdfDoc.saveAsBase64({dataUri: true});

	// removes any toolbars or margins or scroll, make zoom to fit
	const adjustments = "#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit";
	const pdfElement = document.getElementById(id)
	pdfElement.src = pdfDataUri + adjustments;

	// adds the resize-zoom class so it will rezoom on window resize
	pdfElement.classList.add('resize-zoom');
}

loadPdf("CharacterSheet-1", "page1", "full-page1");
loadPdf("CharacterSheet-2", "page2", "full-page2");
loadPdf("basic_details", "basic-info", "basic-info-block");

$(window).on('resize', function () {
	$(".resize-zoom").each((e) => {
		console.log("resizing");
		const src = e.src.split("#")[0];
		const adjustments = "#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit";
		e.src = src + adjustments;
	});
});