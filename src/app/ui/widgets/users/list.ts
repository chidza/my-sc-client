namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);


    class Controller implements ng.IController {

        $router: any;
        users: Array<data.IUser> = [];

        public add: () => void;
        public edit: (login: Object) => void;

        static $inject = ["UserService", "dialogs", "$uibModal"];
        constructor(private userService: data.IUserService,
            private dialog: ng.dialogservice.IDialogService,
            private modal: ng.ui.bootstrap.IModalService) {
        }

        $onInit = () => {
            this.userService.query().then((response) => {
                this.users = response;
            });
        }

        onAdd = () => {
            this.onEdit({} as data.IUser);
        }

        onEdit = (user: data.IUser) => {

            let dlg = this.modal.open(
                {
                    template: `<mrs-user-dialog saved="vm.saved(login)" closed="vm.closed()" login="vm.login"><mrs-user-dialog>`,
                    controller: ["data", function (data: any) {
                        let vm = this;

                        vm.login = data.login;

                        vm.saved = function (login: string) {
                            dlg.dismiss({ login: login });
                        }

                        vm.closed = function () {
                            dlg.close();
                        }

                    }]
                    , controllerAs: "vm",
                    resolve: {
                        data: {
                            login: user.login
                        }
                    }
                }
            );

            dlg.result.then(() => {
                // ignore - user cancelled
            }, (login) => {

                this.userService.query().then((response) => {
                    this.users = response;
                });

            });

        }

        delete = (user: data.IUser) => {

            let dlg = this.dialog.confirm("User Management", "Are you sure you want to delete user?");

            dlg.result.then(() => {
                this.userService.remove(user.login).then((response) => {
                    let index = this.users.indexOf(user);
                    this.users.slice(index, 1);
                }, () => {
                    this.dialog.error("User Management", "Unable to delete user from server");
                });
            });
        }

        setActive = (user: data.IUser, active: boolean) => {
            user.activated = active;
            this.userService.update(user);
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/users/list.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                add: "&",
                edit: "&"
            };

        }
    }

    app.component("mrsUserList", new Component());

}