namespace mrs.ui {
  "use strict";
  let app = angular.module(mrs.appName);

  interface IWardCheckListDialog extends ng.IController {
    closed: () => void;
    saved: (admissionWardCheckListId: Object) => void;
  }

  class Controller implements IWardCheckListDialog {
    personId: string;
    workspaceId: string;
    workareaId: string;
    state: boolean;
    wardId: string;
    admissionWardId: string;

    wards: Array<data.IWard> = [];
    wardCheckList: Array<data.IWardCheckList> = [];
    admissionWardCheckList = {} as data.IAdmissionWardCheckList;
    admissionWardCheckListItem: Array<data.IAdmissionWardCheckListItem> = [];
    admissionWardCheckListItemDTO = {} as data.IAdmissionWardCheckListItem;
    wardCheckListId: string;
    wardCheckListItems: Array<data.IWardCheckListItem> = [];
    wardCheckListItemDTO: data.IWardCheckListItem;

    public closed: () => void;
    public saved: (admissionWardCheckListId: Object) => void;

    static $inject = ["WardService", "AdmissionService",
      "dialogs", "$uibModal", "WardCheckListService", "AdmissionWardCheckListService"
      , "WardCheckListItemService", "AdmissionWardCheckListItemService"];
    constructor(private wardService: data.IWardService,
      private admissionService: data.IAdmissionService,
      private dialog: ng.dialogservice.IDialogService,
      private modal: ng.ui.bootstrap.IModalService,
      private wardCheckListService: data.IWardCheckListService,
      private admissionWardCheckListService: data.IAdmissionWardCheckListService,
      private wardCheckListItemService: data.IWardCheckListItemService,
      private admissionWardCheckListItemService: data.IAdmissionWardCheckListItemService) {

    }

    $onInit = () => {
      if (this.wardId) {
        this.wardCheckListService.getByWard(this.wardId).then((response) => {
          this.wardCheckList = response;
        });

        this.admissionService.current(this.personId).then((response) => {
          this.admissionWardId = response.id;
        });
      }
      this.wardService.query().then((wards) => {
        this.wards = wards;
      });

    }

    close = () => {
      this.closed();
    }

    save = (wardId: string) => {
      this.admissionWardCheckList.admissionWardId = this.admissionWardId;
      this.admissionWardCheckList.wardCheckListId = this.wardId;
      console.log(wardId, "wardId");
      this.admissionWardCheckListService.save(this.admissionWardCheckList).then((response) => {
        console.log(this.wardCheckListItems, " this.wardCheckListItems");
        this.admissionWardCheckListItemService.saveMultiple(response.id, this.admissionWardCheckListItem).then((row) => {
          this.saved({ admissionWardCheckListId: response.id, wardCheckListId: response.wardCheckListId });
        });

      });

    }

    getWardCheckListItems = (wardIdCheckListId: string) => {
      this.state = false;
      this.wardCheckListItemService.getByCheckList(wardIdCheckListId).then((response) => {
        this.wardCheckListItems = response;
        this.wardCheckListId = wardIdCheckListId;
        this.wardId = wardIdCheckListId;
        this.state = true;
      });
    }

    addWardCheckListItemDTO = (wardCheckListItemId: string, event: any) => {

      this.admissionWardCheckListItemDTO.admissionWardCheckListId = "";
      this.admissionWardCheckListItemDTO.wardCheckListItemId = wardCheckListItemId;
      if (event.target.checked) {

        this.admissionWardCheckListItem.push(this.admissionWardCheckListItemDTO);
      } else {
        this.admissionWardCheckListItem.splice(this.admissionWardCheckListItem.indexOf(this.admissionWardCheckListItemDTO), 1);
      }

    }

  }

  class Component implements ng.IComponentOptions {
    bindings: { [binding: string]: string };
    constructor(
      public templateUrl = "app/ui/widgets/change-ward/ward-check-list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        personId: "<",
        wardId: "<",
        admissionWardId: "<",
        workspaceId: "<",
        workareaId: "<",
        closed: "&",
        saved: "&"
      };
    }
  }

  app.component("mrsWardCheckListDialog", new Component());

}