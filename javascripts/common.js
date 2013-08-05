/**
 * @author Greg Tobkin
 */

$(document).ready(function() {
	var top = $('#sidebar').offset().top - parseFloat($('#sidebar').css('marginTop').replace(/auto/, 0));
	$(window).scroll(function (event) {
		
		// what the y position of the scroll is
		var y = $(this).scrollTop();
  
    	// whether that's below the form
    	if (y >= top - 400) {
      		// if so, add the fixed class
      		$('#sidebar').addClass('fixed');
    	} else {
      		// otherwise remove it
      		$('#sidebar').removeClass('fixed');
    	}
  	});
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
var benefit;
function updateBCRatio() {
	var funding = parseField($("#funding").val());
	var rhFactor = parseField($("#rhFactor").val())/100;
	var bcRatio = benefit * rhFactor / funding;
	if (isNaN(Math.round(bcRatio))) {
		$("#bcRatioDisplay").text("0:1");
	} else {
		$("#bcRatioDisplay").text(Math.round(bcRatio) + ":1");
	}
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

//$("input.duplicate").disableInput();
