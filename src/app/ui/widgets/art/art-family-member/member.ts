namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IArtFamilyMemberDialog extends ng.IController {
        addMember: () => void;
    }

    class Controller implements IArtFamilyMemberDialog {
        public addMember: () => void;
        personId: string;
        person: data.IPerson;
        occupations: Array<data.IOccupation> = [];
        educationLevels: Array<data.IEducationLevel> = [];
        members: Array<data.IArtFamilyMember> = [];
        static $inject = ["PersonService", "RelationService", "OccupationService", "EducationLevelService", "ArtService", "dialogs"];
        constructor(private personService: data.IPersonService,
            private relationService: data.IRelationService,
            private occupationService: data.IOccupationService,
            private educationlevelService: data.IEducationLevelService,
            private artService: data.IArtService,
            private dialog: ng.dialogservice.IDialogService) { }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            this.init();
        }

        $onInit = () => {
            this.occupationService.query().then((response) => {
                this.occupations = response;
            });
            this.educationlevelService.query().then((response) => {
                this.educationLevels = response;
            });
        }

        init = () => {
            if (this.personId) {
                this.personService.get(this.personId).then((response) => {
                    this.person = response;
                });
                this.artService.getFamilyMembers(this.personId).then((response) => {
                    this.members = response;
                });

            }
        }

        save = () => {
            this.personService.update(this.person).then((response) => {
                this.person = response;
            });
        }

        remove = (id: string) => {
            console.log("id");
            console.log(id);
            let dlg = this.dialog.confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.relationService.remove(id).then((response) => {
                    this.init();
                });
            }, (error) => {

            });
        }

        add = () => {
            this.addMember();
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/art/art-family-member/member.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                addMember: "&",
                personId: "<"
            };

        }
    }

    app.component("mrsArtFamilyMemberDialog", new Component());

}
