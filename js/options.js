const options = {
	"publicTableOptions":{
    "language": {
      "emptyTable":     "Nu sunt valori",
      "info":           "Afișate _START_ la _END_ din _TOTAL_ valori",
      "infoEmpty":      "Afișate 0 la 0 din 0 valori",
      "infoFiltered":   "(filtrate din _MAX_ valori)",
      "infoPostFix":    "",
      "thousands":      ",",
      "lengthMenu":     "Afișează _MENU_ valori",
      "loadingRecords": "Se încarcă...",
      "processing":     "Porcesare...",
      "search":         "Caută:",
      "zeroRecords":    "Nu s-au găsit valori",
      "paginate": {"first":"Prima","last":"Ultima","next":"Următoarea","previous":"Precedenta"}
    },
    fnDrawCallback: function(oSettings){
    	if (document.documentElement.clientWidth <= 1919 && $('body').hasClass('fs-1')) {
	      $(".search-items td").addClass('p-1'); 
	      $("th:eq(0)").addClass('p-2');
	      $("th").addClass('ps-1');
	      $('.point-open').removeClass('fs-7').addClass('fs-5');
	      $('.search-items .feather-sm').css({'width':'13px','height':'13px'});
	      $('.c-name').addClass('fs-2');
	    }
	    $(".schedule").popover({container:'body'});feather.replace()
	   },
    "columnDefs": [{type:'notnull',targets:[4,5,6]},{ "width": "14%", "targets": 1 },{orderable: false,sortable:false,targets:[0,7],order:[]}],
    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Toate"]],
    "order": [[4,'asc']],
    "responsive": true,
    "sScrollY": '71vh',
    scrollCollapse: true,
	  "sScrollX": '100%',
    "pageLength": 25,
	},
	"publicMapView":{
    "projection": 'EPSG:3857',
    "center": [3167475.240184986, 5952086.044611719],
    "extent":[2437181.208848241, 5600607.633807939, 3893306.0536067626, 6303564.4554155],
    "zoom": 5,
    "minZoom": 4.7,
    "zoomFactor":3
  },
	'datepickerLanguage':{
	    days: ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"],
	    daysShort: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"],
	    daysMin: ["D", "L", "Ma", "Mi", "J", "V", "S", "D"],
	    months: ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'],
	    monthsShort: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"],
	    today: "Azi"
	},
};