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
			var userId;

			// userId = sap.ushell.Container.getService("UserInfo").getUser();

			if (hashText.length === 2) {
				var dateFunc = hashText[1].split("=");
				var dueDate = dateFunc[1];

				//Save the user type data in the session storage
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
				oStorage.put("dueDate", date);
				oStorage.put("userId", userId);
			}
		}
	});
});