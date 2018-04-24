namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonDialog extends ng.IController {
        saved: (id: Object) => void;
        registered: (personId: Object) => void;
        closed: () => void;
        close(): void;
        checkDetails(): void;
        view(person: data.IPerson): void;
    }

    class Controller implements IPersonDialog {

        personId: string;
        personIdentifiers: Array<data.IPersonIdentifier> = [];
        person = {} as data.IPerson;
        public saved: (personId: Object) => void;
        public view: (personId: Object) => void;
        public registered: (personId: Object) => void;
        public closed: () => void;
        educationlevels: Array<data.IEducationLevel> = [];
        occupations: Array<data.IOccupation> = [];
        maritalstates: Array<data.IMaritalState> = [];
        list = [] as Array<data.IPerson>;
        check: boolean;
        months: Array<Object>;
        dob = {} as data.IBirthDate;
        personIdData = {} as data.IPersonId;
        datePickerOpenStatus = {};
        date: string;
        identifier: string;


        static $inject = ["PersonService", "EducationLevelService", "OccupationService", "MaritalStateService",
            "dialogs", "$uibModal", "PersonIdService", "PersonIdentifierService", "SiteSettingService"];
        constructor(private personService: data.IPersonService,
            private educationlevelService: data.IEducationLevelService,
            private occupationService: data.IOccupationService,
            private maritalStateService: data.IMaritalStateService,
            private dialog: ng.dialogservice.IDialogService,
            private modal: ng.ui.bootstrap.IModalService,
            private personIdService: data.IPersonIdService,
            private personIdentifierService: data.IPersonIdentifierService,
            private siteSettingService: data.ISiteSettingService) {

        }
        init = () => {

            this.months = [{ id: 1, name: "January" },
            { id: 2, name: "February" },
            { id: 3, name: "March" },
            { id: 4, name: "April" },
            { id: 5, name: "May" },
            { id: 6, name: "June" },
            { id: 7, name: "July" },
            { id: 8, name: "August" },
            { id: 9, name: "September" },
            { id: 10, name: "October" },
            { id: 11, name: "November" },
            { id: 12, name: "December" }
            ];

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.date) {
                this.dob.year = +this.date.substring(0, 4);
                this.dob.month = +this.date.substring(5, 7);
                this.dob.day = +this.date.substring(8, 10);
                this.init();
            }
        }

        setDate = () => {
            if (this.dob.year > 0 && this.dob.month > 0 && this.dob.day > 0) {
                let date = new Date(moment(this.dob.year + "-" + this.dob.month + "-" + this.dob.day, "YYYY/MM/DD"));
                this.person.birthdate = date;
            }
        }

        getIdentifier = () => {
            if (this.personIdData.typeId && this.personIdentifiers) {
                this.personIdentifiers.forEach((identifier) => {
                    if (identifier.id === this.personIdData.typeId) {
                        this.identifier = identifier.name;
                    }
                });
            }
        }

        $onInit = () => {
            this.maritalStateService.query().then((response) => {
                this.maritalstates = response;
            });

            if (this.personId) {
                this.personService.get(this.personId).then((response) => {
                    this.person = response;
                });
            }
            this.check = false;
            this.siteSettingService.fetch(mrs.config.Settings.SiteSettings.NATIONAL_ID).then((response) => {
                this.personIdData.typeId = response.value;
                this.personIdentifierService.query("").then((response) => {
                    this.personIdentifiers = response;
                    this.getIdentifier();
                });
            });

            this.init();

        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            this.setDate();
            if (this.personId) {
                this.onSave(this.personService.update(this.person));
            }
            else {
                if (this.list.length > 0) {
                    // ask question
                    let dlg = this.dialog.confirm("Patient Registeration", "There is a possible duplicate, Are you sure you want to register the Patient");

                    // if yes proceed{
                    dlg.result.then((btn) => {
                        this.onSave(this.personService.save(this.person));
                    }, (error) => {
                        console.log("rejected ............");
                    });
                    //}
                } else {
                    // process
                    this.onSave(this.personService.save(this.person));
                }

            }
        }

        close = () => {
            this.closed();
        }


        onSave = (promise: ng.IPromise<data.IPerson>) => {
            promise.then((response) => {
                if (this.personIdData.typeId && this.personIdData.number) {
                    this.personIdData.personId = response.id;
                    this.personIdService.save(this.personIdData).then((id) => {
                        this.saved({ personId: response.id });
                    });
                }
                this.saved({ personId: response.id });
            });
        }

        checkDetails = () => {
            this.list = [];
            if (this.personIdData.typeId && this.personIdData.number) {
                this.personService.queryByIdentifier(this.personIdData).then((response) => {
                    this.check = true;
                    let duplicates: Array<data.IPerson> = [];
                    duplicates = response;
                    if (this.person.lastname) {
                        this.personService.query(this.person.lastname).then((response) => {
                            this.list = this.arrayUnique(duplicates.concat(response.content));
                        });
                    }
                });
            } else {
                if (this.person.lastname) {
                    this.personService.query(this.person.lastname).then((response) => {
                        this.check = true;
                        this.list = response.content;
                    });
                }
            }
        }
        arrayUnique = (array: Array<data.IPerson>) => {
            let a = array.concat();
            for (let i = 0; i < a.length; ++i) {
                for (let j = i + 1; j < a.length; ++j) {
                    if (a[i].id === a[j].id)
                        a.splice(j--, 1);
                }
            }

            return a;
        }
        viewDetails = (person: data.IPerson) => {
            this.view({ personId: person.id });
        }

        edit = (personId: string) => {

            let template: string = `
        <div class="modal-header">           
            <h4 class="modal-title">View Person Details</h4>
        </div>
        <div class="modal-body">
          <br/>
          <mrs-person-popup person-id="$resolve.personId" closed="vm.onClose()"></mrs-person-popup>
        </div>
        <p>&nbsp;</p>
        <div class="modal-footer">
        </div>
        `;

            let modalInstance = this.modal.open({
                controller: function () {
                    this.onClose = function () {
                        modalInstance.close();
                    };
                },
                template: template,
                controllerAs: "vm",
                size: "lg",
                backdrop: "static",
                resolve: {
                    personId: personId
                }
            });

        }



    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person/new.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                "saved": "&",
                "closed": "&",
                "view": "&",
                date: "<"
            };

        }
    }

    app.component("mrsPersonNewDialog", new Component());

}
