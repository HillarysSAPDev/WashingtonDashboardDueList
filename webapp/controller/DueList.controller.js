sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/Token",
], function (Controller, ODataModel, Token) {
	"use strict";
	var that;
	var cellList = [];
	var dueDate;
	var datetoDay;
	return Controller.extend("WashingtonDashboardDueList.WashingtonDashboardDueList.controller.DueList", {

		onInit: function () {
			var oView = this.getView();

			var oModel = new ODataModel("/sap/opu/odata/sap/ZPROD_ORD_DET_SRV/");
			oView.setModel(oModel);

			//Set the default sort order for the table
			var dueDataTableView = this.getView().byId("dueDataTable");
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

		onInitSmartFilterBarExtension: function (event) {

			var smartFilterView = this.getView().byId("smartFilterBar");
			var schFinishDate = smartFilterView.getControlByKey("Scheduledfinish");

			// Get the user type array from the session storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			var days = oStorage.get("Days");

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY-MM-dd"
			});
			if (days !== "-1" && days !== "0") {
				var Day = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + parseFloat(days));
				datetoDay = dateFormat.format(Day);
			} else if (days == "0") {
				datetoDay = dateFormat.format(new Date());
			} else if (days == "-1") {
				days = "0";
				var dueDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + parseFloat(days));
				dueDate = dateFormat.format(dueDay);
				datetoDay = "";
			}
			var newTokenDate = new Token({
				key: "=" + datetoDay,
				text: "=" + datetoDay
			});

			schFinishDate.setValue(datetoDay);
		},

		onBeforeRebindTable: function (oSource) {
			var dueDataTable = this.getView().byId("dueDataTable").getTable();

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

			if (datetoDay === "") {
				var binding = oSource.getParameter("bindingParams");
				var oFilter = new sap.ui.model.Filter("Scheduledfinish", sap.ui.model.FilterOperator.LT, dueDate);
				binding.filters.push(oFilter);
			}

			//Set the default sort order for the table
			var dueDataTableView = this.getView().byId("dueDataTable");
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

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");
			mExcelSettings.worker = false;
		},
	});

});