$(function(){
    
    
    var hotels = null;
    
    var categories = null;

    var hotelList = $('.hotel-list'),
        categoryList = $('.category-list'),
        pageDetails =$('.page-info'),
        searchbox = $('#searchbox'),
        screenLinks = $('.screen-link'),
        screens = $('.screen'),
        aboutScreen = $('#about'),
        homeScreen = $('#home');
        
        function init(){
            
        // GET DATA FROM JSON FILES

            $.getJSON('json/hotels.json', function(data){
                hotels = data.hotels;
                displayHotels(hotels);
            });
            
            $.getJSON('json/categories.json', function (data) {
                categories = data.categories;
                displayCategories(categories);
            });

            // SEARCH BY ID IN SEARCH FIELD

            searchbox.on('keyup', function (evt) {
                evt.preventDefault(); 
                if(evt.which === 13){
                    var hotel = getHotelByID($(this).val());
                    if (hotel) {
                        displayHotels([hotel]);
                    }
                }
            });

        function getHotelByID(inputValue){
        for(var i = 0; i < hotels.length; i++){
        var id = hotels[i].id;
            if (id === inputValue) {  
            return hotels[i];
                }
            }  
                return null;
        }

        // GET AND DISPLAY LIST OF ACCOMODATION FROM JSON FILE

        function getHTMLHotelItem(hotel) {
            return `<div data-id="${hotel.id}" class="list-item">
                                <div class="list-image">
                                <img src= ${hotel.image}>
                                </div>
                                <div class="list-info">
                                    <h3>${hotel.name}</h3>
                                    <p>Queenstown</p>
                                    <p>${hotel.stars} Stars</p>
                                    <div class="included">
                                        <i class="fa fa-wifi" aria-hidden="true"></i> Free Wifi<br>
                                        <i class="fa fa-coffee" aria-hidden="true"></i> Breakfast Included<br>
                                        <i class="fa fa-bath" aria-hidden="true"></i> Hot Tub
                                    </div>
                                </div>
                                <div class="list-price">
                                    <h3>${hotel.price}</h3>
                                    <p>Per Night</p>
                                    <a data-screen="about" class="screen-link" href="#">View Details</a>
                                </div>
                            </div>`;
                        }
        
        // FILTER ACCOMDATION BY CATEGORY BUTTONS

        function getHTMLCategoryItem(category) {
            
            return `<button data-category="${category.slug}" class="category-list--item" required data-intro="Accomodation Option"><option value="">${category.title}</option>                  
                    </button>`;
                }

        // GET AND DISPLAY PAGE DETAILS INFORMATION

        function getHTMLDetailsPage(hotel) {

        return `<div data-id= "" class="page-details">
            <div class="page-desc">
                <h2>${hotel.name}</h2><h4>${hotel.stars} Stars</h4>
                <h4>${hotel.rooms}</h4>
                <p>${hotel.description}</p><br>
                <p><strong>Meals Included: ${hotel.meals}</strong></p>
            </div>

            <div class="page-btns-container">
                <div class="page-btns">
                    <h3>${hotel.price}</h3>
                    <p>Per Night</p>
                    <a href="https://www.booking.com">Book Now</a>
                </div>
            </div>`;
        }

    // DISPLAY HOTEL DETAIL PAGE


        function displayDetails(accomodation) {
            pageDetails.html(getHTMLDetailsPage(accomodation));
            
        }

    // GET ACCOMODATION INFO BY ID

        function getAccomodationByID(dataID) {
                for(var i = 0; i < hotels.length; i++){
                    var id = hotels[i].id;
                    if (id === dataID) {  
                        return hotels[i];
                    }
                }  
                return null;
                
            }

    // DISPLAY HOTELS FUNCTION

        function displayHotels(hotels) {
        var s = '';
        $.each(hotels, function (i, hotel) {
            s = s + getHTMLHotelItem(hotel);
        });
        
        hotelList.html(s);
        
        var hotelListItems = $(".list-item");
        $.each(hotelListItems, function () {
            $(this).on("click", function () {
            aboutScreen.toggle();
            homeScreen.toggle();
            
               var dataID = hotelListItems.data('id');
           var accomodation = getAccomodationByID(dataID);
           displayDetails(accomodation);
            });
        });
    }

    // DISPLAY AND FILTER HOTELS BY CATEGORY

    function displayHotelsByCategory(category) {
        event.preventDefault();
        var filteredHotels = [];
        
        $.each(hotels, function (i, hotel) {
            
            if (hotel.category === category) {
                filteredHotels.push(hotel);
            }
        });

        displayHotels(filteredHotels);
    }
    

    function displayCategories(categories){
        var s = '';
        $.each(categories, function(i, category){
            s = s + getHTMLCategoryItem(category);
        });
        
        categoryList.html(s);
        
        var categoryListItems = $('.category-list--item');
        
        $.each(categoryListItems, function(){
            $(this).on('click', function(){
                var category = $(this).data('category');
                displayHotelsByCategory(category);
            });
        });
    }

    // CHANGE SCREENS


     $.each(screenLinks, function(){
                $(this).on('click', changeScreen);
            });

            screens.eq(1).hide();
        }

    function changeScreen(){
        $.each(screenLinks, function(){
            $(this).removeClass('active');
        });

       
        $(this).addClass('active');


        var screenName = $(this).data('screen');
        
        
        $.each(screens, function(){
            $(this).hide();
        });
        
        $('#' + screenName).show();      
    }

    init();
});

// DATEPICKER

$(function() {
    
      $('input[name="datefilter"]').daterangepicker({
          autoUpdateInput: false,
          locale: {
              cancelLabel: 'Clear'
          }
      });
    
      $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
          $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      });
    
      $('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
          $(this).val('');
      });
    
    });

// PRICE CALCULATOR

    const priceInput = document.querySelector('[name=price]');
    const quantityInput = document.querySelector('[name=quantity]');
    const total = document.querySelector('.total');
    const quantityLabel = document.querySelector('.quantity-label');

    function calculateHotelCost() {
        const price = priceInput.value;
        const quantity = quantityInput.value;
        const cost = price * quantity;
        console.log(cost);
        total.innerText = '$' + cost.toFixed(2);
    }

    function updateQuantityLabel() {
        const quantity = quantityInput.value;
        quantityLabel.innerText = quantity;
    }

    calculateHotelCost();

    priceInput.addEventListener('input', calculateHotelCost);
    quantityInput.addEventListener('input', calculateHotelCost);
    quantityInput.addEventListener('input', updateQuantityLabel);
