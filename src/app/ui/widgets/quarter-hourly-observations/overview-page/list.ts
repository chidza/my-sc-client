namespace mrs.ui {
  "use strict";

  let app = angular.module(mrs.appName);

  interface IPartogramInformationList extends ng.IController {
    selected: (id: Object) => void;
    viewed: (id: Object) => void;
    addVital: () => void;
  }

  class Controller implements IPartogramInformationList {

    deliveryId: string;
    date: string;
    endTime: any;
    status: boolean;
    partogramInformationList = {} as Array<data.IPartogramInformation>;
    loggedOnUserId: string;
    userList = {} as Array<data.IUser>;
    currentDate: string;
    quarterHourlyVitals: Array<data.IQuarterHourlyList> = [];
    quarterHourlyForDelivery: Array<data.IQuarterHourlyForDelivery> = [];
    quarterHourlyId: string;



    public selected: (id: Object) => void;
    public viewed: (id: Object) => void;
    public addVital: () => void;

    static $inject = ["QuarterHourlyService", "UserService", "Principal", "SiteSettingService"];
    constructor(private quarterHourlyService: data.IQuarterHourlyService,
      private userService: data.IUserService,
      private Principal: security.IPrincipal,
      private siteSettingService: data.ISiteSettingService) {

    }

    $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
      this.init();



    }

    getListOfQuarterHourLyVitals = (id: string) => {
      console.log("id");
      console.log(id);
      // use for each loop
      // array of all vitals to loop through for that particular delivery


      // get id and use service get vitals

      this.quarterHourlyService.getQuarterHourlyVitals(id).then((response) => {
        this.quarterHourlyVitals = response;

      });



    }

    init = () => {
      this.siteSettingService.currentTime().then((response) => {
        this.endTime = moment(response.currentTime);
      });
      if (this.deliveryId) {
        this.quarterHourlyService.getQuarterHourlyForDelivery(this.deliveryId).then((response) => {
          this.quarterHourlyForDelivery = response;


          // this gets you a list of quarter of quarter hourly id's thru an array

       //   this.getListOfQuarterHourLyVitals("d0db079d-04af-4109-ad73-7798c43b8369");
          // if you have an array of id's 


        }, (error) => {
          console.log(error);
        });
      }
      this.Principal.identity().then((response) => {
        this.userService.get(response.login).then((response) => {
          this.loggedOnUserId = response.login;
        });

      });
    }

    select = (item: data.IPartogramInformation) => {
      this.selected({ id: item.id });
    }

    view = (item: data.IQuarterHourlyForDelivery) => {
      this.viewed({ id: item.id });
    }

    add = () => {
      this.addVital();
    }


    subTime = (model: data.IPartogramInformation): boolean => {
      let date: string;
      date = model.date;
      let startTime = moment(date, "YYYY-MM-DDTHH:mm:ss");
      let duration = this.endTime.diff(startTime, "minutes");
      if (duration < 30) {
        this.status = false;
        if (this.loggedOnUserId === model.userId) {
          this.status = false;
        } else {
          this.status = true;
        }
      } else {
        this.status = true;
      }
      return this.status;
    }

    checkUser = (recordCreaterUserId: string) => {


    }
  }

  class Component implements ng.IComponentOptions {

    bindings: { [binding: string]: string };

    constructor(
      public templateUrl = "app/ui/widgets/quarter-hourly-observations/overview-page/list.html",
      public controllerAs = "vm",
      public controller = Controller) {
      this.bindings = {
        selected: "&",
        viewed: "&",
        addVital: "&",
        deliveryId: "<"
      };

    }
  }

  app.component("mrsUsersQuarterHourlyVitalList", new Component());

}