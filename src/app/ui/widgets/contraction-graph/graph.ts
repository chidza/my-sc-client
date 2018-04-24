namespace mrs.ui {
    "use strict";

    let app = angular.module(mrs.appName);

    interface IContraction extends ng.IController {

    }

    interface IAlert extends ng.IController {
        result: string;
        date: string;
        value: number;

    }

    interface IMinMaxGraph extends ng.IController {

        lineArray: Array<any>;

    }

    class Controller implements IContraction {
        deliveryId: string;
        multiple: Array<any>;
        data: Array<any>;
        config = {} as Object;
        lineConfig = {} as Object;
        lineOption = {} as Object;
        timerAxis: Array<any> = [];
        weakAxis: Array<any> = [];
        moderateAxis: Array<any> = [];
        strongAxis: Array<any> = [];
        dateFrom: string;
        dateTo: string;
        it: data.IGraphPoints;
        entryTime = [] as Array<data.IGraphPoints>;
        entryWeak = [] as Array<data.IGraphPoints>;
        entryModerate = [] as Array<data.IGraphPoints>;
        entryStrong = [] as Array<data.IGraphPoints>;
        headersAndValues = {} as data.IContractionList;
        headersAndValuesList = {} as data.IContractionListGraph;
        timeIntervals = {} as Object;
        notification: data.IContractionValidation;
        date: Date;
        contractionsList: Array<data.IContraction> = [];
        contraction = {} as data.IContraction;
        count: number;
        counter: number = 0;
        valueAlert: string;
        dateAlert: string;
        alert = {} as IAlert;
        alertList = {} as IAlert;
        alertstrong: number = 0;
        alertmoderate: number = 0;
        alertweak: number = 0;
        start: string;
        end: string;
        width: number;
        height: number;
        lines = {} as data.ICervixViewLines;


        static $inject = ["CervixService", "ContractionService", "DeliveryService"];
        constructor(
            private cervixService: data.ICervixService,
            private contractionService: data.IContractionService,
            private deliveryService: data.IDeliveryService
        ) {

        }

        $onChanges = (onChangesObj: ng.IOnChangesObject): void => {

            if (this.deliveryId && this.start) {


                this.contractionService.getContractionsForGraph(this.deliveryId, this.start, this.end).then((respone) => {

                    this.cervixService.getCervixesGraphLines(this.deliveryId).then((response) => {

                        this.lines = response;

                        this.headersAndValuesList = respone;


                        this.loadGraph4();

                    });

                },

                    (error) => {
                    });

            }
        }




        getMinMaxYValues = (): IMinMaxGraph => {

            let minMax: IMinMaxGraph = { lineArray: [] };

            if (this.end) {
                minMax.lineArray = this.lines.closePoints;
            }


            return minMax;

        }

        getClosePartogramLine = (endTime: string) => {

            if (this.end) {

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


        getStatus = (): IAlert => {
            let alertweak = 0;
            let alertmoderate = 0;
            let alertstrong = 0;
            let result: string = "OK";
            if (this.headersAndValues && this.headersAndValues.strong) {
                this.headersAndValues.strong.forEach((strong) => {
                    if (strong.status === "DANGER") {
                        this.alert.result = "DANGER";
                        this.alert.date = moment(strong.x).format("HH:mm");
                        this.alertstrong = parseInt(strong.y);
                        this.alert.value = this.alertweak + this.alertstrong + this.alertmoderate;
                    }
                });
            }

            if (this.headersAndValues && this.headersAndValues.moderate) {
                this.headersAndValues.moderate.forEach((moderate) => {
                    if (moderate.status === "DANGER") {
                        this.alert.result = "DANGER";
                        this.alert.date = moment(moderate.x).format("HH:mm");
                        this.alertmoderate = parseInt(moderate.y);
                        this.alert.value = this.alertweak + this.alertstrong + this.alertmoderate;
                    }
                });
            }

            if (this.headersAndValues && this.headersAndValues.weak) {
                this.headersAndValues.weak.forEach((weak) => {

                    if (weak.status === "DANGER") {
                        this.alert.result = "DANGER";
                        this.alert.date = moment(weak.x).format("HH:mm");
                        this.alertweak = parseInt(weak.y);
                        this.alert.value = this.alertweak + this.alertstrong + this.alertmoderate;
                    }
                });
            }
            return this.alert;
        }

        getClosePartogramNotifier = (): {} => {

            if (this.end) {

                return {
                    silent: true,
                    itemStyle: {
                        normal: {
                            color: "transparent",
                            opacity: 0.1

                        }
                    },
                    label: {
                        normal: {
                            formatter: "Partogram Closed",
                            textStyle: {

                                fontSize: 70,
                                color: "black"
                            }
                        }
                    },
                    data: [[{
                        name: "Partogram Closed",

                        yAxis: 3
                    }, {

                        yAxis: 5
                    }]]
                };
            }



        }





        loadGraph4 = () => {

            let moderate = "image://data:image/png;base64,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";

            let strong = "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAJOgAACToAYJjBRwAAABOSURBVGhD7c/BCYBAAAPBaP89qw+LmIMdCHnvte35drz7/+MVoilEU4imEE0hmkI0hWgK0RSiKURTiKYQTSGaQjSFaArRFKIpRFOIZXsBTmABTxXSHSIAAAAASUVORK5CYII=";

            let weak = "image://data:image/png;base64,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";

            let maxData = 9;

            this.lineConfig = {
                animation: true,
                dataLoaded: true
            };


            this.lineOption = {

                legend: {
                    data: ["weak", "moderate", "strong", ".", ","],
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

                        name: "Contractions" + "/" + "( per 10mins)",
                        nameTextStyle: {
                            fontStyle: "bold",
                            fontSize: 15,
                        },
                        nameLocation: "middle",
                        type: "value",

                        nameGap: 37,

                        max: 9,
                        interval: 1,

                        axisLine: { onZero: false },
                        axisLabel: {
                            show: true

                        }


                    }
                ],


                series: [
                    {
                        name: "Closed line",
                        type: "line",
                        symbolSize: 1,
                        symbol: "pin",

                        smooth: true,

                        data: this.getMinMaxYValues().lineArray.map(function (item) {
                            return {
                                name: item.name,
                                value: [item.time, item.value]
                            };
                        }),
                        lineStyle: this.getClosePartogramLine(this.end),
                        itemStyle: this.getClosePartogramLine(this.end),

                    },

                    {
                        name: ".",
                        type: "line",
                        silent: true,
                        data: this.headersAndValuesList.FirstX.map(function (item) {
                            return {
                                name: item.y,
                                value: [item.x, item.y]
                            };
                        }),

                        lineStyle: {
                            normal: {
                                color: "transparent"

                            }
                        },
                        itemStyle: {
                            normal: {
                                color: "transparent"


                            }
                        }





                    },
                    {
                        name: "weak",
                        type: "pictorialBar",
                        stack: "contractions",
                        symbol: weak,
                        symbolRepeat: "fixed",
                        symbolMargin: "1%",
                        symbolClip: true,
                        symbolSize: 30,
                        symbolOffset: ["50%", 0],


                        data: this.headersAndValuesList.weak.map(function (item) {
                            return {
                                name: item.y,
                                value: [item.x, item.y]
                            };
                        })



                    },
                    {
                        name: "moderate",
                        type: "pictorialBar",
                        stack: "contractions",
                        symbol: moderate,
                        symbolRepeat: "fixed",
                        symbolMargin: "1%",
                        symbolClip: true,
                        symbolSize: 30,
                        symbolOffset: ["50%", 0],
                        symbolBoundingData: maxData,
                        data: this.headersAndValuesList.moderate.map(function (item) {
                            return {
                                name: item.y,
                                value: [item.x, item.y]
                            };
                        }),


                    },
                    {
                        name: "strong",
                        type: "pictorialBar",
                        stack: "contractions",
                        symbol: strong,
                        symbolRepeat: "fixed",
                        symbolMargin: "1%",
                        symbolClip: true,
                        symbolSize: 30,
                        symbolOffset: ["50%", 0],
                        symbolBoundingData: maxData,
                        data: this.headersAndValuesList.strong.map(function (item) {
                            return {
                                name: item.y,
                                value: [item.x, item.y]
                            };
                        }),


                    },


                    {
                        name: ",",
                        type: "line",
                        data: this.headersAndValuesList.LastX.map(function (item) {
                            return {
                                name: item.y,
                                value: [item.x, item.y]
                            };
                        }),
                        lineStyle: {
                            normal: {
                                color: "transparent"

                            }
                        },
                        itemStyle: {
                            normal: {
                                color: "transparent"


                            }
                        },
                        markArea: this.getClosePartogramNotifier(),


                    }



                ]
            };


        }




    }

    class Component implements ng.IComponentOptions {
        bindings: { [binding: string]: string };
        constructor(
            public templateUrl = "app/ui/widgets/contraction-graph/graph.html",
            public controllerAs = "vm",
            public controller = Controller) {
            this.bindings = {
                deliveryId: "<",
                start: "<",
                end: "<",
                width: "<",
                height: "<"
            };
        }
    }
    app.component("mrsContractionGraph", new Component());
}