if (document.documentElement.clientWidth <= 1900) { 
  $('.navbar.top-navbar.navbar-expand-lg h3').removeClass('fs-5').addClass('fs-3')
  $('body, #btn-cancel-filter, #btn-show-filter').addClass('fs-1');
  $('.nav-link h6').addClass('fs-2');
  $('.feather-sm').css({'width':'13px','height':'13px'})
  setTimeout(()=>{$("#locations-table_wrapper .row:eq(0), #locations-table_paginate").css('transform','scale(0.8)');},700);
  $(".topbar .top-navbar .navbar-nav>.nav-item").css({'display':'flex','align-items':'center','justify-content': 'center !important','height':'auto'});
  $(".topbar .top-navbar .navbar-nav>.nav-item>.nav-link").css('height','auto')
  
  $(".distance-btn").css('top','calc(35% + 8.5rem)');
  $(".area-btn").css('top','calc(35% + 10.6rem)');
  $(".basemap-list").addClass('p-1').css('top','calc(35% + 12.7rem)');
  $(".map .distance-btn, .map .area-btn").css('font-size','16px');
  $(".map .btn-groupe").css({'font-size':'16px','top':'35%'});
  $(".legend-list i").removeClass('fs-7').addClass('fs-5');
  $(".legend-list span").addClass('fs-1');
  $(".legend-list").addClass('p-1').css('top','calc(40% + 11rem)');
  options.publicTableOptions.sScrollY = '60vh'
}
$("#map-link").click(function(){
  map.updateSize();
});

$('#help-type').on('select2:opening',function(e){
  $(".select2-search, .select2-focusser").remove();
});
$('#help-type').on('select2:close',function(e){
  $(".select2-search, .select2-focusser").remove();
});
$('.tab-wizard').steps({
  headerTag: 'h6',
  bodyTag: 'section',
  transitionEffect: 'fade',
  titleTemplate: '<span class="step">#index#</span> #title#',
  labels: {
    previous:'Предыдущий',
    next:'Cледующий',
    finish: 'Отправить',
  },
  //onStepChanging: function (event, currentIndex, newIndex) {
    // Allways allow previous action even if the current form is not valid!
    /*if (currentIndex > newIndex) {
      return true;
    }*/
    // Forbid next action on "Warning" step if the user is to young
    /*if (newIndex === 3 && Number($('#age-2').val()) < 18) {
      return false;
    }*/
    // Needed in some cases if the user went back (clean up)
    /*if (currentIndex < newIndex) {
      // To remove error styles
      form.find('.body:eq(' + newIndex + ') label.error').remove();
      form.find('.body:eq(' + newIndex + ') .error').removeClass('error');
    }
    form.validate().settings.ignore = ':disabled,:hidden';
    return form.valid();*/
  //},
  onFinished: function (event, currentIndex) {
    $('#helpInfoModal').modal('hide')
    Swal.fire({
      title:'Form Submitted!',
      text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat eleifend ex semper, lobortis purus sed.',
    });
  },
});

// BEGIN Filter -------------------------------------
var locations = [], points = [], removedPoints = [], filteredPoints = [], filtered = false;

$("#btn-show-filter").click(function(){$("#filterDiv").show(100)});
$("#hide-filter").click(function() {$("#filterDiv").hide(100)});

$("#btn-cancel-filter-raion").click(function(){$("#raion-filter").val(null).trigger('change')});
$("#btn-cancel-filter-localitate").click(function(){$("#localitate-filter").val(null).trigger('change')});
$("#btn-cancel-filter-denumire").click(function(){$("#denumire-filter").val(null).trigger('change')});
$("#btn-cancel-filter-operator").click(function(){$("#operators-filter").val(null).trigger('change')});

