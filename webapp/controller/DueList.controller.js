sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/Token",
], function (Controller, ODataModel, Token) {
	"use strict";

	var GV_dueDate;
	var GV_defaultDate;

	var that;
	return Controller.extend("WashingtonDashboardDueList.WashingtonDashboardDueList.controller.DueList", {

		onInit: function () {
			that = this;
			this.getRouter().getRoute("RouteDueList").attachMatched(this.onRouteMatched, this);

			var oView = this.getView();

			var oModel = new ODataModel("/sap/opu/odata/sap/ZPROD_ORD_DET_SRV/");
			oView.setModel(oModel);

			// Get the user type array from the session storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			var days = oStorage.get("Days");
			debugger;
			// Due In
			if (days >= "0") {
				this.setDefaultTableFormatDue();
				// Overdue App
			} else if (days === "-1") {
				this.setDefaultTableFormatOverdue();

			}
		},

		getRouter: function () {
			//Initialise the router 
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onRouteMatched: function (oEvent) {
			var dueDataTableView = this.getView().byId("dueDataTable");
			dueDataTableView.getTable().removeSelections(true);
		},

		onInitSmartFilterBarExtension: function (event) {

			var smartFilterView = this.getView().byId("smartFilterBar");
			var schFinishDate = smartFilterView.getControlByKey("Scheduledfinish");

			// Get the user type array from the session storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			var days = oStorage.get("Days");

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY-MM-dd"
			});

			// Due In
			if (days !== "-1" && days !== "0") {
				var Day = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + parseFloat(days));
				GV_defaultDate = dateFormat.format(Day);

				// Due Today App 
			} else if (days == "0") {
				GV_defaultDate = dateFormat.format(new Date());

				// Overdue App
			} else if (days == "-1") {
				days = "0";
				var dueDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + parseFloat(days));
				GV_dueDate = dateFormat.format(dueDay);
				GV_defaultDate = "";

			}

			var newTokenDate = new Token({
				key: "=" + GV_defaultDate,
				text: "=" + GV_defaultDate
			});

			schFinishDate.setValue(GV_defaultDate);
		},

		onBeforeRebindTable: function (oSource) {
			var dueDataTable = this.getView().byId("dueDataTable").getTable();
			debugger;
			var schedFinishColumn = dueDataTable.mAggregations.columns[0];
			schedFinishColumn.setHAlign("Left");
			schedFinishColumn.setWidth("9rem");

			var workCenterColumn = dueDataTable.mAggregations.columns[1];
			workCenterColumn.setWidth("8rem");

			var orderColumn = dueDataTable.mAggregations.columns[2];
			orderColumn.setWidth("8rem");

			var salesOrderColumn = dueDataTable.mAggregations.columns[3];
			salesOrderColumn.setWidth("10rem");

			var salesOrdItmColumn = dueDataTable.mAggregations.columns[4];
			salesOrdItmColumn.setHAlign("Left");
			salesOrdItmColumn.setWidth("9rem");

			var materialColumn = dueDataTable.mAggregations.columns[5];
			materialColumn.setWidth("8rem");

			var targetQtyColumn = dueDataTable.mAggregations.columns[6];
			targetQtyColumn.setWidth("8rem");
			targetQtyColumn.setHAlign("Left");

			var quantityDueColumn = dueDataTable.mAggregations.columns[7];
			quantityDueColumn.setWidth("8rem");
			quantityDueColumn.setHAlign("Left");

			var statusCodesColumn = dueDataTable.mAggregations.columns[8];
			statusCodesColumn.setWidth("40rem");

			if (GV_defaultDate === "") {
				var binding = oSource.getParameter("bindingParams");
				var oFilter = new sap.ui.model.Filter("Scheduledfinish", sap.ui.model.FilterOperator.LT, GV_dueDate);
				binding.filters.push(oFilter);
			};

		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");
			mExcelSettings.worker = false;
		},

		setDefaultTableFormatOverdue: function (oEvt) {

			//Set the default sort order for the table
			var dueDataTableView = this.getView().byId("dueDataTable");
			dueDataTableView.setInitiallyVisibleFields(
				"Scheduledfinish,Cellname,Productionorder,Salesorder,Salesorderitem,Material,Totalorderquantity,Quantitydue,Statuscodes");

			dueDataTableView.applyVariant({
				sort: {
					sortItems: [{
						columnKey: "Scheduledfinish",
						operation: "Descending"
					}, {
						columnKey: "Cellname",
						operation: "Ascending"
					}]
				}
			});
		},

		setDefaultTableFormatDue: function (oEvt) {

			//Set the default sort order for the table
			var dueDataTableView = this.getView().byId("dueDataTable");
			dueDataTableView.setInitiallyVisibleFields(
				"Cellname,Productionorder,Salesorder,Salesorderitem,Scheduledfinish,Material,Totalorderquantity,Quantitydue,Statuscodes");

			dueDataTableView.applyVariant({
				sort: {
					sortItems: [{
						columnKey: "Cellname",
						operation: "Ascending"
					}, {
						columnKey: "Salesorder",
						operation: "Ascending"
					}]
				}
			});
		},

		//Get and display details section fucntions
		onRowSelect: function (oEvent) {

			var oSmartTable = this.getView().byId("dueDataTable");
			var oSelectedValuePath = oSmartTable.getTable().getSelectedContextPaths();
			var oData = oSelectedValuePath.toString().split('/');

			var oDataModel = oSmartTable.getTable().getModel();
			var IPLData = oDataModel.oData;

			var selectedRowData = IPLData[oData[1]];

			var inputDataArray = {
				"Barcode": "",
				"ProdOrdNo": selectedRowData.ProdOrd,
				"SalesOrdNo": selectedRowData.SalesOrd,
				"LineItem": selectedRowData.SalesItm,
				"BoxID": ""
			};

			//Save the user type data in the session storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			oStorage.put("inputData", inputDataArray);

			this.navigateToDetailsView();
		},

		navigateToDetailsView: function () {

			this.getRouter().navTo("RouteDetails");
		},
	});

});