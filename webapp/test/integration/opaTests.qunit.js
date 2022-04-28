/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"WashingtonDashboardDueList/WashingtonDashboardDueList/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});