$("#btn-cancel-filter").click(function(){
  $.when($(this).hide(),$('#loading-div').css('display','block')).then(function(){
    $("#btn-cancel-filter-raion, #btn-cancel-filter-localitate, #btn-cancel-filter-denumire, #btn-cancel-filter-operator").click();
    $("#btn-show-filter").removeClass('btn-info text-light').addClass('btn-outline-info bg-white');
    $("#filterDiv .row.col-lg-2:eq(0) input").prop( "checked", false );
    filtered = false;
    filteredPoints = [];
    removedPoints.forEach(function(f){defaultSource.addFeature(f)});removedPoints = [];
    if(map.getView().getResolution() > 299){
      clusterSource.set('title','raioaneClusteredSource');
      clusterSource.setSource(raioaneClusteredSource);
      clusterSource.setDistance(0);}
    else{
      clusterSource.set('title','defaultSource')
      clusterSource.setSource(defaultSource);
      clusterSource.setDistance(20);
    }
    let sort = $("#gasoline-sort, #diesel-sort, #gpl-sort").filter('.active');
    points.sort(priceSort(sort.index(),sort.find('i').hasClass('ri-sort-asc')));
    constructPointsList(points);
  })
});

var mapx = 3167475.240184986, mapy = 5952086.044611719;
$("#btn-filter").click(function(){
  $.when($('#loading-div').css('display','block'),$("#filterDiv").css('display','none')).then(function(){
    $("#btn-show-filter").removeClass('text-info bg-white').addClass('bg-info text-light');
    $("#btn-cancel-filter").show();
    clusterSource.setSource(defaultSource);
    clusterSource.setDistance(20);
    removedPoints.forEach(function(f){defaultSource.addFeature(f)});removedPoints = [];
    filteredPoints = [];
    filtered = false;
    let fTypeArray = [], 
    pointsLength = points.length,
    fLev2Array = $("#raion-filter").val(), 
    fBuaArray = $("#localitate-filter").val(), 
    fNameArray = $("#denumire-filter").val(),
    fOperatorArray = $("#operators-filter").val();
    $("#filterDiv .row.col-lg-2:eq(0) input").each(function(){if(this.checked){fTypeArray.push(parseInt($(this).val()))}});
    setTimeout(function(){
      mapy = mapy+0.0000001;
      map.getView().setZoom((document.documentElement.clientWidth <= 1919)? 4.5: 5);
      map.getView().setCenter([mapx,mapy]);
    },500)
    defaultSource.getFeatures().forEach(function(f,i){
      if( (fTypeArray.length !== 0 && fTypeArray.length !== 4 && !fTypeArray.includes(f.A.type)) ||
          (fLev2Array.length !== 0 && !fLev2Array.includes(f.A.lev2)) ||
          (fBuaArray.length !== 0 && !fBuaArray.includes(f.A.bua)) ||
          (fNameArray.length !== 0 && !fNameArray.includes(f.A.point_name)) ||
          (fOperatorArray.length !== 0 && !fOperatorArray.includes(f.A.operator))
        ){
          filtered = true;
          removedPoints.push(f);
          defaultSource.removeFeature(f);
        }
    });
    for(let i=0;i<pointsLength;i++){
      if( (fTypeArray.length !== 0 && fTypeArray.length !== 4 && !fTypeArray.includes(points[i].station_type)) ||
          (fLev2Array.length !== 0 && !fLev2Array.includes(points[i].lev2)) ||
          (fBuaArray.length !== 0 && !fBuaArray.includes(points[i].bua)) ||
          (fNameArray.length !== 0 && !fNameArray.includes(points[i].station_name)) ||
          (fOperatorArray.length !== 0 && !fOperatorArray.includes(points[i].company_name))
        ){}
        else{
          filtered = true;
          filteredPoints.push(points[i]);
        }
      if(i+1 == pointsLength){setTimeout(()=>{constructPointsList(filteredPoints)},500)};  
    }
  })
});

// END Filter ----------------------------------------
//---------------------------------------
$(window).ready(function(){
  map.updateSize();
})
var buas = [],lev2s = [],locations_names=[],operators=[];

