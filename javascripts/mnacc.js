/**
 * @author Greg Tobkin
 * 
 * Custom javascript for the Manhattan Nursing Aide Career Center page
 * 
 * This implementation is quick and dirty in that it rereads every field after any keypress
 * An optimization would be to store values for each field
 * and specify custom .input/.keyup events for each, to minimize reading+parsing required
 */

function resetDefaults() {
	// Starting values follow
	$("#MNACC_01_01").val("50"); // # participants
	$("#MNACC_01_02").val("30%"); // % graduate, get job, retain < 1yr
	$("#MNACC_01_03").val("3"); // Avg job duration, in months
	$("#MNACC_01_04").val("$15,000"); // avg post-training salary
	$("#MNACC_01_05").val("$9,000"); // avg pre-training salary
	
	$("#MNACC_02_02").val("60%"); // % graduate, get job, retain > 1yr
	
	$("#MNACC_03_03").val("50%"); // % get health insurance through employer
	$("#MNACC_03_04").val("10%"); // % health insurance counterfactual
	$("#MNACC_03_05").val("0.7"); // value of health insurance, in QALY
	$("#MNACC_03_06").val("$50,000"); // value of 1 QALY
	
	$("#MNACC_funding").val("$100,000");
	$("#MNACC_rhFactor").val("50%");
	// End of starting values
}

resetDefaults();

// Defined in the charity-specific script block as the set of input fields varies across selected charities
function updateBenefits() {
	$("#MNACC_02_01").val($("#MNACC_01_01").val());
	$("#MNACC_02_03").val($("#MNACC_01_04").val());
	$("#MNACC_02_04").val($("#MNACC_01_05").val());
	$("#MNACC_03_01").val($("#MNACC_02_01").val());
	$("#MNACC_03_02").val($("#MNACC_02_02").val());
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

// Initialize JQuery smooth-scrolling quicknav links
$("#MNACC_toCalculator").click(function() {
    $('html, body').animate({
        scrollTop: $("#MNACC_calculator").offset().top
    }, 500);
    return false;
});


