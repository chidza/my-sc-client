namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ICervixGraph extends ng.IController {

    }

    class Controller implements ICervixGraph {

        cervix = {};
        deliveryId: string;
        cervixes: data.ICervixes;
        dateFrom: string;
        dateTo: string;
        activePhase: data.IActivePhase;
        times: Array<any> = [];
        width: number;
        height: number;
        dilatationStatus = {} as data.IDilatationStatus;


        static $inject = ["CervixService", "DeliveryService"];
        constructor(private cervixService: data.ICervixService,
            private deliveryService: data.IDeliveryService) {
        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {
            if (this.deliveryId) {
                this.deliveryService.getActivePhase(this.deliveryId).then((response) => {
                    this.activePhase = response;
                    this.activePhase.times.forEach((r) => {
                        let ts = moment(r).valueOf();
                        this.times.push(ts);
                    });
                    if (response.startTime) {
                        this.dateFrom = response.startTime;
                    }
                    if (response.startTime) {
                        this.dateTo = response.endTime;
                    }
                    if (this.dateFrom) {
                        this.cervixService.getCervixesByDeliveryInActivePhase(this.deliveryId, this.dateFrom, this.dateTo).then((response) => {
                            this.cervixes = response;
                            console.log("cervixes");
                            console.log(this.cervixes);

                            /*  this.deliveryService.checkDilatation(this.deliveryId, 1).then((response) => {
                                  this.dilatationStatus = response;
                                  if (this.dilatationStatus.action === "DANGER" || this.dilatationStatus.transfer === "DANGER" || this.dilatationStatus.alert === "DANGER") {
                                  }
                              });*/


                            this.test();
                        });
                    }

                });

            }
        }

        test = () => {

            this.cervix = {
                chart: {
                    height: this.height,
                    width: this.width,
                    type: "line"
                },

                credits: {
                    "enabled": false
                },
                title: {
                    text: "",
                    align: "left"

                },

                navigation: {
                    buttonOptions: {
                        enabled: false
                    }
                },

                legend: {
                    verticalAlign: "top",
                    align: "center"
                },
                xAxis: {
                    type: "datetime",
                    labels: {
                        format: "{value:%H:%M}",
                        rotation: 45,
                        align: "left"
                    },
                    gridLineWidth: 1,
                    tickPositions: this.times,
                },
                yAxis: {
                    title: {
                        text: "Cervix (cm)"
                    },
                    min: 0,
                    max: 11,
                    tickInterval: 1

                }, zones: [{
                    value: [1496158031000, 6],
                    color: "#f7a35c"
                }, {
                    value: 10,
                    color: "#7cb5ec"
                }, {
                    color: "#90ed7d"
                }],
                series: [{
                    name: "Alert line",
                    data: this.cervixes.alertPoints,
                    color: "green",
                }, {
                    name: "Transfer line",
                    data: this.cervixes.transferPoints,
                    dashStyle: "longdash",
                    color: "#FFA500",
                }, {
                    name: "Action line",
                    data: this.cervixes.actionPoints,
                    color: "#ff0000 ",
                }, {
                    data: this.cervixes.dilatation,
                    color: "black",
                    name: "Dilatation",
                    marker: {
                        enabled: true,
                        symbol: "cross",
                        radius: 10,
                        fillColor: "black",
                        lineWidth: 2,
                        lineColor: "black"
                    },
                    allowPointSelect: true
                }
                    ,
                {
                    name: "Descent of head",
                    data: this.cervixes.descentOfHead,
                    color: "black",
                    marker: {
                        enabled: true,
                        symbol: "circle",
                        radius: 14,
                        fillColor: "white",
                        lineWidth: 2,
                        lineColor: "black",
                        states: {
                            hover: {
                                fillColor: "white",
                                lineWidth: 6
                            }
                        }
                    },
                    allowPointSelect: true
                }],

            };
        }
    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/cervix/cervix-graph.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                width: "<",
                height: "<"
            };

        }
    }

    app.component("mrsCervixGraph", new Component());

}
