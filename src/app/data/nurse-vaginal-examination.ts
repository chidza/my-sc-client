namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface INurseVaginalExamination extends IAggregateRoot<string> {
        vulva: string;
        vagina: string;
        applicationToPresentingPart: string;
        position: string;
        liquor: string;
        cordFelt: string;
        note: string;
        pelvicAssessment: string;
    }

    export interface INurseVaginalExaminationService extends data.IAggregateRootService<INurseVaginalExamination, string> {
        saveNurseVaginalExamination(deliveryId: string, entity: INurseVaginalExamination): ng.IPromise<INurseVaginalExamination>;
    }

    interface INurseVaginalExaminationResource extends IResourceService<INurseVaginalExamination> {

    }

    class NurseVaginalExaminationService extends EntityService<INurseVaginalExamination, string, INurseVaginalExaminationResource> implements INurseVaginalExaminationService {

        static $inject = ["NurseVaginalExaminationResource"];
        constructor(private resource: INurseVaginalExaminationResource) {
            super(resource);
        }

        saveNurseVaginalExamination = (deliveryId: string, entity: INurseVaginalExamination): ng.IPromise<INurseVaginalExamination> => {
            return this.getResource().save({ deliveryId: deliveryId }, entity).$promise;
        }
    }

    app.factory("NurseVaginalExaminationResource", ["$resource",
        ($resource: ng.resource.IResourceService): INurseVaginalExaminationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/nurse-vaginal-examinations/:id");

            return <INurseVaginalExaminationResource>$resource(resourceUrl, {}, {
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
                "update": { method: "PUT" },
                "save": {
                    url: mrs.config.Settings.serverResource("api/nurse-vaginal-examinations/:deliveryId"),
                    method: "POST"
                },
            });

        }]);

    app.service("NurseVaginalExaminationService", NurseVaginalExaminationService);

}