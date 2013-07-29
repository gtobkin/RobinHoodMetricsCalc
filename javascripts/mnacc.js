/**
 * @author Greg Tobkin
 * 
 * Custom javascript for the Manhattan Nursing Aide Career Center page
 * 
 * This implementation is quick and dirty in that it rereads every field after any keypress
 * An optimization would be to store values for each field
 * and specify custom .input/.keyup events for each, to minimize reading+parsing required
 */

// Starting values follow
$("#01a").val("50"); // # participants
$("#01b").val("80%"); // % graduate, get job, retain 1yr
$("#01c").val("$15,000"); // avg post-training salary
$("#01d").val("$9,000"); // avg pre-training salary

$("#funding").val("$100,000");
$("#rhFactor").val("50%");
// End of starting values

// Defined in the charity-specific script block as the set of input fields varies across selected charities
function updateBenefits() {
	$("#02a").val($("#01a").val());
	$("#02b").val($("#01b").val());
	$("#02c").val($("#01c").val());
	$("#02d").val($("#01d").val());
	var values = new Array();
	values[0] = parseField($("#01a").val());
	values[1] = parseField($("#01b").val())/100;
	values[2] = parseField($("#01c").val());
	values[3] = parseField($("#01d").val());
	values[4] = values[0];
	values[5] = values[1];
	values[6] = values[2];
	values[7] = values[3];
	var metric1 = values[0] * values[1] * (values[2]-values[3]);
	var metric2 = values[4] * values[5] * (values[6]-values[7]);
	$("#metric1").text(formatMoney(metric1));
	$("#metric2").text(formatMoney(metric2));
	benefit = metric1 + metric2;
	$("#benefitDisplay").text(formatMoney(benefit));
	updateBCRatio();
};

// Updating once the page has loaded makes sure the sidebar displays a consistent state from the start
updateBenefits();

$("input.impact").on('input keyup', function() {
	updateBenefits(); // this will also, indirectly, call updateBCRatio() for us
});

$("input.bcRatio").on('input keyup', function() {
	updateBCRatio();
});