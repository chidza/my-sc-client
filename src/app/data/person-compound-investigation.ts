namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface IPersonCompoundInvestigation extends IAggregateRoot<string> {

        personId: string;
        name: string;
        investigationId: string;
        investigationName: string;
        personInvestigationId: string;
        personInvestigationTestId: string;
    }


    export interface IPersonCompoundInvestigationService extends data.IAggregateRootService<IPersonCompoundInvestigation, string> {

        getPersonCompoundInvestigations(compoundInvestigationId: string, personId: string, date: string): ng.IPromise<Array<IPersonCompoundInvestigation>>;

    }

    interface IPersonCompoundInvestigationResource extends IResourceService<IPersonCompoundInvestigation> {
        getPersonCompoundInvestigations: ng.resource.IResourceArrayMethod<IPersonCompoundInvestigation>;

    }

    class PersonCompoundInvestigationService extends EntityService<IPersonCompoundInvestigation, string, IPersonCompoundInvestigationResource> implements IPersonCompoundInvestigationService {

        static $inject = ["PersonCompoundInvestigationResource", "DateUtils"];
        constructor(private resource: IPersonCompoundInvestigationResource,
            private dateUtils: utils.IDateUtils) {
            super(resource);
        }

        getPersonCompoundInvestigations = (compoundInvestigationId: string, personId: string, date: string): ng.IPromise<Array<IPersonCompoundInvestigation>> => {            
            return this.getResource().getPersonCompoundInvestigations({ compoundInvestigationId: compoundInvestigationId, personId: personId, date: date }).$promise;
        }


    }

    app.factory("PersonCompoundInvestigationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            DateUtils: utils.IDateUtils): IPersonCompoundInvestigationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/person-compound-investigations/:id");

            return <IPersonCompoundInvestigationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getPersonCompoundInvestigations": {
                    url: mrs.config.Settings.serverResource("api/people/:personId/person-compound-investigations/:compoundInvestigationId"),
                    method: "GET", isArray: true
                },
                "get": {
                    method: "GET"
                },
                "update": {
                    method: "PUT"
                },
                "save": {
                    method: "POST"
                }
            });

        }]);

    app.service("PersonCompoundInvestigationService", PersonCompoundInvestigationService);

}