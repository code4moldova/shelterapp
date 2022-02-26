/*let carto = new ol.layer.Tile({ 
  id:0,title:'carto',
  source: new ol.source.XYZ({ 
    url:'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous'
  }),
  visible:false
});
*/

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
      src: '../assets/images/marker.png',
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
      src: '../assets/images/marker.png',
      scale:.34,
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
    })
  })
});

// Cluster Handle-------------

let defaultSource = new ol.source.Vector();
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
  animationDuration: 300,
  style: setClusterStyle,
});

function featureStyle(f) {
  if (f) {
    var type = f[0].get('icon_name');
    var style = styleCache[type];
    if (!style) {
      style =  new ol.style.Style({
        image: new ol.style.Icon({
          src: '../assets/images/peco_icons/'+type+'.png',
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
}
if (document.documentElement.clientWidth <= 1919) { 
  options.publicMapView = {
      "projection": 'EPSG:3857',
      "center": [3167475.240184986, 5952086.044611719],
      "extent":[2437181.208848241, 5600607.633807939, 3893306.0536067626, 6303564.4554155],
      "zoom": 4.5,
      "minZoom": 4.2,
    }
  }
let map = new ol.Map({
  target: 'map',
  controls: [],
  layers: [/*carto,*/osm,hybrid,ortofoto2016,ortofoto2007,vector,searchLayer,stationsLayer],
  view: new ol.View(options.publicMapView),
  interactions: ol.interaction.defaults({ doubleClickZoom: false })
    .extend([new ol.interaction.DragRotate({condition: ol.events.condition.custom})]),
});


function zoomIn(){
  map.getView().animate({zoom:map.getView().getZoom() + 0.5,duration:150});
};
function zoomOut(){
  map.getView().animate({zoom:map.getView().getZoom() - 0.5,duration:150});
};
function homeButton(){
  map.getView().animate({
    zoom: (document.documentElement.clientWidth <= 1919)? 4.5: 5,
    center:[3167475.240184986, 5952086.044611719],
    duration:400,
  });
};

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
  $(".basemap-list").css('display','none').removeClass("open");
  changeLayer($(this).closest('fieldset').index());
})
function changeLayer(i){
  map.getLayers().R[visibleLayer].A.visible = false;
  map.getLayers().R[i].A.visible = true;
  map.updateSize();
  visibleLayer = i;
}

$(".map .btn-groupe button:eq(6)").click(function(){
  if($(".legend-list").hasClass("open")){
    $(".legend-list").css('display','none').removeClass("open");
  }
  if($(".basemap-list").hasClass("open")){
    $(".basemap-list").css('display','none').removeClass("open");
  }else{
    $(".basemap-list").css('display','block').addClass("open");
  }
});
$(".map .btn-groupe button:eq(7)").click(function(){
  if($(".basemap-list").hasClass("open")){
    $(".basemap-list").css('display','none').removeClass("open");
  }
  if($(".legend-list").hasClass("open")){
    $(".legend-list").css('display','none').removeClass("open");
  }else{
    $(".legend-list").css('display','block').addClass("open");
  }
});
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

map.getView().on('change:resolution', (event) => {
  //console.log(map.getView().calculateExtent(map.getSize()))
  if(!filtered){
    if(event.oldValue > 299){
      clusterSource.setSource(raioaneClusteredSource);
      clusterSource.setDistance(0);
    }else{
      clusterSource.setSource(defaultSource);
      clusterSource.setDistance(20);
    }
  }
});

const stbg = ['bg-unknown','bg-sac','bg-sag','bg-mixt'];
map.on('singleclick',function(evt){
  this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    if(layer && layer.A.title == 'pointsLayer'){
      if(feature.A.features.length == 1){
        let f = feature.A.features[0].A;
        popupHandle(false,f.count);
        setTimeout(()=>{
          hideTableChildRows();
          let row = $("#locations-table").DataTable().row(f.count).node();
          $(row).insertBefore($("#locations-table > tbody tr:first"));
          $(row).addClass('bg-light-secondary');
          feather.replace();
        },500)
      }
    }else{return false};
  }); 
});

function popupHandle(type,i){
  
}

function hideTableChildRows(){
  $("#locations-table").DataTable().rows().every( function ( rowIdx,tableLoop,rowLoop){
    $(this.node()).removeClass('bg-light-secondary');
    $(this.node()).find('input').prop('checked',false);
    $("#locations-table").DataTable().row(rowIdx).child.hide('slow');
  });
  $("#btn-edit-prices").attr('disabled','true');
  $("#locations-table").DataTable().draw();
}
const container = document.getElementById('popup');
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
  $("#locations-table").DataTable().rows().every( function ( rowIdx,tableLoop,rowLoop){
    $(this.node()).removeClass('bg-light-secondary');
    $("#locations-table").DataTable().row(rowIdx).child.hide('slow');
  })
  $("#locations-table").DataTable().draw();
  closer.blur();
  return false;
};
map.addOverlay(overlay);

const hov_container = document.getElementById('hov-popup');
const hov_popup = new ol.Overlay({element: hov_container});
map.addOverlay(hov_popup);

map.on("pointermove", function (evt) {
  let feature;
  let hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    if(layer && layer.A.title == 'pointsLayer'){ return feature}else{return false};
  }); 
  if(hit){
    let list = '';
    if(hit.A.features.length == 1){
      hov_popup.setPosition(hit.A.geometry.flatCoordinates);
      $("#hov-content").html('<h6 class="m-2">'+hit.A.features[0].A.point_name+'</h6>');
      hov_container.style.display = 'block';
      this.getTargetElement().style.cursor = 'pointer';
    }else if(hit.A.features.length > 1 && hit.A.features.length < 4){
      hov_popup.setPosition(hit.A.geometry.flatCoordinates);
      hit.A.features.forEach(function(f){
        list+='<h6 class="header-item m-2">'+f.A.point_name+'</h6>'
      });
      $("#hov-content").html(list);
      hov_container.style.display = 'block';
      this.getTargetElement().style.cursor = 'pointer';
    }else{
      hov_container.style.display = 'none';
      this.getTargetElement().style.cursor = '';
    }
  }else{
    hov_container.style.display = 'none';
    this.getTargetElement().style.cursor = '';
  }
});

