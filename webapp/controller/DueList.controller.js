sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/Token",
], function (Controller, ODataModel, Token) {
	"use strict";
	var that;
	return Controller.extend("WashingtonDashboardDueList.WashingtonDashboardDueList.controller.DueList", {

		onInit: function () {

			var oView = this.getView();

			var oModel = new ODataModel("/sap/opu/odata/sap/ZPROD_ORD_DET_SRV/");
			oView.setModel(oModel);

		},

		onInitSmartFilterBarExtension: function (event) {
			debugger;
			// Get the user type array from the session storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			var date = oStorage.get("dueDate");

			var schFinDateView = this.getView().byId("smartFilterBar");
			var schFinishDate = schFinDateView.getControlByKey("Scheduledfinish");
			var cellNameView = this.getView().byId("cellName");

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY-MM-dd"
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
			schFinishDate.setValue(datetoDay);
		},
		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");
			mExcelSettings.worker = false;
		},
	});

});