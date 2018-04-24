namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IDeliveryPartogramPreview extends ng.IController {

    }

    class Controller implements IDeliveryPartogramPreview {

        personId: string;
        delivery: data.IDelivery;
        deliveryId: string;
        $router: any;
        start: string;
        personFullName: string;
        admissionId: string;
        essentialBaby = {} as data.IEssentialBabiesCare;
        encounterId: string;
        fetalHeartRateId: string;
        pulseId: string;
        bpId: string;
        temperatureId: string;
        workspaceId: string;

        vitals: Array<data.IEssentialBabiesCareList> = [];
        examinations: Array<data.IEssentialBabiesCareExaminationList> = [];
        investigations: Array<data.IEssentialBabiesCareInvestigationList> = [];
        medications: Array<data.IEssentialBabiesCareMedicationList> = [];
        feedingOptionsPropertyList: Array<data.IEssentialBabiesCareQuestionareList> = [];
        DangerSignsPropertyList: Array<data.IEssentialBabiesCareQuestionareList> = [];
        infant: data.IInfant;





        list: Array<data.IEssentialBabiesCareList> = [];

        static $inject = ["InfantService", "PersonExaminationService", "EssentialBabiesCareService", "PersonService", "$state", "$stateParams", "DeliveryService", "SiteSettingService", "dialogs", "Principal", "UserService"];
        constructor(
            private infantService: data.IInfantService,
            private personExaminationService: data.IPersonExaminationService,
            private essentialBabiesCareService: data.IEssentialBabiesCareService,
            private personService: data.IPersonService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private deliveryService: data.IDeliveryService,
            private siteSettingService: data.ISiteSettingService,
            private dialog: ng.dialogservice.IDialogService,
            private Principal: security.IPrincipal,
            private userService: data.IUserService,


        ) {

            this.deliveryId = params["deliveryId"];
            this.encounterId = params["encounterId"];
            this.personId = params["personId"];
            this.workspaceId = params["workspaceId"];
        }

        onRecord = () => {
            // create an essential babies record and pass the id then go


            this.infantService.getByChildId(this.personId).then((response) => {




                this.essentialBaby.deliveryId = response.deliveryId;

                this.essentialBabiesCareService.createEssentialBabiesCare(this.essentialBaby).then((response) => {

                    this.state.go("consultation.management.essentialCareForBabies.record", { essentialBabyCareId: response.id });
                });

            });


        }

        $onInit = () => {



            this.getDeliveryId();



            this.init();
        }


        getDeliveryId = () => {
            // insert services esb and use essential id from other shells

            this.infantService.getByChildId(this.personId).then((response) => {
                this.infant = response;
                console.log(response);
                this.essentialBabiesCareService.getEssentialBabiesByDeliveryId(response.deliveryId).then((response) => {
                    // response is a list of essential care babies id


                    if (response) {

                        for (let i = 0; i < response.length; i++) {

                            this.essentialBabiesCareService.getessentialBabiesCareVitals(response[i].id).then((res) => {

                                if (res.length > 0) {
                                    for (let t = 0; t < res.length; t++) {

                                        this.vitals.push(res[t]);
                                    }
                                }

                            });
                            this.essentialBabiesCareService.getessentialBabiesCareExaminations(response[i].id).then((res) => {

                                if (res.length > 0) {
                                    for (let t = 0; t < res.length; t++) {

                                        this.examinations.push(res[t]);
                                        //   console.log(this.examinations);


                                    }
                                }

                            });
                            this.essentialBabiesCareService.getessentialBabiesCareInvestigations(response[i].id).then((res) => {

                                if (res.length > 0) {
                                    for (let t = 0; t < res.length; t++) {

                                        this.investigations.push(res[t]);
                                        //    console.log(this.investigations);

                                    }
                                }

                            });
                            this.essentialBabiesCareService.getessentialBabiesCareMedications(response[i].id).then((res) => {

                                if (res.length > 0) {
                                    for (let t = 0; t < res.length; t++) {

                                        this.medications.push(res[t]);
                                        //   console.log(this.medications);

                                    }
                                }

                            });


                            this.essentialBabiesCareService.getessentialBabiesCareFeedingOptions(response[i].id).then((res) => {
                                console.log("response[i].id");
                                console.log(response[i].id);
                                if (res.length > 0) {
                                    for (let t = 0; t < res.length; t++) {
                                        this.feedingOptionsPropertyList.push(res[t]);
                                        /*   this.medications.push(res[t]); */
                                        /* console.log("this.dangerSignsPropertyList ======>>>>>> check the danger signs now");
                                        console.log(this.feedingOptionsPropertyList); */

                                    }
                                }

                            });

                            this.essentialBabiesCareService.getessentialBabiesCareDangerSigns(response[i].id).then((res) => {
                                console.log("response[i].id");
                                console.log(response[i].id);
                                if (res.length > 0) {
                                    for (let t = 0; t < res.length; t++) {

                                        res[t].name.replace("?", " ");

                                        this.DangerSignsPropertyList.push(res[t]);
                                        /*   this.medications.push(res[t]); */
                                        console.log("this.dangerSignsPropertyList ======>>>>>> check the danger signs now");
                                        console.log(this.DangerSignsPropertyList);

                                    }
                                }

                            });

                        }



                    }

                });
            });


        }
        getTime = (date: Date): string => {


            let times = date.toString().split("T");



            return times[0].substring(0, 9) + " " + times[1].substring(0, 5);
        }

        getName = (id: string, type: string): string => {
            let result: string;

            switch (type) {
                case "Medications":

                    /*   if (this.categoryQuestions) {
                          this.categoryQuestions.forEach((question) => {
                            if (question.id === id) {
                              result = question.name;
                            }
                          });
                        } */



                    break;

                case "Investigations":


                    /*   if (this.categoryQuestions) {
                          this.categoryQuestions.forEach((question) => {
                            if (question.id === id) {
                              result = question.name;
                            }
                          });
                        } */


                    break;

                case "Examinations":

                    /* 
                      if (this.categoryQuestions) {
                          this.categoryQuestions.forEach((question) => {
                            if (question.id === id) {
                              result = question.name;
                            }
                          });
                        } */

                    break;

                default:

                    console.log("no type");

                    break;
            }





            return result;
        }




        init = () => {

            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.FOETAL_HEART_RATE_ID).then((response) => {
                this.fetalHeartRateId = response.value;

            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.PULSE_ID).then((response) => {
                this.pulseId = response.value;

            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.TEMPERATURE_ID).then((response) => {
                this.temperatureId = response.value;

            });
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.BP_ID).then((response) => {
                this.bpId = response.value;

            });
        }


    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/essential-care-for-babies-preview-panel/preview.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                encounterId: "<",
                essentialBabiesCareId: "<",
                personId: "<",
                vitalId: "<",
                date: "@",
            };
        }
    }

    app.component("mrsEssentialCareForBabiesPreviewPanelPreview", new Component());

}