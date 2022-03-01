import { Feature } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource, Cluster } from "ol/source";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Circle, Text, IconImage } from "ol/style";
import * as proj from "ol/proj";
import { onMounted } from "vue";

export function usePoi() {
	const poiVectorSource = new VectorSource();
	const poiClusterSource = new Cluster({
		source: poiVectorSource,
		distance: 20,
		minDistance: 30,
		// geometryFunction: (f) => {
		// 	const coord = raioane.get(f.get("raion"));
		// 	return coord ? new Point(coord) : null;
		// },
	});

	const styleCache: any = {};
	const poiClusterLayer = new VectorLayer({
		source: poiClusterSource,
		style: (feature) => {
			const size = feature.get("features").length;

			styleCache[size] = styleCache[size]
				? styleCache[size]
				: new Style({
						image: new Circle({
							radius: 10,
							stroke: new Stroke({ color: "#fff" }),
							fill: new Fill({ color: size === 1 ? "orange" : "#3399CC" }),
						}),
						text: new Text({
							text: size.toString(),
							fill: new Fill({ color: "#fff" }),
						}),
				  });

			return styleCache[size];
		},
	});

	onMounted(async () => {
		const response = await fetch("https://api.iharta.md/helpua/request/poi");
		type Poi = { x: number; y: number; state: string };
		const data: Array<Poi> = await response.json();

		const features = data.map((poi) => {
			const coord = proj.transform([poi.x, poi.y], "EPSG:4326", "EPSG:3857");
			const geometry = new Point(coord);
			return new Feature({ geometry, raion: poi.state });
		});

		poiVectorSource.addFeatures(features);
	});

	return { poiClusterLayer };
}

const raioane = new Map([
	["Basarabeasca", [3216631.066025944892317, 5842206.573392572812736]],
	["Briceni", [3003072.019361425191164, 6156158.381598853506148]],
	["Cahul", [3149123.568401432596147, 5756003.178547497838736]],
	["Cantemir", [3154183.877697867807001, 5819690.453469815663993]],
	["Drochia", [3101128.654624546412379, 6113020.887209438718855]],
	["Fălești", [3085751.483528479933739, 6035980.156098236329854]],
	["Bălți", [3109289.423339795786887, 6069351.464633577503264]],
	["Ocnița", [3064342.691434606444091, 6168786.085330496542156]],
	["Călărași", [3151002.523615576792508, 5991243.450291478075087]],
	["Căușeni", [3264341.481000471394509, 5884987.388167560100555]],
	["Dondușeni", [3080120.53718033619225, 6146908.899017876014113]],
	["Edineț", [3036496.06201200094074, 6129069.390442192554474]],
	["Dubăsari", [3240016.658753918018192, 5992697.294528198428452]],
	["Sîngerei", [3130120.88644335931167, 6050739.085065165534616]],
	["Chișinău", [3213961.392071668524295, 5944839.934291531331837]],
	["Criuleni", [3230978.204669487196952, 5967970.684981465339661]],
	["Strășeni", [3177325.746584933716804, 5968589.638338066637516]],
	["Șoldănești", [3193011.031814167276025, 6079448.005475859157741]],
	["Ștefan Vodă", [3308091.546661886386573, 5861432.991926955059171]],
	["UAT Stânga Nistrului", [3282267.55632487218827, 5945565.000200471840799]],
	["Florești", [3157612.19017068343237, 6089039.294193187728524]],
	["Anenii Noi", [3253552.609487248584628, 5927122.900560673326254]],
	["UTA Găgăuzia", [3196137.767667891457677, 5809870.544556598179042]],
	["Glodeni", [3062109.170190459582955, 6063747.514527728781104]],
	["Hîncești", [3162213.754862977657467, 5915659.607984576374292]],
	["Ialoveni", [3208479.331406533718109, 5917124.305006320588291]],
	["Leova", [3162801.682627548929304, 5864414.71597158908844]],
	["Nisporeni", [3131870.744841223582625, 5956409.90888200327754]],
	["Orhei", [3205764.878391641657799, 6010150.509848369285464]],
	["Rezina", [3211989.270599716342986, 6055926.028583658859134]],
	["Rîșcani", [3060492.535810024943203, 6092997.195119884796441]],
	["Soroca", [3138588.436684388667345, 6129956.075788766145706]],
	["Taraclia", [3181429.076597475912422, 5764474.997567731887102]],
	["Ungheni", [3106480.241893899161369, 5993041.963218469172716]],
	["Telenești", [3165780.244962127413601, 6033027.254958735778928]],
	["Cimișlia", [3203368.687236454337835, 5874256.95451148878783]],
	["Bender", [3253552.609487248584628, 5927122.900560673326254]],
]);
