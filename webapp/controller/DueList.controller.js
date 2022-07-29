sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/Token",
], function (Controller, ODataModel, Token) {
	"use strict";
	var that;
	var cellList = [];
	var dueDate;
	return Controller.extend("WashingtonDashboardDueList.WashingtonDashboardDueList.controller.DueList", {

		onInit: function () {
			var oView = this.getView();

			var oModel = new ODataModel("/sap/opu/odata/sap/ZPROD_ORD_DET_SRV/");
			oView.setModel(oModel);

		},

		onInitSmartFilterBarExtension: function (event) {
			// var aFilters = [];

			// var filter;
			// var cellList = [];

			// var userID = sap.ushell.Container.getService("UserInfo").getId();

			// filter = new sap.ui.model.Filter("Uname", sap.ui.model.FilterOperator.EQ, userID);
			// aFilters.push(filter);

			var smartFilterView = this.getView().byId("smartFilterBar");
			var schFinishDate = smartFilterView.getControlByKey("Scheduledfinish");

			// var cellName = smartFilterView.getControlByKey("Cellname");

			// var oCellDataModel = this.getOwnerComponent().getModel("WDUserAdmin");
			// oCellDataModel.read("/ZUSER_CELL_LISTSet", {
			// 	filters: aFilters,

			// 	success: function (oData, oResponse) {
			// 		var results = oData.results;

			// 		results.forEach(function (cellname) {
			// 			var newToken = new Token({
			// 				key: cellname.Arbpl,
			// 				text: cellname.Arbpl
			// 			});
			// 			cellList.push(newToken);
			// 		});
			// 		cellName.setTokens(cellList);
			// 	},
			// 	error: function (oError) {
			// 		console.log(oError);
			// 	}
			// });

			// Get the user type array from the session storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			var days = oStorage.get("Days");

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY-MM-dd"
			});
			if (days !== "-1" && days !== "0") {
				var Day = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + parseFloat(days));
				var datetoDay = dateFormat.format(Day);
			} else if (days == "0") {
				var datetoDay = dateFormat.format(new Date());
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
			if (dueDate !== undefined) {
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