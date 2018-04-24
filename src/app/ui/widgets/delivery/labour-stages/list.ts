namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IStageList extends ng.IController {
        editStage: (stageId: Object) => void;
        addStage: () => void;
    }

    class Controller implements IStageList {
        public editStage: (stageId: Object) => void;
        public addStage: () => void;
        deliveryId: string;
        stages: data.ILabourStage;
        stageNumbers: Array<data.IStageNumber> = [];
        stage1Start: any;
        stage2Start: any;
        stage3Start: any;
        stage3End: any;

        static $inject = ["DeliveryService", "dialogs"];
        constructor(private deliveryService: data.IDeliveryService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        init = () => {
            if (this.deliveryId) {
                this.deliveryService.getLabourStages(this.deliveryId).then((response) => {
                    this.stages = response;
                    this.stage1Start = moment(this.stages.stage1StartDate + " " + this.stages.stage1StartTime);
                    this.stage2Start = moment(this.stages.stage2StartDate + " " + this.stages.stage2StartTime);
                    this.stage3Start = moment(this.stages.stage3StartDate + " " + this.stages.stage3StartTime);
                    this.stage3End = moment(this.stages.stage3EndDate + " " + this.stages.stage3EndTime);

                });
            }
        }

        getDuration = (stage: number): string => {
            let duration: string = "";
            if (stage === 1) {
                if (this.stage1Start && this.stage2Start) {
                    duration = moment.utc(this.stage2Start.diff(this.stage1Start)).format("HH:mm:ss");
                }
            }

            if (stage === 2) {
                if (this.stage2Start && this.stage3Start) {
                    duration = moment.utc(this.stage3Start.diff(this.stage2Start)).format("HH:mm:ss");
                }
            }

            if (stage === 3) {
                if (this.stage3Start && this.stage3End) {
                    duration = moment.utc(this.stage3End.diff(this.stage3Start)).format("HH:mm:ss");
                }
            }

            if (stage === 0) {
                if (this.stage1Start && this.stage3End) {
                    duration = moment.utc(this.stage3End.diff(this.stage1Start)).format("HH:mm:ss");
                }
            }
            if (duration !== "Invalid date") {
                return +duration.substring(0, 2) + "hrs" + " and " + +duration.substring(3, 5) + " mins";
            } else {
                return "";
            }

        }

        edit = (item: data.IStage) => {
            this.editStage({ stageId: item.id });
        }

        remove = (item: data.IStage) => {
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                /*this.stageService.remove(item.id).then((response) => {
                    this.init();
                });*/
            }, (error) => {

            });
        }

        add = () => {
            this.addStage();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = " app/ui/widgets/delivery/labour-stages/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                editStage: "&",
                addStage: "&",
                deliveryId: "<"
            };

        }
    }

    app.component("mrsStageList", new Component());

}
