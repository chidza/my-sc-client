namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonPartogramVitalDialog extends ng.IController {
        closed: () => void;
        saved: (personVitalId: Object) => void;
    }

    class Controller implements IPersonPartogramVitalDialog {

        personVital = {} as data.IPersonVital;
        personVitalListElement = {} as data.IEncounterVitalList;
        personVitalList: Array<data.IPersonVital> = [];
        quarterHourlyVitals: Array<data.IQuarterHourlyList> = [];
        bpId: string;
        datePickerOpenStatus = {};
        personId: string;
        vitalId: string;
        encounterId: string;
        deliveryId: string;
        vitalName: string;
        quarterHourlyId: string;
        personVitalId: string;
        vital = {} as data.IVital;
        quarterHourly = {} as data.IQuarterHourly;
        unit: data.IUnit;
        date: string;
        systolic: number;
        diastolic: number;
        message: string;
        personVitalValue: number;
        public closed: () => void;
        public saved: (personVitalId: Object) => void;

        static $inject = ["$state", "QuarterHourlyService", "SiteSettingService", "PersonVitalService", "VitalService", "UnitService", "EncounterVitalService"];
        constructor(
            private state: ng.ui.IStateService,
            private quarterHourlyService: data.IQuarterHourlyService,
            private siteSettingService: data.ISiteSettingService,
            private personVitalService: data.IPersonVitalService,
            private vitalService: data.IVitalService,
            private unitService: data.IUnitService,
            private encounterVitalService: data.IEncounterVitalService) {
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.BP_ID).then((response) => {
                this.bpId = response.value;
            });

            // get vital data first

            if (this.vitalId) {
                this.vitalService.get(this.vitalId).then((response) => {
                    this.vital = response;
                    this.unitService.get(this.vital.unitId).then((response) => {
                        this.unit = response;
                    });
                });

                this.quarterHourlyService.getQuarterHourlyVitals(this.quarterHourlyId).then((response) => {
                    this.quarterHourlyVitals = response;
                    response.forEach((vital) => {
                        if (vital.vital === this.vital.name) {
                            this.personVitalService.get(vital.personVitalId).then((response) => {
                                this.personVital = response;
                                if (vital.vital === "BP") {
                                    this.getBpVitalConfig();
                                }
                            });

                        }
                    });
                });

                // get bp data 


                // get person vitals for this quarter hourly filter by user filter by quarterhourly id
                this.quarterHourlyService.getQuarterHourlyVitals(this.quarterHourlyId).then((response) => {
                    console.log(this.personVital);
                    if (response[0].vital === this.bpId) {
                        this.systolic = parseInt(this.personVital.value.split("/")[0]);
                        this.diastolic = parseInt(this.personVital.value.split("/")[1]);
                    }

                }, (error) => {
                    this.personVital.date = new Date(moment(this.date));
                    this.personVital.personId = this.personId;
                    this.personVital.vitalId = this.vitalId;
                });

            }

        }



        getVitals = (id: string) => {
            this.quarterHourlyService.get(id).then((response) => {
                this.quarterHourly = response;
            });
        }

        getBpVitalConfig = () => {
            console.log("bp config called");
            if (this.personVital.value) {
                this.systolic = parseInt(this.personVital.value.split("/")[0]);
                this.diastolic = parseInt(this.personVital.value.split("/")[1]);

                if (this.vital.name) {
                    // define for systolic

                    if (this.diastolic) {
                        let diastolic = this.diastolic;
                        if (diastolic > this.vital.maximum) {
                            this.message = "diastolic value is above normal";

                        }
                        else if (diastolic < this.vital.minimum) {
                            this.message = "diastolic value is below normal";
                        }
                        return this.message;
                    }
                    else if (this.systolic) {
                        let systolic = this.systolic;
                        if (systolic > this.vital.maximum) {
                            this.message = "systolic value is above normal";
                        }
                        else if (systolic < this.vital.minimum) {
                            this.message = "systolic value is below normal";
                        }
                        return this.message;
                    }
                }
            }



        }

        validateVital = () => {
            let msg = "";


            if (this.vital.name) {

                let personVital = parseInt(this.personVital.value);
                if (personVital > this.vital.maximum) {
                    msg = "The value is above normal";

                }
                else if (personVital < this.vital.minimum) {
                    msg = "The value is below normal";
                }
                return msg;

            }


        }

        validateVitalBpDiastolic = (): string => {
            let msg = "";

            if (this.vital.name) {
                // define for systolic
                if (this.diastolic) {
                    let diastolic = this.diastolic;
                    if (diastolic > this.vital.maximum) {
                        msg = "The value is above normal";

                    }
                    else if (diastolic < this.vital.minimum) {
                        msg = "The value is below normal";
                    }
                    return msg;
                }
            }

        }

        validateVitalBpSystolic = (): string => {
            let msg = "";

            if (this.vital.name) {
                // define for systolic
                if (this.systolic) {
                    let systolic = this.systolic;
                    if (systolic > this.vital.maximum) {
                        msg = "The value is above normal";
                    }
                    else if (systolic < this.vital.minimum) {
                        msg = "The value is below normal";
                    }
                    return msg;
                }
            }
        }

        saveBp = () => {
            if (this.personVital.id) {
                if ((this.systolic) && (this.diastolic)) {
                    this.personVital.value = (this.systolic) + "/" + (this.diastolic);
                    this.personVitalService.update(this.personVital).then((response) => {
                        console.log(response);
                    });
                }
            }
            else {
                if (this.systolic && this.diastolic) {
                    this.personVital.vitalId = this.vitalId;
                    this.personVital.personId = this.personId;
                    this.personVital.value = (this.systolic) + "/" + (this.diastolic);
                    this.encounterVitalService.saveEncounterVital(this.encounterId, this.personVital).then((response) => {
                        this.personVital.id = response.personVitalId;
                        this.saveQuaterLyHourlyVital(this.quarterHourlyId, response.personVitalId);
                    });
                }
            }
        }



        saveQuaterLyHourlyVital = (id: string, personVitalId: string) => {
            console.log(id, "id>>>>>>>>>>>>>>>>>>>>>>");
            console.log(personVitalId, "personVitalId >>>>>>>>>>>>>>>>>>>>>>");
            this.quarterHourlyService.saveQuarterHourlyVitals(id, personVitalId).then((response) => {
                console.log("response =====>>>> save new");
                console.log(response);
            });
        }



        save = (personVital: data.IPersonVital) => {

            console.log(personVital, "personVital");
            console.log(personVital.id);
            if (personVital.id) {
                this.personVitalService.update(personVital).then((response) => {
                    console.log("updated");
                    // this.saveQuaterLyHourlyVital(this.quarterHourlyId, response.id);
                });
            }
            else {
                if (this.encounterId) {
                    this.personVital.date = new Date(moment(this.date));
                    this.personVital.personId = this.personId;
                    this.personVital.vitalId = this.vitalId;

                    this.encounterVitalService.saveEncounterVital(this.encounterId, this.personVital).then((response) => {
                        this.personVital.id = response.personVitalId;
                        this.saveQuaterLyHourlyVital(this.quarterHourlyId, response.personVitalId);

                    });
                }
            }
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/quarter-hourly-observations/vitals/edit.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                encounterId: "<",
                deliveryId: "<",
                quarterHourlyId: "<",
                personId: "<",
                vitalId: "<",
                date: "<",
            };

        }
    }
    app.component("mrsQuarterHourlyVitalDialogEdit", new Component());

}
