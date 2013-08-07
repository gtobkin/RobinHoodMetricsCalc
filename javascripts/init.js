/**
 * @author Greg Tobkin
 * 
 * This .js is only executed once (on page load).
 */

$(document).ready(function() {
	
});

function formatMoney(amount, decPlaces, thouSeparator, decSeparator) {
	var n = amount,
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSeparator = decSeparator == undefined ? "." : decSeparator,
    thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
    sign = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + "$" + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};

function parseField(input) {
	return parseFloat(input.replace(/[^\d.-]/g, ""));
};

$(function() {
	$('a[rel=tipsy]').tipsy({fade: true, gravity: 'n'});
});

$("a.quicknav").click(function(){
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 750);
    return false;
});

// Set duplicate (teal) field inputs to disabled
$('input.duplicate').prop("disabled", true);

// Initialize each mock charity's metrics accordion UI element
$("#MNACC_metricsAccordion").accordion({heightStyle:"content"});
$("#WA_metricsAccordion").accordion({heightStyle:"content"});

// Initialize Tipsy Tooltips across all charities
$('#MNACC_constantFactorHint').tipsy({html:true, gravity:'w'});
$('#MNACC_duplicateFactorHint').tipsy({html:true, gravity:'w'});
$('#MNACC_rhFactorHint').tipsy({html:true, gravity:'w'});
$('#MNACC_qalyFactorHint').tipsy({html:true, gravity:'w'});
$('#MNACC_pdvHint').tipsy({html:true, gravity:'w'});

$('#WA_constantFactorHint').tipsy({html:true, gravity:'w'});
$('#WA_duplicateFactorHint').tipsy({html:true, gravity:'w'});
$('#WA_rhFactorHint').tipsy({html:true, gravity:'w'});
$('#WA_qalyFactorHint').tipsy({html:true, gravity:'w'});
$('#WA_pdvHint').tipsy({html:true, gravity:'w'});

$("#MNACC_pdvSettingsToggle").click(function() {
	$("#MNACC_pdvFactors").slideToggle();
});
$("#WA_pdvSettingsToggle").click(function() {
	$("#WA_pdvFactors").slideToggle();
});

// Annuity-immediate calculator (so payments are at the ENDS of intervals)
// All inputs are in years, so for PDV of a $1500/year salary increase after 6mo. training,
// salary paid weekly, annual interest rate of 5%, for ten years, you'd do
// pdvCalc(0.5, 1500/52, 10*52, 1/12, 0.05)
function pdvCalc(delay, amount, count, interval, annualSDR) {
	if (annualSDR == 0) {
		return amount * count;
	} else {
		// compute effective discount rate between payments
		var intervalSDR = Math.pow(1+annualSDR, interval)-1;
		// bring the entire annuity forward to the start date
		var val = amount * (1 - Math.pow((1 + intervalSDR), -1*count)) / intervalSDR;
		// and now bring that value from the start date forward to the present
		val = val / Math.pow(1+annualSDR, delay);
		return val;
	}
};

$('#MNACC_img').click(function() {
	if ($("#MNACC").css('display')=='block') {
		$('#MNACC').slideToggle();
		$('html, body').animate({scrollTop: 0}, 300);
    } else {
    	if ($('#WA').css('display')=='block') {
    		$('#WA').toggle();
    	}
    	if ($('#FB').css('display')=='block') {
    		$('#FB').toggle();
    	}
		$('#MNACC').toggle();
		$('html, body').animate({
	        scrollTop: $("#MNACC").offset().top
	    }, 750);
	    // Start monitoring MNACC fields; stop monitoring other ones, to save calculations
		$("input.impact").on('input keyup', function() {
			updateMNACCBenefits(); // this will also, indirectly, call updateBCRatio() for us
		});
		
		$("input.bcRatio").on('input keyup', function() {
			updateMNACCBCRatio();
		});
	}
});

$('#WA_img').click(function() {
	if ($("#WA").css('display')=='block') {
		$('#WA').slideToggle();
		$('html, body').animate({scrollTop: 0}, 300);
    } else {
    	if ($('#MNACC').css('display')=='block') {
    		$('#MNACC').toggle();
    	}
    	if ($('#FB').css('display')=='block') {
    		$('#FB').toggle();
    	}
		$('#WA').toggle();
		$('html, body').animate({
	        scrollTop: $("#WA").offset().top
	    }, 750);
	    // Start monitoring WA fields; stop monitoring other ones, to save calculations
		$("input.impact").on('input keyup', function() {
			updateWABenefits(); // this will also, indirectly, call updateBCRatio() for us
		});
		
		$("input.bcRatio").on('input keyup', function() {
			updateWABCRatio();
		});
	}
});

var MNACC_benefit, MNACC_bcRatio, MNACC_funding, MNACC_rhFactor, MNACC_bcRatio, MNACC_sdr,
	MNACC_subtotal_01, MNACC_subtotal_02, MNACC_subtotal_03;

