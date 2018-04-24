namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IPersonComplaintDialog extends ng.IController {
        closed: () => void;
        saved: (id: Object) => void;
    }

    class Controller implements IPersonComplaintDialog {

        personComplaint = {} as data.IPersonComplaint;
        datePickerOpenStatus = {};
        complaint: data.IComplaint;

        personComplaintId: string;
        complaintId: string;
        personId: string;

        public saved: (id: Object) => void;
        public closed: () => void;

        static $inject = ["PersonComplaintService", "ComplaintService", "dialogs"];
        constructor(private personComplaintService: data.IPersonComplaintService,
            private complaintService: data.IComplaintService,
            private dialog: ng.dialogservice.IDialogService) {

        }

        $onInit = (): void => {

            this.personComplaintService.get(this.personComplaintId).then((response) => {
                this.personComplaint = response;

                this.getComplaintDescription(this.personComplaint.complaintId);

            }, (error) => {
                this.personComplaint = {
                    complaintId: this.complaintId,
                    date: new Date(),
                    duration: 0,
                    personId: this.personId,
                    present: false,
                    note: "",
                } as data.IPersonComplaint;

                this.getComplaintDescription(this.personComplaint.complaintId);

            });

        }

        getComplaintDescription = (id: string): void => {
            this.complaintService.get(id).then((response) => this.complaint = response);
        }

        openCalendar = (date: string) => {
            this.datePickerOpenStatus[date] = true;
        }

        save = () => {
            if (this.personComplaint.id) {
                this.onSave(this.personComplaintService.update(this.personComplaint));
            } else {
                this.onSave(this.personComplaintService.save(this.personComplaint));
            }
        }

        onSave = (promise: ng.IPromise<data.IPersonComplaint>) => {
            promise.then((response) => {
                this.saved({ id: response.id });
            }, () => {
                this.dialog.error("Error", "Historical complaint could not be save at this time. Please try again");
            });
        }

        close = () => {
            this.closed();
        }

    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/person-complaint/person-complaint.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                complaintId: "<",
                personId: "<",
                personComplaintId: "<",
                saved: "&",
                closed: "&"
            };

        }
    }

    app.component("mrsPersonComplaintDialog", new Component());

}
