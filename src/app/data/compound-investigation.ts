namespace mrs.data {
    "use strict";

    let app = angular.module(mrs.appName);

    export interface ICompoundInvestigation extends IAggregateRoot<string> {
        name: string;
    }

    export interface ICompoundInvestigationTests extends IAggregateRoot<string> {
        sampleId: string;
        testId: string;
    }

    export interface ICompoundInvestigationService extends data.IAggregateRootService<ICompoundInvestigation, string> {

        getCompoundInvestigationTests(id: string): ng.IPromise<Array<ICompoundInvestigationTests>>;

    }

    interface ICompoundInvestigationResource extends IResourceService<ICompoundInvestigation> {
        getCompoundInvestigationTests: ng.resource.IResourceArrayMethod<ICompoundInvestigationTests>;

    }

    class CompoundInvestigationService extends EntityService<ICompoundInvestigation, string, ICompoundInvestigationResource> implements ICompoundInvestigationService {

        static $inject = ["CompoundInvestigationResource"];
        constructor(private resource: ICompoundInvestigationResource) {
            super(resource);
        }

        getCompoundInvestigationTests = (id: string): ng.IPromise<Array<ICompoundInvestigationTests>> => {
            return this.getResource().getCompoundInvestigationTests({ id: id }).$promise;
        }


    }

    app.factory("CompoundInvestigationResource", ["$resource", "DateUtils",
        ($resource: ng.resource.IResourceService,
            DateUtils: utils.IDateUtils): ICompoundInvestigationResource => {

            let resourceUrl = mrs.config.Settings.serverResource("api/compound-investigations/:id");

            return <ICompoundInvestigationResource>$resource(resourceUrl, {}, {
                "query": { method: "GET", isArray: true },
                "getCompoundInvestigationTests": {
                    url: mrs.config.Settings.serverResource("api/compound-investigations/:id/investigations"),
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

    app.service("CompoundInvestigationService", CompoundInvestigationService);

}