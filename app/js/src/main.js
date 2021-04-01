$(document).on('ready', function() {

	$(window).scroll(function() {
	  if ($(this).scrollTop() > 1){ 
	    $('.site-header').addClass("sticky");
	  }
	  else{
	    $('.site-header').removeClass("sticky");
	  }
    if ($(this).scrollTop() > 300){  
	    $('.call-action-fixed').addClass("sticky-call-action");
	  }
	  else{
	    $('.call-action-fixed').removeClass("sticky-call-action");
	  }

	});  

  console.log('jQuery load!!!');


  var $menu = $('.getway');
  var $hamburguer = $('.getway-hamburguer');
  $hamburguer.click(function (e) {
    e.stopPropagation();
    $(this).toggleClass('active');
    $menu.toggleClass('active');
    console.log('click');
  });

  // $menu.find('ul').click(function (e) {
  //   e.stopPropagation();
  // });

  $('body').click(function () {
    $hamburguer.removeClass('active')
    $menu.removeClass('active');
  });

  $(".regular").slick({
    autoplay: true,
    dots: true,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 2
  });


//ACORDEON
  var $buttonAcordeon = $('.why-faq li a');
  var $whyFaqSlibing = $('.why-faq-text');
  $whyFaqSlibing.slideUp();
  $('.why-faq-text.text-01').slideDown();
  $buttonAcordeon.click(function(e){
    e.preventDefault();
    $whyFaqSlibing.slideUp();
    $(this).parent().find('.why-faq-text').slideDown();
  });

//ARCORDEON IMAGES
$('.why-faq li a').each(function(index){
  var $indice = index+1;
  $(this).attr('id','bg-' + $indice);
  $(this).click(function(){
    var $bgId = $(this).attr('id');
    $('.bg-image').removeClass('d-block').addClass('d-none');
    $('.bg-image'+'.'+$bgId).removeClass('d-none').addClass('d-block');
  });
})

  $.scrollIt();

  ScrollReveal().reveal('.rentabilidade', { delay: 500 });
  ScrollReveal().reveal('.simulador', { delay: 500 });
  ScrollReveal().reveal('.assistidos', { delay: 500 });
  ScrollReveal().reveal('.investidores', { delay: 500 });
  ScrollReveal().reveal('.como-funciona', { delay: 500 });
  ScrollReveal().reveal('.canais-digitais', { delay: 500 });
  ScrollReveal().reveal('.compartilhe', { delay: 500 });
  ScrollReveal().reveal('.quero-aderir', { delay: 500 });

});