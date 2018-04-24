namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IAncGeneralAssessment extends IAggregateRoot<string> {
        goitre: boolean;
        pallor: string;
        abdomen: string;
        tbScreeningDone: boolean;
    }

    export interface IAncGeneralAssessmentService extends data.IAggregateRootService<IAncGeneralAssessment, string> {

    }

    interface IAncGeneralAssessmentResource extends IResourceService<IAncGeneralAssessment> {

    }

    class AncGeneralAssessmentService extends EntityService<IAncGeneralAssessment, string, IAncGeneralAssessmentResource> implements IAncGeneralAssessmentService {

        static $inject = ["AncGeneralAssessmentResource"];
        constructor(private resource: IAncGeneralAssessmentResource) {
            super(resource);
        }


    }

    app.factory("AncGeneralAssessmentResource", ["$resource",
        ($resource: ng.resource.IResourceService): IAncGeneralAssessmentResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/general-assessments/:id");

            return <IAncGeneralAssessmentResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "get": {
                    isArray: false,
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

    app.service("AncGeneralAssessmentService", AncGeneralAssessmentService);

}