initiateLocations();
function initiateLocations(){
  //overlay.setPosition(undefined);
  /*$.ajax({
    url: conf.link+'public/',
    type: "GET",
    success: function(resp){
      let i=0;
      resp.forEach(function(s){
        if(s.station_status == 1){

          if(!buas.includes(s.bua) && s.bua){buas.push(s.bua)}
          if(!lev2s.includes(s.lev2)){lev2s.push(s.lev2)}
          if(!locations_names.includes(s.station_name)){locations_names.push(s.station_name)}
          if(!operators.includes(s.company_name)){operators.push(s.company_name)}
          s.icon_name = (options.stationNames.indexOf(s.station_name) !== -1)?options.icons[options.stationNames.indexOf(s.station_name)]:'peco_default';
          s.count = i;
          
          locations.push(s);
          points.push(s);
          let feature = new ol.Feature({
            geometry: new ol.geom.Point([s.x,s.y]),
            id_point: s.id_station,
            type:s.station_type,
            icon_name: s.icon_name,
            point_name: s.station_name,
            operator: s.company_name,
            nomenclator: s.nomenclator,
            bua: s.bua,
            lev2: s.lev2,
            bprice:s.gasoline,
            mprice:s.diesel,
            gprice:s.gpl,
            count: i,
          });
          defaultSource.addFeature(feature);

          conf.raioane.forEach(function(r){
            if(s.lev2 == r.name){
              let feature1 = new ol.Feature({
                geometry: new ol.geom.Point(r.coordinates),
                id_point: s.id_station,
                type:s.station_type,
                icon_name: s.icon_name,
                point_name: s.station_name,
                count: i,
              });
              raioaneClusteredSource.addFeature(feature1); 
            }
          });
          i++;
        }
      })*/
      // Localitati Filter--------------
      //$("#localitate-filter").select2({data: buas});
      // Raioane Filter ----------------
      //$("#raion-filter").select2({data: lev2s});
      // Denumire Filter----------------
      //$("#denumire-filter").select2({data: locations_names});
      // Operators Filter---------------
      $("#operators-filter").select2({data: operators});
      $("#helpInfoModal .steps.clearfix li").css('width','fit-content');
      $("#helpInfoModal ul:eq(0)").css({'display':'flex','justify-content':'center'});
      $("#helpInfoModal .steps").css('top','-20px');
      $("#helpInfoModal section").css('padding','0px');
      $('#help-type').select2();
      //points.sort(priceSort(0,true));
      //constructPointsList(points);
      map.updateSize();
      $('.ol-overlaycontainer-stopevent').append(`<div class="map-attributions pe-3 ${(document.documentElement.clientWidth <= 1919)?'fs-1':''}">Furnizori de date: OSM, Esri</div>`);
   // }
  //});
}
//----------------  
let helpLocation = [];
$('#addHelp').click(function(){
  if($('#addHelp').attr('type') == 'location'){
    addLocation = true;
    $("#map-pin").css('display','block');
    addPointLayer.setVisible(true);
    triggerMapMove();
    $("#help-tutorial").show();
    $('#addHelp').html('<i class="feather feather-xl" data-feather="check"></i>');
    $('#addHelp').attr('type','helpChoise');
    feather.replace();
  }else if($('#addHelp').attr('type') == 'helpChoise'){
      addLocation = false;
      helpLocation = addPointLayer.getSource().getFeatures()[0].getGeometry().getCoordinates();
      console.log(helpLocation);
      $("#map-pin").css('display','none');
      addPointLayer.setVisible(false);
      $("#help-tutorial").hide();
      $('#addHelp').attr('type','location');
      $('#addHelp').html('<i class="feather feather-xl" data-feather="plus"></i>');
      feather.replace();
      $('#helpChoiseModal').modal('show');
    }
})
$('#help-offer').click(function(){
  $('#helpChoiseModal').modal('hide');
  $('#helpInfoModal').modal('show');
})
function constructPointsList(stationArr){
  let points_list = '';
  stationArr.forEach(function(s,i){
    let station_prices = (s.station_type == 3)?
      `<div class="d-flex align-items-center text-center fs-3">
        <div class="border-end pe-2">
          <h6 class="text-muted fw-normal">Benzină</h6>
          <h6 class="mb-0 fs-2">${s.gasoline?s.gasoline.toFixed(2):'-'}</h6>
        </div>
        <div class="ms-2 border-end pe-2">
          <h6 class="text-muted fw-normal">Motorină</h6>
          <h6 class="mb-0 fs-2">${s.diesel?s.diesel.toFixed(2):'-'}</h6>
        </div>
        <div class="ms-2 pe-2">
          <h6 class="text-muted fw-normal">Gaz</h6>
          <h6 class="mb-0 fs-2">${s.gpl?s.gpl.toFixed(2):'-'}</h6>
        </div>
      </div>`:(s.station_type == 2)?
      `<div class="d-flex align-items-center text-center fs-3">
        <div class="ms-2 pe-2">
          <h6 class="text-muted fw-normal">Gaz</h6>
          <h6 class="mb-0 fs-2">${s.gpl?s.gpl.toFixed(2):'-'}</h6>
        </div>
      </div>`:(s.station_type == 1)?
      `<div class="d-flex align-items-center text-center fs-3">
        <div class="border-end pe-2">
          <h6 class="text-muted fw-normal">Benzină</h6>
          <h6 class="mb-0 fs-2">${s.gasoline?s.gasoline.toFixed(2):'-'}</h6>
        </div>
        <div class="ms-2 pe-2">
          <h6 class="text-muted fw-normal">Motorină</h6>
          <h6 class="mb-0 fs-2">${s.diesel?s.diesel.toFixed(2):'-'}</h6>
        </div>
      </div>`:'';
    points_list+=`<div class="card card-body mb-2 px-3 py-2">
      <h6 class="mb-0 ms-1 fs-3">${s.station_name}</h6>
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <img src="./assets/images/peco_icons/${s.icon_name}.png" width="57px">
        </div>
        ${station_prices}
        <div class="ms-2 text-end d-flex flex-column align-items-center">
          <button class="btn btn-info p-1 mb-1 py-0" onclick="zoomPan(${s.count})"><i class="ri-map-pin-line"></i></button>
          <button class="btn btn-info p-1 py-0" onclick="showInfo(this)"><i class="ri-information-line"></i></button>
        </div>
      </div>
      <div class="points-hidden-info fs-2 hide">
        <div class="d-flex justify-content-center">
          <table>
            <tr>
              <td class="py-0 px-1 text-end fw-bold">Adresa:</td>
              <td class="py-0 px-1 text-start">${(s.fullstreet)?s.fullstreet:''} ${(s.addrnum)?s.addrnum:''}</td>
            </tr>
            <tr><td class="py-0 px-1 text-end fw-bold">Localitate:</td><td class="py-0 px-1 text-start">${(s.bua)?s.bua:'-'}</td></tr>
            <tr><td class="py-0 px-1 text-end fw-bold">Raion / Mun:</td><td class="py-0 px-1 text-start">${(s.lev2)?s.lev2:'-'}</td></tr>
            <tr><td class="py-0 px-1 text-end fw-bold">Operator:</td><td class="py-0 px-1 text-start">${s.company_name}</td></tr>
            <tr><td class="py-0 px-1 text-end fw-bold">IDNO:</td><td class="py-0 px-1 text-start">${s.idno}</td></tr>
            <tr><td class="py-0 px-1 text-end fw-bold">Licența BM:</td><td class="py-0 px-1 text-start">${(s.license_bm)?(s.license_bm):'-'}</td></tr>
            <tr>
              <td class="py-0 px-1 text-end fw-bold">Data includerii PPP:</td>
              <td class="py-0 px-1 text-start">${(s.license_bm_date)?s.license_bm_date:'-'}</td>
            </tr>
            <tr><td class="py-0 px-1 text-end fw-bold">Licența GL:</td><td class="py-0 px-1 text-start">${(s.license_gl)?(s.license_gl):'-'}</td></tr>
            <tr>
              <td class="py-0 px-1 text-end fw-bold">Data includerii GL:</td>
              <td class="py-0 px-1 text-start">${(s.license_gl_date)?s.license_gl_date:'-'}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>`
  })
  $("#points-list").html(points_list);
  document.getElementById("points-list").scrollTop = 0;
  setTimeout(()=>{$('#loading-div').css('display','none')},300);
}

