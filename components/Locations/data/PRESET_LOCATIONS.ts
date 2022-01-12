 /* 
  
Adding a new Preset Location:
```
type PresetLocation = {
  title:string // The nice display title
    urlParam:string // The matching url param (via ?loc=[urlParm] or /loc/[urlParm])
    matchingMohCityString:string[] // All MoH locations will be mapped to this location based on these keys
    lat:number 
    lng:number
    zoom:number // The react-leaflet map zoom for this location (compare to other similar sized cities)
}
```
  */






const PRESET_LOCATIONS:PresetLocation[] = [
    { 
      title: "all",
      urlParam: "all",
      matchingMohCityString: [""],
      lat: -40.8248,
      lng: 173.7304,
      zoom: 6,
      showInDrawer: false
    },{ 
      title: "Auckland",
      urlParam: "auckland",
      matchingMohCityString: ["Auckland", "Takaanini"],
      lat: -36.8500,
      lng: 174.7833,
      zoom: 9,
      showInDrawer: true
    },{
      title: "Wellington",
      urlParam: "wellington",
      matchingMohCityString: ["Wellington", "Lower Hutt"],
      lat: -41.2889,
      lng: 174.7772,
      zoom: 11,
      showInDrawer: true
    },{
      title: "Hamilton",
      urlParam: "hamilton",
      matchingMohCityString: ["Hamilton"],
      lat: -37.7833,
      lng: 175.2833,
      zoom: 11,
      showInDrawer: true
    },{
      title: "Tauranga",
      urlParam: "tauranga",
      matchingMohCityString: ["Tauranga", "Mount Maunganui", "Papamoa"],
      lat: -37.6858,
      lng: 176.1667,
      zoom: 11,
      showInDrawer: true
    },{
      title: "Palmerston North",
      urlParam: "palmerstonnorth",
      matchingMohCityString: ["Palmerston North"],
      lat: -40.3549,
      lng: 175.6095,
      zoom: 11,
      showInDrawer: true
    },{
      title:"Whangarei",
      urlParam: "whangarei",
      matchingMohCityString: ["Whangarei"],
      lat: -35.7250,
      lng: 174.3236,
      zoom: 12,
      showInDrawer: true
    },{
      title: "Napier",
      urlParam: "napier",
      matchingMohCityString: ["Napier"],
      lat: -39.4833,
      lng: 176.9167,
      zoom: 12,
      showInDrawer: true
    },{
      title: "Rotorua",
      urlParam: "rotorua",
      matchingMohCityString: ["Rotorua"],
      lat: -38.1378,
      lng: 176.2514,
      zoom: 12,
      showInDrawer: true
    },{
      title: "Dunedin",
      urlParam: "dunedin",
      matchingMohCityString: ["Dunedin"],
      lat: -45.8667,
      lng: 170.5000,
      zoom: 12,
      showInDrawer: true
    },  {
      title: "Christchurch",
      urlParam: "christchurch",
      matchingMohCityString: ["Christchurch"],
      lat: -43.5309,
      lng: 172.6365,
      zoom: 11
        ,showInDrawer: true
    },{
      title: "Invercargill",
      urlParam: "invercargill",
      matchingMohCityString: ["Invercargill"],
      lat: -46.4290,
      lng: 168.3620,
      zoom: 11
        ,showInDrawer: true
    },{
      title: "Nelson",
      urlParam: "nelson",
      matchingMohCityString: ["Nelson"],
      lat: -41.2931,
      lng: 173.2381,
      zoom: 12,
      showInDrawer: true
    },{
      title: "Whanganui",
      urlParam: "whanganui",
      matchingMohCityString: ["Whanganui"],
      lat: -39.9333,
      lng: 175.0500,
      zoom: 12
        ,showInDrawer: true
    },{
      title: "Taupō",
      urlParam: "taupo",
      matchingMohCityString: ["Taupo", "Taupō"],
      lat: -38.690980140896016,
      lng: 176.08259535359113,
      zoom: 12
        ,showInDrawer: true
    },{
      title: "Bulls",
      urlParam: "bulls",
      matchingMohCityString: ["Bulls"],
      lat: -40.174538700945355,
      lng: 175.38489529999998,
      zoom: 12
        ,showInDrawer: true
    },{
      title: "Waihi",
      urlParam: "waihi",
      matchingMohCityString: ["Waihi", "Waihi Beach"],
      lat: -37.391462000435894,
      lng: 175.84035379999997,
      zoom: 12,
      showInDrawer: true
    },{
      title: "Queenstown",
      urlParam: "queenstown",
      matchingMohCityString: ["Queenstown"],
      lat: -45.02108559729038, 
      lng: 168.69876199033442,
      zoom: 12,
      showInDrawer: true
    },
    {
      title: 'The Bay of Islands',
      urlParam: 'bayofislands',
      matchingMohCityString: ["Bay of Islands"],
      lat: -35.21386707198709, 
      lng: 174.15347141745954,
      zoom: 10,
      showInDrawer: true
    },{
      title: 'Feilding',
      urlParam: 'feilding',
      matchingMohCityString: ['Feilding'],
      lat: -40.2253049740385, 
      lng: 175.5684729604652,
      zoom: 12,
      showInDrawer: true
    },
    {
      title: 'Carterton',
      urlParam: 'carterton',
      matchingMohCityString: ['Carterton'],
      lat: -41.023569115843145,
      lng: 175.5221376193341,
      zoom: 13,
      showInDrawer: true
    },
    {
      title: 'Masterton',
      urlParam: 'masterton',
      matchingMohCityString: ['Masterton'],
      lat: -40.946190374524,
      lng: 175.66576287590723,
      zoom: 12,
      showInDrawer: true
    },
    {
      title: 'Whanganui',
      urlParam: 'whanganui',
      matchingMohCityString: ['Whanganui'],
      lat: -39.93242412021889, 
      lng: 175.02958355172697,
      zoom: 10,
      showInDrawer: true
    },
    {
      title: 'Kaikoura',
      urlParam: 'kaikoura',
      matchingMohCityString: ['Kaikoura', 'Kaikōura'],
      lat: -42.39200642596124,
      lng: 173.67887645158532,
      zoom: 10,
      showInDrawer: true
    },
    {
      title: 'Ōtaki',
      urlParam: 'otaki',
      matchingMohCityString: ['Otaki'],
      lat: -40.76018472420495,
      lng:  175.1568850510182,
      zoom: 10,
      showInDrawer: true
    },
    {
      title: 'Orewa',
      urlParam: 'orewa',
      matchingMohCityString: ["Orewa"],
      lat: -36.58622354488708,
      lng: 174.68657614155387,
      zoom: 10,
      showInDrawer: true
    },
    {
      title: 'Warkworth',
      urlParam: 'warkworth',
      matchingMohCityString: ['Warkworth'],
      lat: -36.39825538554779, 
      lng: 174.6622196622345, 
      zoom:10,
      showInDrawer: true
    },
    {
      title: 'Waimauku',
      urlParam: 'waimauku',
      matchingMohCityString: ['Waimauku'],
      lat: -36.769535791859894, 
      lng: 174.49177041557877,
      zoom: 10,
      showInDrawer: true
    },
    {
      title: 'Otorohanga',
      urlParam: 'otorohanga',
      matchingMohCityString: ['Otorohanga'],
      lat: -38.185506335511775, 
      lng: 175.2103540378415,
      zoom: 10,
      showInDrawer: true
    },
    {
      title: 'New Plymouth',
      urlParam: 'newplymouth',
      matchingMohCityString: ['New Plymouth'],
      lat: -39.05531858908381, 
      lng: 174.08590254313253,
      zoom: 10,
      showInDrawer: true
    },
    {
      title: 'Ōpōtiki',
      urlParam: 'opotiki',
      matchingMohCityString: ['Opotiki'],
      lat: -38.01207840880075, 
      lng: 177.2829488360815,
      zoom: 10,
      showInDrawer: true
    }
  ];

export default PRESET_LOCATIONS