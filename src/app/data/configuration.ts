namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IConfigurationService {
        get: () => ng.IPromise<any>;
        getEnv: () => ng.IPromise<any>;
    }

    class ConfigurationService implements IConfigurationService {

        static $inject = ["$filter", "$http"];
        constructor(private $filter: ng.IFilterService, private $http: ng.IHttpService) { }

        get = () => {
            return this.$http.get(mrs.config.Settings.serverResource("api/management/configprops")).then((response) => {
                let properties: Array<any> = [];

                angular.forEach(response.data, function (data) {
                    properties.push(data);
                });

                let orderBy = this.$filter("orderBy");

                return orderBy(properties, "prefix");

            });


        }

        getEnv = () => {
            return this.$http.get(mrs.config.Settings.serverResource("api/management/env")).then((response) => {
                let properties = {};

                angular.forEach(response.data, function (val, key) {
                    let vals: Array<any> = [];

                    angular.forEach(val, function (v, k) {
                        vals.push({ key: k, val: v });
                    });

                    properties[key] = vals;

                });

                return properties;

            });

        }
    }

    app.service("ConfigurationService", ConfigurationService);

}