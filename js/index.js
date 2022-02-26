if (document.documentElement.clientWidth <= 1919) { 
  $('.navbar.top-navbar.navbar-expand-lg h3').removeClass('fs-5').addClass('fs-3')
  $('body, #btn-cancel-filter, #btn-show-filter').addClass('fs-1');
  $('.navbar-collapse.collapse h5').addClass('fs-2');
  $('.adj-card').addClass('fs-1 p-2');
  $('#left-part .card-body:eq(0)').addClass('mb-2');
  $('#left-part').addClass('pe-0');
  $('.container-fluid').addClass('p-2');
  $('.feather-sm').css({'width':'13px','height':'13px'})
  setTimeout(()=>{$("#locations-table_wrapper .row:eq(0), #locations-table_paginate").css('transform','scale(0.8)');},700);
  $(".topbar .top-navbar .navbar-nav>.nav-item").css({'display':'flex','align-items':'center','justify-content': 'center !important','height':'auto'});
  $(".topbar .top-navbar .navbar-nav>.nav-item>.nav-link").css('height','auto')
  $(".round.rounded h4").addClass('fs-3');
  $(".round.rounded").css({'width':'41px','height':'41px'});
  $(".topbar").css('height','51px');
  $(".topbar nav").css('min-height','51px');
  $(".legend-list i").removeClass('fs-7').addClass('fs-5');
  $(".legend-list span").addClass('fs-1');
  $(".legend-list").addClass('p-1').css('top','calc(40% + 11rem)');
  $(".basemap-list").addClass('p-1 fs-2').css('top','calc(40% + 9.4rem)');
  $(".area-btn").css('top','calc(40% + 7.9rem)');
  $(".distance-btn").css('top','calc(40% + 6.32rem)');
}
// BEGIN Filter -------------------------------------
$("#btn-show-filter").on('mouseover',function(){
  $(this).removeClass('btn-info text-light').addClass('btn-light text-info');
});
$("#btn-show-filter").on('mouseout',function(){
  $(this).removeClass('btn-light text-info').addClass('btn-info text-light');
});

var removedStations = [], filtered = false;

$("#btn-show-filter").click(function(){$("#filterDiv").show(100)});
$("#hide-filter").click(function() {$("#filterDiv").hide(100)});

$("#btn-cancel-filter-raion").click(function(){$("#raion-filter").val(null).trigger('change')});
$("#btn-cancel-filter-localitate").click(function(){$("#localitate-filter").val(null).trigger('change')});
$("#btn-cancel-filter-denumire").click(function(){$("#denumire-filter").val(null).trigger('change')});
$("#btn-cancel-filter-operator").click(function(){$("#operators-filter").val(null).trigger('change')});

$("#btn-cancel-filter").click(function(){
  $(this).hide();
  filtered = false;
  $("#btn-show-filter").removeClass('btn-light text-info').addClass('btn-info text-light');
  removedStations.forEach(function(f){defaultSource.addFeature(f)});removedStations = [];
  $("#filterDiv .row.col-lg-2:eq(0) input").prop( "checked", false );
  $("#btn-cancel-filter-raion, #btn-cancel-filter-localitate, #btn-cancel-filter-denumire, #btn-cancel-filter-operator").click();
  /*let val = null;
  if(bminprice == bmaxprice){val = bminprice}else{val = [bminprice, bmaxprice]};
  document.getElementById("benzina-price-filter").noUiSlider.set(val);
  if(mminprice == mmaxprice){val = mminprice}else{val = [mminprice, mmaxprice]};
  document.getElementById("motorina-price-filter").noUiSlider.set(val);
  if(gminprice == gmaxprice){val = gminprice}else{val = [gminprice, gmaxprice]};
  document.getElementById("gas-price-filter").noUiSlider.set(val);*/
  triggerMapMove();
});

