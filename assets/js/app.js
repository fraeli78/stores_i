var map, featureList, franchiseSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through franchise Stores layer and add only features which are in the map bounds */
  franchiseStores.eachLayer(function (layer) {
    if (map.hasLayer(franchiseStoresLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/favicon.ico"></td><td class="feature-name"><strong>' + layer.feature.properties.City + '</strong><br > ' + layer.feature.properties.address_New + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */

var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

var WorldAntique =               L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png', {
          attribution: 'default_antique_cartodb',
    maxZoom: 19});

/* Mask Layers */
var germanyCountry = L.geoJSON(germanyBoundary);
var masked = turf.mask(germanyBoundary);
var germanyBorder = L.geoJSON(masked, {"fillOpacity": 0.1, color: 'grey', weight: 0});


/* Overlay Layers */
var highlight = L.geoJSON(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});



/* Empty layer placeholder to add to layer control for listening when to add/remove franchise Stores to markerClusters layer */
var franchiseStoresLayer = L.geoJSON(null);
var data = new Date();
var weekDays = ["SUNDAY","MONDAY", "TUESDAY","WEDNESDAY","THURSDAY","FRIDAY",  "SATURDAY"];

var franchiseStores = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/favicon.ico",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.Business_name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>"       
//      + "<tr><th>Name</th><td>" 
//      + feature.properties.Chanel + "</td></tr>"
//      + "<tr><th>Phone</th><td>" 
//      + feature.properties.TEL + "</td></tr>" 
//      + "<tr><th>City</th><td>" 
//      + feature.properties.City + "</td></tr>" 
//      + "<tr><th>Address</th><td>" 
//      + feature.properties.Address_line_1 + "</td></tr>" 
//      + "<tr><th>Postal code</th><td>" 
//      + feature.properties.Postal_code + "</td></tr>" 
      + "<tr><th colspan=2 style='font-size: large;'>Open Days<br></th></tr>";

        

        
    content += "<tr ";
    if(weekDays[data.getDay()]=='MONDAY'){content += "class='oggi' ";}
    content += "><th>Monday</th><td>"
    + feature.properties.MONDAY + "</td></tr>"
    + "<tr><th>";

    content += "<tr ";
    if(weekDays[data.getDay()]=='TUESDAY'){content += "class='oggi'  ";}
    content += "><th>Tuesday</th><td>"
    + feature.properties.TUESDAY + "</td></tr>"
    + "<tr><th>";

    content += "<tr ";
    if(weekDays[data.getDay()]=='WEDNESDAY'){content += "class='oggi'  ";}
    content += "><th>Wednesday</th><td>"
    + feature.properties.WEDNESDAY + "</td></tr>"
    + "<tr><th>";

    content += "<tr ";
    if(weekDays[data.getDay()]=='THURSDAY'){content += "class='oggi'  ";}
    content += "><th>Thurday</th><td>"
    + feature.properties.THURSDAY + "</td></tr>"
    + "<tr><th>";

    content += "<tr ";
    if(weekDays[data.getDay()]=='FRIDAY'){content += "class='oggi'  ";}
    content += "><th>Friday</th><td>"
    + feature.properties.FRIDAY + "</td></tr>"
    + "<tr><th>";

    content += "<tr ";
    if(weekDays[data.getDay()]=='SATURDAY'){content += "class='oggi'  ";}
    content += "><th>Saturday</th><td>"
    + feature.properties.SATURDAY + "</td></tr>"
    + "<tr><th>";

    content += "<tr ";
    if(weekDays[data.getDay()]=='SUNDAY'){content += "class='oggi'  ";}
    content += "><th>Sunday</th><td>"
    + feature.properties.SUNDAY +  "</td></tr>"
        
//    + "<tr><th colspan=2 style='font-size: small;'>Open Days<br></th></tr>"
    + '<tr><th colspan="2" style="font-size: small;"><a href="https://www.google.at/maps/dir//51.1042292,8.0728232" style="color:hsla(0,100%,50%,0.7); font-size: small;" target="_blank">Get directions</a>&nbsp; <i class="fa fa-street-view fa-2x" aria-hidden="true"></i><br></th></tr>'
        
        
//      + "<tr><th>Website</th><td><a class='url-break' href='" 
//      + feature.properties.URL + "' target='_blank'>" 
//      + feature.properties.URL + "</a></td></tr>" 
        
    + '<tr><th colspan="2" style="font-size: large;"><img width=100% src="assets/img/TTStore.jpg"/></th></tr>'


      + "<table>";
        
        
      layer.on({
        click: function (e) {
//            <a href="' + feature.properties.GoogleMap + '" target=_blank>WEBSITE</a>
            
          $("#feature-title").html(feature.properties.City +', ' + feature.properties.Address_line_1);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) 
                                      + '" lat="' + layer.getLatLng().lat 
                                      + '" lng="' + layer.getLatLng().lng 
                                      + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/favicon.ico"></td><td class="feature-name">' 
                                      + layer.feature.properties.Business_name 
                                      + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      franchiseSearch.push({
        name: layer.feature.properties.City,
        address: layer.feature.properties.Address_line_1,
        source: "FranchiseStore",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

$.getJSON("data/Franchise_Stores.geojson", function (data) {
  franchiseStores.addData(data);
  map.addLayer(franchiseStoresLayer);
});





map = L.map("map", {
  zoom: 10,
  center: [40.702222, -73.979378],
  layers: [cartoLight, markerClusters,germanyBorder, highlight],
//  layers: [cartoLight, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === franchiseStoresLayer) {
    markerClusters.addLayer(franchiseStores);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === franchiseStoresLayer) {
    markerClusters.removeLayer(franchiseStores);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  return div;                                           
};

map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": cartoLight,
  "World Antique": WorldAntique
};

// Legend 
var groupedOverlays = {
  "Franchise Stores": {
      "Tom Tailor" : franchiseStoresLayer  
  }//,
//  "Reference": {
//    "Boroughs": germanyCountry,
//  }
};



var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

//var layerControl = L.control.groupedLayers(baseLayers, {
//  collapsed: isCollapsed
//}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to germanyBorder bounds */
  map.fitBounds(germanyCountry.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

    
//  var franchisestoresBH = new Bloodhound({
//    name: "FranchiseStore",
//    datumTokenizer: function (d) {
//      return Bloodhound.tokenizers.whitespace(d.name);
//    },
//    queryTokenizer: Bloodhound.tokenizers.whitespace,
//    local: franchiseSearch,
//    limit: 10
//  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
    //      url: "http://api.geonames.org/searchJSON?username=fraeli78&featureClass=P&maxRows=5&countryCode=DE&name_startsWith=%QUERY",
            url: "https://secure.geonames.org/searchJSON?username=fraeli78&featureClass=P&maxRows=5&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name,// + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  //franchisestoresBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  },
// {
//    name: "FranchiseStores",
//    displayKey: "name",
//    source: franchisestoresBH.ttAdapter(),
//    templates: {
//      header: "<h4 class='typeahead-header'><img src='assets/img/favicon.ico' width='24' height='28'>&nbsp;FranchiseStores</h4>",
//      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
//    }
//  },
{
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter()//,
//    templates: {
//      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
//    }
  }).on("typeahead:selected", function (obj, datum) {
//    if (datum.source === "FranchiseStore") {
//      if (!map.hasLayer(franchiseStoresLayer)) {
//        map.addLayer(franchiseStoresLayer);
//      }
//      map.setView([datum.lat, datum.lng], 17);
//      if (map._layers[datum.id]) {
//        map._layers[datum.id].fire("click");
//      }
//    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
