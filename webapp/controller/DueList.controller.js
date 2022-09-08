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
			var oST = this.getView().byId("dueListId").getTable();
			var PO = oST.mAggregations.columns[0];
			PO.setWidth("12rem");
			var SO = oST.mAggregations.columns[1];
			SO.setWidth("12rem");
			var SOItem = oST.mAggregations.columns[2];
			SOItem.setWidth("8rem");
			var CellName = oST.mAggregations.columns[3];
			CellName.setWidth("10rem");
			var SchFin = oST.mAggregations.columns[4];
			SchFin.setHAlign("Left");
			SchFin.setWidth("12rem");
			var Material = oST.mAggregations.columns[5];
			Material.setWidth("20rem");
			var TOQ = oST.mAggregations.columns[6];
			TOQ.setWidth("8rem");
			TOQ.setHAlign("Left");
			var QuantityDue = oST.mAggregations.columns[7];
			QuantityDue.setWidth("8rem");
			QuantityDue.setHAlign("Left");
			var Status = oST.mAggregations.columns[8];
			Status.setWidth("40rem");

			if (datetoDay === "") {
				var binding = oSource.getParameter("bindingParams");
				var oFilter = new sap.ui.model.Filter("Scheduledfinish", sap.ui.model.FilterOperator.LT, dueDate);
				binding.filters.push(oFilter);
			}
		},
		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");
			mExcelSettings.worker = false;
		},
	});

});