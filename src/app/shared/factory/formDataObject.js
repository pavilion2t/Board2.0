export function formDataObject() {
    return function(data) {
        var fd = new FormData();
        angular.forEach(data, function(value, key) {
            if(value instanceof Object && (key === "listing" || key === "unique_product")){
                angular.forEach(value, function(v, k) {
                    fd.append(key+'['+k+']', v);
                });

            }else{
                fd.append(key, value);
            }

        });
        return fd;
    };
}
