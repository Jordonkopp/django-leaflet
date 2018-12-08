L.Control.Shapefile = L.Control.extend({
    onAdd: function(map, drawnLayer, mapId, polygonId) {
        var thisControl = this;

        var controlDiv = L.DomUtil.create('div', 'leaflet-control-command');

        // Create the leaflet control.
        var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', controlDiv);

        // Create the form inside of the leaflet control.
        var form = L.DomUtil.create('form', 'leaflet-control-command-form', controlUI);
        form.action = '';
        form.method = 'post';
        form.enctype='multipart/form-data';

        // Create the input file element.
        var input = L.DomUtil.create('input', 'leaflet-control-command-form-input', form);
        input.id = 'file';
        input.type = 'file';
        input.name = 'uploadFile';
        input.style.display = 'none';
        input.accept = '.geojson';

        L.DomEvent
            .addListener(form, 'click', function () {
                document.getElementById("file").click();
            })
            .addListener(input, 'change', function(){
                //Size in Megabytes
                size = this.files[0].size/1024/1024;
                var valid = thisControl.validateFileSize(size);
                if(valid){
                    thisControl.fileToArrayBuffer(this.files[0], map, drawnLayer, mapId, polygonId);
                    form.reset();
                }else{
                    form.reset();
                }
            });

        controlUI.title = 'Upload a GeoJson';

        return controlDiv;
    },
    //Limit file size to prevent large posts
    validateFileSize: function(size){
        var limit = 1.5;
        if(size > limit){
            alert("File too large.");
            return false;
        } else{
            return true;
        }
    },
    // When the user uploads a file, convert the file to an array buffer.
    fileToArrayBuffer: function(file, map, drawnLayer, mapId, polygonId) {
        var thisControl = this;

        var reader = new FileReader();

        reader.onloadend = function (e) {
            var json = JSON.parse(e.target.result);
            var errors = geojsonhint.hint(json);
            if (errors){
                var message = "";
                for (e in errors){
                    if (errors[e]["message"] === "Polygons and MultiPolygons should follow the right-hand rule" || errors[e]["message"] === "old-style crs member is not recommended, this object is equivalent to the default and should be removed"){
                        message += ""
                    }
                    else{
                        message += errors[e]["message"]
                        message += "\n"    
                    }       
                }
                if (message == ""){
                    thisControl.loadArrayBuffer(json, map, drawnLayer, mapId, polygonId);
                }
                else if (message != ""){
                    alert(message);
                }
            }else{
                // Pass the array buffer to the shapfile-js function
                thisControl.loadArrayBuffer(json, map, drawnLayer, mapId, polygonId);
            }

        };

        reader.readAsText(file);

    },

    // Convert the array buffer to geojson and add it to the map as a layer
    loadArrayBuffer: function(geojson, map, drawnLayer, mapId, polygonId) {

        console.log(map._layers);

        // var tolerance = 0.001

        //Create Polygon from file to simplify using turf.js
        var feature = turf.polygon(geojson["features"][0]["geometry"]["coordinates"]);
        // var simplifiedGeojson = turf.simplify(feature, tolerance, true);

        // //Check for any self-intersections
        // var self_intersects = turf.kinks(simplifiedGeojson);

        // if(self_intersects['features'].length > 0){
        //     var intersect_message = "Geojson has self-intersecting points!\n";
        //     alert(intersect_message);
        // }

        //Create layer to add to map

        drawnLayer.removeLayer(polygonId);
        polygonId = null;
        // var tolerance = 0.001

        //Create Polygon from file to simplify using turf.js
        var feature = turf.polygon(geojson["features"][0]["geometry"]["coordinates"]);
        // var simplifiedGeojson = turf.simplify(feature, tolerance, true);

        // //Check for any self-intersections
        // var self_intersects = turf.kinks(simplifiedGeojson);

        // if(self_intersects['features'].length > 0){
        //     var intersect_message = "Geojson has self-intersecting points!\n";
        //     alert(intersect_message);
        // }

        //Create layer to add to map
        var layer = L.geoJson(feature).getLayers()[0];
        drawnLayer.addLayer({layer);
        polygonId = layer._leaflet_id;
        var {{ callback }}_id = new String('{{ name }}').replace("-map", "");
        document.getElementById({{ callback }}_id).innerHTML = JSON.stringify({{ callback }}_drawnLayer.getLayer({{ callback }}_polygonId).toGeoJSON()['geometry']);
        {{ callback }}.fitBounds({{ callback }}_drawnLayer.getBounds());
    }
});

L.control.shapefile = function(opts) {
    return new L.Control.Shapefile(opts);
};

function isNotMultiPolygon(geojson){
    if (geojson["features"][0]["geometry"]["type"] == "MultiPolygon"){
        alert("Geojson must not be a MultiPolygon");
        return false;
    }
    else{
        return true;
    }
};

