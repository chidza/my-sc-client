namespace mrs.ui {
    "use strict";

    export interface IController<T> extends ng.IController {
        model: T;
    }

    export interface IListableController<T> extends IController<Array<T>> {
        add(): void;
        edit(item: T): void;
        delete(item: T): void;
        $routerOnActivate(next: any, previous: any): void;
    }

    export interface IEditableController<T> extends IController<T> {
        save(): void;
        close(): void;
        $routerOnActivate(next: any, previous: any): void;
    }

    export abstract class AbstractController implements ng.IController {
        private dialog: ng.dialogservice.IDialogService;

        protected getDialog = (): ng.dialogservice.IDialogService => {
            return this.dialog;
        }

        protected error = (message: string): void => {
            this.dialog.error("Processing Error", message);
        }

        constructor(dialog: ng.dialogservice.IDialogService) {
            this.dialog = dialog;
        }

    }

    export abstract class AbstractModelController<T> extends AbstractController implements IController<T> {

        model: T;

        constructor(dialog: ng.dialogservice.IDialogService) {
            super(dialog);
        }

    }

    export abstract class EditableController<T> extends AbstractModelController<T>
        implements IEditableController<T> {

        constructor(dialog: ng.dialogservice.IDialogService) {
            super(dialog);
        }

        $routerOnActivate = (next: any, previous: any): void => {

            if (!this.isNew()) {

                this.get(next).then((response) => {
                    this.model = response;
                }, (error) => {
                    this.getDialog().error("Error", "Failed to retrive record from server");
                    this.close();
                });

            }
        }

        save = (): void => {
            this.update().then((response) => {
                this.close();
            }, (error) => {
                this.getDialog().error("Error", "Errors occured while trying to persist information");
            });
        }

        protected abstract get = (id: any): ng.IPromise<T> => { return null; }

        protected abstract update = (): ng.IPromise<T> => { return null; }

        public abstract close = (): void => { }

        public abstract isNew = (): boolean => { return null; }

    }

    export abstract class ListableController<T> extends AbstractModelController<Array<T>>
        implements IListableController<T> {

        $router: any;

        constructor(dialog: ng.dialogservice.IDialogService) {
            super(dialog);
        }

        $routerOnActivate = (next: any, previous: any): void => {
            this.fetch().then((response) => {
                this.model = response;
            }, (error) => {
                this.getDialog().error("Deletion Error", "Errors occured retrieving records");
            });
        }

        protected abstract fetch = (): ng.IPromise<Array<T>> => { return null; }

        abstract add = (): void => { }

        abstract edit = (item: T): void => { }

        delete = (item: T): void => {

            let dlg = this.getDialog().confirm("Confirm deletion", "Are you sure you want to delete selection?");

            dlg.result.then((btn) => {
                this.remove(item).then((response) => {
                    this.fetch().then((response) => {
                        this.model = response;
                    });
                }, (error) => {
                    this.getDialog().error("Deletion Error", "Errors occured while deleting selection");
                });
            });

        }

        protected abstract remove = (item: T): ng.IPromise<T> => { return null; }

    }

}