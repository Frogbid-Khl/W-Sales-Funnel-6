/* ==================================================
	Theme Name: Wet Wipes Template
    Theme URL: https://www.ogwebsolutions.com/
    Author: OG Websolutions Pvt. Ltd.
    Version:  1.0
===================================================== */
jQuery(document).ready(function($) {
   

    /*=========================================
		# Header
	=========================================
    $(window).scroll(function() {
        if ($(this).scrollTop() > 1) {
            $('header').addClass('fixed');
        } else {
            $('header').removeClass('fixed');
        }
    })*/

    /*=========================================
        Back to top button
    =========================================*/
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.backtotop').fadeIn(100);
        } else {
            $('.backtotop').fadeOut(100);
        }
    });
    $('.backtotop').click(function() {
        $("html, body").animate({ scrollTop: 0 }, 100);
        return false;
    });
    
    /*================================================== 
        Copyright year auto update 
    ================================================== */
    $('#copy_rightYears').html(new Date().getFullYear());

    /*=========================================
        Registration Form
    =========================================*/
    if ($("#free-consultation-form").length) {
        $('#free-consultation-form').validate({
            errorPlacement: function(error, element) {
                return true;
            },
            rules: {
                email: {
                    required: true,
                    email: true
                },
            },
            submitHandler: function(form) {
                var formData = $('#free-consultation-form').serialize();
                $.ajax({
                    type: 'POST',
                    url: 'assets/php/popup-form.php',
                    dataType: "json",
                    data: formData,
                    success: function(data) {
                        if (data.success) {
                            $('.form-status').addClass('alert alert-success');
                            $('.form-status').text('Your Message Has been Sent Successfully');
                            form.submit();
                            $('.form-status').slideDown().delay(3000).slideUp();
                            $("#free-consultation-form").trigger("reset");
                            window.location.href = 'order.html';
                        } else {
                            $('.form-status').addClass('alert alert-danger');
                            $('.form-status').text('Error Occurred, Please Try Again');
                            $('.form-status').slideDown().delay(3000).slideUp();
                        }
                    },
                    error: function(xhr, status, error) {
                        $('.form-status').addClass('alert alert-danger');
                        $('.form-status').text('Something Went Wrong');
                        $('.form-status').slideDown().delay(3000).slideUp();
                    }
                });
            }
        });
    }
    /*=========================================
        Order Form
    =========================================*/
    
	Stripe.setPublishableKey('pk_test_18lgnnPV3SZZn36tyAFO131T00P2pCl90m');
    function stripeResponseHandler(status, response) {
        if (response.error) {

            $(".payment-status").html('<p>' + response.error.message + '</p>');
            return false;

        } else {
            var form$ = $("#order-form");
            // Get token id
            var token = response.id;

            $("#stripeToken").val(token);
            var formData = $('#order-form').serialize();
            $.ajax({
                type: 'POST',
                url: 'stripe/stripe_payment.php',
                dataType: "json",
                data: formData,
                beforeSend: function() {
                $('#loader').show();
                },
                success: function (data) {
                $('#loader').hide();
                    if (data.success) {
                        window.location.href="thank-you.html";
                        return false;
                        $('#order-form').attr('id', 'ssss');
                        $('#sss').submit();
                        $('.form-status').addClass('alert alert-success');
                        $('.form-status').text('Your Message Has been Sent Successfully');
                        
                        $('.form-status').slideDown().delay(3000).slideUp();

                    } else { 
                        window.location.href="order-cancelled.html";
                        return false;
                        $('.form-status').addClass('alert alert-danger');
                        $('.form-status').text('Error Occurred, Please Try Again');
                        $('.form-status').slideDown().delay(3000).slideUp();
                    }
                },
                error: function (xhr, status, error) {
                    window.location.href="order-cancelled.html";
                    return false;
                    $('.form-status').addClass('alert alert-danger');
                    $('.form-status').text('Something Went Wrong');
                    $('.form-status').slideDown().delay(3000).slideUp();
                    $('#loader').hide();
                }
            });

            return false;
        }
    }

    $('#stripepay').click(function () {
        $('#order-form').attr('action', 'stripe/stripe_payment.php');
        $('#card_number').attr('required', true);
        $('#card_exp_month').attr('required', true);
        $('#card_exp_year').attr('required', true);
        $('#card_cvc').attr('required', true);
        $('#paymentdiv').show();
    });
    $(document).on("click", "#paypalpay", function () {
        $('#order-form').attr('action', 'https://www.paypal.com/cgi-bin/webscr');
        $('#card_number').removeAttr("required");
        $('#card_exp_month').removeAttr("required");
        $('#card_exp_year').removeAttr("required");
        $('#card_cvc').removeAttr("required");
        $('#paymentdiv').hide();
    });
    let ch = 1;
if ($("#order-form").length) {
    $("#order-form").validate({
        errorPlacement: function (error, element) {
            return true;
        },
        rules: {
            first_name: {
                required: true,
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                number: true,
                minlength: 10
            },
            billing_address: {
                required: true,
            },
            city: {
                required: true,
            },
            state: {
                required: true,
            },
            zip: {
                required: true,
            },
            country: {
                required: true,
            }
        },
        submitHandler: function (form) {
            var form = document.getElementById('order-form');
            for (var i = 0; i < form.elements.length; i++) {
              
                 if((form.elements[i].getAttribute('class') && form.elements[i].getAttribute('class').includes('error'))===true){
                     return false;
                 }
                 
            }
            
            if($('#stripepay').is(':checked')){

            let ddf = Stripe.createToken({
                number: $('#card_number').val(),
                exp_month: $('#card_exp_month').val(),
                exp_year: $('#card_exp_year').val(),
                cvc: $('#card_cvc').val()
            }, stripeResponseHandler);
            return false;
        } else {
            
            if(ch == 1){
                event.preventDefault();
                ch = 2;
            } else {
                return true;
            }
            setTimeout(function(){ $('#order-form').submit() }, 5000);
            var formData = $('#order-form').serialize();
            

            $.ajax({
                type: 'POST',
                url: 'assets/php/order-form.php',
                dataType: "json",
                data: formData,
                beforeSend: function() {
                    
                  $('#loader').show();
                },
                success: function (data) {
                     $('#loader').hide(); 
                    if (data.success) {
                        $('.form-status').addClass('alert alert-success');
                        $('.form-status').text('Your Message Has been Sent Successfully');
                        $('.form-status').slideDown().delay(3000).slideUp();
                        
                    } else {
                        $('.form-status').addClass('alert alert-danger');
                        $('.form-status').text('Error Occurred, Please Try Again');
                        $('.form-status').slideDown().delay(3000).slideUp();
                    }
                },
                error: function (xhr, status, error) {
                    if(ch == 1){
                    $('.form-status').addClass('alert alert-danger');
                    $('.form-status').text('Something Went Wrong');
                    $('.form-status').slideDown().delay(3000).slideUp();
                    //$('#loader').hide();
                    }
                }
            });
            return true;
        }
        
        return false;
            
        }
    });
}
$('#paypalpay').click();



});