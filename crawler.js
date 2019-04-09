var request = require('request'); //library, used to make http requests
var cheerio = require('cheerio'); // used to parse and select html elements
var URL = require('url-parse'); // use to parse urls


var START_URL = "https://www.adidasoutdoor.com";
var SEARCH_WORD = "terrex";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseURL = url.protocol + "/" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of pages to visit.");
        return;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        //We've already visited this page so repeat the crawl
        crawl();
    } else {
        //New page we haven't visited
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    //Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++; //increment pagesVisited counter

    //Make the request

    console.log("Visiting page " + url);
    request(url, function (error, response, body) { //using library request to visit page and execute callback a callback after we get a response
        // callback is the anonymous function function(error, response, body)       
       
        //Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        if (response.statusCode !== 200) {

            callback();
            return;
        }
            //Parse the document body
            var $ = cheerio.load(body); //parsing the page and assign body to $ variable
            var isWordFound = searchForWord($, SEARCH_WORD);
            if(isWordFound) {
                console.log('Word'+ SEARCH_WORD + 'found at page ' + url);
            } else {
                collectInternalLinks($);
                //In this short program, our callback is just calling crawl()
                callback();
            }
            
        });
    }


//this function will search page for keyword
function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return (bodyText.indexOf(word.toLowerCase()) !== -1);
}

//this function will gather all relative links as well as absolute links on a given page

function collectInternalLinks($) {
 

    var relativeLinks = $("a[href^='/']"); //selecting elements whose href attribute begins with "/"  ie relative links
    console.log("Found " + allRelativeLinks.length + " relative links");
    relativeLinks.each(function () {
        pagesToVisit.push(baseURL + $(this).attr('href'));
    });

    

}