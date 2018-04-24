namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAdmissionWard extends IAggregateRoot<string> {
        admissionId: string;
        wardId: string;
    }

    export interface IAdmissionWardService extends data.IAggregateRootService<IAdmissionWard, string> {


    }

    interface IAdmissionWardResource extends IResourceService<IAdmissionWard> {

    }

    class AdmissionWardService extends EntityService<IAdmissionWard, string, IAdmissionWardResource> implements IAdmissionWardService {

        static $inject = ["AdmissionWardResource"];
        constructor(private resource: IAdmissionWardResource) {
            super(resource);
        }

    }

    app.factory("AdmissionWardResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            DateUtils: utils.IDateUtils): IAdmissionWardResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/admission-wards/:id");

            return <IAdmissionWardResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.discharged = DateUtils.convertLocalDateTimeFromServer(data.discharged);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "update": {
                    method: "PUT",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);
                        copy.time = DateUtils.convertLocalDateTimeToServer(copy.time);
                        copy.discharged = DateUtils.convertLocalDateToServer(copy.discharged);
                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.discharged = DateUtils.convertLocalDateTimeFromServer(data.discharged);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);
                        }
                        return data;
                    }
                },
                "save": {
                    method: "POST",
                    transformRequest: function (data) {
                        let copy = angular.copy(data);

                        if (copy.absconded == null) {
                            copy.absconded = false;
                        }

                        copy.time = DateUtils.convertLocalDateTimeToServer(copy.time);
                        copy.discharged = DateUtils.convertLocalDateTimeToServer(copy.discharged);

                        return angular.toJson(copy);
                    },
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                            data.discharged = DateUtils.convertLocalDateTimeFromServer(data.discharged);
                            data.time = DateUtils.convertLocalDateTimeFromServer(data.time);

                        }
                        return data;
                    }
                }

            });

        }]);

    app.service("AdmissionWardService", AdmissionWardService);

}