// Initialize MNACC-specific functions; then, call them, so we prepopulate each charity's derived calculations
function resetMNACCDefaults() {
	$("#MNACC_01_01").val("50"); // # participants
	$("#MNACC_01_02").val("6"); // training duration, in months
	$("#MNACC_01_03").val("30%"); // % graduate, get job, retain < 1yr
	$("#MNACC_01_04").val("3"); // Avg job duration, in months
	$("#MNACC_01_05").val("$15,000"); // avg post-training salary
	$("#MNACC_01_06").val("$9,000"); // avg pre-training salary
	
	$("#MNACC_02_03").val("60%"); // % graduate, get job, retain > 1yr
	$("#MNACC_02_04").val("15"); // of those that find job, avg. years in field
	
	$("#MNACC_03_03").val("50%"); // % get health insurance through employer
	$("#MNACC_03_04").val("10%"); // % health insurance counterfactual
	$("#MNACC_03_05").val("0.07"); // value of health insurance, in QALY
	$("#MNACC_03_06").val("$50,000"); // value of 1 QALY
	
	$("#MNACC_funding").val("$100,000");
	$("#MNACC_rhFactor").val("50%");
	
	$("#MNACC_sdr").val("5%");
	
	updateMNACCBenefits(); // we may have just changed field values, so need to update derived values too
}

function updateMNACCBenefits() {
	// Copy over duplicate factors
	$("#MNACC_02_01").val($("#MNACC_01_01").val());
	$("#MNACC_02_02").val($("#MNACC_01_02").val());
	$("#MNACC_02_05").val($("#MNACC_01_05").val());
	$("#MNACC_02_06").val($("#MNACC_01_06").val());
	$("#MNACC_03_01").val($("#MNACC_02_01").val());
	$("#MNACC_03_02").val($("#MNACC_02_03").val());
	// Extract values, possibly stripping nonnumerals+nonperiods
	var values = new Array();
	values[0] = parseField($("#MNACC_01_01").val()); // # participants
	values[1] = parseField($("#MNACC_01_02").val()); // training duration, in months
	values[2] = parseField($("#MNACC_01_03").val()); // % find job but <1 yr
	values[3] = parseField($("#MNACC_01_04").val()); // of those, how long do they keep their job, in months
	values[4] = parseField($("#MNACC_01_05").val()); // avg post-training earnings
	values[5] = parseField($("#MNACC_01_06").val()); // avg pre-trainign earnings
	
	values[6] = parseField($("#MNACC_02_03").val()); // % find job and >1 yr
	values[7] = parseField($("#MNACC_02_04").val()); // avg. # years in field
	
	values[8] = parseField($("#MNACC_03_03").val()); // % get health insurance through job
	values[9] = parseField($("#MNACC_03_04").val()); // # would have anyway
	values[10] = parseField($("#MNACC_03_05").val()); // health insurance benefit, in QALY
	values[11] = parseField($("#MNACC_03_06").val()); // value of one QALY
	
	MNACC_sdr = parseField($("#MNACC_sdr").val()); // social discount rate
	
	// Compute subtotals by metric; update subtotal displays
	// assumes 4 paychecks/month
	MNACC_subtotal_01 = values[0]*(values[2]/100) * pdvCalc(values[1]/12, (values[4]-values[5])/48, values[3]*4, 1/48, MNACC_sdr/100);
	MNACC_subtotal_02 = values[0]*(values[6]/100) * pdvCalc(values[1]/12, (values[4]-values[5])/48, values[7]*48, 1/48, MNACC_sdr/100);
	MNACC_subtotal_03 = values[0]*(values[6]/100)*((values[8]-values[9])/100) * pdvCalc(values[1]/12, values[10]*values[11], values[7], 1, MNACC_sdr/100);
	
	$("#MNACC_subtotal_01").text(formatMoney(MNACC_subtotal_01));
	$("#MNACC_subtotal_02").text(formatMoney(MNACC_subtotal_02));
	$("#MNACC_subtotal_03").text(formatMoney(MNACC_subtotal_03));
	// and finally, update benefit + b/c ratio displays
	MNACC_benefit = MNACC_subtotal_01 + MNACC_subtotal_02 + MNACC_subtotal_03;
	$("#MNACC_benefit").text(formatMoney(MNACC_benefit));
	updateMNACCBCRatio();
};

function updateMNACCBCRatio() {
	MNACC_funding = parseField($("#MNACC_funding").val());
	MNACC_rhFactor = parseField($("#MNACC_rhFactor").val());
	MNACC_bcRatio = MNACC_benefit * (MNACC_rhFactor / 100) / MNACC_funding;
	if (isNaN(Math.round(MNACC_bcRatio))) {
		$("#MNACC_bcRatio").text("0");
		$("#MNACC_altBCRatio").text("$0");
	} else {
		$("#MNACC_bcRatio").text(Math.round(MNACC_bcRatio));
		$("#MNACC_altBCRatio").text("$" + Math.round(MNACC_bcRatio));
	}
};

$("#MNACC_resetDefaults").click(function() {
	resetMNACCDefaults();
});

resetMNACCDefaults();