function zoomPan(i){
  $("#points-tab").removeClass('active');$("#map-link").parents('ul').find('a:eq(1)').removeClass('active');
  $("#map-tab, #map-link").addClass('active');
  map.updateSize();
  popupHandle('zoom',i);
}
function showInfo(e){
  if($(e).hasClass('open')){
    $(e).removeClass('open');
    $(e).find('i').removeClass('ri-arrow-up-s-line').addClass('ri-information-line');
    $(e).parent().parent().parent().find('.points-hidden-info:eq(0)').hide(100);
  }else{
    $(e).addClass('open');
    $(e).find('i').removeClass('ri-information-line').addClass('ri-arrow-up-s-line');
    $(e).parent().parent().parent().find('.points-hidden-info:eq(0)').show(100);
  }
}
// BEGIN PRICE SORT -----------------------------

$("#gasoline-sort, #diesel-sort, #gpl-sort").click(function(){
  let e = $(this);
  $.when($('#loading-div').css('display','block')).then(function(){
    e.parent().find('button').removeClass('text-info');
    e.addClass('text-info');
    let arr = (filtered == true)?filteredPoints:points;
    if(e.hasClass('active')){
      if(e.find('i').hasClass('ri-sort-asc')){
        e.find('i').removeClass('ri-sort-asc').addClass('ri-sort-desc');
        arr.sort(priceSort(e.index(),false));
      }else{
        e.find('i').removeClass('ri-sort-desc').addClass('ri-sort-asc');
        arr.sort(priceSort(e.index(),true));
      }
    }else{
      e.parent().find('button').removeClass('active');
      e.addClass('active');
      if(e.find('i').hasClass('ri-sort-asc')){
        arr.sort(priceSort(e.index(),true));
      }else{
        arr.sort(priceSort(e.index(),false));
      }
    }
    constructPointsList(arr);
  })
});
function priceSort(type,ascending) {
  return function (x, y) {
    let a = (type == 0)?x.gasoline:(type == 1)?x.diesel:x.gpl;
    let b = (type == 0)?y.gasoline:(type == 1)?y.diesel:y.gpl;
    // equal items sort equally
    if (a === b) {return 0}
    // nulls sort after anything else
    else if (a === null) {return 1}
    else if (b === null) {return -1}
    // otherwise, if we're ascending, lowest sorts first
    else if (ascending) {return a < b ? -1 : 1}
    // if descending, highest sorts first
    else { return a < b ? 1 : -1}
  }
}


