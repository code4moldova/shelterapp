let osm = new ol.layer.Tile({title:'osm',source: new ol.source.OSM(),visible: true});

let hybrid = new ol.layer.Group({
  title:'satellite',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.TileArcGISRest({url:"https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"}),
    }),
    new ol.layer.Tile({
      source: new ol.source.TileArcGISRest({url:"https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer"}),
    }),
  ],
  visible: false,
});

let ortofoto2007 = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "https://moldova-map.md/geoserver/orthophoto/wms?",
    params: {
      'LAYERS': 'orthophoto:Ortofoto_2007',
      'CRS': 'EPSG:3857',
    },
  }),
  visible: false, 
});

let ortofoto2016 = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "https://moldova-map.md/geoserver/orthophoto/wms?",
    params: { 'LAYERS': 'orthophoto:Ortofoto'}
  }),
  visible: false, 
});

let vector = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(41, 98, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#2962FF',
      width: 3
    }),
    image: new ol.style.Icon({
      src: './assets/images/marker.png',
      scale:0.34,
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
    })
  })
});

let searchLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(41, 98, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#2962FF',
      width: 3
    }),
    image: new ol.style.Icon({
      src: './assets/images/marker.png',
      scale:.34,
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
    })
  })
});

let addPointLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#FF7F11'
      }),
      stroke: new ol.style.Stroke({
        color: 'white',
        width: 1
      }),
    })
   }),
  visible:false,
});
// Cluster Handle-------------

/*let defaultSource = new ol.source.Vector();
let raioaneClusteredSource = new ol.source.Vector();

const clusterSource = new ol.source.Cluster({
  distance:20,
  minDistance: 30,
  source: raioaneClusteredSource,
});

var styleCache = {};

function setClusterStyle(feature,resolution){
  var features = feature.get('features');
  var size = features.length;
  // Feature style
  if (size===1) return featureStyle(features);
  // ClusterStyle
  else {
    var data = [0,0,0,0];
    for (var i=0, f; f=features[i]; i++) data[f.get('type')]++;
    var style = styleCache[data.join(',')];
    if (!style) {
      var radius = Math.min(size+14, (document.documentElement.clientWidth <= 1900)?20:30);
      style = styleCache[data.join(',')] = [ new ol.style.Style({
        image: new ol.style.Chart({
          colors: 'pale',
          type: 'pie', 
          radius: radius, 
          data: data,
          rotateWithView: true,
          stroke: new ol.style.Stroke({
            color: "rgba(0,0,0,0)",
            width: 0
          })
        }),
        
        text: new ol.style.Text({
          text: size.toString(),
          fill: new ol.style.Fill({
            color: '#000',
          }),
          scale:(document.documentElement.clientWidth <= 1900)? 1.2: 1.5,
          stroke: new ol.style.Stroke({
          color: '#000',
          width: 0.5
        })
        }),

      }),
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius-7,
          fill: new ol.style.Fill({
            color: '#fff'
          })
        }),
      })
      ]
    }
    return style;
  }
}

const stationsLayer = new ol.layer.AnimatedCluster({
  title: 'pointsLayer',
  source: clusterSource,
  //animationDuration: 300,
  style: setClusterStyle,
});

function featureStyle(f) {
  if (f) {
    var type = f[0].get('icon_name');
    var style = styleCache[type];
    if (!style) {
      style =  new ol.style.Style({
        image: new ol.style.Icon({
          src: './assets/images/peco_icons/'+type+'.png',
          scale:(document.documentElement.clientWidth <= 1919)? .40 : .47,
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
        })
      })
    }
    return [style];
  }
  else return [ new ol.style.Style({
    stroke: new ol.style.Stroke({
      color:"#fff", 
      width:1 
    }) 
  })];
}*/
if (document.documentElement.clientWidth <= 1919) { 
  options.publicMapView = {
      "projection": 'EPSG:3857',
      "center": [3167475.240184986, 5952086.044611719],
      "extent":[2437181.208848241, 5100607.633807939, 3893306.0536067626, 6903564.4554155],
      "zoom": 7,
      "minZoom": 5,
    }
  }
