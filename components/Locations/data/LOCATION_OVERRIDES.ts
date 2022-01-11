
/*
  If a location is released without a location (or with the wrong one).
  It can be corrected here:
  MoH locations without a lat/lng will also appear in a "unmapped locations" section at the bottom of the drawer.
*/

const LOCATION_OVERRIDES:LocationOverride[] = [
    {eventId: 'a0l4a0000006NKfAAM', lat: '-39.550910', lng: '174.123688'}
    ,{eventId: 'a0l4a0000006RWCAA2', lat: '-38.689185', lng: '176.071376'}
    , {eventId: 'a0l4a0000006QRRAA2', lat: '-37.673978143585785', lng: '176.22322409540428'}
    , {eventId: 'a0l4a0000006NXZAA2', lat: '-37.710854952237725', lng: '176.15152478126316'}
    , {eventId: 'a0l4a0000006OyMAAU', lat: '-37.67357686829962', lng: '176.22265982164015'}
    , {eventId: 'a0l4a0000006Q1yAAE', lat: '-38.14035277924268', lng: '176.25445811133048'}
    , {eventId: 'a0l4a0000006Sp4AAE', lat:'-37.73870099757525', lng: '176.1038195083869'}
    , {eventId: 'a0l4a0000006SopAAE', lat: '-38.68647464948843', lng: '176.06532281197366'}
    , {eventId: 'a0l4a0000006SXuAAM', lat: '-35.93501809911511', lng: '173.87742493344686'}
    , {eventId: 'a0l4a0000006QSyAAM', lat: '-37.70737160447246', lng: '176.14647672692442'}
    , {eventId: 'a0l4a0000006QTDAA2', lat: '-37.70451889546021', lng:'176.15319463761546'}
    , {eventId: 'a0l4a0000006QPVAA2', lat: '-37.682077131055124', lng: '176.16832800001407'}
    , {eventId: 'a0l4a0000006QP1AAM', lat: '-37.674881587012045', lng:'176.22266988519743'}
    , {eventId: 'a0l4a0000006Y9EAAU', lat:'-36.84394204165378', lng: '174.76565925548348'}
    , { eventId: 'a0l4a0000006YIaAAM', lat: '-43.4894639295836', lng: '172.5472327076925'}
    , { eventId: 'a0l4a0000006YHDAA2', lat: '-35.53664725946573', lng:'173.3861921967765'}
    , { eventId: 'a0l4a0000006YGUAA2', lat: '-35.53664725946573', lng:'173.3861921967765'}
    , { eventId: 'a0l4a0000006YGeAAM', lat: '-35.53664725946573', lng:'173.3861921967765'}
    , { eventId: 'a0l4a0000006ZL5AAM', lat: '-37.674113436476176', lng:'176.2243295802912'}
    , { eventId: 'a0l4a0000006aeRAAQ', lat:'-37.99000017599115', lng: '177.1615482680346'}
    , { eventId: 'a0l4a0000006VokAAE', lat: '-36.86286489342495', lng: '174.75669958249682'}
    , { eventId: 'a0l4a0000006VpTAAU', lat: '-36.86286489342495', lng: '174.75669958249682'}
    , { eventId: 'a0l4a0000006baKAAQ', lat: '-36.86286489342495', lng: '174.75669958249682'}
    , { eventId: 'a0l4a0000006X6FAAU', lat: '-36.849718170449385',lng: '174.75963861112493'}
    , { eventId: 'a0l4a0000006bVKAAY', lat: '-38.70360004692749', lng:'176.10112869764'}
    , { eventId: 'a0l4a0000006dwVAAQ', lat: '-36.86286489342495', lng: '174.75669958249682'}
    , { eventId: 'a0l4a0000006jZhAAI', lat: '-38.11602517023455', lng:'176.2259859711393'}
    , {eventId: 'a0l4a0000006jgJAAQ', lat: '-41.29232941897306', lng:'174.77645536127966'}
    , {eventId: 'a0l4a0000006jpuAAA', lat: '-37.679527857475044', lng:'176.1656490270016'}
    , {eventId: 'a0l4a0000006jsZAAQ', lat: '-37.63690773843197', lng:'176.1829740402555'}
    , {eventId: 'a0l4a0000006jmbAAA', lat: '-36.823432181151354', lng:'174.61118945822034'}
    , {eventId: 'a0l4a0000006jj8AAA', lat: '-36.823432181151354', lng:'174.61118945822034'}
    , {eventId: 'a0l4a0000006jlEAAQ', lat: '-36.823432181151354', lng:'174.61118945822034'}
    , {eventId: 'a0l4a0000006n9fAAA', lat: '-39.47954129434454', lng: '175.669459569513' }
    , {eventId: 'a0l4a0000006nBqAAI', lat: '-40.348771995369354', lng: '175.62327494840014' }
    , {eventId: 'a0l4a0000006nAxAAI', lat: '-41.20990670954692',lng: '174.90620871204248'}
  
    , {eventId: 'a0l4a0000006n91AAA', lat: '-35.22065780052977', lng:'174.23203990272302'}
    , {eventId: 'a0l4a0000006nAYAAY', lat: '-41.209882137630295', lng:'174.90678119833257'}
    , {eventId: 'a0l4a0000006nQMAAY', lat: '-41.2099528231171', lng:'174.9064340705554'}
  ]

  export default LOCATION_OVERRIDES;