var mapx = 3167475.240184986, mapy = 5952086.044611719;
$("#btn-filter").click(function(){
  $("#filterDiv").hide(100);
  $("#btn-show-filter").removeClass('btn-info text-light').addClass('btn-light text-info');
  $("#btn-cancel-filter").show();
  removedStations.forEach(function(f){defaultSource.addFeature(f)});removedStations = [];
  clusterSource.setSource(defaultSource);
  clusterSource.setDistance(20);
   /*b = document.getElementById("benzina-price-filter").noUiSlider.get(),
  m = document.getElementById("motorina-price-filter").noUiSlider.get(),
  g = document.getElementById("gas-price-filter").noUiSlider.get(),*/
  let fTypeArray = [], 
  fLev2Array= $("#raion-filter").val(), 
  fBuaArray = $("#localitate-filter").val(), 
  fNameArray = $("#denumire-filter").val(),
  fOperatorArray = $("#operators-filter").val();
  $("#filterDiv .row.col-lg-2:eq(0) input").each(function(){if(this.checked){fTypeArray.push(parseInt($(this).val()))}});
  $.when(
    defaultSource.getFeatures().forEach(function(f,i){
      //console.log(f.A.bprice+'  '+f.A.mprice+'   '+f.A.gprice);
      if( /*(bminprice!==bmaxprice && parseFloat(b[0]) !== parseFloat(b[1]) && (parseFloat(b[0]) > f.A.bprice || parseFloat(b[1]) < f.A.bprice)) ||
          (mminprice!==mmaxprice && parseFloat(m[0]) !== parseFloat(m[1]) && (parseFloat(m[0]) > f.A.mprice || parseFloat(m[1]) < f.A.mprice)) ||
          (gminprice!==gmaxprice && parseFloat(g[0]) !== parseFloat(g[1]) && (parseFloat(g[0]) > f.A.gprice || parseFloat(g[1]) < f.A.gprice)) ||
          (bminprice!==bmaxprice && (parseFloat(b[0]) === parseFloat(b[1]) && parseFloat(b[0]) !== f.A.bprice)) ||
          (mminprice!==mmaxprice && (parseFloat(m[0]) === parseFloat(m[1]) && parseFloat(m[0]) !== f.A.mprice)) || 
          (gminprice!==gmaxprice && (parseFloat(g[0]) === parseFloat(g[1]) && parseFloat(g[0]) !== f.A.gprice)) ||*/
          (fTypeArray.length !== 0 && fTypeArray.length !== 4 && !fTypeArray.includes(f.A.type)) ||
          (fLev2Array.length !== 0 && !fLev2Array.includes(f.A.lev2)) ||
          (fBuaArray.length !== 0 && !fBuaArray.includes(f.A.bua)) ||
          (fNameArray.length !== 0 && !fNameArray.includes(f.A.point_name)) ||
          (fOperatorArray.length !== 0 && !fOperatorArray.includes(f.A.operator))
        ){
          filtered = true;
          removedStations.push(f);
          defaultSource.removeFeature(f);
        }
    })
  ).then(triggerMapMove())
});

// END Filter ----------------------------------------

var locations = [], buas = [],lev2s = [],locations_names=[],operators=[],locationsTable = $("#locations-table");
$(window).ready(function(){
  map.updateSize();
})
constructTable();
function constructTable(){
  overlay.setPosition(undefined);
  // Localitati Filter--------------
  //$("#localitate-filter").select2({data: buas});
  // Raioane Filter ----------------
  //$("#raion-filter").select2({data: lev2s});
      
      $('.ol-overlaycontainer-stopevent').append(`<div class="map-attributions ${(document.documentElement.clientWidth <= 1919)?'fs-1':''}">Furnizori de date: ANRE, ARFC, OSM, Esri</div>`);
}
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "notnull-asc": function (str1, str2) {
        if(str1 == "-")
          return 1;
        if(str2 == "-")
            return -1;
        return ((str1 < str2) ? -1 : ((str1 > str2) ? 1 : 0));
    },
 
    "notnull-desc": function (str1, str2) {
        if(str1 == "-")
            return 1;
        if(str2 == "-")
            return -1;
        return ((str1 < str2) ? 1 : ((str1 > str2) ? -1 : 0));
    }
})
//----------------  
$("#locations-table tbody").on('mouseover','td',function(){
  if($(this).index() == 0){
    let index = $(this).closest("tr").attr('data-count');
    hov_popup.setPosition([locations[index].x,locations[index].y]);
    $("#hov-content").html('<h6 class="m-2">'+locations[index].station_name+'</h6>');
    hov_container.style.display = 'block';
  }
});
$("#locations-table tbody").on('mouseout','td',function(){
  if($(this).index() == 0){
    hov_container.style.display = 'none';
  }
});
$("#locations-table tbody").on("click", "td", function () {
  let tr = $(this).closest("tr");
  if(tr.hasClass('search-items') && $(this).index() !== 0 && $(this).index() !== 7){
    let row = $("#locations-table").DataTable().row(tr);
    if (row.child.isShown()) {
      row.child.hide('slow');
      tr.removeClass("shown");
    }else {
      row.child(row.data()[8]).show('slow');
      $(".schedule").popover({container:'body'});
      tr.addClass("shown");
    }
  }else if(tr.hasClass('search-items') && $(this).index() !== 7){
    tr.addClass('bg-light-secondary');
    popupHandle('zoom',tr.attr('data-count'));
  }
});


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

