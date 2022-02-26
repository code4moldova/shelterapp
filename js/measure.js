let measureTooltipElement;
let sketch;
let measureTooltip;
let draw;
proj4.defs("EPSG:4026","+proj=tmerc +lat_0=0 +lon_0=28.4 +k=0.9999400000000001 +x_0=200000 +y_0=-5000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
ol.proj.proj4.register(proj4);

function addMeasure(type,tip,maps,nr){
  let souurce;
  if(nr == 0){ source = vector.getSource();}else{source = vector1.getSource()};
  maps.removeInteraction(draw);
  draw = new ol.interaction.Draw({
    source: source,
    type: type,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });

  maps.addInteraction(draw);
  createMeasureTooltip();
  let listener;
    
  draw.on('drawstart', function(evt) {
    sketch = evt.feature;
    var tooltipCoord = evt.coordinate;
    listener = sketch.getGeometry().on('change', function(evt) {
      var geom = evt.target;
      var output;
      if (geom instanceof ol.geom.Polygon) {
        output = formatArea((geom));
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof ol.geom.LineString) {
        output = formatLength((geom));
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  }, this);

  draw.on('drawend', function(evt) {
    measureTooltipElement.className = 'map-tooltip map-tooltip-static';
    measureTooltip.setOffset([0, -7]);
    sketch = null;
    measureTooltipElement = null;
    createMeasureTooltip();
    ol.Observable.unByKey(listener);
    maps.removeInteraction(draw);
  }, this);
    
  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'map-tooltip map-tooltip-measure';
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    maps.addOverlay(measureTooltip);
  }

  let formatLength = function(line) {
    let coord = line.flatCoordinates;
    let i,j=0;
    let coords=[];
    let coord1=[];
    for(i=0;i<coord.length;i++){
      coord1 = ol.proj.transform([coord[i], coord[i+1]],'EPSG:3857','EPSG:4026');
    	coords[j]=[coord1[0],coord1[1]];
    	i++;j++;
    };
    let obj = new ol.geom.LineString(coords);
    let length,output; 
    if(tip=='m'){
      length = Math.round(obj.getLength() * 100) / 100;
      output = length.toFixed(1) +' m';
    }else if(tip=='km'){
      length = (Math.round(obj.getLength() * 100) / 100)/1000;
      output = length.toFixed(2) +' km';
    }
    return output;
  };

  let formatArea = function(polygon) {
    let coord = polygon.flatCoordinates;
    let i,j=0;
    let coords=[];
    let coord1=[];
    for(i=0;i<coord.length;i++){
      coord1 = ol.proj.transform([coord[i], coord[i+1]],'EPSG:3857','EPSG:4026');
    	coords[j]=[coord1[0],coord1[1]];
    	i++;j++;
    };
    let obj = new ol.geom.Polygon([coords]);
    let area = obj.getArea();
    let output,output1;
    if(tip == 'mm'){
      output1 = Math.round(area).toFixed(1)+' m²';
    }else if(tip == 'ha'){
      output = Math.round(area)/10000;
      output1 = output.toFixed(1) + ' ha';
    }else if(tip == 'a'){
      output = Math.round(area)/100;
      output1 = output.toFixed(1) + ' ar';
    }else if(tip == 'kmm'){
      output = Math.round(area)/1000000;
      output1 = output.toFixed(6) + ' km²';
    }
    return output1;
  };
};