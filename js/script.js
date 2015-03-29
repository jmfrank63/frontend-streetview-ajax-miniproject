function getToday() {
    // returns the date in format YYYYMMDD
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd < 10) {
        dd='0'+dd;
    } 
    if(mm < 10) {
        mm ='0' + mm;
    } 
    var now = yyyy + mm + dd;
    return now;
}

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var NYT_url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    var NYT_api_key = "5d044ccb5cee809c73529ad63c3615e3:12:71476639";

    var jsonpCallback = function(data) {
        console.log(data);
    };
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    if (street && city) {
        $body.append('<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=640x480&location=' + street + ',' + city + '">');
        $greeting.text('So you like to live at ' + street + ' , ' + city + '?');
        // load NYT articles
        $.getJSON(NYT_url + '?fq=' + city + '&begin_date='+ getToday() + '&api-key=' + NYT_api_key, function( data ) {
            var items = [];
            $.each( data.response.docs, function( key, val ) {
                    items.push( "<li id='article_no_" + key + "'>" +
                                "<a href='" + val.web_url +
                                "' target='_blank'>" +
                                val.headline.main +
                                "</a><p>"+ val.snippet +
                                "</p></li>" );
                  });
            $('#nytimes-articles').append(items.join(''));
            }).error( function() {
                $('#nytimes-articles').append('<h3>... could not be loaded.</h3>');
            });
        // load Wikipedia links
        // get relevant titles and snippets
        var wikiRequestTimeOut = setTimeout(function(){
            $wikiElem.text('<h3>... failed to load.</h3>');
        }, 8000);
        var wikiURL = 'https://en.wikipedia.org/w/api.php?continue=&action=query&list=search&srsearch=';
        $.ajax({
            url: wikiURL + city + '&srprop=title|snippet&format=json&callback=?',
            cache: true,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            data: {
                    format: 'json'
            },
            dataType: 'jsonp',
            success: function(jsondata){
                var items = [];
                $.each(jsondata , function(jsonKey, jsonVal) {
                    //console.log('Key:', jsonKey,'Val', jsonVal);
                    if (jsonKey == "query") {
    
                        for (var i = 0; i < jsonVal.search.length; i++) {
                            console.log(jsonVal.search[i]);
                            items.push("<li id='wikipedia_link_no" + i + "'>" +
                            "<a href='https://en.wikipedia.org/wiki/" +
                            jsonVal.search[i].title.replace(/ /g,"_") +
                            "' target='_blank'>" +
                            jsonVal.search[i].title +
                            "<a>" +
                            '<p>' +
                            jsonVal.search[i].snippet + 
                            "</p></li>");
                        }
                        clearTimeout(wikiRequestTimeOut);
                    }
                });
                $('#wikipedia-links').append(items.join(''));
            }
        });
    }

    return false;
    
}

$('#form-container').submit(loadData);

loadData();
