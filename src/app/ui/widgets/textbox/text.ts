namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonVital extends ng.IController {

    }

    class Controller implements IPersonVital {

        personVital: data.IPersonVital;
        vitalId: string;
        personId: string;
        vital: data.IVital;
        personVitalId: string;
        personVitalValue: number;

        static $inject = ["PersonVitalService", "VitalService"];
        constructor(private personVitalService: data.IPersonVitalService,
            private vitalService: data.IVitalService) {

        }

        $onInit = () => {
            this.personVitalService.get(this.personVitalId).then((response) => {
                this.personVital = response;
                console.log(response);
            }, (error) => {
                console.log(error);
            });

        }
        save = () => {
            this.personVitalService.update(this.personVital).then((response) => {
                this.personVital = response;
        
                console.log("saving....")
                console.log(response)

            });


        }


    }


    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/textbox/text.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personVitalId: "<"


            };

        }
    }

    app.component("mrsTextBoxDialog", new Component());

}
