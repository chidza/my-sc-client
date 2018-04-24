namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface ICervixGraph extends ng.IController {

    }

    interface IMinMaxGraph extends ng.IController {

        lineArray: Array<any>;

    }

    class Controller implements ICervixGraph {

        cervix = {};
        deliveryId: string;
        lines = {} as data.ICervixViewLines;
        plots: Array<data.ICervixView> = [];
        start: string;
        end: string;
        infants: Array<data.IInfantGraph> = [];
        delivery = {} as data.IDelivery;
        DescentLabel: string;


        // graph shells to make the graph dynamic

        width: number;
        height: number;
        ancObstetricExaminationId: string;
        nurseGeneralExaminationId: string;
        doctorGeneralExaminationId: string;
        nurseGeneralExamination: data.INurseGeneralExamination;
        lineConfig = {};
        lineOption = {};


        static $inject = ["NurseGeneralExaminationService", "PersonService", "InfantService", "CervixService", "DeliveryService", "PartogramInformationService"];
        constructor(
            private nurseGeneralExaminationService: data.INurseGeneralExaminationService,
            private personService: data.IPersonService,
            private infantService: data.IInfantService,
            private cervixService: data.ICervixService,
            private deliveryService: data.IDeliveryService,
            private partogramInformationService: data.IPartogramInformationService


        ) {



        }


        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {


            if (this.deliveryId) {


                if (this.deliveryId) {


                    this.deliveryService.get(this.deliveryId).then((response) => {
                        this.delivery = response;
                        this.nurseGeneralExaminationId = response.nurseGeneralExaminationId;
                        this.doctorGeneralExaminationId = response.doctorGeneralExaminationId;

                        this.nurseGeneralExaminationService.get(this.nurseGeneralExaminationId).then((response) => {
                            this.nurseGeneralExamination = response;
                        }, (error) => {
                        });



                    }, (error) => {
                        // not found - 
                    });


                    this.infantService.getByDeliveryIdGraph(this.deliveryId).then((response) => {
                        this.infants = response;
                    });
                }




                if (this.start) {

                    this.cervixService.getCervixesGraphLines(this.deliveryId).then((response) => {
                        this.lines = response;



                        this.cervixService.getCervixesGraph(this.deliveryId, this.start, this.end).then((response) => {
                            this.plots = response;
                            this.loadGraph2();
                        });
                    });
                }


            }
        }

        switchCervicalIcon = (): string => {

            // check presentation first
            if (this.nurseGeneralExamination.presentation === "BREECH") {


                return "image://img/magaro.png";
            }
            else {

                return "emptyCircle";
            }
            // if breeche put buttocks
            // if anything else put head


        }



        getClosePartogramNotifier = (endTime: string): {} => {
            if (endTime && this.infants.length > 0) {

                return {
                    silent: true,
                    itemStyle: {
                        normal: {
                            color: "transparent",
                            opacity: 1

                        }
                    },
                    label: {
                        normal: {
                            formatter: "\nstatus:" + this.infants[0].outcome + "\nweight:" + this.infants[0].weight + "g\naction:" + this.infants[0].deliveryMethod + "\ngender:" + this.infants[0].sex + "\nhc:" + this.infants[0].headCircumference + "\napgar 1min:" + this.infants[0].apgar1 + "\napgar 5min:" + this.infants[0].apgar5 + "\nchl:" + this.infants[0].height,
                            position: "insideBottomLeft",
                            textStyle: {
                                align: "left",
                                fontSize: 15,
                                color: "black"
                            }
                        }
                    },
                    data: [[{
                        name: "Partogram Closed",
                        xAxis: this.end,
                        yAxis: 3
                    }, {
                        xAxis: "max",
                        yAxis: 12
                    }]]
                };
            }



        }


        getClosePartogramLine = (endTime: string): {} => {


            if (endTime) {

                return {
                    normal: {
                        color: "black",
                        width: 5

                    }
                };



            }
            else {
                return {
                    normal: {
                        color: "transparent",
                        width: 5

                    }
                };

            }

        }

        getMinMaxYValues = (endTime: string): IMinMaxGraph => {

            let minMax: IMinMaxGraph = { lineArray: [] };

            if (this.end) {
                minMax.lineArray = this.lines.closePoints;
            }

            return minMax;

        }


        loadGraph2 = () => {

            this.lineConfig = {
                animation: true,
                theme: "roma",
                dataLoaded: true
            };

            this.lineOption = {
                title: {

                    left: 20,
                    top: 20

                },

                legend: {

                    data: ["Closed line", "Alert line", "Transfer line", "Action line", "Dilatation", "Descent"],
                    selectedMode: false,
                    position: "bottom",
                    top: 20
                },


                grid: {
                    right: 30
                },


                xAxis: [
                    {
                        name: "time/hr",
                        nameLocation: "end",
                        type: "time",
                        smooth: true,
                        axisLine: { onZero: false },
                        interval: 30 * 60 * 1000,
                        splitLine: { show: true },
                        splitArea: { show: false },
                        axisLabel: {

                            rotate: 45,
                            show: true,
                            formatter: function (value: any) {

                                return moment(value).format("HH:mm");

                            }

                        },
                    }

                ],
                yAxis: [
                    {

                        name: "Cervix(cm) [Plot X] \n Descent of head [Plot O] ",
                        nameTextStyle: {
                            fontStyle: "bold",
                            fontSize: 15,
                        },
                        nameLocation: "middle",
                        type: "value",
                        smooth: true,
                        nameGap: 37,
                        silent: true,
                        max: 11,
                        boundaryGap: [0, "100%"],
                        interval: 1,
                        axisLine: { onZero: false }


                    }
                ],
                series: [
                    {
                        name: "Closed line",
                        type: "line",
                        symbolSize: 1,
                        symbol: "pin",

                        smooth: true,
                        data: this.getMinMaxYValues(this.end).lineArray.map(function (item) {
                            return {
                                name: item.name,
                                value: [item.time, item.value]
                            };
                        }),
                        lineStyle: this.getClosePartogramLine(this.end),
                        itemStyle: this.getClosePartogramLine(this.end),

                    },
                    {
                        name: "Alert line",
                        type: "line",
                        symbolSize: 10,
                        symbol: "rect",

                        smooth: true,
                        data: this.lines.alertPoints.map(function (item) {
                            return {
                                name: item.name,
                                value: [item.time, item.value]
                            };
                        }),
                        itemStyle: {

                            normal: {
                                opacity: 0.3,
                                color: "green",
                                borderWidth: 0,
                                borderType: "solid"

                            },
                        },
                        lineStyle: {

                            normal: {
                                opacity: 0.5
                            },
                        },


                    },
                    {
                        name: "Transfer line",
                        type: "line",
                        symbolSize: 10,
                        symbol: "triangle",

                        smooth: true,
                        data: this.lines.transferPoints.map(function (item) {
                            return {
                                name: item.name,
                                value: [item.time, item.value]
                            };
                        }),
                        itemStyle: {
                            normal: {
                                color: "orange"


                            },
                        },
                        lineStyle: {
                            normal: {

                                width: 4,
                                type: "dashed",
                                opacity: 0.5

                            },
                        }


                    },
                    {
                        name: "Action line",
                        type: "line",
                        symbolSize: 10,
                        symbol: "diamond",

                        smooth: true,
                        data: this.lines.actionPoints.map(function (item) {
                            return {
                                name: item.name,
                                value: [item.time, item.value]
                            };
                        }),
                        itemStyle: {
                            normal: {
                                color: "red"


                            },
                        },

                        lineStyle: {
                            normal: {

                                width: 3,
                                type: "dotted",

                            },
                        }

                    },
                    {
                        name: "Dilatation",
                        type: "line",

                        symbol: "image://img/cross-6.png",
                        symbolSize: [30, 20],


                        data: this.plots.map(function (item) {
                            return {
                                name: item.dilatation,
                                value: [item.time, item.dilatation],




                            };
                        })
                        ,
                        itemStyle: {
                            normal: {
                                color: "black",
                                borderWidth: 0,
                                borderType: "solid"

                            },
                        },
                        lineStyle: {
                            normal: {
                                color: "black",
                                borderWidth: 0,
                                borderType: "solid"

                            },
                        }
                        ,
                        markArea: this.getClosePartogramNotifier(this.end)

                    },
                    {
                        name: "Descent",
                        type: "line",
                        symbol: this.switchCervicalIcon(),
                        symbolSize: [25, 25],


                        data: this.plots.map(function (item) {
                            return {
                                name: item.descent,
                                value: [item.time, item.descent]
                            };
                        }),
                        itemStyle: {
                            normal: {
                                color: "black"


                            },
                        }

                    }
                ]
            };


        }




    }

    class Component implements ng.IComponentOptions {

        bindings: { [binding: string]: string };

        constructor(
            public templateUrl = "app/ui/widgets/delivery/cervix/cervix-graph-Test-Echarts.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                personId: "<",
                start: "<",
                end: "<",
                width: "<",
                height: "<"
            };

        }
    }

    app.component("mrsCervixGraphEchartsTest", new Component());

}
