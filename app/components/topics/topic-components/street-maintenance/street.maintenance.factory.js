simplicity.factory('StreetMaintenance', ['$q', '$stateParams', 'AddressCache', 'simplicityBackend', 'COLORS',
  function($q, $stateParams, AddressCache, simplicityBackend, COLORS){   

    var StreetMaintenance = {};

    var topicProperties = {
      'name' : 'streetmaintenance',
      'title' : 'Street Maintenance',
      'position' : 7,
      'searchby' : {
        'address' : {
          'params' : {
            'type' : null,
            'timeframe' : null,
            'extent' : null,
            'view' : 'map'
          },
          'requiredParams' : [],
          'headerTemplate' : 'topics/topic-headers/topic.header.at.html',
        },
        'street_name' : {
          'params' : {
            'type' : null,
            'timeframe' : null,
            'extent' : 82.5,
            'view' : 'map'
          },
          'requiredParams' : [],
          'headerTemplate' : 'topics/topic-headers/topic.header.along.html',
        }
      },
      'simpleViewTemplate' : null,
      'detailsViewTemplate' : 'topics/topic-components/street-maintenance/street-maintenance.view.html',
      'tableViewTemplate' : null,
      'listViewTemplate' : 'topics/topic-components/street-maintenance/street-maintenance.view.html',
      'defaultView' : 'map',
      'iconClass' : 'flaticon-location38',
      'linkTopics' : ['property'],
      'questions' : {
        'topic' :  'Do you want to know who is responsible for maintaining a street?',
        'address' :  'Do you want to know who is responsible for maintaining the street at this address?',
        'street_name' : 'Do you want to know who is responsible for maintaining this street?'
      }   
    };

    var formatStreetMaintenanceData = function(centerlineIdsString){
      var q = $q.defer();
      var addressCache = AddressCache.get();
        simplicityBackend.simplicityQuery('streets', {'centerlineIds' : centerlineIdsString})
          .then(function(streetResults){
              var streetFeaturesArray = [];
              var streetMaintenanceColors = {};
              for (var i = 0; i < streetResults.features.length; i++) {
                if(streetResults.features[i].properties.street_responsibility === 'UNKOWN'){
                  streetResults.features[i].properties.street_responsibility = 'UNKNOWN';
                }
                if(!streetMaintenanceColors[streetResults.features[i].properties.street_responsibility]){
                  streetMaintenanceColors[streetResults.features[i].properties.street_responsibility] = COLORS.streetmaintenance[streetResults.features[i].properties.street_responsibility];
                }
                streetResults.features[i].properties.color = COLORS.streetmaintenance[streetResults.features[i].properties.street_responsibility].color;
                streetFeaturesArray.push(streetResults.features[i]);
              }
              var summary = {
                'table' : streetMaintenanceColors
              };
              var geojson = {
                'type' : 'FeatureCollection',
                'summary' : summary,
                'searchGeojson' : addressCache.searchGeojson,
                'features' : streetFeaturesArray
              };
              q.resolve(geojson);
          });
        return q.promise;
    };

    StreetMaintenance.build = function(){
      var q = $q.defer();
      if($stateParams.searchby === "street_name"){
        q.resolve(formatStreetMaintenanceData($stateParams.id));

      }else if ($stateParams.searchby === "address"){

        simplicityBackend.simplicityQuery('xrefs', {'civicaddressId' : $stateParams.id})
          .then(function(xrefResults){
            var centerlineIdArray = [];
            for (var i = 0; i < xrefResults.features.length; i++) {
              centerlineIdArray.push(xrefResults.features[i].properties.centerline_id);
            }
            q.resolve(formatStreetMaintenanceData(centerlineIdArray.join(',')));
          });
      }
      

      return q.promise;
    };

    StreetMaintenance.getTopicProperties = function(){
      return topicProperties;
    };

    //****Return the factory object****//
    return StreetMaintenance; 

    
}]); //END StreetMaintenance factory function




   


