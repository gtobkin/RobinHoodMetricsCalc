/**
 * @author Greg Tobkin
 * 
 * Custom javascript for the Manhattan Nursing Aide Career Center page
 * 
 * This .js is executed every time the MNACC div becomes the active one in the calc.
 * 
 * This implementation is quick and dirty in that it rereads every field after any keypress
 * An optimization would be to store values for each field
 * and specify custom .input/.keyup events for each, to minimize reading+parsing required
 */

// Start monitoring MNACC fields; stop monitoring other ones, to save calculations
$("input.impact").on('input keyup', function() {
	updateMNACCBenefits(); // this will also, indirectly, call updateBCRatio() for us
});

$("input.bcRatio").on('input keyup', function() {
	updateMNACCBCRatio();
});