let map = new ol.Map({
  target: 'map',
  controls: [],
  layers: [osm,hybrid,ortofoto2016,ortofoto2007,vector,searchLayer,addPointLayer],
  view: new ol.View(options.publicMapView),
  interactions:
    ol.interaction.defaults({ doubleClickZoom: false, altShiftDragRotate:false, pinchRotate: false, rotate: false }).extend([
      new ol.interaction.DragRotate({
        condition: ol.events.condition.custom
    })
  ]),
});

function zoomIn(){
  map.getView().animate({zoom:map.getView().getZoom() + 0.5,duration:150});
};
function zoomOut(){
  map.getView().animate({zoom:map.getView().getZoom() - 0.5,duration:150});
};
function homeButton(){
  map.getView().animate({
    zoom: 7,
    center:[3167475.240184986, 5952086.044611719],
    duration:400,
  });
};
function triggerMapMove(){
  map.getView().setZoom(map.getView().getZoom()+0.02);
  map.getView().setCenter([map.getView().getCenter()[0],map.getView().getCenter()[1]+0.0000001]);
}
let geolocationCoords,geoDone=false;

function locateMe(){
  var geolocation = new ol.Geolocation({
    projection: map.getView().getProjection(),
    tracking: true
  });
  geolocation.on('change', function() {
    if(geoDone == false){
      geoDone = true;
      geolocationCoords = geolocation.getPosition();
      let feature = new ol.Feature({
        geometry: new ol.geom.Point(geolocationCoords),
        type: 'point'
      });
      searchLayer.getSource().clear();
      searchLayer.getSource().addFeature(feature);
      map.getView().animate({
        zoom: 12,
        center:geolocationCoords,
        duration:400,
      });
    }
  });
  let feature = new ol.Feature({
    geometry: new ol.geom.Point(geolocationCoords),
    type: 'point'
  });
  searchLayer.getSource().clear();
  searchLayer.getSource().addFeature(feature);
  map.getView().animate({
    zoom: 12,
    center:geolocationCoords,
    duration:400,
  });
}

var visibleLayer = 0;
$(".basemap-list").find('input').click(function(){
  $(".basemap-list").toggle();
  changeLayer($(this).closest('fieldset').index());
})
function changeLayer(i){
  map.getLayers().R[visibleLayer].A.visible = false;
  map.getLayers().R[i].A.visible = true;
  map.updateSize();
  visibleLayer = i;
}

$(".btn-groupe button:eq(6)").click(()=>{
  $(".legend-list").toggle(!$(".legend-list").css('display') == 'block')
  $(".basemap-list").toggle()
});
$(".btn-groupe button:eq(7)").click(()=>{
  $(".basemap-list").toggle(!$(".basemap-list").css('display') == 'block')
  $(".legend-list").toggle()
});
//$(".secondMap .btn-groupe button:eq(5)").click(()=>{$(".secondMap .basemap-list").toggle()});

function lengthMeasure() {
  map.removeInteraction(draw);
  vector.getSource().clear();
  map.removeOverlay(measureTooltip);
  if($(".map-tooltip")){
    $(".map-tooltip").each(function(){$(this).css('display','none')});
  }
  if($(".area-btn").hasClass('active')){
    $(".area-btn").removeClass('active').css('display','none');
  }
  if($(".distance-btn").hasClass('active')){
    $(".distance-btn").removeClass('active').css('display','none');
  }else{
    $(".distance-btn").addClass('active').css('display','block');
  }
};

function areaMeasure() {
  map.removeInteraction(draw);
  vector.getSource().clear();
  map.removeOverlay(measureTooltip);
  if($(".map-tooltip")){
    $(".map-tooltip").each(function(){$(this).css('display','none')});
  }
  if($(".distance-btn").hasClass('active')){
    $(".distance-btn").removeClass('active').css('display','none');
  }
  if($(".area-btn").hasClass('active')){
    $(".area-btn").removeClass('active').css('display','none');
  }else{
    $(".area-btn").addClass('active').css('display','block');
  }
};

