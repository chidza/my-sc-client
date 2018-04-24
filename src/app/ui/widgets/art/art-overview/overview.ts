namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtPatientOverviewDisplay extends ng.IController {
        performTest: (investigationId: Object) => void;
        screenTb: () => void;
    }

    class Controller implements IArtPatientOverviewDisplay {
        public performTest: (investigationId: Object) => void;
        public screenTb: () => void;
        encounterId: string;
        $router: any;
        personId: string;
        personArtStatusFirst: data.IPersonArtStatus;
        personArtStatusCurrent: data.IPersonArtStatus;
        personInvestigation: data.IPersonInvestigation;
        regimen: data.IArvCombinationRegimen;
        artStatus: data.IArtStatus;
        whoStage: data.IPersonArtWhoStage;
        anc: data.IAnc;
        gravida: number;
        art: data.IArt;
        cd4CountId: string;
        viralLoadId: string;
        cd4CountThreshold: number;
        viralLoadThreshold: number;
        cd4Examination: data.IPersonInvestigation;
        viralLoadExamination: data.IPersonInvestigation;

        static $inject = ["ArtService", "PersonArtStatusService", "PersonInvestigationService", "ArvCombinationRegimenService",
            "ArtStatusService", "PersonArtWhoStageService", "AncService", "SiteSettingService"];
        constructor(private artService: data.IArtService,
            private personArtStatusService: data.IPersonArtStatusService,
            private personInvestigationService: data.IPersonInvestigationService,
            private arvCombinationRegimenService: data.IArvCombinationRegimenService,
            private artStatusService: data.IArtStatusService,
            private personWhoStageService: data.IPersonArtWhoStageService,
            private ancService: data.IAncService,
            private siteSettingService: data.ISiteSettingService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }
        init = (): void => {
            console.log("PersonId", this.personId);
            console.log("EncounterId", this.encounterId);
            if (this.personId && this.encounterId) {
                this.artService.getByPersonId(this.personId).then((response) => {
                    this.art = response;
                    this.personArtStatusService.getCurrent(this.art.id).then((response) => {
                        this.personArtStatusCurrent = response;
                        if (this.personArtStatusCurrent.arvCombinationRegimenId) {
                            this.arvCombinationRegimenService.get(this.personArtStatusCurrent.arvCombinationRegimenId).then((response) => {
                                this.regimen = response;
                            });
                        }
                        if (this.personArtStatusCurrent.artStatusId) {
                            this.artStatusService.get(this.personArtStatusCurrent.artStatusId).then((response) => {
                                this.artStatus = response;
                            });
                        }
                    });

                    this.personWhoStageService.getCurrent(this.art.id).then((response) => {
                        this.whoStage = response;
                    });

                    this.personArtStatusService.getFirst(this.art.id).then((response) => {
                        this.personArtStatusFirst = response;
                    });

                    if (this.art.investigationId) {
                        this.personInvestigationService.get(this.art.investigationId).then((response) => {
                            this.personInvestigation = response;
                        });
                    }

                    this.ancService.current(this.personId).then((response) => {
                        this.anc = response;
                        if (this.anc.id) {
                            this.ancService.getInformation(this.personId).then((response) => {
                                this.gravida = response.gravida;
                            });
                        }
                    });

                });
            }
        }

        $onInit = () => {
            this.siteSettingService.fetch("INVESTIGATION_VIRAL_LOAD_ID").then((response) => {
                this.viralLoadId = response.value;
                this.personInvestigationService.getCurrentByPersonIdAndInvestigationId(this.personId, this.viralLoadId).then((response) => {
                    this.viralLoadExamination = response;
                });
            });
            this.siteSettingService.fetch("INVESTIGATION_CD_4_ID").then((response) => {
                this.cd4CountId = response.value;
                this.personInvestigationService.getCurrentByPersonIdAndInvestigationId(this.personId, this.cd4CountId).then((response) => {
                    this.cd4Examination = response;
                });
            });

            this.siteSettingService.fetch("CD_4_THRESHOLD_VALUE").then((response) => {
                this.cd4CountThreshold = parseInt(response.value);
            });
            this.siteSettingService.fetch("VIRAL_LOAD_THRESHOLD_VALUE").then((response) => {
                this.viralLoadThreshold = parseInt(response.value);
            });
        }

        gotoTest = (test: string) => {
            if (test === "Viral Load") {
                this.performTest({ investigationId: this.viralLoadId });
            }
            if (test === "CD4 Count") {
                this.performTest({ investigationId: this.cd4CountId });
            }

        }

        screen = () => {
            this.screenTb();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-overview/overview.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                screenTb: "&",
                performTest: "&",
                "$router": "<",
                personId: "<",
                encounterId: "<"
            };

        }
    }

    app.component("mrsArtOverviewDisplay", new Component());

}
