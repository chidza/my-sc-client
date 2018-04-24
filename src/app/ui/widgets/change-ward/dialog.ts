namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);

  interface IAdmissionDialog extends ng.IController {
    closed: () => void;
    saved: (admissionId: Object) => void;
  }

  class Controller implements IAdmissionDialog {
    wardCheckListId: string;
    admissionWardCheckListId: string;
    personId: string;
    workspaceId: string;
    workareaId: string;

    reload: number = 0;
    state: boolean;
    admission = {} as data.IAdmissionWard;
    newAdmission = {} as data.IAdmission;
    changeWard = {} as data.IChangeWard;
    wards: Array<data.IWard> = [];
    wardCheckList: Array<data.IWardCheckList> = [];


    datePickerOpenStatus = {};

    public closed: () => void;
    public saved: (admission: Object) => void;

    static $inject = ["WardService", "AdmissionService", "ConsultationService",
      "dialogs", "$uibModal", "WardCheckListService", "AdmissionWardService"];
    constructor(private wardService: data.IWardService,
      private admissionService: data.IAdmissionService,
      private consultationService: data.IConsultationService,
      private dialog: ng.dialogservice.IDialogService,
      private modal: ng.ui.bootstrap.IModalService,
      private wardCheckListService: data.IWardCheckListService,
      private admissionWardService: data.IAdmissionWardService) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();
    }

    init = () => {
      this.newAdmission.time = new Date();
      this.admissionService.current(this.personId).then((response) => {
        console.log(response, "response");
        this.admission = response;

      });

      this.wardService.query().then((wards) => {
        this.wards = wards;
      });

      this.wardCheckListService.query().then((response) => {
        this.wardCheckList = response;
        console.log(response, "response");
      });

    }

    openCalendar = (date: string) => {
      this.datePickerOpenStatus[date] = true;
    }

    close = () => {
      this.closed();
    }

    getWardName = (wardId: string) => {
      let name = "";
      this.wards.forEach((response) => {
        if (response.id === wardId) {
          name = response.name;
        }
      });
      return name;
    }

    save = () => {
      console.log(this.isNewAdmission(), "this.isNewAdmission()")

      let newWard = {
        toWardId: this.newAdmission.wardId,
        personId: this.personId,
        fromWardId: this.admission.wardId
      } as data.IChangeWard;

      this.admissionService.changeWard(newWard).then((response) => {
        console.log(response, "response");
        this.saved({ wardId: response.toWardId });
      }, (error) => {
        console.log(error);
      });

    }
    getCheckListForWard = (wardId: string) => {
      this.state = false;
      this.wardCheckList.forEach((row) => {
        if (row.wardId === wardId) {
          console.log(row);
          this.state = true;
        }
      });
    }


    isNewAdmission = () => {
      return !this.admission.id;
    }

    getWardCheckList = (wardId: string) => {
      /*  this.wardCheckListService.getByWard(wardId).then((response) => {
       }); */
    }

    proceed = () => {

      if (this.isNewAdmission()) {
        //this.onSave(this.admissionService.save(this.admission));
      }
      else {
        // this.onSave(this.admissionService.update(this.admission));
      }

    }

    onSave = (promise: ng.IPromise<data.IAdmission>) => {
      promise.then((admission) => {
        this.dialog.notify("Notification", "Patient successfully changed ward");


      }, (error) => {
      });
    }
  }

  class Component implements ng.IComponentOptions {
    bindings: { [binding: string]: string };
    constructor(
      public templateUrl = "app/ui/widgets/change-ward/dialog.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        workspaceId: "<",
        workareaId: "<",
        closed: "&",
        saved: "&"
      };
    }
  }

  app.component("mrsAdmissionChangeWardDialog", new Component());

}