var mapMoved = false, addLocation = false;
map.on('movestart', function(e){
  if(addLocation){
    mapMoved = true;
    $("#map-pin").css('top','50vh');
  }
});

map.on('moveend', function(e){
  if(addLocation){
    let feature = new ol.Feature({
      geometry: new ol.geom.Point(map.getView().getCenter()),
      type: 'point'
    });
    addPointLayer.getSource().clear();
    addPointLayer.getSource().addFeature(feature);
    $("#map-pin").css('top','calc(50vh + 8px)');
  }
});

/*map.getView().on('change:resolution', (event) => {
  if(!filtered){
    if(event.oldValue > 299 && clusterSource.get('title') !== 'raioaneClusteredSource'){
      clusterSource.set('title','raioaneClusteredSource')
      clusterSource.setSource(raioaneClusteredSource);
      clusterSource.setDistance(0);
    }else if(event.oldValue <= 299 && clusterSource.get('title') !== 'defaultSource'){
      clusterSource.set('title','defaultSource')
      clusterSource.setSource(defaultSource);
      clusterSource.setDistance(20);
    }
  }
});*/

/*map.on('singleclick',function(evt){
  this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    if(layer && layer.A.title == 'pointsLayer'){
      if(feature.A.features.length == 1){
        let f = feature.A.features[0].A;
        popupHandle(false,f.count);
      }
    }else{return false};
  }); 
});

function popupHandle(type,i){
  $("#popup .card-header").removeClass('bg-sac bg-sag bg-mixt bg-unknown').addClass(stbg[locations[i].station_type]);
  $("#popup .popup-header").html(`<h6 class="mb-0 fs-1 text-light">${locations[i].station_name} ${(locations[i].nomenclator)?locations[i].nomenclator:''}</h6>`);
  let prices = '';
  if(locations[i].station_type == 1){
    prices = `<tr class="fw-bold"><td class="text-end p-0">Benzină 95:</td><td class="p-0 ps-2 text-start">${locations[i].gasoline?locations[i].gasoline.toFixed(2)+' lei':' -'}</td></tr>
    <tr class="fw-bold"><td class="text-end p-0">Motorină:</td><td class="p-0 ps-2 text-start">${locations[i].diesel?locations[i].diesel.toFixed(2)+' lei':' -'}</td></tr>`
  }if(locations[i].station_type == 2){
    prices = `<tr class="fw-bold"><td class="text-end p-0">Gaz:</td><td class="p-0 ps-2 text-start">${locations[i].gpl?locations[i].gpl.toFixed(2)+' lei':' -'}</td></tr>`
  }if(locations[i].station_type == 3){
    prices = `<tr class="fw-bold"><td class="text-end p-0">Benzină 95:</td><td class="p-0 ps-2 text-start">${locations[i].gasoline?locations[i].gasoline.toFixed(2)+' lei':' -'}</td></tr>
    <tr class="fw-bold"><td class="text-end p-0">Motorină:</td><td class="p-0 ps-2 text-start">${locations[i].diesel?locations[i].diesel.toFixed(2)+' lei':' -'}</td></tr>
    <tr class="fw-bold"><td class="text-end p-0">Gaz:</td><td class="p-0 ps-2 text-start">${locations[i].gpl?locations[i].gpl.toFixed(2)+' lei':' -'}</td></tr>`
  }
  $("#popup .col-12").html(`<table>${prices}</table>`);
  let opt = {center:[locations[i].x,locations[i].y],duration:400}
  if(type == 'zoom'){opt.zoom=16}
  overlay.setPosition([locations[i].x,locations[i].y]);
  map.getView().animate(opt);
}
*/

/*const container = document.getElementById('popup');
const closer = document.getElementById('popup-closer');

const overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
map.addOverlay(overlay);*/

