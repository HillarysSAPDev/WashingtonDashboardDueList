sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var date;
	return Controller.extend("WashingtonDashboardDueList.WashingtonDashboardDueList.controller.App", {
		onInit: function () {
			var hashText = window.location.hash;
			hashText = hashText.split('?');

			var userDataArray;
			var userData = [];

			if (hashText.length === 2) {
				var dateFunc = hashText[1].split("=");
				var days = dateFunc[2];

				//Save the user type data in the session storage
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
				oStorage.put("Days", days);
			}
		}
	});
});