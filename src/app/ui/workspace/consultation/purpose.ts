namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    class Controller implements ng.IController {

        personId: string;
        encounters: Array<data.IEncounter> = [];
        departments: Array<data.IDepartment> = [];
        users: Array<data.IUser> = [];
        admission: data.IAdmission = null;
        person: data.IPerson = null;
        workspaceId: string;
        workareaId: string;

        static $inject = ["InfantService", "$state", "$stateParams", "Principal", "AdmissionService",
            "PersonService", "ConsultationService", "DeliveryService", "OpdService",
            "dialogs", "ArtService", "DepartmentService", "UserService"];
        constructor(


            private infantService: data.IInfantService,
            private state: ng.ui.IStateService,
            private params: ng.ui.IStateParamsService,
            private Principal: security.IPrincipal,
            private admissionService: data.IAdmissionService,
            private personService: data.IPersonService,
            private consultationService: data.IConsultationService,
            private deliveryService: data.IDeliveryService,
            private opdService: data.IOpdService,
            private dialog: ng.dialogservice.IDialogService,
            private artService: data.IArtService,
            private departmentService: data.IDepartmentService,
            private userSevice: data.IUserService) {
            this.workspaceId = params["workspaceId"];
            this.workareaId = params["workareaId"];
            this.personId = params["personId"];
        }

        $onInit = () => {

            this.Principal.identity().then((response) => {
                // deliberately left blank for initialising user object for roles and authorities
            });

            this.departmentService.query().then((response) => {
                this.departments = response.content;
            });


            if (this.personId) {

                this.personService.get(this.personId).then((person) => {
                    this.person = person;
                    console.log(person.id, "person.id");
                    this.opdService.current(person.id).then((opd) => {

                        this.opdService.encounters(opd.id).then((encounters) => {
                            console.log(encounters, "person.id");
                            encounters.forEach((row) => {
                                this.userSevice.get(row.createdBy).then((user) => {
                                    this.users.push(user);
                                });
                            });

                            this.encounters.push.apply(this.encounters, encounters);
                        });
                    });

                    this.admissionService.current(person.id).then((response) => {

                        this.admissionService.get(response.admissionId).then((admission) => {
                            this.admission = admission;
                        });

                        this.opdService.encounters(response.admissionId).then((encounters) => {
                            this.encounters.push.apply(this.encounters, encounters);
                        });

                    });

                });


            }

        }

        go = (state: string) => {
            this.consultationService.generalEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                this.state.go(state, { workareaId: this.workareaId, personId: this.personId, encounterId: response.id });
            });
        }

        hts = () => {
            let state = "consultation.management.hts.overview";
            let dlg = this.dialog.confirm("HTS Module", "Do you want to proceed to HTS Module?");
            dlg.result.then((btn) => {
                this.consultationService.htsEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                    this.state.go(state, {
                        workareaId: this.workareaId, personId: this.personId,
                        encounterId: response.encounterId, htsId: response.htsId //, lastVisited: "none"
                    });
                });
            });


        }

        delivery = () => {

            let state = "consultation.management.delivery.overview";

            this.deliveryService.current(this.personId).then((response) => {
                this.go(state);
            }, (error) => {

                if ((angular.isDefined(error.status)) && (error.status === 404)) {
                    // not found
                    let dlg = this.dialog.confirm("Confirm", "Patient has no delivery record. Do you wish to create it?");

                    dlg.result.then(() => {

                        let delivery = { personId: this.personId, admissionId: this.admission.id } as data.IDelivery;

                        this.deliveryService.save(delivery).then((response) => {
                            this.go(state);
                        }, (error) => {
                            this.dialog.error("Error", "Unable to retrieve delivery record for patient");
                        });

                    });

                } else {
                    this.dialog.error("Error", "Unable to retrieve delivery record for patient");
                }
            });

        }

        essentialBabiesCare = () => {
            console.log("i have been clicked");
            let state = "consultation.management.essentialCareForBabies.overview";

            this.infantService.getByChildId(this.personId).then((response) => {
                console.log(" child details response =====>>>> ");
                console.log(response);
                this.go(state);


            }
                , (error) => {
                    this.dialog.error("Error", "Unable to retrieve infant record for patient");
                })

                ;


        }


        partogram = () => {

            let state = "consultation.management.partogram.overview";

            this.deliveryService.current(this.personId).then((delivery) => {

                this.consultationService.generalEncounter(this.workspaceId, this.workareaId, this.personId).then((response) => {
                    this.state.go(state, { workareaId: this.workareaId, personId: this.personId, encounterId: response.id, deliveryId: delivery.id });
                });

            }, (error) => {

                if ((angular.isDefined(error.status)) && (error.status === 404)) {
                    // not found
                    let dlg = this.dialog.error("Process Error", "Patient currently has no delivery record. Invalid action");



                } else {
                    this.dialog.error("Error", "Unable to retrieve delivery record for patient");
                }
            });

        }

        getDepartmentName = (id: string): string => {
            let dptName = "";
            if (id != null) {
                this.departments.forEach((row) => {
                    if (id === row.id) {
                        dptName = row.name;
                    }
                });
                return dptName;
            }
        }

        getUserName = (id: string): string => {
            let userName = "";
            if (this.users) {
                this.users.forEach((row) => {
                    if (id === row.login) {
                        console.log(row);
                        userName = row.lastName;
                    }
                });
                return userName;
            }
        }

        isAdmitted = (): boolean => {
            if (this.admission != null) {
                return this.admission.id.length > 0;
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

        constructor(
            public templateUrl = "app/ui/workspace/consultation/purpose.html",
            public controllerAs = "vm",
            public controller = Controller) { }

    }

    app.component("mrsConsultationPatientPurposeLayout", new Component());

}
