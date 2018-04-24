namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IInfantDialog extends ng.IController {
        closed: () => void;
        saved: (infantId: Object) => void;
        updateResuscitationItems: (infantId: Object) => void;
    }

    class Controller implements IInfantDialog {

        deliveryId: string;
        infantId: string;
        infant = {} as data.IInfant;
        datePickerOpenStatus = {};
        infants: Array<data.IInfant> = [];
        partogram = {} as data.IPartogramInformation;
        disableAlive: boolean = false;
        disableDead: boolean = false;

        public closed: () => void;
        public saved: (infantId: Object) => void;
        public updateResuscitationItems: (infantId: Object) => void;

        static $inject = ["InfantService", "dialogs", "PartogramInformationService", "DateUtils"
        , "SiteSettingService", "InfantResuscitationService"];
        constructor(private infantService: data.IInfantService,
            private dialog: ng.dialogservice.IDialogService,
            private partogramInformationService: data.IPartogramInformationService,
            private dateUtils: utils.IDateUtils,
            private siteSettingService: data.ISiteSettingService,
        private infatntResuscitationService: data.IInfantResuscitationService) {

        }

        outcomeDead = () => {
            let dlg = this.dialog.confirm("Warning!", "This operation cannot be changed. Are you sure you the infant is dead?");

            dlg.result.then((btn) => {
                this.infant.outcome = "DEAD";
                this.disableAlive = true;
            }, (error) => {
            });

        }
        $onInit = () => {
            if (this.deliveryId) {
                this.infantService.get(this.infantId).then((response) => {
                    this.infant = response;
                    console.log("hgfgfhgfhfhjfhj");
                    console.log(".......>>>>>>>>>>>>>>", response);
                    if (this.infant.outcome === "ALIVE") {
                        this.disableDead = true;
                    }
                    if (this.infant.outcome === "DEAD") {
                        this.infant.outcome = "DEAD";
                        this.disableAlive = true;
                    }
                }, (error) => {
                    if ((angular.isDefined(error.status)) && (error.status === 404)) {
                        // not found - initialise variable here
                        if (this.deliveryId) {
                            this.infant.deliveryId = this.deliveryId;

                            this.siteSettingService.currentTime().then((response) => {
                                // this.currentTime = response;
                                let ct = response.currentTime;
                                const myDate = this.dateUtils.convertLocalDateTimeFromServer(ct.toString());
                                this.infant.time = new Date(myDate);
                                this.infant.date = new Date(myDate);
                            });
                        }
                    }
                });
            }
            this.partogramInformationService.getLast(this.deliveryId).then((response) => {
                this.partogram = response;
            });


        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }


        save = () => {
            if (this.partogram.date) {
                let partDate = new Date(this.partogram.date);
                let infantDate = this.dateUtils.convertLocalDateTimeFromServer(this.dateUtils.combineDate(moment(this.infant.date).format("YYYY-MM-DD"), moment(this.infant.time).format("HH:mm:ss")));
                if (infantDate > partDate) {
                    if (this.infantId) {
                        this.onSave(this.infantService.update(this.infant));
                    }
                    else {
                        this.onSave(this.infantService.save(this.infant));
                    }

                } else {
                    let dlg = this.dialog.error("Warning!", "Your date should not be before last observation :" + moment(this.partogram.date).format("YYYY-MM-DD HH:mm:ss"));
                }
            } else {
                if (this.infantId) {
                    this.onSave(this.infantService.update(this.infant));
                }
                else {
                    this.onSave(this.infantService.save(this.infant));
                }
            }

        }

        updateInfatntResuscitation = () => {
            this.updateResuscitationItems({ infantId: this.infantId });
        }

        onSave = (promise: ng.IPromise<data.IInfant>) => {
            promise.then((response) => {
                if (this.saved != null) {
                    this.saved({ infantId: response.personId });
                }
            }, () => {
                // error!

            });
        }

        close = () => {
            this.closed();
        }

        isChecked = (event: any) => {

            if (!event.target.checked) {
                let dlg = this.dialog.confirm("Warning!", "Are you sure you want to delete resuscitation option and its associated data!");
                dlg.result.then((btn) => {
                    this.infant.resuscitation = false;
                    this.infantService.update(this.infant).then((response) => {
                        this.infant = response;
                        console.log(response);
                        this.infatntResuscitationService.removeByInfant(this.infant.id).then((response)=>{
                            console.log("removed ..............");
                        })
                    });
                }, (error) => {
                     this.infant.resuscitation = true;
                });
            } else {
                console.log(event.target.checked);
                this.infant.resuscitation = true;
                this.infantService.update(this.infant).then((response) => {
                    this.infant = response;
                    console.log(response);
                });
            }
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/infant/dialog.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                infantId: "<",
                deliveryId: "<",
                closed: "&",
                saved: "&",
                updateResuscitationItems: "&"
            };

        }
    }

    app.component("mrsInfantDialog", new Component());

}
