sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/Token",
], function (Controller, ODataModel, Token) {
	"use strict";
	var that;
	return Controller.extend("WashingtonDashboardDueList.WashingtonDashboardDueList.controller.DueList", {

		onInit: function () {
			debugger;
			var oView = this.getView();

			var oModel = new ODataModel("/sap/opu/odata/sap/ZPROD_ORD_DET_SRV/");
			oView.setModel(oModel);

		},

		onInitSmartFilterBarExtension: function (event) {
			var aFilters = [];

			var filter;
			var cellList = [];

			// var userID = sap.ushell.Container.getService("UserInfo").getId();
			var userID = "GNATARAJAN";
			filter = new sap.ui.model.Filter("Uname", sap.ui.model.FilterOperator.EQ, userID);
			aFilters.push(filter);

			var smartFilterView = this.getView().byId("smartFilterBar");
			var schFinishDate = smartFilterView.getControlByKey("Scheduledfinish");

			var cellName = smartFilterView.getControlByKey("Cellname");

			var oCellDataModel = this.getOwnerComponent().getModel("WDUserAdmin");
			oCellDataModel.read("/ZUSER_CELL_LISTSet", {
				filters: aFilters,

				success: function (oData, oResponse) {
					var results = oData.results;

					results.forEach(function (cellname) {
						var newToken = new Token({
							key: cellname.Arbpl,
							text: cellname.Arbpl
						});
						cellList.push(newToken);
					});
					cellName.setTokens(cellList);
				},
				error: function (oError) {
					console.log(oError);
				}
			});

			// Get the user type array from the session storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			var date = oStorage.get("dueDate");

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY-MM-dd"
					// pattern: "dd.MM.YYYY"
			});
			if (date !== null) {
				if (date === "Today") {
					var datetoDay = dateFormat.format(new Date());
				} else if (date === "Tomorrow") {
					var tomorrow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
					var datetoDay = dateFormat.format(tomorrow);
				} else if (date === "NextDay") {
					var nextDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
					var datetoDay = dateFormat.format(nextDay);
				}
			} else {
				var datetoDay = dateFormat.format(new Date());
			}
			var newTokenDate = new Token({
				key: "=" + datetoDay,
				text: "=" + datetoDay
			});

			schFinishDate.setValue(datetoDay);
			// schFinishDate.setTokens(newTokenDate);
			// schFinishDate.addToken(newTokenDate);
		},
		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");
			mExcelSettings.worker = false;
		},
	});

});