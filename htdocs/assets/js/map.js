(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.project = window.project || {};

  window.isEnabledlog = true;

  window.log = (function() {
    if (window.isEnabledlog) {
      if ((window.console != null) && (window.console.log.bind != null)) {
        return window.console.log.bind(window.console);
      } else {
        return window.alert;
      }
    } else {
      return function() {};
    }
  })();

  project.MapData = (function() {
    var _CENTRAL_LONGITUDE_ON_IMG, _EQUATOR_ON_IMG, _MAP_IMG_HEIGHT, _MAP_IMG_WIDTH, _MILLER_CYLINDRICAL_PROJECTION_POS_Y_MAX, _NUM_CALLS_PER_INTERVAL;

    MapData.COUNTRY_DATA = [
      {
        country: "United Arab Emirates",
        capital: "Abu Dhabi"
      }, {
        country: "Nigeria",
        capital: "Abuja"
      }, {
        country: "Ghana",
        capital: "Accra"
      }, {
        country: "Pitcairn Islands",
        capital: "Adamstown"
      }, {
        country: "Ethiopia",
        capital: "Addis Ababa"
      }, {
        country: "Algeria",
        capital: "Algiers"
      }, {
        country: "Niue",
        capital: "Alofi"
      }, {
        country: "Jordan",
        capital: "Amman"
      }, {
        country: "Netherlands",
        capital: "Amsterdam"
      }, {
        country: "Andorra",
        capital: "Andorra la Vella"
      }, {
        country: "Turkey",
        capital: "Ankara"
      }, {
        country: "Madagascar",
        capital: "Antananarivo"
      }, {
        country: "Samoa",
        capital: "Apia"
      }, {
        country: "Turkmenistan",
        capital: "Ashgabat"
      }, {
        country: "Eritrea",
        capital: "Asmara"
      }, {
        country: "Kazakhstan",
        capital: "Astana"
      }, {
        country: "Paraguay",
        capital: "Asunción",
        query: "Asuncion"
      }, {
        country: "Greece",
        capital: "Athens"
      }, {
        country: "Cook Islands",
        capital: "Avarua"
      }, {
        country: "Iraq",
        capital: "Baghdad"
      }, {
        country: "Azerbaijan",
        capital: "Baku"
      }, {
        country: "Mali",
        capital: "Bamako"
      }, {
        country: "Brunei",
        capital: "Bandar Seri Begawan"
      }, {
        country: "Thailand",
        capital: "Bangkok"
      }, {
        country: "Central African Republic",
        capital: "Bangui"
      }, {
        country: "Gambia",
        capital: "Banjul"
      }, {
        country: "Saint Kitts and Nevis",
        capital: "Basseterre"
      }, {
        country: "China",
        capital: "Beijing"
      }, {
        country: "Lebanon",
        capital: "Beirut"
      }, {
        country: "Serbia",
        capital: "Belgrade"
      }, {
        country: "Belize",
        capital: "Belmopan"
      }, {
        country: "Germany",
        capital: "Berlin"
      }, {
        country: " Switzerland",
        capital: "Bern"
      }, {
        country: "Kyrgyzstan",
        capital: "Bishkek"
      }, {
        country: "Guinea-Bissau",
        capital: "Bissau"
      }, {
        country: "Colombia",
        capital: "Bogotá"
      }, {
        country: "Brazil",
        capital: "Brasília"
      }, {
        country: "Slovakia",
        capital: "Bratislava"
      }, {
        country: "Republic of the Congo",
        capital: "Brazzaville"
      }, {
        country: "Barbados",
        capital: "Bridgetown"
      }, {
        country: "Belgium",
        capital: "Brussels"
      }, {
        country: "Romania",
        capital: "Bucharest"
      }, {
        country: "Hungary",
        capital: "Budapest"
      }, {
        country: "Argentina",
        capital: "Buenos Aires"
      }, {
        country: "Burundi",
        capital: "Bujumbura"
      }, {
        country: "Egypt",
        capital: "Cairo"
      }, {
        country: "Australia",
        capital: "Canberra"
      }, {
        country: "Venezuela",
        capital: "Caracas"
      }, {
        country: "Saint Lucia",
        capital: "Castries"
      }, {
        country: "French Guiana",
        capital: "Cayenne"
      }, {
        country: "United States Virgin Islands",
        capital: "Charlotte Amalie"
      }, {
        country: "Moldova",
        capital: "Chisinau"
      }, {
        country: "Turks and Caicos Islands",
        capital: "Cockburn Town"
      }, {
        country: "Guinea",
        capital: "Conakry"
      }, {
        country: "Denmark",
        capital: "Copenhagen"
      }, {
        country: "Senegal",
        capital: "Dakar"
      }, {
        country: "Syria",
        capital: "Damascus"
      }, {
        country: "Bangladesh",
        capital: "Dhaka"
      }, {
        country: "East Timor (Timor-Leste)",
        capital: "Dili"
      }, {
        country: "Djibouti",
        capital: "Djibouti"
      }, {
        country: "Tanzania",
        capital: "Dodoma (official, legislative)"
      }, {
        country: "Qatar",
        capital: "Doha"
      }, {
        country: "Isle of Man",
        capital: "Douglas"
      }, {
        country: "Ireland",
        capital: "Dublin"
      }, {
        country: "Tajikistan",
        capital: "Dushanbe"
      }, {
        country: "Tristan da Cunha",
        capital: "Edinburgh of the Seven Seas"
      }, {
        country: "Sahrawi Arab Democratic Republic [c]",
        capital: "El Aaiún (declared)"
      }, {
        country: "Akrotiri and Dhekelia",
        capital: "Episkopi Cantonment"
      }, {
        country: "Christmas Island",
        capital: "Flying Fish Cove"
      }, {
        country: "Sierra Leone",
        capital: "Freetown"
      }, {
        country: "Tuvalu",
        capital: "Funafuti"
      }, {
        country: "Botswana",
        capital: "Gaborone"
      }, {
        country: "Cayman Islands",
        capital: "George Town"
      }, {
        country: "Ascension Island",
        capital: "Georgetown"
      }, {
        country: "Guyana",
        capital: "Georgetown"
      }, {
        country: "Gibraltar",
        capital: "Gibraltar"
      }, {
        country: "Guatemala",
        capital: "Guatemala City"
      }, {
        country: "Saint Barthélemy",
        capital: "Gustavia"
      }, {
        country: "Guam",
        capital: "Hagåtña"
      }, {
        country: "Bermuda",
        capital: "Hamilton"
      }, {
        country: "Easter Island",
        capital: "Hanga Roa"
      }, {
        country: "Vietnam",
        capital: "Hanoi"
      }, {
        country: "Zimbabwe",
        capital: "Harare"
      }, {
        country: "Somaliland",
        capital: "Hargeisa"
      }, {
        country: "Cuba",
        capital: "Havana"
      }, {
        country: "Finland",
        capital: "Helsinki"
      }, {
        country: "Hong Kong",
        capital: "Hong Kong"
      }, {
        country: "Solomon Islands",
        capital: "Honiara"
      }, {
        country: "Pakistan",
        capital: "Islamabad"
      }, {
        country: "Indonesia",
        capital: "Jakarta"
      }, {
        country: "Saint Helena",
        capital: "Jamestown"
      }, {
        country: "Israel",
        capital: "Jerusalem (declared, de facto)"
      }, {
        country: "State of Palestine",
        capital: "East Jerusalem (declared)"
      }, {
        country: "State of Palestine",
        capital: "Ramallah (de facto)",
        query: "Ramallah"
      }, {
        country: "South Sudan",
        capital: "Juba"
      }, {
        country: "Afghanistan",
        capital: "Kabul"
      }, {
        country: "Uganda",
        capital: "Kampala"
      }, {
        country: "Nepal",
        capital: "Kathmandu"
      }, {
        country: "Sudan",
        capital: "Khartoum"
      }, {
        country: "Ukraine",
        capital: "Kiev"
      }, {
        country: "Rwanda",
        capital: "Kigali"
      }, {
        country: "South Georgia and the South Sandwich Islands",
        capital: "King Edward Point"
      }, {
        country: "Jamaica",
        capital: "Kingston"
      }, {
        country: "Norfolk Island",
        capital: "Kingston"
      }, {
        country: "Saint Vincent and the Grenadines",
        capital: "Kingstown"
      }, {
        country: "Democratic Republic of the Congo",
        capital: "Kinshasa"
      }, {
        country: "Malaysia",
        capital: "Kuala Lumpur (official, legislative and royal)"
      }, {
        country: "Malaysia",
        capital: "Putrajaya (administrative and judicial)"
      }, {
        country: "Kuwait",
        capital: "Kuwait City"
      }, {
        country: "Gabon",
        capital: "Libreville"
      }, {
        country: "Malawi",
        capital: "Lilongwe"
      }, {
        country: "Peru",
        capital: "Lima"
      }, {
        country: "Portugal",
        capital: "Lisbon"
      }, {
        country: "Slovenia",
        capital: "Ljubljana"
      }, {
        country: "Togo",
        capital: "Lomé"
      }, {
        country: "United Kingdom",
        capital: "London"
      }, {
        country: "Angola",
        capital: "Luanda"
      }, {
        country: "Zambia",
        capital: "Lusaka"
      }, {
        country: "Luxembourg",
        capital: "Luxembourg"
      }, {
        country: "Spain",
        capital: "Madrid"
      }, {
        country: "Marshall Islands",
        capital: "Majuro"
      }, {
        country: "Equatorial Guinea",
        capital: "Malabo"
      }, {
        country: "Maldives",
        capital: "Malé"
      }, {
        country: "Nicaragua",
        capital: "Managua"
      }, {
        country: "Bahrain",
        capital: "Manama"
      }, {
        country: "Philippines",
        capital: "Manila"
      }, {
        country: "Mozambique",
        capital: "Maputo"
      }, {
        country: "Saint Martin",
        capital: "Marigot"
      }, {
        country: "Lesotho",
        capital: "Maseru"
      }, {
        country: "Wallis and Futuna",
        capital: "Mata-Utu"
      }, {
        country: "Swaziland",
        capital: "Mbabane (administrative)"
      }, {
        country: "Swaziland",
        capital: "Lobamba (royal and legislative)"
      }, {
        country: "Mexico",
        capital: "Mexico City"
      }, {
        country: "Belarus",
        capital: "Minsk"
      }, {
        country: "Somalia",
        capital: "Mogadishu"
      }, {
        country: "Monaco",
        capital: "Monaco"
      }, {
        country: "Liberia",
        capital: "Monrovia"
      }, {
        country: "Uruguay",
        capital: "Montevideo"
      }, {
        country: "Comoros",
        capital: "Moroni"
      }, {
        country: "Russia",
        capital: "Moscow"
      }, {
        country: "Oman",
        capital: "Muscat"
      }, {
        country: "Kenya",
        capital: "Nairobi"
      }, {
        country: "Bahamas",
        capital: "Nassau"
      }, {
        country: "Burma",
        capital: "Naypyidaw"
      }, {
        country: "Chad",
        capital: "N'Djamena"
      }, {
        country: "India",
        capital: "New Delhi"
      }, {
        country: "Palau",
        capital: "Ngerulmud"
      }, {
        country: "Niger",
        capital: "Niamey"
      }, {
        country: "Cyprus",
        capital: "Nicosia"
      }, {
        country: "Northern Cyprus",
        capital: "Nicosia"
      }, {
        country: "Mauritania",
        capital: "Nouakchott"
      }, {
        country: "New Caledonia",
        capital: "Nouméa"
      }, {
        country: "Tonga",
        capital: "Nukuʻalofa"
      }, {
        country: "Greenland",
        capital: "Nuuk"
      }, {
        country: "Aruba",
        capital: "Oranjestad"
      }, {
        country: "Norway",
        capital: "Oslo"
      }, {
        country: "Canada",
        capital: "Ottawa"
      }, {
        country: "Burkina Faso",
        capital: "Ouagadougou"
      }, {
        country: "American Samoa",
        capital: "Pago Pago"
      }, {
        country: "Federated States of Micronesia",
        capital: "Palikir"
      }, {
        country: "Panama",
        capital: "Panama City"
      }, {
        country: "French Polynesia",
        capital: "Papeete"
      }, {
        country: "Suriname",
        capital: "Paramaribo"
      }, {
        country: "France",
        capital: "Paris"
      }, {
        country: "Sint Maarten",
        capital: "Philipsburg"
      }, {
        country: "Cambodia",
        capital: "Phnom Penh"
      }, {
        country: "Montserrat",
        capital: "Plymouth (official)"
      }, {
        country: "Montserrat",
        capital: "Brades Estate (de facto)",
        query: "Brades,+Montserrat"
      }, {
        country: "Montenegro",
        capital: "Podgorica (official)"
      }, {
        country: "Montenegro",
        capital: "Cetinje (seat of the President)"
      }, {
        country: "Mauritius",
        capital: "Port Louis"
      }, {
        country: "Papua New Guinea",
        capital: "Port Moresby"
      }, {
        country: "Vanuatu",
        capital: "Port Vila"
      }, {
        country: "Haiti",
        capital: "Port-au-Prince"
      }, {
        country: "Trinidad and Tobago",
        capital: "Port of Spain"
      }, {
        country: "Benin",
        capital: "Porto-Novo (official)"
      }, {
        country: "Benin",
        capital: "Cotonou (de facto)"
      }, {
        country: "Czech Republic",
        capital: "Prague"
      }, {
        country: "Cape Verde",
        capital: "Praia"
      }, {
        country: "South Africa",
        capital: "Pretoria (executive)"
      }, {
        country: "South Africa",
        capital: "Bloemfontein (judicial)"
      }, {
        country: "South Africa",
        capital: "Cape Town (legislative)"
      }, {
        country: "Kosovo[g]",
        capital: "Pristina"
      }, {
        country: "North Korea",
        capital: "Pyongyang"
      }, {
        country: "Ecuador",
        capital: "Quito"
      }, {
        country: "Morocco",
        capital: "Rabat"
      }, {
        country: "Iceland",
        capital: "Reykjavík"
      }, {
        country: "Latvia",
        capital: "Riga"
      }, {
        country: "Saudi Arabia",
        capital: "Riyadh"
      }, {
        country: "British Virgin Islands",
        capital: "Road Town"
      }, {
        country: "Italy",
        capital: "Rome"
      }, {
        country: "Dominica",
        capital: "Roseau"
      }, {
        country: "Northern Mariana Islands",
        capital: "Saipan"
      }, {
        country: "Costa Rica",
        capital: "San José"
      }, {
        country: "Puerto Rico",
        capital: "San Juan"
      }, {
        country: "San Marino",
        capital: "San Marino"
      }, {
        country: "El Salvador",
        capital: "San Salvador"
      }, {
        country: "Yemen",
        capital: "Sana'a"
      }, {
        country: "Chile",
        capital: "Santiago (official)"
      }, {
        country: "Chile",
        capital: "Valparaíso (legislative)"
      }, {
        country: "Dominican Republic",
        capital: "Santo Domingo"
      }, {
        country: "São Tomé and Príncipe",
        capital: "São Tomé"
      }, {
        country: "Bosnia and Herzegovina",
        capital: "Sarajevo"
      }, {
        country: "South Korea",
        capital: "Seoul"
      }, {
        country: "Singapore",
        capital: "Singapore"
      }, {
        country: "Macedonia",
        capital: "Skopje"
      }, {
        country: "Bulgaria",
        capital: "Sofia"
      }, {
        country: "Sri Lanka",
        capital: "Sri Jayawardenepura Kotte (official)"
      }, {
        country: "Sri Lanka",
        capital: "Colombo (former capital; has some government offices)"
      }, {
        country: "Grenada",
        capital: "St. George's"
      }, {
        country: "Jersey",
        capital: "St. Helier"
      }, {
        country: "Antigua and Barbuda",
        capital: "St. John's"
      }, {
        country: "Guernsey",
        capital: "St. Peter Port"
      }, {
        country: "Saint Pierre and Miquelon",
        capital: "St. Pierre"
      }, {
        country: "Falkland Islands",
        capital: "Stanley"
      }, {
        country: "Nagorno-Karabakh Republic",
        capital: "Stepanakert",
        query: "Stepanakert"
      }, {
        country: "Sweden",
        capital: "Stockholm"
      }, {
        country: "Bolivia",
        capital: "Sucre (constitutional)"
      }, {
        country: "Bolivia",
        capital: "La Paz (administrative)"
      }, {
        country: "Abkhazia",
        capital: "Sukhumi"
      }, {
        country: "Fiji",
        capital: "Suva"
      }, {
        country: "Taiwan",
        capital: "Taipei"
      }, {
        country: "Estonia",
        capital: "Tallinn"
      }, {
        country: "Kiribati",
        capital: "Tarawa Atoll"
      }, {
        country: "Uzbekistan",
        capital: "Tashkent"
      }, {
        country: "Georgia",
        capital: "Tbilisi (official)"
      }, {
        country: "Georgia",
        capital: "Kutaisi (legislative)"
      }, {
        country: "Honduras",
        capital: "Tegucigalpa"
      }, {
        country: "Iran",
        capital: "Tehran"
      }, {
        country: "Bhutan",
        capital: "Thimphu"
      }, {
        country: "Albania",
        capital: "Tirana"
      }, {
        country: "Transnistria",
        capital: "Tiraspol"
      }, {
        country: "Japan",
        capital: "Tokyo"
      }, {
        country: "Faroe Islands",
        capital: "Tórshavn"
      }, {
        country: "Libya",
        capital: "Tripoli"
      }, {
        country: "South Ossetia",
        capital: "Tskhinvali"
      }, {
        country: "Tunisia",
        capital: "Tunis"
      }, {
        country: "Mongolia",
        capital: "Ulaanbaatar"
      }, {
        country: "Liechtenstein",
        capital: "Vaduz"
      }, {
        country: "Malta",
        capital: "Valletta"
      }, {
        country: "Anguilla",
        capital: "The Valley"
      }, {
        country: "Vatican City",
        capital: "Vatican City"
      }, {
        country: "Seychelles",
        capital: "Victoria"
      }, {
        country: "Austria",
        capital: "Vienna"
      }, {
        country: "Laos",
        capital: "Vientiane"
      }, {
        country: "Lithuania",
        capital: "Vilnius",
        query: "Vilnius"
      }, {
        country: "Poland",
        capital: "Warsaw"
      }, {
        country: "United States",
        capital: "Washington"
      }, {
        country: "New Zealand",
        capital: "Wellington"
      }, {
        country: "Cocos (Keeling) Islands",
        capital: "West Island"
      }, {
        country: "Curaçao",
        capital: "Willemstad"
      }, {
        country: "Namibia",
        capital: "Windhoek"
      }, {
        country: "Ivory Coast",
        capital: "Yamoussoukro (official)"
      }, {
        country: "Ivory Coast",
        capital: "Abidjan (former capital; still has many government offices)"
      }, {
        country: "Cameroon",
        capital: "Yaoundé"
      }, {
        country: "Nauru",
        capital: "Yaren (de facto)"
      }, {
        country: "Armenia",
        capital: "Yerevan"
      }, {
        country: "Croatia",
        capital: "Zagreb"
      }
    ];

    _NUM_CALLS_PER_INTERVAL = 10;

    _MAP_IMG_WIDTH = 1280;

    _MAP_IMG_HEIGHT = 930;

    _EQUATOR_ON_IMG = 465;

    _CENTRAL_LONGITUDE_ON_IMG = 0;

    _MILLER_CYLINDRICAL_PROJECTION_POS_Y_MAX = 5 / 4 * Math.log(Math.tan(1 / 4 * Math.PI + 2 / 5 * 90 / 180 * Math.PI));

    function MapData() {
      this.appendData = bind(this.appendData, this);
      this.appendDataPerInterval = bind(this.appendDataPerInterval, this);
      this.displayData = bind(this.displayData, this);
      this.$body = $('body');
      this.$pre = $('<pre>').appendTo(this.$body);
      this.$current = $('.current');
      this.$total = $('.total');
    }

    MapData.prototype.displayData = function() {
      var i;
      this.data = project.MapData.COUNTRY_DATA;
      this.numData = this.data.length;
      this.totalAPICallCount = Math.floor(this.numData / _NUM_CALLS_PER_INTERVAL) + 1;
      this.currentAPICallCount = 0;
      this.$total.text(this.totalAPICallCount);
      this.outputData = [];
      return $.when.apply($, (function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = this.totalAPICallCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          results.push(this.appendDataPerInterval(i));
        }
        return results;
      }).call(this)).done((function(_this) {
        return function() {
          var data, j, len, ref, str;
          log('complete', _this.outputData);
          alert('complete');
          str = '';
          ref = _this.outputData;
          for (j = 0, len = ref.length; j < len; j++) {
            data = ref[j];
            str += "{\n  \"country\": \"" + data.country + "\",\n  \"capital\": \"" + data.capital + "\",\n  \"x\": " + data.x + ",\n  \"y\": " + data.y + "\n},\n";
          }
          return _this.$pre.text(str);
        };
      })(this));
    };

    MapData.prototype.appendDataPerInterval = function(index) {
      var d, end, start;
      d = new $.Deferred();
      start = index * _NUM_CALLS_PER_INTERVAL;
      end = Math.min(start + _NUM_CALLS_PER_INTERVAL, this.numData);
      setTimeout(((function(_this) {
        return function() {
          var i;
          return $.when.apply($, (function() {
            var j, ref, ref1, results;
            results = [];
            for (i = j = ref = start, ref1 = end; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
              results.push(this.appendData(this.data[i]));
            }
            return results;
          }).call(_this)).done(function() {
            d.resolve();
            _this.currentAPICallCount++;
            return _this.$current.text(_this.currentAPICallCount);
          });
        };
      })(this)), index * 2000);
      return d.promise();
    };

    MapData.prototype.appendData = function(data) {
      var capital, country, query, regexp;
      country = data.country;
      capital = data.capital;
      regexp = new RegExp(' \\(.*\\)');
      query = ((capital.replace(regexp, '')) + ",+" + (country.replace(regexp, ''))).replace(/ /g, '+');
      if (data.query != null) {
        query = data.query;
      }
      return $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&language=en&key=AIzaSyCRj5hoOWV05oaN5hFRtLmx5VFicAzzXXA").done((function(_this) {
        return function(json) {
          var geocodeData, location, x, y;
          log(country, capital, json);
          geocodeData = json.results;
          if (geocodeData.length !== 1) {
            geocodeData = geocodeData.filter(function(item) {
              return $.inArray('political', item.types) !== -1;
            });
          }
          if (geocodeData.length === 0) {
            log(query, country, capital, geocodeData);
            return;
          }
          location = geocodeData[0].geometry.location;
          x = location.lng - _CENTRAL_LONGITUDE_ON_IMG;
          if (x < -180) {
            x += 360;
          }
          x = x / 360 * _MAP_IMG_WIDTH;
          y = 5 / 4 * Math.log(Math.tan(1 / 4 * Math.PI + 2 / 5 * location.lat / 180 * Math.PI)) / _MILLER_CYLINDRICAL_PROJECTION_POS_Y_MAX * _MAP_IMG_HEIGHT / 2;
          return _this.outputData.push({
            country: country,
            capital: capital,
            x: x,
            y: y
          });
        };
      })(this));
    };

    return MapData;

  })();

  $(function() {
    var mapData;
    mapData = new project.MapData();
    return mapData.displayData();
  });

}).call(this);
