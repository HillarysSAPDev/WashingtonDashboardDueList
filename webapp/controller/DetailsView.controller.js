sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var that;
	var GV_inputDataArray;
	return Controller.extend("WashingtonDashboardDueList.WashingtonDashboardDueList.controller.DetailsView", {

		onInit: function () {
			that = this;
			this.getRouter().getRoute("RouteDetails").attachMatched(this.onRouteMatched, this);
		},
		getRouter: function () {
			//Initialise the router 
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onRouteMatched: function (oEvent) {

			// Get the user type array from the session storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			GV_inputDataArray = oStorage.get("inputData");

			//Displaying the admin app in an iFrame
			var iFrame = this.getView().byId("iFrame");
			var oFrameContent = iFrame.$()[0];
			oFrameContent.setAttribute("src", "/sap/bc/ui5_ui5/sap/ZPrdOrderStages/index.html");

		},

		onBackBtnPress: function (oEvent) {
			this.getRouter().navTo("RouteDueList");
		}

	});

});