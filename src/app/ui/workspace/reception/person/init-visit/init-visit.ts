namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IParams extends ng.ui.IStateParamsService {
        personId: string;
    }

    class Controller implements ng.IController {

        personId: string;
        queues: Array<data.IQueueList> = [];
        currentQueues: Array<data.IQueue> = [];
        queueId: string;
        opd: data.IOpd = {} as data.IOpd;
        admission: data.IAdmission = null;
        diagnoses: Array<data.IEncounterDiagnosisList> = [];

        static $inject = ["QueueService", "OpdService",
            "OpdQueueService", "AdmissionService", "dialogs",
            "PersonDiagnosisService", "$state", "$stateParams"];
        constructor(private queueService: data.IQueueService,
            private opdService: data.IOpdService,
            private opdQueueService: data.IOpdQueueService,
            private admissionService: data.IAdmissionService,
            private dialog: ng.dialogservice.IDialogService,
            private personDiagnosisService: data.IPersonDiagnosisService,
            private state: ng.ui.IStateService,
            params: IParams) {
            this.personId = params.personId;
        }

        $onInit = () => {
            console.log(this.personId);
            this.queueService.getAll({ page: 0, size: 32000 }).then((response) => {
                this.queues = response.content;
            });

            this.opdService.current(this.personId).then((response) => {
                this.opd = response;
            }, () => {
                this.opd.personId = this.personId;
            });

            this.opdQueueService.queues(this.personId).then((response) => {
                this.currentQueues = response;
            });

            this.admissionService.current(this.personId).then((response) => {

                this.admissionService.get(response.admissionId).then((admission) => {
                    this.admission = admission;
                });

            });

            this.personDiagnosisService.getPersonHistory(this.personId, {
                page: 0, size: 32000
            }).then((response) => {
                this.diagnoses = response.content;
            });

        }

        isAdmitted = (): boolean => {
            return this.admission != null;
        }

        save = () => {
            if (this.queueId) {
                if (this.opd.id) {
                    this.onSave(this.opdService.update(this.opd));
                } else {
                    this.onSave(this.opdService.save(this.opd));
                }
            } else {
                this.dialog.error("Queue send off", "No queue selected.");
            }
        }

        onSave = (promise: ng.IPromise<data.IOpd>) => {
            promise.then((response) => {
                this.sendToQueue(this.queueId);
            }, (error) => {
                console.log(error);
            });
        }

        sendToQueue = (queueId: string) => {
            this.opdQueueService.save({ personId: this.personId, queueId: queueId } as data.IOpdQueue).then((response) => {

                this.dialog.notify("Patient Admission", "Patient successfully sent to next Queue")
                    .result.then(() => {
                        this.state.go("reception.management.overview", { personId: this.personId });
                    });

            }, (error) => {
                console.log(error);
            });
        }

        back = () => {
            this.state.go("reception.management.overview", { personId: this.personId });
        }
    }

    class Component implements ng.IComponentOptions {

        constructor(
            public templateUrl = "app/ui/workspace/reception/person/init-visit/init-visit.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsReceptionOpdInit", new Component());

}
