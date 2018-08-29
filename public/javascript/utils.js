'use strict';

var web_address;

module.exports = {
   getSubPath: function(request) {
     // Returns an array representing the URL
     // Empty string ("") means you're at base, "/"
     let url_split_arr = require('url')
       .parse(request.url, true)
       .pathname
       .split('/');
     let url_split_arr_length = url_split_arr.length;
     let url_split_path = url_split_arr.slice(1, url_split_arr_length);
     // let base = url_split_path[0];

     return url_split_path;
   }, // end getSubPath
   address: function(passed_web_address) {
     if(web_address) {
       //pass
     } else {
       web_address = passed_web_address;
     }
     return web_address;
   } // end address
}