/*function createDisponibilty(type,i){
  let hr = '',hd = '',days = '';
  if(type == 'table'){hr = `<hr class='m-0 mb-1'>`; hd = 'h6'}
  if(type == 'map'){hr = `<hr class='m-0'>`; hd = 'strong'}
  for(let j = 1;j<8;j++){
    let w = false,d = null;
    p[i].openhours.forEach(function(e,q){if(e.weekday == j){w = true;d = q}})
    if(w){
      let  h = '',startH = p[i].openhours[d].starthour.slice(0,5), endH = p[i].openhours[d].endhour.slice(0,5);
      if(startH == '00:00' && endH == '00:00'){h = '24/24'}else{ h = startH+'-'+endH};
      if(j < 6){days+= `<${hd} class='m-0'>${h}</${hd}>${hr}`}
      if(j == 6){days+= `<${hd} class='m-0 text-warning'>${h}</${hd}>${hr}`}
      if(j == 7){days+= `<${hd} class='m-0 text-warning'>${h}</${hd}>`}
    }else{
      if(j < 6){days+= `<${hd} class='m-0'>&#10005;</${hd}>${hr}`}
      if(j == 6){days+= `<${hd} class='m-0 text-warning'>&#10005;</${hd}>${hr}`}
      if(j == 7){days+= `<${hd} class='m-0 text-warning'>&#10005;</${hd}>`}
    }
  }
  return days;
}*/

