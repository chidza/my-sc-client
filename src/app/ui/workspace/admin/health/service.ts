namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IHealthService {
        checkHealth(): ng.IPromise<any>;
        transformHealthData(data: any): any;
        getBaseName(name?: string): string;
        getSubSystemName(name?: string): string;
    }

    class HealthService {

        separator = ".";

        static $inject = ["$rootScope", "$http"];
        constructor(private $rootScope: ng.IRootScopeService, private $http: ng.IHttpService) {

        }

        checkHealth = (): ng.IPromise<any> => {
            return this.$http.get(mrs.config.Settings.serverResource("api/management/health"), {}).then((response) => {
                console.log(response);
                return response.data;
            }, (e) => {
                console.log(e);
            });
        }

        transformHealthData = (data: any): any => {
            let response: Array<any> = [];
            this.flattenHealthData(response, null, data);
            return response;
        }

        getBaseName = (name: string) => {
            if (name) {
                let split = name.split(".");
                return split[0];
            }
        }

        getSubSystemName = (name: string) => {
            if (name) {
                let split = name.split(".");
                split.splice(0, 1);
                let remainder = split.join(".");
                return remainder ? " - " + remainder : "";
            }
        }

        /* private methods */
        flattenHealthData = (result: any, path: string, data: any) => {
            angular.forEach(data, (value, key) => {
                if (this.isHealthObject(value)) {
                    if (this.hasSubSystem(value)) {
                        this.addHealthObject(result, false, value, this.getModuleName(path, key));
                        this.flattenHealthData(result, this.getModuleName(path, key), value);
                    } else {
                        this.addHealthObject(result, true, value, this.getModuleName(path, key));
                    }
                }
            });
            return result;
        }

        addHealthObject = (result: any, isLeaf: boolean, healthObject: any, name: string) => {

            let healthData = {
                "name": name
            } as any;

            let details = {};
            let hasDetails = false;

            angular.forEach(healthObject, (value, key) => {
                if (key === "status" || key === "error") {
                    healthData[key] = value;
                } else {
                    if (!this.isHealthObject(value)) {
                        details[key] = value;
                        hasDetails = true;
                    }
                }
            });

            // Add the of the details
            if (hasDetails) {
                angular.extend(healthData, { "details": details });
            }

            // Only add nodes if they provide additional information
            if (isLeaf || hasDetails || healthData.error) {
                result.push(healthData);
            }
            return healthData;
        }

        getModuleName = (path: string, name: string) => {
            let result;
            if (path && name) {
                result = path + this.separator + name;
            } else if (path) {
                result = path;
            } else if (name) {
                result = name;
            } else {
                result = "";
            }
            return result;
        }

        hasSubSystem = (healthObject: any) => {
            let result = false;
            angular.forEach(healthObject, (value) => {
                if (value && value.status) {
                    result = true;
                }
            });
            return result;
        }

        isHealthObject = (healthObject: any) => {
            let result = false;
            angular.forEach(healthObject, (value, key) => {
                if (key === "status") {
                    result = true;
                }
            });
            return result;
        }

    }

    app.service("HealthService", HealthService);

} 