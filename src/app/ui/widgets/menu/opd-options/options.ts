namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IEncounterPurposeOption extends ng.IController {
        vitals: () => void;
        general: () => void;
        medication: () => void;
        hts: () => void;
        anc: () => void;
        pnc: () => void;
        tb: () => void;
        malaria: () => void;
        sti: () => void;
        chronic: () => void;
        art: () => void;
        imnci: () => void;
        fp: () => void;
        delivery: () => void;
        close: () => void;
    }

    class Controller implements IEncounterPurposeOption {
        public vitals: () => void;
        public general: () => void;
        public medication: () => void;
        public hts: () => void;
        public anc: () => void;
        public pnc: () => void;
        public tb: () => void;
        public malaria: () => void;
        public sti: () => void;
        public chronic: () => void;
        public art: () => void;
        public imnci: () => void;
        public fp: () => void;
        public delivery: () => void;
        public close: () => void;

        personId: string;
        admission: data.IAdmission = null;
        person: data.IPerson = null;

        static $inject = ["Principal", "AdmissionService", "PersonService"];
        constructor(private Principal: security.IPrincipal,
            private admissionService: data.IAdmissionService,
            private personService: data.IPersonService) {

        }

        $onInit = () => {
            this.Principal.identity().then((response) => {

            });

            if (this.personId) {

                this.personService.get(this.personId).then((response) => {
                    this.person = response;
                });

                this.admissionService.current(this.personId).then((response) => {

                    this.admissionService.get(response.admissionId).then((admission) => {
                        this.admission = admission;
                    });

                });

            }

        }

        isAdmitted = (): boolean => {
            if (this.admission != null) {
                return this.admission.id !== "";
            } else {
                return false;
            }
        }

        isNurseOrDoctor = (): boolean => {
            return this.Principal.hasAnyAuthority(["ROLE_NURSE", "ROLE_DOCTOR"]);
        }

        isFemale = (): boolean => {
            if (this.person != null) {
                return this.person.sex === "FEMALE";
            } else {
                return false;
            }
        }

        isUnknown = (): boolean => {
            if (this.person != null) {
                return this.person.sex === "UNKNOWN";
            } else {
                return true;
            }
        }

        isInfant = (): boolean => {
            return this.personService.age(this.person) <= 5;
        }

        isPharmacists = (): boolean => {
            return this.Principal.hasAnyAuthority(["ROLE_PHARMACIST"]);
        }

        isPharmTech = (): boolean => {
            return this.Principal.hasAnyAuthority(["ROLE_PHARM_TECH"]);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/menu/opd-options/options.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                personId: "<",
                vitals: "&",
                general: "&",
                medication: "&",
                hts: "&",
                anc: "&",
                pnc: "&",
                tb: "&",
                malaria: "&",
                sti: "&",
                chronic: "&",
                art: "&",
                imnci: "&",
                fp: "&",
                delivery: "&",
                close: "&"
            };

        }

    }

    app.component("mrsEncounterPurposeOption", new Component());

}
