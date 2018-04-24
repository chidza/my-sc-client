namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IMissingInformation extends ng.IController {
    }


    class Controller implements IMissingInformation {
        start: string;
        end: string;
        personId: string;
        urinalysisInvestigations = {} as data.IUrinalysisRecording;
        missingDetails: Array<data.IUrinalysisRecordingData> = [];
        static $inject = ["PersonInvestigationService"];
        constructor(private personInvestigationService: data.IPersonInvestigationService) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            console.log(this.personId);
            console.log(this.start);
            console.log(this.end);
            if (this.personId && this.start) {
                this.personInvestigationService.checkMissingUrinalysis(this.personId, this.start, this.end, 60).then((response) => {
                    this.urinalysisInvestigations = response;
                    this.urinalysisInvestigations.volume.forEach((v) => {
                        if (v.status === "MISSING") {
                            this.missingDetails.push({ status: "Volume", time: v.time });
                        }
                    });

                    this.urinalysisInvestigations.proteins.forEach((pr) => {
                        if (pr.status === "MISSING") {
                            this.missingDetails.push({ status: "Protein", time: pr.time });
                        }
                    });

                    this.urinalysisInvestigations.acetons.forEach((ac) => {
                        if (ac.status === "MISSING") {
                            this.missingDetails.push({ status: "Acetone", time: ac.time });
                        }
                    });
                });
            }
        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/partogram/missing-information/urinalysis/missing-urinalysis.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "start": "@",
                "end": "@",
                personId: "<",
            };

        }
    }

    app.component("mrsPartogramMissingUrinalysis", new Component());

}
