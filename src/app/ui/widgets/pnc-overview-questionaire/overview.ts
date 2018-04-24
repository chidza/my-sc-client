
namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPncOverviewDialog extends ng.IController {

    }

    class Controller implements IPncOverviewDialog {


        $router: any;
        children: Array<data.IPerson> = [];
        medicationList: Array<data.IEncounterPrescriptionList>;
        vitalList: Array<data.IEncounterVitalList>;
        pnc: data.IPnc;
        admission: data.IAdmission;
        encounterId: string;
        pncId: string;
        personId: string;
        workspaceId: string;
        pncVisitId: string;
        pncVisit: data.IPncVisit;
        childPnc = {} as data.IPnc;

        static $inject = ["PncService", "PncChildService", "AdmissionService", "PncVisitService", "EncounterVitalService", "PrescriptionService", "ConsultationService",];
        constructor(

            private pncService: data.IPncService,
            private pncChildService: data.IPncChildService,
            private admissionService: data.IAdmissionService,
            private pncVisitService: data.IPncVisitService,
            private encounterVitalService: data.IEncounterVitalService,
            private encounterPrescriptionService: data.IPrescriptionService,
            private consultationService: data.IConsultationService

        ) {

        }

        init = () => {

            if (this.pncVisitId) {
                this.pncVisitService.get(this.pncVisitId).then((response) => {
                    console.log("pncVisit");
                    console.log(response);
                    this.pncVisit = response;

                    this.getVitalAndMedication(response.encounterId);
                }, (error: any) => {
                    console.log(error);
                });
            }


            this.admissionService.current(this.personId).then((response) => {

                this.admissionService.get(response.admissionId).then((admission) => {
                    this.admission = admission;
                });

                this.pncService.current(this.personId).then((response) => {
                    this.pnc = response;


                    this.pncId = this.pnc.id;
                    this.pncChildService.getByPncId(this.pncId).then((response) => {
                        this.children = response;
                    });
                });
            });


        }



        getVitalAndMedication = (id: string): void => {

            /* this.encounterVitalService.getByEncounterId(id).then((response) => {
                this.vitalList = response;
            }); */

            this.consultationService.getVitals(this.workspaceId, this.personId).then((response) => {
                this.vitalList = response;
            });

            this.encounterPrescriptionService.getEncounterPrescriptions(id).then((response) => {
                this.medicationList = response;
            });
        }


        childAge = (dob: Date): number => {
            let current = moment(new Date);
            let date = moment(dob);
            return current.diff(date, "days");
        }
        attend = (id: string) => {
            this.pncService.current(id).then((response) => {
                this.$router.navigate(["PncAdmissionChildVisit", { personId: this.personId, id: id }]);
            }, (err) => {

                this.childPnc.date = this.pnc.date;
                this.childPnc.personId = id;
                this.pncService.save(this.childPnc).then((pnc) => {
                    this.$router.navigate(["PncAdmissionChildVisit", { personId: this.personId, id: id }]);
                });

            });
        }
        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }









    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/pnc-overview-questionaire/overview.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                workspaceId: "<",
                pncVisitId: "<"

            };

        }
    }

    app.component("mrsPncOverviewDialog", new Component());

}
