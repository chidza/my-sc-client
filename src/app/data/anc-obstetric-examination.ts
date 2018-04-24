namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAncObstetricExamination extends IAggregateRoot<string> {
        lie: string;
        presentation: string;
        engaged: boolean;
        fetalMovement: boolean;
    }

    export interface IAncObstetricExaminationService extends data.IAggregateRootService<IAncObstetricExamination, string> {

    }

    interface IAncObstetricExaminationResource extends IResourceService<IAncObstetricExamination> {

    }

    class AncObstetricExaminationService extends EntityService<IAncObstetricExamination, string, IAncObstetricExaminationResource> implements IAncObstetricExaminationService {

        static $inject = ["AncObstetricExaminationResource"];
        constructor(private resource: IAncObstetricExaminationResource) {
            super(resource);
        }


    }

    app.factory("AncObstetricExaminationResource", ["$resource",
        ($resource: ng.resource.IResourceService): IAncObstetricExaminationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/obstetric-examinations/:id");

            return <IAncObstetricExaminationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    method: "GET",
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                "update": { method: "PUT" }
            });

        }]);

    app.service("AncObstetricExaminationService", AncObstetricExaminationService);

}