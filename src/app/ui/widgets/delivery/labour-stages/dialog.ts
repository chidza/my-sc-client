namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStageDialog extends ng.IController {
        closed: () => void;
        saved: (stageId: Object) => void;
    }


    class Controller implements IStageDialog {

        stageId: string;
        deliveryId: string;
        stageNumberId: string;
        stage = {} as data.IStage;
        datePickerOpenStatus = {};
        stageNumbers: Array<data.IStageNumber> = [];

        public closed: () => void;
        public saved: (stageId: Object) => void;

        static $inject = ["StageService", "StageNumberService"];
        constructor(private stageService: data.IStageService,
            private stageNumberService: data.IStageNumberService) {

        }


        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId) {
                this.stageNumberService.query().then((response) => {
                    this.stageNumbers = response;
                }, (error) => {
                    console.log(error);
                });

                this.stageService.get(this.stageId).then((response) => {
                    this.stage = response;
                }, (error) => {
                    console.log(error);
                    if ((angular.isDefined(error.status)) && (error.status === 404)) {
                        // not found - initialise variable here
                        this.stage.deliveryId = this.deliveryId;
                        this.stage.startDate = new Date();
                        this.stage.startTime = new Date();
                        this.stage.endDate = new Date();
                        this.stage.endTime = new Date();


                    } else {
                        // serious error!
                    }
                });

            }

        }
        openCalendar = (date: any) => {
            if (date) {
                this.datePickerOpenStatus[date] = true;
            }
        }


        save = () => {
            if (this.stage.id !== "" ) {
                this.onSave(this.stageService.update(this.stage));
            }
            else {
                this.onSave(this.stageService.save(this.stage));
            }
        }


        onSave = (promise: ng.IPromise<data.IStage>) => {
            promise.then((response) => {
                if (this.saved != null) {
                    this.saved({ stageId: response.id });
                }
            }, () => {
                // error!
            });
        }

        close = () => {
            this.closed();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/labour-stages/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                stageId: "<",
                deliveryId: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsStageDialog", new Component());

}