map.on('moveend', function(e){
  $.fn.dataTable.ext.search = [];$("#locations-table").DataTable().draw();
  let extent = map.getView().calculateExtent(map.getSize());
  let stationsIntersection = [];

  defaultSource.forEachFeatureIntersectingExtent(extent, function(feature) {
    stationsIntersection.push(feature.A.count);
  });
  $.fn.dataTable.ext.search.push(function( settings, data, dataIndex, row ) {
    if(stationsIntersection.includes(dataIndex)){return true}else{return false};
  });
  $("#locations-table").DataTable().draw();
});
function triggerMapMove(){
  map.getView().setZoom(map.getView().getZoom()+0.0000001);
  map.getView().setCenter([map.getView().getCenter()[0],map.getView().getCenter()[1]+0.0000001]);
}
let expanded = false;

$(".map-manage .mnbtn:eq(0)").click(function(){
  if(!expanded){
    expanded = true;
    $(this).find('i').removeClass('fa-expand').addClass('fa-compress');
    $(".search-element").css('width','28%');
    $("#left-part").hide(50)
    $("#right-part").removeClass('col-lg-5').addClass('col-12');
    setTimeout(()=>{map.updateSize()},155);
  }else{
    expanded = false;
    $(".search-element").removeAttr('style');
    $(this).find('i').removeClass('fa-compress').addClass('fa-expand')
    $("#left-part").show(50);
    $("#right-part").removeClass('col-12').addClass('col-lg-5');
     map.updateSize();
  }
});