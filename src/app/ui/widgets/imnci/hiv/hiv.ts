namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IHiv extends ng.IController {

    }

    class Controller implements IHiv {
        personId: string;
        encounterId: string;
        motherId: string;
        personInvestigation: data.IPersonInvestigation;
        relation: Array<data.IRelation>;
        hivStatus: data.IHivStatus;
        investigationId: string;


        static $inject = ["PersonService", "RelationService", "PersonInvestigationService", "OpdService", "SiteSettingService", "EncounterInvestigationService"];
        constructor(
            private personService: data.IPersonService,
            private relationService: data.IRelationService,
            private personInvestigationService: data.IPersonInvestigationService,
            private opdService: data.IOpdService,
            private siteSettingService: data.ISiteSettingService,
            private encounterInvestigationService: data.IEncounterInvestigationService) {
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.personId) {
                this.opdService.current(this.personId).then((response) => {

                });

                this.relationService.getByPersonId(this.personId).then((response) => {
                    this.relation = response;
                    console.log(response);
                    this.relation.forEach((r) => {
                        if (r.personId === this.personId) {
                            this.motherId = r.memberId;
                            this.personService.hivStatus(this.motherId, new Date()).then((response) => {
                                this.hivStatus = response;
                                console.log("response");
                                console.log(response);
                            });
                        }
                    });
                });

            }

              this.siteSettingService.fetch("HIV_DNA_PCR").then((response) => {
                this.investigationId = response.value;
            });
        }

       /* hiv = () => {
            if (this.personInvestigation) {
                this.setHiv({ personInvestigationId: this.personInvestigation.id, investigationId: this.investigationId });
            } else {
                this.setHiv({ personInvestigationId: -1, investigationId: this.investigationId });
            }
        }
*/


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/imnci/hiv/hiv.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                encounterId: "<"

            };

        }
    }

    app.component("mrsImnciHiv", new Component());

}
