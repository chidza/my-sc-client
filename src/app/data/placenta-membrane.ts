namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPlacentaMembrane extends IAggregateRoot<string> {
        deliveryMethod: string;
        membraneDescription: string;
        membraneState: string;
        placentaDescription: string;
        placentaState: string;
        placentaWeight: number;
        umbilicalCordDescription: string;
        umbilicalCordState: string;
        umbilicalCordVessel: number;
        date: Date;
        time: Date;
    }

    export interface IPlacentaMembraneService extends data.IAggregateRootService<IPlacentaMembrane, string> {
        query: (text?: string) => ng.IPromise<Array<IPlacentaMembrane>>;
    }

    interface IPlacentaMembraneResource extends IResourceService<IPlacentaMembrane> {

    }

    class PlacentaMembraneService extends EntityService<IPlacentaMembrane, string, IPlacentaMembraneResource> implements IPlacentaMembraneService {

        static $inject = ["PlacentaMembraneResource"];
        constructor(private resource: IPlacentaMembraneResource) {
            super(resource);
        }

        query = (text?: string): ng.IPromise<Array<IPlacentaMembrane>> => {
            return this.getResource().query({ text: name }).$promise;
        }

    }

    app.factory("PlacentaMembraneResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService, dateUtils: utils.IDateUtils): IPlacentaMembraneResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/placenta-and-membranes/:id");

            return <IPlacentaMembraneResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            if (data.date) {
                                data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                                data.time = dateUtils.convertLocalDateTimeFromServer(data.date);
                            }
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.combineDate(moment(copy.date).format("YYYY-MM-DD"), moment(copy.time).format("HH:mm:00"));
                        return angular.toJson(copy);
                    }, transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.date = dateUtils.combineDate(moment(copy.date).format("YYYY-MM-DD"), moment(copy.time).format("HH:mm:00"));
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.date = dateUtils.convertLocalDateTimeFromServer(data.date);
                            data.time = dateUtils.convertLocalDateTimeFromServer(data.date);
                        }
                        return data;
                    }
                }
            });

        }]);

    app.service("PlacentaMembraneService", PlacentaMembraneService);

}