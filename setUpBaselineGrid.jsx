//@targetengine "setUpBaselineGrid"

/* DESCRIPTION: Set up the baseline grid */ 

/*
	
		+ Adobe InDesign Version: CS6
		+ Autor: Roland Dreger 
		+ Datum: 20. Juli 2014
		
		+ Zuletzt aktualisiert: 3. November 2018
		
		
		
		+ Eingabefelder:
			In den Eingabefeldern koennen die Werte mit und ohne Einheiten eingegeben werden (z.B. 13 pt). 
			
			Mit den Pfeiltasten koennen die Werte erhoeht/verringert werden. Die Werte (Schrittweiten) werden aus den 
			Voreinstellungen des Dokuments ausgelesen.
			
			++ Skript-Eingabefeld: »Grundlinienraster« -> »Werte« -> »Anfang:« 
				 Schrittweite aus den InDesign-Voreinstellungen: »Einheiten und Einteilungen« -> »Tastaturschritte« -> »Pfeiltasten«
			
			++ Skript-Eingabefeld: »Grundlinienraster« -> »Werte« -> »Einteilung alle:« 
				 Schrittweite aus den InDesign-Voreinstellungen: »Einheiten und Einteilungen« -> »Tastaturschritte« -> »Schriftgrad-Zeilenabstand«
			
				 + Shift-Taste gedrueckt: Schrittweite wird um den Faktor 10 erhoeht/verringert.
				 + Shift- + cmd-Taste gedrueckt: Schrittweite wird um den Faktor 0.1 erhoeht/verringert.
			
			++ Skript-Eingabefeld: »Grundlinienraster« -> »Werte« -> »Anfang:«:
				 Werden »Shift« + »Crtl« + »Pfeiltaste« gleichzeitig gedrueckt, wird der Wert im Eingabefeld 
				 um den Betrag eines Zeilenabstandes erhoeht/verringert.
				 
			++ Skript-Eingabefelder fuer die manuelle Eingabe der Stege (Raender):
				 Einfach-Klick auf die Feldbeschriftung waehlt den Wert im Eingabegeld aus.
				 Doppel-Klick auf die Feldbeschriftung rundet zudem den Wert im Eingabefeld.
				 
			++ Skript-Button: »Stege (Raender) auf Musterseite uebertragen«
				 Mit »Shift« + Klick koennen die Werte bei doppelseitigen Dokumenten fuer beide Musterseiten uebernommen werden.
				 Mit »Alt« + Klick erscheint ein Auswahldialog mit allen Musterseiten.
				 
			++ Auswahl »Aktive Seite«: Ist kein Icon angewaehlt, ermittelt InDesign die aktive Seite (d.h. jene Seite, die sich 
				 im Zentrum des Layoutfensters befindet). Die Auswahl durch InDesign erfolgt auch dann, wenn mehr als zwei Seiten
				 pro Druckbogen vorhanden sind bzw. eine recht oder linke Seite fehlen.
		
		
		
		+ Freies Script fuer private und kommerzielle Nutzung (Creativ Commons Lizenz: Roland Dreger, CC BY 3.0 AT). 
		+ Verwendung auf eigene Gefahr.
		
		+ Free Script for private and commercial use (Creativ Commons Licence: Roland Dreger, CC BY 3.0 AT). 
		+ Use at your own risk.
		
			 
		
		+ Thanks to Kai Ruebsamen (ruebiarts.de) for his ideas to the script, 
			Dirk Becker for ScriptUI tips and 
			René Andritsch, Martin Fischer, Hans Haesler, Uwe Laubender for discussion and feedback.
		
*/




var _global = {};


/* +++++++++++++++++++ */
/* + Preferences     + */

_global.baselineGridShown = true; /* Grundlinienraster beim Start anzeigen: »true« or »false« */

_global.columnsPositionsFeature = true; /* Manuelle Positionierung der Spaltenhilfslinien mit Eingabefeldern: »true« or »false« */
_global.lockColumnsPositionsRow = false; /* Gruppe mit Spalten-Positionen sperren (Startwert): »true« or »false« */

_global.timeStampBefore = -1; /* Zeitstempel fuer Event-Kontrolle (Startwert) */
_global.uiSensivity = 500; /* Gesperrtes Zeitintervall zwischen zwei aufeinanderfolgenden Events  */

_global.debug = false; /* Debug-Modus:  »true« or »false« */

/* + END Preferences + */
/* +++++++++++++++++++ */


__main();



function __main() { 
	__showUI ();
} /* END function __main */



function __showUI() {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { 
		_global = null;
		return; 
	}
	
	var _appVersion = parseFloat(app.version).toFixed(1);
	if(_appVersion < 8) {
		var _appVersionInfo = { 
			en:"Note to older versions of InDesign\rThis script is tested with version CS6 and higher. Maybe it does not work properly with your version.", 
			de:"Hinweis zu \u00e4lteren InDesign-Versionen\rLeider ist dieses Script erst ab Version CS6 getestet. M\u00f6glicherweise funktioniert das Skript deshalb mit deiner Version nicht korrekt."
		}
		alert(localize(_appVersionInfo));
	}

	if(_appVersion < 8) {
		_global.columnsPositionsFeature = false;
	}
	
	var _doc;
	var _icons;
	var _ui;
	var _pageIconSize = [32,38];
	
	_doc = app.documents.firstItem();
	_doc.gridPreferences.baselineGridShown = _global.baselineGridShown;  
	
	__defineLocalizeStrings();
	_icons = __defineIconsForUI(); 
	
	_ui = new Window("palette", localize(_global.uiHead));
	with (_ui) {
		orientation = "row";
		alignChildren = ["fill","fill"];
		margins = [8,12,8,8];
		spacing = 8;
		var _rulerUnitColumn = add("group");
		with(_rulerUnitColumn) {
			orientation = "column";
			alignChildren = ["fill","fill"];
			margins = [0,0,0,2];
			var _rulerUnitButtonGroup = add("group");
			with(_rulerUnitButtonGroup) {
				orientation = "column";
				alignment = "fill";
				alignChildren = "top";
				spacing = 4;
				var _ptButton = add("iconbutton", undefined, _icons.rulerUnitsBg, { style:"toolbutton" });
				with (_ptButton) {
					size = [33,24];
					helpTip = localize(_global.points);
					text = "pt";
				} /* END _ptButton */
				var _mmButton = add("iconbutton", undefined, _icons.rulerUnitsBg, { style:"toolbutton" });
				with (_mmButton) {
					size = [33,24];
					helpTip = localize(_global.mm);
					text = "mm";
				} /* END _mmButton */
				var _cmButton = add("iconbutton", undefined, _icons.rulerUnitsBg, { style:"toolbutton" });
				with (_cmButton) {
					size = [33,24];
					helpTip = localize(_global.cm);
					text = "cm";
				} /* END _cmButton */
				var _inchButton = add("iconbutton", undefined, _icons.rulerUnitsBg, { style:"toolbutton" });
				with (_inchButton) {
					size = [33,24];
					helpTip = localize(_global.inches);
					text = localize(_global.inches);
				} /* END _inchButton */
				var _pButton = add("iconbutton", undefined, _icons.rulerUnitsBg, { style:"toolbutton" });
				with (_pButton) {
					size = [33,24];
					helpTip = localize(_global.picas);
					text = "p";
				} /* END _pButton */
				var _pxButton = add("iconbutton", undefined, _icons.rulerUnitsBg, { style:"toolbutton" });
				with (_pxButton) {
					size = [33,24];
					helpTip = localize(_global.pixels);
					text = "px";
				} /* END _pxButton */
				var _warningDifferentUnits = add("image", undefined, _icons.warning);
				with(_warningDifferentUnits) {
					helpTip = localize(_global.warningDifferentUnitsHelpTip);
				} /*END image _warningDifferentUnits */
			} /* END _rulerUnitButtonGroup */
			var _baselineGridVisibilityGroup = add("group");
			with(_baselineGridVisibilityGroup) {
				orientation = "stack";
				margins = [0,0,0,0];
				alignChildren ="bottom";
				var _showGrid = add("iconbutton", undefined, _icons.showBaselineGrid, { style: "toolbutton" });
				with(_showGrid) {
					size = [33,33];
					helpTip = localize(_global.showGridHelpTip);
				} /* END Button _showGrid */
				var _hideGrid = add("iconbutton", undefined, _icons.hideBaselineGrid, { style: "toolbutton" });
				with(_hideGrid) {
					size = [33,33];
					helpTip = localize(_global.hideGridHelpTip);
				} /* END Button _hideGrid */
			} /* END _baselineGridVisibilityGroup */
		} /* END _rulerUnitColumn */
		var _baselineColumn = add("group");
		with(_baselineColumn) {
			orientation = "column";
			alignChildren = ["fill","fill"];
			var _baselineOptionsPanel = add("tabbedpanel");
			with(_baselineOptionsPanel) {
				/* margins = [8,10,8,0]; // Bug mit _ui.layout.layout() in CS6 */
				var _valuesTab = add("tab", undefined, localize(_global.valuesTabLabel));
				with(_valuesTab) {
					alignChildren = "fill";
					spacing = 12;
					var _relativeToGroup = add("group");
					with(_relativeToGroup) {
						orientation = "column";
						alignChildren = "left";
						spacing = 4;
						margins = [8,8,0,8];
						add("statictext", undefined, localize(_global.relativToLabel));
						var _relativeToDropdownList = [localize(_global.topOfThePageListItem),localize(_global.topOfTheMarginListItem)];
						var _relativeToDropdown = add("dropdownlist", undefined, _relativeToDropdownList); 
					} /* END _relativeToGroup */
					var _startGroup = add("group");
					with(_startGroup) { 
						orientation = "column";
						alignChildren = "left";
						margins.left = 8;
						spacing = 0;
						var _startInputLabel = add("statictext", undefined, localize(_global.startLabel));
						var _startInputGroup = add("group");
						with(_startInputGroup) {
							spacing = 10;
							var _startInput = add("edittext", undefined, "", { multiline: false });
							with(_startInput) {
								characters = 9;
								helpTip = localize(_global.startInputHelpTip);
							}
							var _selectionStartUIButton = add("iconbutton", undefined, _icons.selectionStart, { style:"toolbutton" });
							with (_selectionStartUIButton) {
								size = [30,30];
								helpTip = localize(_global.selectionStartHelpTip);
							} /* END Button _selectionStartUIButton */
							var _selectionLastBaselineUIButton = add("iconbutton", undefined, _icons.selectionLastBaseline, { style:"toolbutton" });
							with (_selectionLastBaselineUIButton) {
								size = [30,30];
								helpTip = localize(_global.selectionLastBaselineHelpTip);
							} /* END Button _selectionLastBaselineUIButton */
							var _selectionMarginBottomUIButton = add("iconbutton", undefined, _icons.selectionMarginBottom, { style:"toolbutton" });
							with (_selectionMarginBottomUIButton) {
								size = [30,30];
								helpTip = localize(_global.selectionMarginBottomHelpTip);
							} /* END Button _selectionMarginBottomUIButton */							
						} /* END _startInputGroup */ 
					} /* END _startGroup */
					var _incrementGroup = add("group");
					with(_incrementGroup) {
						orientation = "column";
						alignChildren = "left";
						margins.left = 8;
						margins.bottom = 4;
						spacing = 0;
						var _incrementInputLabel = add("statictext", undefined, localize(_global.incrementEveryLabel));
						var _incrementInputGroup = add("group");
						with(_incrementInputGroup) {
							spacing = 10;
							var _incrementInput = add("edittext", undefined, "", { multiline: false });
							with(_incrementInput) {
								characters = 9;
							}
							var _selectionIncrementUIButton = add("iconbutton", undefined, _icons.selectionIncrement, { style: "toolbutton" });
							with (_selectionIncrementUIButton) {
								size = [30,30];
								helpTip = localize(_global.selectionIncrementHelpTip);
							} /* END Button _selectionIncrementUIButton */
							var _divideIncementArrow = add("statictext", undefined, "\u25b6");
							with(_divideIncementArrow) {
								size = [12,15];
								enabled = false;
							} /* END _divideIncementArrow */
							var _divideIncrementBy2UIButton = add("iconbutton", undefined, _icons.divideIncrementBy2, { style:"toolbutton" });
							with (_divideIncrementBy2UIButton) {
								size = [19,30];
								helpTip = localize(_global.divideIncrementBy2HelpTip);
							} /* END Button _divideIncrementBy2UIButton */
							var _divideIncrementBy3UIButton = add("iconbutton", undefined, _icons.divideIncrementBy3, { style:"toolbutton" });
							with (_divideIncrementBy3UIButton) {
								size = [19,30];
								helpTip = localize(_global.divideIncrementBy3HelpTip);
							} /* END Button _divideIncrementBy3UIButton */
						} /* END _incrementInputGroup */
						var _incrementInputInPointsGroup = add("group");
						with(_incrementInputInPointsGroup) {
							orientation = "column";
							var _incrementInputValue = add("statictext", undefined, "");
							with(_incrementInputValue) {
								characters = 12;
								enabled = true;
								alignment = "left";
								indent = 2;
							} /* END statictext _incrementInputValue */
						} /* END _incrementInputInPointsGroup */
					} /* END _incrementGroup */
				} /* END tab _valuesTab */
				var _displayTab = add("tab", undefined, localize(_global.displayTabLabel));
				with(_displayTab) {
					alignChildren = "fill";
					spacing = 16;
					var _baselineColorGroup = add("group");
					with(_baselineColorGroup) {
						orientation = "column";
						alignChildren = "left";
						margins = [8,8,0,0];
						spacing = 4;
						add("statictext", undefined, localize(_global.baselineColorLabel));
						var _baselineColorDropdownList = __getUIColorList();
						var _baselineColorDropdown = add("dropdownlist", undefined, _baselineColorDropdownList);
						with(_baselineColorDropdown) {
							__setUIColorIcon(_baselineColorDropdown,_icons);
						}
						var _userDefinedColorGroup = add("group");
						with(_userDefinedColorGroup) {
							spacing = 2;
							var _userDefinedRedLabel = add("statictext", undefined, "R:");
							var _userDefinedRed = add("edittext", undefined, "", { multiline: false });
							with(_userDefinedRed) {
								characters = 4;
								helpTip = localize(_global.userDefinedHelpTip);
							}
							var _userDefinedGreenLabel = add("statictext", undefined, "\u00A0G:");
							var _userDefinedGreen = add("edittext", undefined, "", { multiline: false });
							with(_userDefinedGreen) {
								characters = 4;
								helpTip = localize(_global.userDefinedHelpTip);
							}
							var _userDefinedBlueLabel = add("statictext", undefined, "\u00A0B:");
							var _userDefinedBlue = add("edittext", undefined, "", { multiline: false });
							with(_userDefinedBlue) {
								characters = 4; 
								helpTip = localize(_global.userDefinedHelpTip);
							}
						} /* _userDefinedColorGroup */
					} /* END _baselineColorGroup */
					var _viewThresholdGroup = add("group");
					with(_viewThresholdGroup) {
						orientation = "column";
						alignChildren = "left";
						margins.left = 8;
						spacing = 4;
						var _viewThresholdInputLabel = add("statictext", undefined, localize(_global.viewThresholdLabel));
						var _viewThresholdInputGroup = add("group");
						with(_viewThresholdInputGroup) {
							spacing = 2;
							var _viewThresholdInput = add("edittext", undefined, "", { multiline: false });
							with(_viewThresholdInput) {
								characters = 3;
							}
							var _viewThresholdInputUnit = add("statictext", undefined, localize(_global.percentage));
							with(_viewThresholdInputUnit) {
								characters = 5;
							}
						} /* END _viewThresholdInputGroup */
					} /* END _viewThresholdGroup */
					var _gridsInBackGroup = add("group");
					with(_gridsInBackGroup) {
						orientation = "column";
						margins.left = 8;
						alignChildren = "left";
						spacing = 4;
						margins.top = 4;
						var _gridsInBack = add ("checkbox", undefined, localize(_global.gridsInBackLabel));	
					} /* END _gridsInBackGroup */
				} /* END tab _displayTab */
			} /* END tabpanel _baselineOptionsPanel */
		} /* END _baselineColumn */	 
		var _marginsAndOptionsColumn = add("group");
		with(_marginsAndOptionsColumn) {
			orientation = "column";
			alignChildren = ["fill","fill"];
			var _marginsAndOptionsPanel = add("tabbedpanel");
			with(_marginsAndOptionsPanel) {
				/* margins = [6,0,0,0]; // Bug mit _ui.layout.layout() in CS6 */
				var _marginsTab = add("tab", undefined, localize(_global.marginsPanelLabel));
				with(_marginsTab) {
					alignChildren = ["fill","fill"];
					var _autoMarginsRow = add("group");
					with(_autoMarginsRow) {
						alignChildren = ["center","middle"];
						spacing = 0;
						var _pageSelectionGroup = add("group");
						with(_pageSelectionGroup) {
							spacing = 0;
							margins = [0,0,0,0];
							orientation = "column";
							var _spinLineGroupTop = add("group");
							with(_spinLineGroupTop) {
								preferredSize = [_pageIconSize[0]*2,4];
							} /* END _spinLineGroupTop */
							var _pageSelectionIconGroup = add("group");
							with(_pageSelectionIconGroup) {
								orientation = "stack";
								alignChildren = "center";
								spacing = 0;
								margins = [0,0,0,0];
								var _pageIconSingleGroup = add("group");
								with(_pageIconSingleGroup) {
									var _singlePageButton = add ("iconbutton", undefined, undefined, { style:"toolbutton", toggle:true });
									with(_singlePageButton) {
										size = _pageIconSize;
										helpTip = localize(_global.singlePageButtonHelpTip);
										text = "1";
									} /* END _singlePageButton */
								} /* END _pageIconSingleGroup */
								var _pageIconFacingGroup = add("group");
								with(_pageIconFacingGroup) {
									margins = [0,0,0,0];
									size = [_pageIconSize[0]*2,_pageIconSize[1]];
									spacing = 0;
									var _leftPageButton = add ("iconbutton", undefined, undefined, { style:"toolbutton", toggle:true });
									with(_leftPageButton) {
										size = _pageIconSize;
										helpTip = localize(_global.leftPageButtonHelpTip);
										text = "1";
									} /* END _leftPageButton */
									var _rightPageButton = add ("iconbutton", undefined, undefined, { style:"toolbutton", toggle:true });
									with(_rightPageButton) {
										size = _pageIconSize;
										helpTip = localize(_global.rightPageButtonHelpTip);
										text = "2";
									} /* END _rightPageButton */
								} /* END _pageIconFacingGroup */
							} /* END _pageSelectionIconGroup */
							var _spinLineGroupBottom = add("group");
							with(_spinLineGroupBottom) {
								preferredSize = [_pageIconSize[0]*2,4];
							} /* END _spinLineGroupBottom */
							var _pageSelectionLabelGroup = add("group");
							with(_pageSelectionLabelGroup) {
								var _pageSelectionLabel = add("statictext", undefined, localize(_global.pageSelectionLabelText));
								with(_pageSelectionLabel) {
									characters = 16;
									justify = "center";
								} /* END _pageSelectionLabel */
							} /* END _pageSelectionLabelGroup */
						} /* END _pageSelectionGroup */
						var _autoMarginsGroup = add("group");
						with(_autoMarginsGroup) {
							alignChildren = ["fill","top"];
							margins = [0,0,0,0];
							spacing = 5;
							orientation = "column";
							var _marginTopButtonGroup = add("group");
							with(_marginTopButtonGroup) {
								margins = [0,0,0,0];
								orientation = "column";
								alignChildren = "center";
								var _marginTopButton = add("button", undefined, localize(_global.marginsTopLabel));
								with(_marginTopButton) {
									preferredSize.height = 32;
									helpTip = localize(_global.adjustMarginTopHelpTip);
								}
							} /* END _marginTopButtonGroup */
							var _centerleftAndRightMarginButtonGroup = add("group");
							with(_centerleftAndRightMarginButtonGroup) {
								orientation = "column";
								alignChildren = "center";
								margins = [0,0,0,0];
								spacing = 0;
								var _leftAndRightMarginButtonGroup = add("group");
								with(_leftAndRightMarginButtonGroup) {
									spacing = 6;
									var _marginLeftButton = add("button", undefined, localize(_global.marginsLeftLabel));
									with(_marginLeftButton) {
										preferredSize.height = 32;
										helpTip = localize(_global.adjustMarginLeftHelpTip);
									} /* END Button _marginLeftButton */
									var _allMarginsButton = add("iconbutton", undefined, _icons.textFrame, { style:"toolbutton"} );
									with (_allMarginsButton) {
										size = [31,31];
										helpTip = localize(_global.adjustAllMarginsHelpTip);
									} /* END Button _allMarginsButton */
									var _flipMarginsButton = add("iconbutton", undefined, _icons.flipMargins, { style:"toolbutton"} );
									with (_flipMarginsButton) {
										size = [31,31];
										helpTip = localize(_global.flipButtonHelpTip);
									} /* END Button _flipMarginsButton */
									var _marginRightButton = add("button", undefined,	localize(_global.marginsRightLabel));
									with(_marginRightButton) {
										preferredSize.height = 32;
										helpTip = localize(_global.adjustMarginRightHelpTip);
									} /* END Button _marginRightButton */
								} /* END _leftAndRightMarginButtonGroup */
							} /* END _centerleftAndRightMarginButtonGroup */
							var _marginBottomButtonGroup = add("group");
							with(_marginBottomButtonGroup) {
								margins = [0,0,0,0];
								orientation = "row";
								alignment = "center";
								var _marginBottomButton = add("button", undefined, localize(_global.marginsBottomLabel));
								with(_marginBottomButton) {
									preferredSize.height = 32;
									helpTip = localize(_global.adjustMarginBottomHelpTip);
								}
							} /* END _marginBottomButtonGroup */
						} /* END _autoMarginsGroup */
						var _transferMarginsToMasterGroup = add("group");
						with(_transferMarginsToMasterGroup) {
							spacing = 6;
							margins = [0,0,0,0];
							orientation = "column";
							var _transferMarginsToMasterIconsGroup = add("group");
							with(_transferMarginsToMasterIconsGroup) {
								var _transferMarginsToMasterArrowRight = add("statictext", undefined, "\u25b6");
								with(_transferMarginsToMasterArrowRight) {
									size = [15,15];
									enabled = false;
								} /* END _transferMarginsToMasterArrowRight */
								var _transferMarginsToMasterButton = add ("iconbutton", undefined, undefined, { style:"toolbutton", toggle:false });
								with(_transferMarginsToMasterButton) {
									size = [32,38];
									helpTip = localize(_global.transferMarginsToMasterHelpTip);
									text = "A";
								} /* END _transferMarginsToMasterButton */
							} /* END _transferMarginsToMasterIconsGroup */
							var _transferMarginsToMasterLabelGroup = add("group");
							with(_transferMarginsToMasterLabelGroup) {
								margins.left = 24;
								var _transferMarginsToMasterLabel = add("statictext", undefined, localize(_global.transferMarginsToMasterLabelText));
								with(_transferMarginsToMasterLabel) {
									characters = 12;
									justify = "center";
								} /* END _transferMarginsToMasterLabel */
							} /*END _transferMarginsToMasterLabelGroup */
						} /* END _transferMarginsToMasterGroup */
					} /* END _autoMarginsRow */
					var _inputMarginsRow = add("group");
					with(_inputMarginsRow) {
						alignChildren = ["center","middle"];
						spacing = 6;
						var _marginsInputGroup = add("group");
						with(_marginsInputGroup) {
							alignChildren = ["fill","fill"];
							margins = [0,0,0,0];
							spacing = 4;
							var _marginsLeftInputGroup = add("group");
							with(_marginsLeftInputGroup) {
								orientation = "column";
								alignChildren = "right";
								spacing = 4;
								var _marginTopInputGroup = add("group");
								with(_marginTopInputGroup) {
									spacing = 4;
									var _marginTopInputLabel = add("statictext", undefined, localize(_global.marginTopLabel));
									var _marginTopInput = add("edittext", undefined, "", { multiline: false });
									with(_marginTopInput) { 
										characters = 9; 
									} /* END _marginTopInput */
								} /* END _marginTopInputGroup */ 
								var _marginBottomInputGroup = add("group");
								with(_marginBottomInputGroup) {
									spacing = 4;
									var _marginBottomInputLabel = add("statictext", undefined, localize(_global.marginBottomLabel));
									var _marginBottomInput = add("edittext", undefined, "", { multiline: false });
									with(_marginBottomInput) { 
										characters = 9; 
									} /* END _marginBottomInput */
								} /* END _marginBottomInputGroup */	
							} /* END _marginsLeftInputGroup */
							var _chainMarginsGroup = add("group");
							with(_chainMarginsGroup) {
								margins = [0,2,0,0];
								var _chainMarginsButton = add ("iconbutton", undefined, _icons.chainMargins, { style:"toolbutton", toggle:true });
								with(_chainMarginsButton) {
									alignment = "top";
									size = [20,20];
									helpTip = localize(_global.chainMarginsButtonHelpTip);
								} /* END _chainMarginsButton */
							} /* END _chainMarginsGroup */
							var _marginsRightInputGroup = add("group");
							with(_marginsRightInputGroup) {
								orientation = "column";
								alignChildren = "right";
								spacing = 4;
								var _marginLeftInputGroup = add("group");
								with(_marginLeftInputGroup) { 
									spacing = 4;
									var _marginLeftInputLabel = add("statictext", undefined, localize(_global.marginLeftLabel));
									with(_marginLeftInputLabel) {
										justify = "right";
										characters = 6;
									} /* END _marginLeftInputLabel */
									var _marginLeftInput = add("edittext", undefined, "", { multiline: false });
									with(_marginLeftInput) { 
										characters = 9; 
									} /* END _marginLeftInput */
								} /* END _marginLeftInputGroup */ 
								var _marginRightInputGroup = add("group");
								with(_marginRightInputGroup) { 
									spacing = 4;
									var _marginRightInputLabel = add("statictext", undefined, localize(_global.marginRightLabel));
									with(_marginRightInputLabel) {
										justify = "right";
										characters = 6;
									} /* END _marginRightInputLabel */
									var _marginRightInput = add("edittext", undefined, "", { multiline: false });
									with(_marginRightInput) { 
										characters = 9; 
									} /* END _marginRightInput */
								} /* END _marginRightInputGroup */	 
							} /* END _marginsRightInputGroup */
						} /* END _marginsInputGroup */
						var _swapLeftRightMarginsGroup = add("group");
						with(_swapLeftRightMarginsGroup) {
							orientation = "column";
							alignChildren = ["fill","middle"];
							var _swapLeftRightMarginsButton = add ("iconbutton", undefined, _icons.swapLeftRightMargins, { style:"toolbutton", toggle:false });
								with(_swapLeftRightMarginsButton) {
									alignment = "top";
									size = [12,20];
									helpTip = localize(_global.swapLeftRightMarginsButtonButtonHelpTip);
								} /* END _swapLeftRightMarginsButton */
						} /* END _swapLeftRightMarginsGroup */
						var _columnsInputGroup = add("group");
						with(_columnsInputGroup) {
							orientation = "column";
							alignChildren = ["left","fill"];
							spacing = 4;
							var _numberOfColumnsInputGroup = add("group");
							with(_numberOfColumnsInputGroup) {
								spacing = 4;
								var _numberOfColumnsInputLabel = add("statictext", undefined, localize(_global.columnsLabel));
								with(_numberOfColumnsInputLabel) {
									justify = "right";
									characters = 9;
								} /* END _numberOfColumnsInputLabel */
								var _numberOfColumnsInput = add("edittext", undefined, "", { multiline: false });
								with(_numberOfColumnsInput) { 
									characters = 3; 
								} /* END _numberOfColumnsInput */
							} /* END _numberOfColumnsInputGroup */
							var _gutterInputGroup = add("group");
							with(_gutterInputGroup) {
								spacing = 4;
								var _gutterInputLabel = add("statictext", undefined, localize(_global.gutterLabel));
								with(_gutterInputLabel) {
									justify = "right";
									characters = 9;
								} /* END _gutterInputLabel */
								var _gutterInput = add("edittext", undefined, "", { multiline: false });
								with(_gutterInput) { 
									characters = 9; 
								} /* END _gutterInput */
							} /* END _gutterInputGroup */
						} /* END _columnsInputGroup */	
					} /* END _inputMarginsRow */
					/* +++++++++++++++++++++++++++++++++++++++++ */
					/* + Spaltenpositionen – variabler Bereich + */
					/* +++++++++++++++++++++++++++++++++++++++++ */
				} /* END _marginsTab */
				var _optionsTab = add("tab", undefined, localize(_global.optionsTabLabel));
				with(_optionsTab) {
					orientation = "row";
					alignChildren = ["fill","fill"];
					spacing = 10;
					var _optionsPanelGroup = add("group");
					with(_optionsPanelGroup) {
						alignChildren = ["fill","fill"];
						margins.left = 8;
						margins.top = 10;
						var _basicTFPanel = add("panel", undefined, localize(_global.basicTFPanelLabel));
						with(_basicTFPanel) {
							margins = [10,22,8,8];
							alignChildren = "left";
							var _basicTFObjectStyleGroup = add("group");
							with(_basicTFObjectStyleGroup) {
								orientation = "column";
								alignChildren = "left";
								spacing = 5;
								add("statictext", undefined, localize(_global.basicTFObjectStyle));
								var _basicTFObjectStyleDropdownGroup = add("group");
								with(_basicTFObjectStyleDropdownGroup) {
									var _basicTFObjectStyleDropdownList = __getObjectStyleNames();
									var _basicTFObjectStyleDropdown = add("dropdownlist", undefined, _basicTFObjectStyleDropdownList);
									with(_basicTFObjectStyleDropdown) {
										maximumSize.width = 190;
										if(
											_doc.allObjectStyles.length > 2 && 
											_doc.allObjectStyles[2].isValid && 
											_doc.allObjectStyles[2].name == localize(_global.objectStyleBasicTFName)
										) { 
											selection = 2; 
										}
									} /* END _basicTFObjectStyleDropdown */
									var _info = add("iconbutton",undefined,_icons.info, { style: "toolbutton" }); 
									with(_info) {
										visible = true;
										size = [24,24];
										helpTip = localize(_global.basicTFChangeStyleHint);
									} /* END iconbutton _info */
								} /* END _basicTFObjectStyleDropdownGroup */
							} /* END _basicTFObjectStyleGroup */
							var _basicTFFirstBaselineGroup = add("group");
							with(_basicTFFirstBaselineGroup) {
								orientation = "column";
								alignChildren = "left";
								spacing = 4;
								margins.top = 10;
								var _basicTFFirstBaselineLabelGroup = add("group");
								with(_basicTFFirstBaselineLabelGroup) {
									add("statictext", undefined, localize(_global.basicTFFirstBaselineLabel));
								} /* END _basicTFFirstBaselineLabelGroup */
								var _basicTFFirstBaselineOffsetGroup = add("group");
								with(_basicTFFirstBaselineOffsetGroup) {
									spacing = 0;
									var _basicTFFirstBaselineOffsetLabel = add("statictext", undefined, localize(_global.basicTFFirstBaselineOffsetLabel));
									with(_basicTFFirstBaselineOffsetLabel) {
										characters = 8;
									} /* END _basicTFFirstBaselineOffsetLabel */
									var _firstBaselineOffsetDropdownList = [localize(_global.firstBaselineAscentOffset), localize(_global.firstBaselineCapHeight), localize(_global.firstBaselineLeadingOffset), localize(_global.firstBaselineXHeight), localize(_global.firstBaselineFixedHeight)];
									var _basicTFFirstBaselineOffsetDropdown = add("dropdownlist", undefined, _firstBaselineOffsetDropdownList);
									with(_basicTFFirstBaselineOffsetDropdown) {
										/* maximumSize.width = 110; */
									} /* END _basicTFFirstBaselineOffsetDropdown */
								} /* END _basicTFFirstBaselineOffsetGroup */
								var _basicTFFirstBaselineMinGroup = add("group");
								with(_basicTFFirstBaselineMinGroup) {
									spacing = 0;
									var _basicTFFirstBaselineMinLabel = add("statictext", undefined, localize(_global.basicTFFirstBaselineMinLabel));
									with(_basicTFFirstBaselineMinLabel) {
										characters = 8;
									} /* END _basicTFFirstBaselineMinLabel */
									var _basicTFFirstBaselineMin = add("edittext", undefined, "", { multiline: false });
									with(_basicTFFirstBaselineMin) {
										characters = 4;
									} /* END _basicTFFirstBaselineMin */
								} /* END _basicTFFirstBaselineMinGroup */
							} /* END _basicTFFirstBaselineGroup */
						} /* END _basicTFPanel */
						var _generalOptionsPanel = add("panel", undefined, localize(_global.generalOptionsPanelLabel));
						with(_generalOptionsPanel) {
							margins = [10,22,8,8];
							alignChildren = "left";
							var _generalOptionsDocLabel = add("statictext", undefined, localize(_global.generalOptionsDocLabel));
							var _generalOptionsDocGroup = add("group");
							with(_generalOptionsDocGroup) {
								orientation = "column";
								alignment = "left";
								alignChildren = "left";
								spacing = 0;
								var _lockColumnGuidesCheckbox = add("checkbox", undefined, localize(_global.lockColumnGuidesLabel));
								var _layoutAdjustmentCheckbox = add("checkbox", undefined, localize(_global.enableLayoutAdjustmentLabel));
							} /* END _generalOptionsDocGroup */
							var _generalOptionsActivePageLabel = add("statictext", undefined, localize(_global.generalOptionsActivePageLabel));
							var _columnDirectionGroup = add("group");
							with(_columnDirectionGroup) {
								orientation = "column";
								alignChildren = "left";
								spacing = 4;
								var _columnDirectionLabel = add("statictext", undefined, localize(_global.columnDirectionLabel) + ":");
								var _columnDirectionValueGroup = add("group");
								with(_columnDirectionValueGroup) {
									spacing = 8;
									var _columnDirectionHorizontalRadiobutton = add("radiobutton", undefined, localize(_global.columnDirectionHorizontalRadiobuttonLabel));
									var _columnDirectionVerticalRadiobutton = add("radiobutton", undefined, localize(_global.columnDirectionVerticalRadiobuttonLabel));
								} /* END _columnDirectionValueGroup */	
							} /* END _columnDirectionGroup */
						} /* END _generalOptionsPanel */
					} /* END _optionsPanelGroup */
				} /* END _optionsTab */
			} /* END _marginsAndOptionsPanel */	
		} /* END _marginsAndOptionsColumn */
		var _uiButtonColumn = add("group");
		with(_uiButtonColumn) {
			orientation = "column";
			alignChildren = ["fill","fill"];
			margins = [0,0,0,2];
			var _alignUIButtonTopGroup = add("group");
			with(_alignUIButtonTopGroup) {
				orientation = "column";
				alignChildren = ["fill","top"];
				margins = [0,0,0,0];
				spacing = 4;
				var _opacityUIButton = add("iconbutton", undefined, _icons.uiOpacity, { style: "toolbutton", toggle: true} );
				with(_opacityUIButton) {
					size = [33,33];
					helpTip = localize(_global.uiOpacityHelpTip);
				} /* END Button _opacityUIButton */
				var _refreshUIButton = add("iconbutton", undefined, _icons.refresh, { style: "toolbutton"} );
				with(_refreshUIButton) {
					size = [33,33];
					helpTip = localize(_global.refreshHelpTip);
					visible = true;
				} /* END Button _refreshUIButton */
			} /* END _alignUIButtonTopGroup */
			var _alignUIButtonBottomGroup = add("group"); 
			with(_alignUIButtonBottomGroup) {
				orientation = "column";
				alignChildren = ["fill","bottom"];
				margins = [0,0,0,0];
				var _cancelUI = add("iconbutton", undefined, _icons.close, { style: "toolbutton"} );
				with(_cancelUI) {
					size = [33,33];
					helpTip = localize(_global.closeWinHelpTip);
					visible = true;
				} /* END Button _cancelUI */
			} /* END _alignUIButtonBottomGroup */
		} /* END _uiButtonColumn */
	} /* END _ui */
 
 

	/* Callbacks _ui */
	
	_ui.onActivate = function() {
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
		
		_refreshUIButton.notify(); 
	}

	_ui.addEventListener('mouseover', function (_event) {
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
		if(!_global.timeStampBefore) { return; }
		
		/* Mehrfach abgefeuerte Events abfangen */
		var _curTimeStamp = _event.timeStamp.getTime();
		var _lag = _curTimeStamp - _global.timeStampBefore;
		
		if(_lag > _global.uiSensivity) {
			_refreshUIButton.notify();
		}
		
		_event.stopPropagation();
		_event.preventDefault();
		
		_global.timeStampBefore = _curTimeStamp;
	});

	
	_refreshUIButton.onDraw = __buttonOnDraw;
	_refreshUIButton.onClick = function() {
			
		if(app.documents.length === 0 || app.layoutWindows.length == 0 || !_global) { return; }
		
		_global.refresh = true;
		_global.ui.text = localize(_global.uiHead);
		
		/* __press(_ui, this); */
		
		__insertMasterPageLabels();
		__updatePageIcons();
		__insertGridValues(true);
		__insertBasicTFValues(false);
		__insertMarginValues();
		__disableRulerUnitButton(_rulerUnitButtonGroup);
		__insertIncrementValueInPoints(_incrementInputValue, "pt");
		__insertLayoutAdjustmentValue(_layoutAdjustmentCheckbox);	
		__insertColumnDirectionValue(_columnDirectionVerticalRadiobutton,_columnDirectionHorizontalRadiobutton);
		__insertColumnGuideLockedValue(_lockColumnGuidesCheckbox);
		__fillColumnsPositionsRow(_ui,_marginsTab,_lockColumnGuidesCheckbox);
		__hideWaring(_warningDifferentUnits);
		
		_global.refresh = false;
		
		if(app.scriptPreferences.version < 8) {
			_baselineOptionsPanel.selection = _valuesTab; /* Korrigiert fehlerhafte Darstellung des Tab-Panel unter Win CS5 */
		}
	}
	 
	
	_relativeToDropdown.onChange = function() {
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
		if(_global.refresh == true) { return; }
		
		var _doc = app.documents.firstItem();
		
		switch (_relativeToDropdown.selection.index) {
			case 0 :
				_doc.gridPreferences.baselineGridRelativeOption = BaselineGridRelativeOption.TOP_OF_PAGE_OF_BASELINE_GRID_RELATIVE_OPTION;
				break;
			case 1 :
				_doc.gridPreferences.baselineGridRelativeOption = BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION;
				break;
			default :	 
		}
	}
	
	
	_startInputLabel.addEventListener('click', function (_event) {	
		
		if(_event.detail == 2 /* Double-Click */) {
			if(__round(_startInput)) { 
				__setDocPrefs(_startInput,"baselineStart");
			}
		}	 
		__activate(_startInput);
	});
	
	 
	_startInput.onChanging = function() {
		
		if(!_global || _global.refresh == true) { return; }
		__setDocPrefs(_startInput,"baselineStart");
	}

	
	_startInput.onDeactivate = function() {	
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }	
		
		var _doc = app.documents.firstItem();
		var _baselineStartValue = _doc.gridPreferences.baselineStart;
		
		_startInput.text = __convertToOutputFormat(_baselineStartValue);
	}


	_startInput.addEventListener('keydown', function (_event) {
		__keydown(_event, this, "baselineStart", undefined);
	}); /* Increment and decrement values with arrow keys */


	_selectionStartUIButton.onDraw = __buttonOnDraw;
	_selectionStartUIButton.onClick = function() {	 
		__press(_ui, this);
		__setSelectionToBaselineGridStart();	
	}


	_selectionLastBaselineUIButton.onDraw = __buttonOnDraw;
	_selectionLastBaselineUIButton.onClick = function() {	
		__press(_ui, this);
		__adjustGridToLastBaseline();
	}

	_selectionMarginBottomUIButton.onDraw = __buttonOnDraw;
	_selectionMarginBottomUIButton.addEventListener('click', function (_event) {	 
		
		__press(_ui, this);	
		__adjustMarginBottomToSelection(_startInput);
		
		if(!_event.shiftKey) { return; }
		
		__adjustMarginTopToSelection();	 
	});


	_incrementInputLabel.addEventListener('click', function (_event) { 
		
		if(_event.detail == 2 /* Double-Click */) {
			if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
			if(__round(_incrementInput)) { 
				__setDocPrefs(_incrementInput,"baselineDivision");
			}
		}
		__activate(_incrementInput);
	});


	_incrementInput.onChanging = function() {	
			
		if(!_global || _global.refresh == true) { return; }
		
		__setDocPrefs(_incrementInput,"baselineDivision");
		__insertIncrementValueInPoints(_incrementInputValue, "pt");
	}


	_incrementInput.onDeactivate = function() {
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
		
		var _doc = app.documents.firstItem();
		var _baselineDivisionValue = _doc.gridPreferences.baselineDivision;
			 
		_incrementInput.text = __convertToOutputFormat(_baselineDivisionValue);
		__insertIncrementValueInPoints(_incrementInputValue, "pt");
	}


	_incrementInput.addEventListener('keydown', function (_event) { 
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
		
		var _doc = app.documents.firstItem();
		var _rulerUnit = _doc.viewPreferences.horizontalMeasurementUnits.toString();
		var _leadingKeyIncrement = _doc.textPreferences.leadingKeyIncrement;
		var _step;
				
		_step = __convert(_leadingKeyIncrement, "pt", _rulerUnit);	
		if(_step == null) { return; }	
		
		__keydown(_event, this, "baselineDivision", _step);
		__insertIncrementValueInPoints(_incrementInputValue, "pt");
	}); /* Increment and decrement values with arrow keys */

	
	_selectionIncrementUIButton.onDraw = __buttonOnDraw;
	_selectionIncrementUIButton.onClick = function() {
		__press(_ui, this);
		__setSelectionToIncrement();
	}

	_divideIncrementBy2UIButton.onDraw = __buttonOnDraw;
	_divideIncrementBy2UIButton.onClick = function() {
		__press(_ui, this);
		__divideIncrementBy2();
	}


	_divideIncrementBy3UIButton.onDraw = __buttonOnDraw;
	_divideIncrementBy3UIButton.onClick = function() {
		__press(_ui, this);
		__divideIncrementBy3();
	}


	_baselineColorDropdown.onChange = function() {
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
		if(_global.refresh == true) { return; }
		
		var _doc = app.documents.firstItem();
		var _colorName = _baselineColorDropdown.selection.text;
		var _colorEnum = __getUIColorEnum(_colorName);
					
		if(_colorName != localize(_global.userDefined)) {
			_doc.gridPreferences.baselineColor = UIColors[_colorEnum]; /* ### -> document property */
		} else {
			__setUserDefinedBaslineColor(); /* Wechsel von UI-Farbe auf »Benutzerdefiniert«: Farbwerte aus InDesign-UI nicht auslesbar */
		}
	} 


	_userDefinedRedLabel.addEventListener('click', function () { 
		__activate(_userDefinedRed);
	});


	_userDefinedRed.onChanging = function() {
		
		if(!_global || _global.refresh == true) { return; }
		__setUserDefinedBaslineColor();
	}


	_userDefinedGreenLabel.addEventListener('click', function () { 
		__activate(_userDefinedGreen);
	});


	_userDefinedGreen.onChanging = function() {
		
		if(!_global || _global.refresh == true) { return; }
		__setUserDefinedBaslineColor();
	}


	_userDefinedBlueLabel.addEventListener('click', function () { 
		__activate(_userDefinedBlue);
	});


	_userDefinedBlue.onChanging = function() {
		
		if(!_global || _global.refresh == true) { return; }
		__setUserDefinedBaslineColor();
	}


	_viewThresholdInputLabel.addEventListener('click', function () { 
		__activate(_viewThresholdInput);
	});


	_viewThresholdInput.onChanging = function() {
			
		if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
		if(_global.refresh == true) { return; }
		
		var _doc = app.documents.firstItem();
		var _viewThresholdInputNumber = Number(_viewThresholdInput.text.replace(",",".","g").replace("[a-z+-]","","gi"));
		
		if(_viewThresholdInput.text != "" && !isNaN(_viewThresholdInputNumber) && _viewThresholdInputNumber >= 5 && _viewThresholdInputNumber <= 4000) {	 
			try {
				_doc.gridPreferences.baselineViewThreshold = _viewThresholdInputNumber; /* ### -> document property */
			} catch(_error) { 
				if(_global.debug) {
					$.writeln(_error.message + "; Zeile: " + _error.line);
				}
			}
		} 
	}


	_gridsInBack.onClick = function() { 
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
		
		var _doc = app.documents.firstItem();
		
		if(_gridsInBack.value == true) {
			 _doc.gridPreferences.gridsInBack = true; /* ### -> document property */
		} else {
			 _doc.gridPreferences.gridsInBack = false; /* ### -> document property */
		}
	}


	_marginTopButton.onClick = function() {
		__setMarginAuto("Top",true,false);
	}
	
	
	_marginLeftButton.onClick = function() {
		__setMarginAuto("Left",true,false);
	}
	
	
	_marginRightButton.onClick = function() {
		__setMarginAuto("Right",true,false);
	}
	
	
	_marginBottomButton.onClick = function() {
		__setMarginAuto("Bottom",true,false);
	}


	_allMarginsButton.onDraw = __buttonOnDraw;
	_allMarginsButton.onClick = function() { 
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
		
		var _doc;
		var _userLayoutAdjustment
		
		__press(_ui, this);
		
		_doc = app.documents.firstItem();
		
		if(_doc.hasOwnProperty("layoutAdjustmentPreferences")) {
			/* InDesign bis CC2018 */
			_userLayoutAdjustment = _doc.layoutAdjustmentPreferences.enableLayoutAdjustment;
			_doc.layoutAdjustmentPreferences.enableLayoutAdjustment = false; /* ### -> document property */
		} else {
			/* InDesign ab CC2019 */
			_userLayoutAdjustment = _doc.adjustLayoutPreferences.enableAdjustLayout;
			_doc.adjustLayoutPreferences.enableAdjustLayout = false; /* ### -> document property */
		}
		
		__setMarginAuto("Top",true,true);
		__setMarginAuto("Left",false,false);
		__setMarginAuto("Right",false,false);
		__setMarginAuto("Bottom",false,false);
		
		if(_doc.hasOwnProperty("layoutAdjustmentPreferences")) {
			/* InDesign bis CC2018 */
			_doc.layoutAdjustmentPreferences.enableLayoutAdjustment = _userLayoutAdjustment; /* ### -> document property */
		} else {
			/* InDesign ab CC2019 */
			_doc.adjustLayoutPreferences.enableAdjustLayout = _userLayoutAdjustment; /* ### -> document property */
		}
	}


	_flipMarginsButton.onDraw = __buttonOnDraw;
	_flipMarginsButton.onClick = function() {
		
		__press(_ui, this);
		
		if (app.scriptPreferences.version >= 6) {
			app.doScript(__flipMargins, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, localize(_global.flipButtonHelpTip));
		} else { 
			__flipMargins(); 
		}	
	}


	_transferMarginsToMasterButton.onDraw = __pageIconOnDraw;
	_transferMarginsToMasterButton.addEventListener('click', function(_event) { 
		
		__press(_ui, this);
		
		if (app.scriptPreferences.version >= 6) {
			app.doScript(__transferMarginsToMaster, ScriptLanguage.JAVASCRIPT, [_event.shiftKey,_event.altKey], UndoModes.ENTIRE_SCRIPT, localize(_global.transferMarginsToMasterGoBackLabel)); 
		} else { 
			__transferMarginsToMaster([_event.shiftKey,_event.altKey]); 
		} 
	});

	
	_spinLineGroupTop.onDraw = __spinLineGroupOnDraw;
	_spinLineGroupBottom.onDraw = __spinLineGroupOnDraw;	
	
	
	_singlePageButton.onDraw = __pageIconOnDraw;
	_singlePageButton.onClick = function() {
		
		if(_rightPageButton.visible === true && _rightPageButton.value) {
			_singlePageButton.value = !_singlePageButton.value;
		}
		_refreshUIButton.notify();
	}


	_leftPageButton.onDraw = __pageIconOnDraw;
	_leftPageButton.onClick = function() {
		
		if(_rightPageButton.visible === true && _rightPageButton.value) {
			_rightPageButton.value = !_leftPageButton.value;
		}
		_refreshUIButton.notify();
	}


	_rightPageButton.onDraw = __pageIconOnDraw;
	_rightPageButton.onClick = function() {
		
		if(_rightPageButton.visible === true && _leftPageButton.value) {
			_leftPageButton.value = !_rightPageButton.value;
		}
		_refreshUIButton.notify();
	}


	_chainMarginsButton.onDraw = __chainMarginsButtonOnDraw;
	_chainMarginsButton.onClick = function() {
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"],_marginTopInput);
		}
	}
	
	
	_swapLeftRightMarginsButton.onDraw = __swapLeftRightMarginsButtonOnDraw;
	_swapLeftRightMarginsButton.onClick = function() {
		
		if (app.scriptPreferences.version >= 6) {
			app.doScript(__swapLeftRightMargins, ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, localize(_global.swapLeftRightMarginsGoBackLabel)); 
		} else { 
			__swapLeftRightMargins(); 
		} 
		
		_refreshUIButton.notify();
	}
	

	_marginTopInputLabel.addEventListener('click', function (_event) {
		
		if(_event.detail == 2 /* Double-Click */) {
			if(__round(_marginTopInput)) {
				_marginTopInput.notify();
			} 
		}
	
		__activate(_marginTopInput);
	});

	_marginTopInput.onChanging = function() {	 
		
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"], _marginTopInput);
		} else {
			__setMarginManual("Top", _marginTopInput);
		}
	}
	
	_marginTopInput.onChange = function() {	 
		
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"], _marginTopInput);
		} else {
			__setMarginManual("Top", _marginTopInput);
		}
	}


	_marginTopInput.addEventListener('keydown', function (_event) { 
		
		if(_chainMarginsButton.value === true) {
			__keydown(_event, _marginTopInput, "Top", undefined);
			__chainMargins(["Bottom","Left","Right"], _marginTopInput);
		} else {
			__keydown(_event, _marginTopInput, "Top", undefined);
		}
	}); /* Increment and decrement values with arrow keys */


	_marginBottomInputLabel.addEventListener('click', function (_event) {
		
		if(_event.detail == 2 /* Double-Click */) {
			if(__round(_marginBottomInput)) { 
				_marginBottomInput.notify();
			}
		}
		__activate(_marginBottomInput);
	});

	_marginBottomInput.onChanging = function() { 
		
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"], _marginBottomInput);
		} else {
			__setMarginManual("Bottom", _marginBottomInput);
		}
	}

	_marginBottomInput.onChange = function() { 
		
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"], _marginBottomInput);
		} else {
			__setMarginManual("Bottom", _marginBottomInput);
		}
	}

	_marginBottomInput.addEventListener('keydown', function (_event) {
		
		if(_chainMarginsButton.value === true) {
			__keydown(_event, _marginBottomInput, "Bottom", undefined);
			__chainMargins(["Top","Left","Right"], _marginBottomInput);
		} else {
			__keydown(_event, _marginBottomInput, "Bottom", undefined); 
		}
	}); /* Increment and decrement values with arrow keys */
	
	
	_marginLeftInputLabel.addEventListener('click', function (_event) { 
		
		if(_event.detail == 2 /* Double-Click */) {
			if(__round(_marginLeftInput)) {
				_marginLeftInput.notify();
			} 
		}
		__activate(_marginLeftInput);
	});

	_marginLeftInput.onChanging = function() {
		
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"], _marginLeftInput);
		} else {
			__setMarginManual("Left", _marginLeftInput);
		}
	}

	_marginLeftInput.onChange = function() {
		
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"], _marginLeftInput);
		} else {
			__setMarginManual("Left", _marginLeftInput);
		}
	}

	_marginLeftInput.addEventListener('keydown', function (_event) { 
		
		if(_chainMarginsButton.value === true) {
			__keydown(_event, _marginLeftInput, "Left", undefined);
			__chainMargins(["Top","Bottom","Right"], _marginLeftInput);
		} else {
			__keydown(_event, _marginLeftInput, "Left", undefined);
		}
	}); /* Increment and decrement values with arrow keys */


	_marginRightInputLabel.addEventListener('click', function (_event) {
		
		if(_event.detail == 2 /* Double-Click */) {
			if(__round(_marginRightInput)) {
				_marginRightInput.notify();
			}
		}
		__activate(_marginRightInput);
	});

	_marginRightInput.onChanging = function() { 
		
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"], _marginRightInput);
		} else {
			__setMarginManual("Right", _marginRightInput);
		}
	}

	_marginRightInput.onChange = function() { 
		
		if(_chainMarginsButton.value === true) {
			__chainMargins(["Top","Bottom","Left","Right"], _marginRightInput);
		} else {
			__setMarginManual("Right", _marginRightInput);
		}
	}

	_marginRightInput.addEventListener('keydown', function (_event) {
		
		if(_chainMarginsButton.value === true) {
			__keydown(_event, _marginRightInput, "Right", undefined);
			__chainMargins(["Top","Bottom","Left"], _marginRightInput);
		} else {
			__keydown(_event, _marginRightInput, "Right", undefined);
		}
	}); /* Increment and decrement values with arrow keys */

	
	_numberOfColumnsInputLabel.addEventListener('click', function () { 
		__activate(_numberOfColumnsInput);
	});

	_numberOfColumnsInput.onChanging = function() { 
		__setColumnCountManual(_numberOfColumnsInput);
		__fillColumnsPositionsRow(_ui,_marginsTab,_lockColumnGuidesCheckbox);
	}

	_numberOfColumnsInput.addEventListener('keydown', function (_event) { 
		__keydown(_event, this, "columnCount", "1");
		__fillColumnsPositionsRow(_ui,_marginsTab,_lockColumnGuidesCheckbox);
	}); /* Increment and decrement values with arrow keys */


	_gutterInputLabel.addEventListener('click', function (_event) {
		
		if(_event.detail == 2 /* Double-Click */) {
			if(__round(_gutterInput)) {
				_gutterInput.notify();
			}
		}
		__activate(_gutterInput);
	});

	_gutterInput.onChanging = function() { 
		__setColumnGutterManual(_gutterInput);
	}

	_gutterInput.onChange = function() { 
		__setColumnGutterManual(_gutterInput);
	}

	_gutterInput.addEventListener('keydown', function (_event) {
		__keydown(_event, this, "columnGutter", undefined); 
	}); /* Increment and decrement values with arrow keys */


	_basicTFObjectStyleDropdown.onChange = function() {
		
		if(!_global || _global.refresh == true) { return; }
		if(_basicTFObjectStyleDropdown.selection == null) { return; }
		
		__insertBasicTFValues(true); 
	}


	_layoutAdjustmentCheckbox.onClick = function() {
		__setLayoutAdjustment(_layoutAdjustmentCheckbox);
	}

	
	_lockColumnGuidesCheckbox.onClick = function() {
		__setColumnGuideLock(_ui, _marginsTab, _lockColumnGuidesCheckbox);
	}


	_columnDirectionVerticalRadiobutton.onClick = function() {
		__setColumnDirection(_columnDirectionVerticalRadiobutton, _columnDirectionHorizontalRadiobutton);
	}
	
	_columnDirectionHorizontalRadiobutton.onClick = function() {
		__setColumnDirection(_columnDirectionVerticalRadiobutton, _columnDirectionHorizontalRadiobutton);
	}
	

	_basicTFFirstBaselineOffsetDropdown.onChange = function() { 
		
		if(!_global || _global.refresh == true) { return; }
		if(_global.insertBasicTFValues == true) { return; }
		
		__setBasicTFFirstBaselineOffset(_basicTFObjectStyleDropdown, _basicTFFirstBaselineOffsetDropdown);
	} 


	_basicTFFirstBaselineMinLabel.addEventListener('click', function () { 
		__activate(_basicTFFirstBaselineMin);
	});

	
	_basicTFFirstBaselineMin.onChanging = function() {
	
		if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
		if(_global.refresh == true) { return; }
		
		var _doc = app.documents.firstItem();
		var _basicTFObjectStyleIndex;

		if(_basicTFObjectStyleDropdown.selection == null) { return; }
		_basicTFObjectStyleIndex = _basicTFObjectStyleDropdown.selection.index;
		if(!_doc.allObjectStyles[_basicTFObjectStyleIndex].isValid) { return; }
		
		__setDocPrefs(_basicTFFirstBaselineMin,"minimumFirstBaselineOffset") 
	}
	
	
	_basicTFFirstBaselineMin.addEventListener('keydown', function (_event) {
		__keydown(_event, this, "minimumFirstBaselineOffset", undefined); 
	}); /* Increment and decrement values with arrow keys */



	_ptButton.onDraw = __buttonOnDraw;
	_ptButton.onClick = function() {
		__press(_ui, this);
		__setDocMeasurementUnits("POINTS");
		_refreshUIButton.notify();
	}	
	
	
	_mmButton.onDraw = __buttonOnDraw;
	_mmButton.onClick = function() {
		__press(_ui, this);
		__setDocMeasurementUnits("MILLIMETERS");
		_refreshUIButton.notify();
	}
	
	
	_cmButton.onDraw = __buttonOnDraw;
	_cmButton.onClick = function() {
		__press(_ui, this);
		__setDocMeasurementUnits("CENTIMETERS");
		_refreshUIButton.notify();
	}
	
	
	_inchButton.onDraw = __buttonOnDraw;
	_inchButton.onClick = function() {
		__press(_ui, this);
		__setDocMeasurementUnits("INCHES");
		_refreshUIButton.notify(); 
	}
	
	
	_pButton.onDraw = __buttonOnDraw;
	_pButton.onClick = function() {
		__press(_ui, this);
		__setDocMeasurementUnits("PICAS");
		_refreshUIButton.notify();
	}
	
	
	_pxButton.onDraw = __buttonOnDraw;
	_pxButton.onClick = function() {
		__press(_ui, this);
		__setDocMeasurementUnits("PIXELS");
		_refreshUIButton.notify();
	}
	
	
	_ui.addEventListener('mousedown', function () { 
		__hideWaring(_warningDifferentUnits);
	}, true);


	_showGrid.onDraw = __buttonOnDraw;
	_showGrid.onClick = function() {
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
		
		var _doc = app.documents.firstItem();
		
		_doc.gridPreferences.baselineGridShown = true; /* ### -> document property */
		__press(_ui, this);
		_showGrid.visible = false;
		_hideGrid.visible = true;
	}

	
	_hideGrid.onDraw = __buttonOnDraw;
	_hideGrid.onClick = function() {
		
		if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
		
		var _doc = app.documents.firstItem();
		
		_doc.gridPreferences.baselineGridShown = false; /* ### -> document property */
		__press(_ui, this);
		_showGrid.visible = true;
		_hideGrid.visible = false;
	} 
	
	
	_opacityUIButton.onDraw = __buttonOnDraw;
	_opacityUIButton.onClick = function() { 
		if(this.value === false) {
			_ui.opacity = 1;
		} else {
			_ui.opacity = 0.4;
		}
	}


	_info.onClick = function() {
		alert(localize(_global.basicTFChangeStyleHint));
	}

	
	_cancelUI.onDraw = __buttonOnDraw;
	_cancelUI.onClick = function() { 
		_ui.close(2);
	}
	
	
	_ui.onClose = function() {
		_global = null;
	}
	/* END Callbacks _ui */


	/* Define global properties */
	
	_global.refresh = false;
	_global.ui = _ui;
	
	_global.insertBasicTFValues = false;
	_global.relativeToDropdownList = _relativeToDropdownList;
	_global.relativeToDropdown = _relativeToDropdown;
	_global.startInput = _startInput;
	_global.incrementInput = _incrementInput;
	_global.incrementInputValue = _incrementInputValue;
	
	_global.viewThresholdInput = _viewThresholdInput;
	_global.baselineColorDropdown = _baselineColorDropdown;
	_global.baselineColorDropdownList = _baselineColorDropdownList;
	_global.userDefinedRed = _userDefinedRed;
	_global.userDefinedGreen = _userDefinedGreen;
	_global.userDefinedBlue = _userDefinedBlue;
	_global.gridsInBack = _gridsInBack;
	_global.showGrid = _showGrid;
	_global.hideGrid = _hideGrid;	
	
	_global.marginLeftInputLabel = _marginLeftInputLabel;
	_global.marginRightInputLabel = _marginRightInputLabel;
	_global.marginTopButton = _marginTopButton;
	_global.marginLeftButton = _marginLeftButton;
	_global.marginRightButton = _marginRightButton;
	_global.marginBottomButton = _marginBottomButton;
	_global.marginTopInput = _marginTopInput;
	_global.marginBottomInput = _marginBottomInput;
	_global.marginLeftInput = _marginLeftInput;
	_global.marginRightInput = _marginRightInput;
	_global.numberOfColumnsInput = _numberOfColumnsInput;
	_global.gutterInput = _gutterInput;
	
	_global.spinLineGroupTop = _spinLineGroupTop;
	_global.spinLineGroupBottom = _spinLineGroupBottom;
	_global.pageIconFacingGroup = _pageIconFacingGroup;
	_global.pageIconSingleGroup = _pageIconSingleGroup;
	_global.singlePageButton = _singlePageButton;
	_global.leftPageButton = _leftPageButton;
	_global.rightPageButton = _rightPageButton;
	
	_global.transferMarginsToMasterButton = _transferMarginsToMasterButton;
	_global.transferMarginsToMasterLabel = _transferMarginsToMasterLabel;
	
	_global.basicTFObjectStyleDropdown = _basicTFObjectStyleDropdown;
	_global.basicTFFirstBaselineOffsetDropdown = _basicTFFirstBaselineOffsetDropdown;
	_global.basicTFFirstBaselineMin = _basicTFFirstBaselineMin;
	
	/* END Define global properties */
	
	
	_ui.show();
	_ui.layout.layout(true);
	
	return;
} /* END function __showUI */




function __setSelectionToBaselineGridStart() {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return false; }
	
	const _minValueBaselineStart = 0;
	const _maxValueBaselineStart = 1000;
	
	var _doc = app.documents.firstItem();
	var _userZeroPoint;
	var _activePage;
	var _firstIP;
	var _baselineStart;
	var _baselineStartValue;
	var _baselineStartValueInPoints;
	var _rulerUnit = _doc.viewPreferences.horizontalMeasurementUnits.toString();
	
	if(app.selection.length != 0 && app.selection[0].hasOwnProperty("insertionPoints")) {
		
		_userZeroPoint = _doc.zeroPoint; 
		_doc.zeroPoint = [0,0];
		
		try { 
			
			_activePage = __getPage("selection","alert");
			if(!_activePage || !_activePage.isValid) { return false; }
			
			_firstIP = app.selection[0].insertionPoints[0];
			_baselineStart = _firstIP.baseline;
			
			if(_doc.gridPreferences.baselineGridRelativeOption == BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) {				 
				_baselineStart -= _activePage.marginPreferences.top;		 
			}
			
			_baselineStartValueInPoints = __convert(_baselineStart,_rulerUnit,"pt"); 
			if(_baselineStartValueInPoints != null && _baselineStart >= _minValueBaselineStart && _baselineStartValueInPoints <= _maxValueBaselineStart) {
				_doc.gridPreferences.baselineStart = _baselineStart; /* ### -> document property */
				_baselineStartValue = _doc.gridPreferences.baselineStart;
				_global.startInput.text = __convertToOutputFormat(_baselineStartValue);
				_global.ui.text = localize(_global.uiHead);
			} else {
				_global.ui.text = localize(_global.selectionStartAlertLabel);
			}	 
		} catch(_error) {
			if(_global.debug) {
				$.writeln(_error.message + "; Zeile: " + _error.line);
			}
		} finally {
			_doc.zeroPoint = _userZeroPoint;
		}
		
		_global.ui.text = localize(_global.uiHead);
	} else {
		_global.ui.text = localize(_global.noTextSelectedErrorMessage);
	}
	
	return true;
} /* END function __setSelectionToBaselineGridStart */



function __adjustGridToLastBaseline() {
			
	if(app.documents.length === 0 || app.layoutWindows.length == 0 || !_global) { return false; }

	const _correctionValue = 0;
	
	var _doc = app.documents.firstItem();
	var _userZeroPoint;
	var _activePage;
	var _firstIP;
	var _parentTextFrames;
	var _baselineStart;
	var _baselineStartValue;
	var _baselineDivisionValue;
	var _offset;
				
	if(app.selection.length !== 0 && app.selection[0].hasOwnProperty("insertionPoints")) {
		
		_userZeroPoint = _doc.zeroPoint; 
		_doc.zeroPoint = [0,0];
		
		try { 
			
			_activePage = __getPage("selection","alert");
			if(!_activePage || !_activePage.isValid) { return false; }
			
			_firstIP = app.selection[0].insertionPoints[0];
			_parentTextFrames = _firstIP.parentTextFrames;
			
			if(_parentTextFrames.length > 0 && _parentTextFrames[0].isValid && _parentTextFrames[0] instanceof TextFrame) {
				
				_baselineDivisionValue = _doc.gridPreferences.baselineDivision;
				
				if(_parentTextFrames[0].textColumns.length > 0) {
					_baselineStart = _parentTextFrames[0].textColumns[0].lines.lastItem().baseline;
				} else {
					_baselineStart = _parentTextFrames[0].lines.lastItem().baseline;
				}
			
				_offset = _baselineStart;
				
				if(_doc.gridPreferences.baselineGridRelativeOption === BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) {
					_correctionValue = _activePage.marginPreferences.top;
				}
			
				/* Modulo bei Fliesskommazahl zu ungenau */
				while(_offset > _baselineDivisionValue + _correctionValue) {
					_offset -= _baselineDivisionValue;
				}
				_baselineStart = _offset;
				
			} else {
				_baselineStart = _firstIP.baseline;
			}
			
			if(_doc.gridPreferences.baselineGridRelativeOption === BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) { 
				_baselineStart -= _activePage.marginPreferences.top;
			}
			
			if(_baselineStart > 0) {
				_doc.gridPreferences.baselineStart = _baselineStart; /* ### -> document property */
				_baselineStartValue = _doc.gridPreferences.baselineStart;
				_global.startInput.text = __convertToOutputFormat(_baselineStartValue);
			}
		} catch(_error) { 
			if(_global.debug) {
				$.writeln(_error.message + "; Zeile: " + _error.line);
			} 
		} finally {
			_doc.zeroPoint = _userZeroPoint;
		}
		
		_global.ui.text = localize(_global.uiHead);
	} else {
		_global.ui.text = localize(_global.noTextSelectedErrorMessage);
	}
	
	return true;
} /* END function __adjustGridToLastBaseline() */



function __setSelectionToIncrement() {
			
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _doc = app.documents.firstItem();
	var _userZeroPoint;
	var _firstIP;
	var _baselineDivision;
	var _baselineDivisionValue;
	
	if(app.selection.length != 0 && app.selection[0].hasOwnProperty("insertionPoints")) {
		
		_userZeroPoint = _doc.zeroPoint; 
		_doc.zeroPoint = [0,0];
		_firstIP = app.selection[0].insertionPoints[0];
		_baselineDivision = 0;

		if (_firstIP.leading == Leading.AUTO) {
			_baselineDivision = _firstIP.pointSize*(_firstIP.autoLeading/100)
			_baselineDivision = _baselineDivision + " pt";
		}
		else {
			_baselineDivision = _firstIP.leading + " pt";
		}
		
		try { 
			_doc.gridPreferences.baselineDivision = _baselineDivision; /* ### -> document property */
			_baselineDivisionValue = _doc.gridPreferences.baselineDivision;
			_global.incrementInput.text = __convertToOutputFormat(_baselineDivisionValue);
			__insertIncrementValueInPoints(_global.incrementInputValue, "pt");
			_global.ui.text = localize(_global.uiHead);
		} catch(_error) { 
			if(_global.debug) {
				$.writeln(_error.message + "; Zeile: " + _error.line);
			} 
		} finally {
			_doc.zeroPoint = _userZeroPoint;
		}
	} else {
		_global.ui.text = localize(localize(_global.noTextSelectedErrorMessage));
	}

	return true;
} /* END function __setSelectionToIncrement */



function __divideIncrementBy2() {
			
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
	
	var _doc = app.documents.firstItem();
	var _rulerUnit = _doc.viewPreferences.horizontalMeasurementUnits.toString();
	var _inputValue;
	var _inputValueInPoints;
	var _baselineDivision;
	var _baselineDivisionValue;
	
	try { 
		_baselineDivision = _doc.gridPreferences.baselineDivision; 
		_inputValue = Number(_baselineDivision) / 2; 
		_inputValueInPoints = __convert(_inputValue, _rulerUnit, "pt");
		if(_inputValueInPoints >= 1 && _inputValueInPoints < 8640) {
			_doc.gridPreferences.baselineDivision = _inputValue; /* ### -> document property */
			_baselineDivisionValue = _doc.gridPreferences.baselineDivision;
			_global.incrementInput.text = __convertToOutputFormat(_baselineDivisionValue);
			__insertIncrementValueInPoints(_global.incrementInputValue, "pt");
		}
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		}
	}

	return true;
} /* END function __divideIncrementBy2 */



function __divideIncrementBy3() {

	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
	
	var _doc = app.documents.firstItem();
	var _rulerUnit = _doc.viewPreferences.horizontalMeasurementUnits.toString();
	var _inputValue;
	var _inputValueInPoints;
	var _baselineDivision;
	var _baselineDivisionValue;
	
	try { 
		_baselineDivision = _doc.gridPreferences.baselineDivision; 
		_inputValue = Number(_baselineDivision) / 3; 
		_inputValueInPoints = __convert(_inputValue, _rulerUnit, "pt");
		
		if(_inputValueInPoints >= 1 && _inputValueInPoints < 8640) {
			_doc.gridPreferences.baselineDivision = _inputValue; /* ### -> document property */
			_baselineDivisionValue = _doc.gridPreferences.baselineDivision;
			_global.incrementInput.text = __convertToOutputFormat(_baselineDivisionValue);
			__insertIncrementValueInPoints(_global.incrementInputValue, "pt");
		}
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		}
	}
} /* END function __divideIncrementBy3 */



function __setDocPrefs(_input,_prop) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	const _minValueBaselineStart = 0;
	const _maxValueBaselineStart = 1000;
	const _minValueBaselineDivison = 1;
	const _maxValueBaselineDivison = 8640;
	const _minValueFirstBaselineOffset = 0;
	const _maxValueFirstBaselineOffset = 8640;
	
	var _doc = app.documents.firstItem();
	var _inputValue;
	var _rulerUnit = _doc.viewPreferences.horizontalMeasurementUnits.toString();
	var _inputValueInPoints;
	var _basicTFObjectStyleIndex;
	var _basicTFObjectStyle;
	 
	_inputValue = __getConvertedInputValue (_input); 
	if(_inputValue == null) { return; } 
	
	switch (_prop) {
		case "baselineStart" :
			_inputValueInPoints = __convert(_inputValue,_rulerUnit,"pt");
			if(_inputValueInPoints == null || _inputValueInPoints < _minValueBaselineStart || _inputValueInPoints > _maxValueBaselineStart) { return; }
			try { 
				_doc.gridPreferences[_prop] = _inputValue; /* ### -> document property */
			} catch(_error) { 
				if(_global.debug) {
					$.writeln(_error.message + "; Zeile: " + _error.line);
				} 
			}
			break;
		case "baselineDivision" :
			_inputValueInPoints = __convert(_inputValue,_rulerUnit,"pt");
			if(_inputValueInPoints == null || _inputValueInPoints < _minValueBaselineDivison || _inputValueInPoints > _maxValueBaselineDivison) { return; }
			try { 
				_doc.gridPreferences[_prop] = _inputValue; /* ### -> document property */
			} catch(_error) { 
				if(_global.debug) {
					$.writeln(_error.message + "; Zeile: " + _error.line);
				} 
			}
			break;
		case "minimumFirstBaselineOffset" :
			_inputValueInPoints = __convert(_inputValue,_rulerUnit,"pt");
			if(_inputValueInPoints == null || _inputValueInPoints < _minValueFirstBaselineOffset || _inputValueInPoints > _maxValueFirstBaselineOffset) { return; }
			if(_global.basicTFObjectStyleDropdown.selection == null) { return; }
			_basicTFObjectStyleIndex = _global.basicTFObjectStyleDropdown.selection.index;
			if(!_doc.allObjectStyles[_basicTFObjectStyleIndex].isValid) { return; }
			_basicTFObjectStyle = _doc.allObjectStyles[_basicTFObjectStyleIndex]; 
			try { 
				_basicTFObjectStyle.textFramePreferences[_prop] = _inputValue;  /* ### -> basic textframe property */
			} catch(_error) { 
				if(_global.debug) {
					$.writeln(_error.message + "; Zeile: " + _error.line);
				} 
			}
			break;
		case "Top" :
			__setMarginManual(_prop, _input);
			break;
		case "Bottom" :
			__setMarginManual(_prop, _input);
			break;
		case "Left" :
			__setMarginManual(_prop, _input);
			break;
		case "Right" :
			__setMarginManual(_prop, _input);
			break;
		case "columnCount" :
			__setColumnCountManual(_input);
			break; 
		case "columnGutter" :
			__setColumnGutterManual(_input);
			break;
		case "columnsPositions" :
			__setColumnsPositionsManual(_input);
			break;
		default :
	}

	return;
} /* END function __setDocPrefs */



function __keydown(_event, _inputField, _prop, _step) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return false; }
	if(_event.keyName !== "Up" && _event.keyName !== "Down") { return false; }
	 
	var _doc = app.documents.firstItem();
	var _inputNumber;
	
	if(_step == undefined) {
		_step = _doc.viewPreferences.cursorKeyIncrement;
	}

	_step = Number(_step);
	if(isNaN(_step)) { return false; }

	if(_event.shiftKey) {	
		if(_prop == "baselineStart" && _event.ctrlKey) { 
			app.select(NothingEnum.NOTHING); /* Ausgewaehltes Objekt wird bei gedruecker crtl-/cmd-Taste mit den Pfeiltasten verschoben */
			_step = _doc.gridPreferences.baselineDivision;
		} else if(_event.metaKey) {
			app.select(NothingEnum.NOTHING); /* Ausgewaehltes Objekt wird bei gedruecker crtl-/cmd-Taste mit den Pfeiltasten verschoben */
			_step = _step / 10;
		} else {
			_step = _step * 10;
		}
	} 

	switch(_event.keyName) {
		case "Up":
			_inputNumber = __getConvertedInputValue (_inputField);
			_inputField.text = __convertToOutputFormat(_inputNumber + _step);
			__setDocPrefs(_inputField, _prop);
			break;
		case "Down": 
			_inputNumber = __getConvertedInputValue (_inputField);
			if((_inputNumber - _step) >= 0) {
				_inputField.text = __convertToOutputFormat(_inputNumber - _step);
				__setDocPrefs(_inputField, _prop);
			} 
			break;
		default:
	}
	
	/* Bugfix InDesign Version CC: Keyboard Event »keydown« wird 2-mal ausgeloest */
	if(_event.keyName == "Up" || _event.keyName == "Down") {
		_event.preventDefault(); 
	}

	return;
} /* END function __keydown */



function __insertGridValues(_refresh) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _doc = app.documents.firstItem();
	
	if (_refresh || !_global.startInput.active) { 
		_global.startInput.text = __convertToOutputFormat(_doc.gridPreferences.baselineStart);
	} 
	
	if (_refresh || !_global.relativeToDropdown.active) {
	
		switch (_doc.gridPreferences.baselineGridRelativeOption) {
			case BaselineGridRelativeOption.TOP_OF_PAGE_OF_BASELINE_GRID_RELATIVE_OPTION :
				_global.relativeToDropdown.selection = 0;
				break;
			case BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION :
				_global.relativeToDropdown.selection = 1;
				break;
			default :	
		} 
	}
	
	if (_refresh || !_global.incrementInput.active) {
		_global.incrementInput.text = __convertToOutputFormat(_doc.gridPreferences.baselineDivision);
	}

	if (_refresh || !_global.viewThresholdInput.active) {
		_global.viewThresholdInput.text = Math.round(_doc.gridPreferences.baselineViewThreshold);
	}

	if (_refresh || !_global.baselineColorDropdown.active) {
		
		var _baselineColor = _doc.gridPreferences.baselineColor;
		var _colorIndex = __getBaselineColorIndex(_baselineColor);	 
		
		_global.baselineColorDropdown.selection = _colorIndex; 
		
		if(_colorIndex == _global.baselineColorDropdownList.length - 1) {
			_global.userDefinedRed.text = Math.round(_doc.gridPreferences.baselineColor[0]);
			_global.userDefinedGreen.text = Math.round(_doc.gridPreferences.baselineColor[1]);
			_global.userDefinedBlue.text = Math.round(_doc.gridPreferences.baselineColor[2]);
		} 
	}

	if(_doc.gridPreferences.gridsInBack) {
		_global.gridsInBack.value = true;
	} else {
		_global.gridsInBack.value = false;
	}
	 
	if(_doc.gridPreferences.baselineGridShown) { 
		_global.showGrid.visible = false;
		_global.hideGrid.visible = true;
	} else {
		_global.showGrid.visible = true;
		_global.hideGrid.visible = false;
	}

	return;
} /* END function __insertGridValues */



function __getUIColorList() {
	
	if(!_global) { return; }
	
	var _allUIColors = [];
	var i;
 
	for(i in _global.uiColors) { 
		_allUIColors.push(_global.uiColors[i].toString());	 
	} 
	
	return _allUIColors;
} /* END function __getUIColorList */



function __getUIColorEnum(_colorName) {
	
	if(!_global) { return; }
	
	var _colorEnum;
	
	for(_colorEnum in _global.uiColors) { 
		if(_global.uiColors[_colorEnum] == _colorName) {
			return _colorEnum;
		}
	}
	
	return "GRID_BLUE";
} /* END function __getUIColorEnum */



function __getBaselineColorIndex(_baselineColor) {
	
	if(!_global) { return; }
	
	var _colorArrayLength = _global.baselineColorDropdownList.length;
	var _baselineColorName = _global.uiColors[_baselineColor.toString()];
	var i;
	
	for(i=0; i<_colorArrayLength;i++) {	 
		if(_baselineColorName == _global.baselineColorDropdownList[i]) {
			return i;
		}
	}

	return _colorArrayLength - 1;
} /* END function __getBaselineColorIndex */



function __setUserDefinedBaslineColor() {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _doc = app.documents.firstItem();
	var _r = Number(_global.userDefinedRed.text);
	var _g = Number(_global.userDefinedGreen.text);
	var _b = Number(_global.userDefinedBlue.text);

	if(isNaN(_r) || _r > 255 || _r < 0) _r = 0;
	if(isNaN(_g) || _g > 255 || _g < 0) _g = 0;
	if(isNaN(_b) || _b > 255 || _b < 0) _b = 0;
			
	_doc.gridPreferences.baselineColor = [_r,_g,_b]; /* ### -> document property */
	_global.baselineColorDropdown.selection = _global.baselineColorDropdownList.length - 1;
	
	return;
} /* END function __setUserDefinedBaslineColor */



function __insertIncrementValueInPoints(_statictext, _targetMeasurementUnit) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
	
	var _doc = app.documents.firstItem();
	var _rulerUnit;
	var _baselineDivision;
	var _baselineDivisionInPoints;
	
	_rulerUnit = _doc.viewPreferences.horizontalMeasurementUnits.toString();

	if(_rulerUnit.toLowerCase() === "points") {
		_statictext.visible = false;
	} else {
		_statictext.visible = true;
	}
	
	_baselineDivision = _doc.gridPreferences.baselineDivision; 
	_baselineDivisionInPoints = __convert(_baselineDivision, _rulerUnit, _targetMeasurementUnit);
	
	if(!_baselineDivisionInPoints || isNaN(_baselineDivisionInPoints)) { return; }
	
	_baselineDivisionInPoints = Math.round(_baselineDivisionInPoints * 10)/10;
	_statictext.text = " " + _baselineDivisionInPoints + " pt";
	
	return;
} /* END function __insertIncrementValueInPoints */



function __refeshBasicTFObjectStyleDropdownList() {
	
	if(!_global) { return; }
	
	var _objectStyleNames = __getObjectStyleNames();
	var _selectedItemIndex;
	var _selectedItemName;
			
	if(_global.basicTFObjectStyleDropdown.selection != null) {
		_selectedItemIndex = _global.basicTFObjectStyleDropdown.selection.index;
		_selectedItemName = _global.basicTFObjectStyleDropdown.selection.text;
	}

	_global.basicTFObjectStyleDropdown.removeAll();
	
	for(var i=0; i<_objectStyleNames.length; i++) {
		switch (_objectStyleNames[i]) {
			case localize(_global.objectStyleBasicGridName) :
				_global.basicTFObjectStyleDropdown.add ("separator", undefined);
				break; 
			default :
				_global.basicTFObjectStyleDropdown.add("item", _objectStyleNames[i]);
		}
	}

	_global.basicTFObjectStyleDropdown.items[0].enabled = false;
	_global.basicTFObjectStyleDropdown.items[1].enabled = false;
	
	if(_selectedItemIndex != null && 
		 _global.basicTFObjectStyleDropdown.items[_selectedItemIndex] != null && 
		 _global.basicTFObjectStyleDropdown.items[_selectedItemIndex].text == _selectedItemName) {
			 
		_global.basicTFObjectStyleDropdown.selection = _selectedItemIndex;
	}

	return;
} /* END function __refeshBasicTFObjectStyleDropdownList() */



function __getObjectStyleNames() {
 
	var _doc = app.documents.firstItem();
	var _allOStyles = _doc.allObjectStyles;
	var _allOStylesLength = _allOStyles.length;
	var _oStyle;
	var _oStyleName = "";
	var _allOStyleNames = []; 
	
	var i;
 
	for (i=0; i<_allOStylesLength; i++) { 
		_oStyle = _allOStyles[i];
		_oStyleName = _oStyle.name;
		_oStyleName = __getStyleName(_oStyle,_oStyleName); 
		_allOStyleNames.push(_oStyleName);
	}

	function __getStyleName(_style,_styleName) {
		
		var _styleGroupName,
				_maxLength = 14,
				_suffix;
				
		if (_style.parent instanceof ObjectStyleGroup) { 
			
			_styleGroupName = _style.parent.name;
			
			if (_styleGroupName.length > _maxLength) {
				_suffix = "... > ";
			} else {
				_suffix = " > ";
			}	 
			_styleName = _styleGroupName.substring(0,_maxLength) + _suffix + _styleName;
			_styleName = __getStyleName(_style.parent,_styleName); 
		}
		
		return _styleName;
	} /* END function __getStyleName */

	return _allOStyleNames;
} /* END function __getObjectStyleNames */



function __insertMarginValues() {
	
	if(!_global) { return false; }

	var _page;
					
	_page = __getPage("active");
	if(!_page || !_page.isValid) { return false; }
	
	switch (_page.side) {
		case PageSideOptions.RIGHT_HAND :
		case PageSideOptions.LEFT_HAND :
			_global.marginLeftInputLabel.text = localize(_global.marginInsideLabel);
			_global.marginRightInputLabel.text = localize(_global.marginOutsideLabel);
			break;
		default :
			_global.marginLeftInputLabel.text = localize(_global.marginLeftLabel);
			_global.marginRightInputLabel.text = localize(_global.marginRightLabel);
	}
	
	_global.marginTopInput.text = __convertToOutputFormat(_page.marginPreferences.top); 
	_global.marginBottomInput.text = __convertToOutputFormat(_page.marginPreferences.bottom); 
	_global.marginLeftInput.text = __convertToOutputFormat(_page.marginPreferences.left); 
	_global.marginRightInput.text = __convertToOutputFormat(_page.marginPreferences.right); 
	
	_global.numberOfColumnsInput.text = Math.round(_page.marginPreferences.columnCount);
	_global.gutterInput.text = __convertToOutputFormat(_page.marginPreferences.columnGutter); 
	
	_global.marginTopButton.text = localize(_global.marginsTopLabel);
	_global.marginBottomButton.text = localize(_global.marginsBottomLabel);
	_global.marginLeftButton.text = localize(_global.marginsLeftLabel);
	_global.marginRightButton.text = localize(_global.marginsRightLabel);
	
	return true;
} /* END function __insertMarginValues */



function __setMarginAuto(_marginName,_firstRound,_onClickAllMargins) {
			
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	const _gutterWidth = -1;
	
	var _doc = app.documents.firstItem();
	var _selection;
	var _userZeroPoint;
	var _userRulerOrigin; 
	var _page;
	var _pageHeight;
	var _pageWidth; 
	var _y1;
	var _x1;
	var _y2;
	var _x2;
	var _columnCount;
	
	_userZeroPoint = _doc.zeroPoint;
	_userRulerOrigin = _doc.viewPreferences.rulerOrigin; 
	
	_doc.zeroPoint = [0,0];
	_doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	
	try {
		if(_doc.selection.length == 0) {	 
			if(_firstRound) {
				_global.ui.text = localize(_global.noTextFrameSelectedErrorMessage);
			}
			return false;		
		} else {
			if(_doc.selection.length == 1) {
				_selection = _doc.selection[0];	
				if(!(_selection instanceof TextFrame)) {
					if(_selection.hasOwnProperty("parentTextFrames") && _selection.parentTextFrames != null && _selection.parentTextFrames instanceof Array && _selection.parentTextFrames[0] instanceof TextFrame) {			
						_selection = _selection.parentTextFrames[0];
					} else {
						if(_firstRound) {
							_global.ui.text = localize(_global.noTextFrameSelectedErrorMessage);
						}
						return false;
					}
				}
				switch (_marginName) {
					case "Top" :
						_y1 = _selection.geometricBounds[0];
						break;
					case "Left" :
						_x1 = _selection.geometricBounds[1]; 
						break;
					case "Bottom" :
						_y2 = _selection.geometricBounds[2];
						break;
					case "Right" :
						_x2 = _selection.geometricBounds[3];
						break;
					default :
				}
				_columnCount = 1;
			} else {
				if(__onlyTextFrames(_doc.selection) && __onSamePage(_doc.selection)) {
					switch (_marginName) {
						case "Top" :
							_y1 = __getExtreme(0,_doc.selection);
							break;
						case "Left" :
							_x1 = __getExtreme(1,_doc.selection); 
							break;
						case "Bottom" :
							_y2 = __getExtreme(2,_doc.selection);
							break;
						case "Right" :
							_x2 = __getExtreme(3,_doc.selection);
							break;
						default :
					}
					if(_onClickAllMargins) {
						_gutterWidth = __getGutterWidth(_doc.selection);
						_columnCount = _doc.selection.length;
					}
					_selection = _doc.selection[0];
				} else {
					if(_firstRound) {
						_global.ui.text = localize(_global.noTextFrameSelectedErrorMessage);
					}
					return false;
				}
			}
		}
		
		_page = __getPage("selection", "alert");
		if(!_page || !_page.isValid) { return false; }
		
		_pageHeight = _page.bounds[2] - _page.bounds[0];
		_pageWidth = _page.bounds[3] - _page.bounds[1];
 
		switch (_marginName) {
			case "Top" :
				if(_y1 >= 0 && _y1 <= Math.floor(_pageHeight - _page.marginPreferences.bottom)) {
					__setMarginPref(_y1);
				}
				break;
			case "Left" :
				if(_x1 >= 0 && _x1 <= Math.floor(_pageWidth - _page.marginPreferences[__shiftMarginName(_page, "Right")])) {
					__setMarginPref(_x1);
				} 
				break;
			case "Bottom" :
				if(_y2 >= 0 && (_pageHeight - _y2) >= 0 && (_pageHeight - _y2) <= Math.floor(_pageHeight - _page.marginPreferences.top)) {
					__setMarginPref(_pageHeight - _y2);
				}
				break;
			case "Right" :
				if(_x2 >= 0 && (_pageWidth - _x2) >= 0 && (_pageWidth - _x2) <= Math.floor(_pageWidth - _page.marginPreferences[__shiftMarginName(_page, "Left")])) {
					__setMarginPref(_pageWidth - _x2);
				}
				break;
			default :
		}
		
		if(_firstRound && _onClickAllMargins) {
			if(_gutterWidth >= 0) {
			 _page.marginPreferences.columnGutter = _gutterWidth; /* ### -> page property */
			}
			_page.marginPreferences.columnCount = _columnCount; /* ### -> page property */
		}
		
		function __setMarginPref(_marginValue) { 
			
			var _buttonName;
			
			_buttonName = "margin" + _marginName + "Button";
			_marginName = __shiftMarginName(_page, _marginName);
			_page.marginPreferences[_marginName] = _marginValue; /* ### -> page property */
			_global[_buttonName].text = __convertToOutputFormat(_marginValue);
			
			return;
		}
	
		function __shiftMarginName(_curPage, _curMarginName) {	
			
			if(_curPage.side == PageSideOptions.LEFT_HAND) {
				switch (_curMarginName) {
					case "Left" :
						_curMarginName = "Right";
					break;
					case "Right" :
						_curMarginName = "Left";
					break;
				}
			}
		
			return _curMarginName.toLowerCase();
		}
		
	} catch(_error) {
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		} 
	} finally {
		_doc.zeroPoint = _userZeroPoint;
		_doc.viewPreferences.rulerOrigin = _userRulerOrigin;
	}
	
	_global.ui.text = localize(_global.uiHead);
	
	return;
} /* END function __setMarginAuto */


function __adjustMarginBottomToSelection(_startInput) {
	
	if(app.documents.length === 0 || app.layoutWindows.length == 0) { return; }
	
	var _doc = app.documents.firstItem();
	var _userZeroPoint;
	var _activePage;
	var _baselineStart;
	var _baselineStartValue;
	var _baselineDivisionValue;
	var _offset;
	var _correctionValue = 0;
	
	_userZeroPoint = _doc.zeroPoint; 
	_doc.zeroPoint = [0,0];
	
	try { 
		
		_activePage = __getPage("active");
		if(!_activePage || !_activePage.isValid) { return false; }
		
		_baselineStart = _activePage.bounds[2] - _activePage.marginPreferences.bottom;
		_baselineDivisionValue = _doc.gridPreferences.baselineDivision;
		_offset = _baselineStart;
		
		if(_doc.gridPreferences.baselineGridRelativeOption === BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) {				 
			_correctionValue = _activePage.marginPreferences.top;
		}
	
		/* Modulo bei Fliesskommazahl zu ungenau */
		while(_offset > _baselineDivisionValue + _correctionValue) {	
			_offset -= _baselineDivisionValue;
		}
		_baselineStart = _offset;

		if(_doc.gridPreferences.baselineGridRelativeOption === BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) {				 
			_baselineStart -= _activePage.marginPreferences.top;
		}
		
		if(_baselineStart > 0) {
			_doc.gridPreferences.baselineStart = _baselineStart; /* ### -> document property */
			_baselineStartValue = _doc.gridPreferences.baselineStart;
			_startInput.text = __convertToOutputFormat(_baselineStartValue);
		}
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		} 
	} finally {
		_doc.zeroPoint = _userZeroPoint;
	}
	
	return;
} /* END function __adjustMarginBottomToSelection */



function __adjustMarginTopToSelection() {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _doc = app.documents.firstItem();
	var _selection = app.selection;
	var _numOfSelectedObj;
	var _firstIP;
	var _parentTextFrames;
	var _numOfParentTextFrames;
	var _tempTextFrame;
	var _curPage;
	var _curPageHeight;
	var _curPageWidth;
	var _marginTop;
	var _marginBottom;
	var _marginLeft;
	var _marginRight;
	var _userZeroPoint;
	var _userRulerOrigin;
	var _y1, _x1, _y2, _x2; 
	var i, j;
				
	if(_selection.length === 0 || !_selection[0].hasOwnProperty("insertionPoints")) { 
		_global.ui.text = localize(_global.noTextSelectedErrorMessage);
		return false; 
	}

	_firstIP = _selection[0].insertionPoints[0];
	_parentTextFrames = _firstIP.parentTextFrames;
	
	if(_parentTextFrames.length === 0 || !_parentTextFrames[0].isValid || !(_parentTextFrames[0] instanceof TextFrame)) { return false; }	
	_tempTextFrame = _parentTextFrames[0].duplicate();
	
	_numOfSelectedObj = _selection.length;
	
	for(i=1; i<_numOfSelectedObj; i++) {
		if(_selection[i] instanceof TextFrame) {
			_parentTextFrames.push(_selection[i]);
		}
	}
	
	if(!_tempTextFrame.hasOwnProperty("parentPage") || _tempTextFrame.parentPage == null) { return false; }
	_curPage = _tempTextFrame.parentPage;
	
	_userZeroPoint = _doc.zeroPoint; 
	_doc.zeroPoint = [0,0];
	_userRulerOrigin = _doc.viewPreferences.rulerOrigin;
	_doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	
	app.scriptPreferences.enableRedraw = false;
	
	try {
	
		_marginTop = _curPage.marginPreferences.top;
		_marginBottom = _curPage.marginPreferences.bottom;
		
		if(_curPage.side === PageSideOptions.LEFT_HAND) {
			_marginLeft = _curPage.marginPreferences.right;
			_marginRight = _curPage.marginPreferences.left;
		} else { 
			_marginLeft = _curPage.marginPreferences.left;
			_marginRight = _curPage.marginPreferences.right;
		}
		 
		_curPageHeight = _curPage.bounds[2] - _curPage.bounds[0];
		_curPageWidth = _curPage.bounds[3] - _curPage.bounds[1];
		 
		_tempTextFrame.geometricBounds = [_marginTop, _marginLeft, _curPageHeight - _marginBottom, _curPageWidth - _marginRight];
		_tempTextFrame.contents = TextFrameContents.PLACEHOLDER_TEXT;
	
		_y1 = _tempTextFrame.geometricBounds[0];
		_x1 = _tempTextFrame.geometricBounds[1];
		_y2 = _tempTextFrame.geometricBounds[2];
		_x2 = _tempTextFrame.geometricBounds[3]; 
	
		while (!_tempTextFrame.overflows) {
			_y1 += 1;
			_tempTextFrame.geometricBounds = [_y1,_x1,_y2,_x2];
		}
		
		while (_tempTextFrame.overflows) {
			_y1 -= 0.1;
			_tempTextFrame.geometricBounds = [_y1,_x1,_y2,_x2];
		}
		
		while (!_tempTextFrame.overflows) {
			_y1 += 0.01;
			_tempTextFrame.geometricBounds = [_y1,_x1,_y2,_x2];
		}
		
		while (_tempTextFrame.overflows) {
			_y1 -= 0.001;
			_tempTextFrame.geometricBounds = [_y1,_x1,_y2,_x2];
		}
		
		_doc.select(_tempTextFrame);
		_global.marginTopButton.notify();
		
		_numOfParentTextFrames = _parentTextFrames.length;
		
		for(j=0; j<_numOfParentTextFrames; j++) {
			_x1 = _parentTextFrames[j].geometricBounds[1];
			_y2 = _parentTextFrames[j].geometricBounds[2];
			_x2 = _parentTextFrames[j].geometricBounds[3];
			_parentTextFrames[j].geometricBounds = [_y1,_x1,_y2,_x2];
		}		
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		} 
	} finally {
		
		if(_tempTextFrame != null) {
			_tempTextFrame.remove();
		}
		
		_doc.zeroPoint = _userZeroPoint;
		_doc.viewPreferences.rulerOrigin = _userRulerOrigin;
		app.scriptPreferences.enableRedraw = true;
	}
	
	_global.ui.text = localize(_global.uiHead);
	
	return;
} /* END function __adjustMarginBottomToSelection */



function __setMarginManual(_marginName, _inputValue) {

	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _marginValue;
	var _page;
	var _pageHeight;
	var _pageWidth; 
	var _inputFieldName;

	_marginValue = __getConvertedInputValue (_inputValue); 
	if(_marginValue == null) { return false; }

	_page = __getPage("active");
	if(!_page || !_page.isValid) { return false; }
	
	_pageHeight = _page.bounds[2] - _page.bounds[0];
	_pageWidth = _page.bounds[3] - _page.bounds[1];

	switch (_marginName) {
		case "Top" :
			if(_marginValue >= 0 && _marginValue <= Math.floor(_pageHeight - Math.ceil(_page.marginPreferences.bottom))) {
				__setMarginPref(_marginValue);
			} else {
				_global.ui.text = localize(_global.marginValueError);
			}
			break;
		case "Left" :
			if(_marginValue >= 0 && _marginValue <= Math.floor(_pageWidth - Math.ceil(_page.marginPreferences.right))) {
				__setMarginPref(_marginValue);
			} else {
				_global.ui.text = localize(_global.marginValueError);
			}
			break;
		case "Bottom" :
			if(_marginValue >= 0 && _marginValue <= Math.floor(_pageHeight - Math.ceil(_page.marginPreferences.top))) {
				__setMarginPref(_marginValue);
			} else {
				_global.ui.text = localize(_global.marginValueError);
			}
			break;
		case "Right" :
			if(_marginValue >= 0 && _marginValue <= Math.floor(_pageWidth - Math.ceil(_page.marginPreferences.left))) {
				__setMarginPref(_marginValue);
			} else {
				_global.ui.text = localize(_global.marginValueError);
			}
			break;
		default :
	}
	
	function __setMarginPref(_marginValue) {
		_page.marginPreferences[_marginName.toLowerCase()] = _marginValue; /* ### -> page property */
		_global.ui.text = localize(_global.uiHead);
		return;
	}
	
	return;
} /* END function __setMarginManual */



function __flipMargins() {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return false; }
	
	var _doc = app.documents.firstItem();
	
	if(_doc.documentPreferences.facingPages == false) { 
		_global.ui.text = localize(_global.alertNoRightPage);
		return; 
	}
	
	var _activePage;
	var _userZeroPoint;
	var _userRulerOrigin;
	var _targetPage;
	var _sourcePage;
	
	_activePage = __getPage("active");
	if(!_activePage || !_activePage.isValid) { return false; }
	
	_userZeroPoint = _doc.zeroPoint;
	_userRulerOrigin = _doc.viewPreferences.rulerOrigin; 
	
	_doc.zeroPoint = [0,0];
	_doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	
	try {
		if((_activePage.parent instanceof Spread || _activePage.parent instanceof MasterSpread ) && _activePage.parent.pages.length == 2) {		 
			if(_activePage.side == PageSideOptions.LEFT_HAND) {
				if(_activePage.parent.pages[1].side == PageSideOptions.RIGHT_HAND) {
					_targetPage = _activePage.parent.pages[1];
					_sourcePage = _activePage.parent.pages[0];
				} else {
					_global.ui.text = localize(_global.alertNoRightPage);
					return false;
				}
			} else {
				if(_activePage.parent.pages[0].side == PageSideOptions.LEFT_HAND) {
					_targetPage = _activePage.parent.pages[0];
					_sourcePage = _activePage.parent.pages[1];
				} else {
					_global.ui.text = localize(_global.alertNoLeftPage);
					return false;
				}
			}
			_targetPage.marginPreferences.top = _sourcePage.marginPreferences.top; /* ### -> page property */
			_targetPage.marginPreferences.bottom = _sourcePage.marginPreferences.bottom; /* ### -> page property */
			_targetPage.marginPreferences.left = _sourcePage.marginPreferences.left; /* ### -> page property */
			_targetPage.marginPreferences.right = _sourcePage.marginPreferences.right; /* ### -> page property */
			_targetPage.marginPreferences.columnCount = _sourcePage.marginPreferences.columnCount; /* ### -> page property */
			_targetPage.marginPreferences.columnGutter = _sourcePage.marginPreferences.columnGutter; /* ### -> page property */
			_targetPage.marginPreferences.columnDirection = _sourcePage.marginPreferences.columnDirection; /* ### -> page property */
			_targetPage.marginPreferences.columnsPositions = _sourcePage.marginPreferences.columnsPositions;  /* ### -> page property *//* letzte Zuweisung! */
		} else {
			_global.ui.text = localize(_global.alertTooManyPages);
		} 
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		} 
	} finally {
		_doc.zeroPoint = _userZeroPoint;
		_doc.viewPreferences.rulerOrigin = _userRulerOrigin;
	}

	return;
} /* END function __flipMargins */



function __transferMarginsToMaster(_eventKeyArray) {
	/* _eventKeyArray[0] -> shiftKey / _eventKeyArray[1] -> altKey */
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _doc = app.documents.firstItem();
	var _masterPageArray;
	var _inverseMargins = false;
	var _selectedMasterPageArray;
	var _facingPages;
	var _activePage;
	var _activeSpread;
	var _secondPage;
	var _appliedMaster;
	var _targetMasterPage;
	
	var i;
	
	_activePage = __getPage("active");
	if(!_activePage || !_activePage.isValid) { return false; }
	
	/* Transfer margins to multiple masters */
	if(_eventKeyArray[1]) {
		
		_masterPageArray = _doc.masterSpreads.everyItem().pages.everyItem().getElements();
		
		_selectedMasterPageArray = __showMasterPageList(_masterPageArray, _activePage);
		if(!_selectedMasterPageArray) { return false; }
		
		for(i=0; i<_selectedMasterPageArray.length; i++) {
			if(!_selectedMasterPageArray[i] || !_selectedMasterPageArray[i].isValid) { continue; }
			if(
				_activePage.side === PageSideOptions.LEFT_HAND && 
				_selectedMasterPageArray[i].side === PageSideOptions.SINGLE_SIDED
			) {
				_inverseMargins = true;
			} else {
				_inverseMargins = false;
			}
			__setMarginPreferencesOfMaster(_activePage, _selectedMasterPageArray[i], _inverseMargins);		
		}
		_global.ui.text = localize(_global.marginsTransferedToMasterLabel);
		return true;
	}
	
	_activeSpread = _activePage.parent;
	if(_activeSpread instanceof MasterSpread || _activeSpread.pages.length > 2) {
		_global.ui.text = localize(_global.spreadWithToManyPagesAlertLabel);
		return false;
	} 
	
	_appliedMaster = _activePage.appliedMaster;	
	if(_appliedMaster == null || _appliedMaster.pages.length > 2) { 
		_global.ui.text = localize(_global.masterWithToManyPagesAlertLabel);
		return false;
	}	
	
	_facingPages = _doc.documentPreferences.facingPages; 
	if(_facingPages === false && (_activeSpread.pages.length > 1 || _appliedMaster.pages.length > 1)) { 
		_global.ui.text = localize(_global.pageCountMismatchAlertLabel);
		return false; 
	}
	
	switch(_activePage.side) {
		case PageSideOptions.LEFT_HAND :
			if(_activePage === _activeSpread.pages.firstItem()) {
				_targetMasterPage = _appliedMaster.pages.firstItem();
			} else {
				_targetMasterPage = _appliedMaster.pages.lastItem();
			}
			if(_targetMasterPage.side === PageSideOptions.SINGLE_SIDED) {
				__setMarginPreferencesOfMaster(_activePage, _targetMasterPage, true);
			} else {
				__setMarginPreferencesOfMaster(_activePage, _targetMasterPage, false);
			}
			if(!_eventKeyArray[0]) { break; }
			if(_activeSpread.pages.length === 1) { break; }
			_secondPage = _activeSpread.pages.lastItem();
			if(_secondPage.appliedMaster == null || _secondPage.side !== PageSideOptions.RIGHT_HAND) { break; }
			_targetMasterPage = _secondPage.appliedMaster.pages.lastItem();
			if(_targetMasterPage.side !== PageSideOptions.RIGHT_HAND) { break; }
			__setMarginPreferencesOfMaster(_secondPage, _targetMasterPage, false);	 
			break;
		case PageSideOptions.RIGHT_HAND : 
			if(_activePage === _activeSpread.pages.lastItem()) {
				_targetMasterPage = _appliedMaster.pages.lastItem();
			} else {
				_targetMasterPage = _appliedMaster.pages.firstItem();
			}
			__setMarginPreferencesOfMaster(_activePage, _targetMasterPage, false);
			if(!_eventKeyArray[0]) { break; }
			if(_activeSpread.pages.length === 1) { break; }
			_secondPage = _activeSpread.pages.firstItem();
			if(_secondPage.appliedMaster == null || _secondPage.side !== PageSideOptions.LEFT_HAND) { break; }
			_targetMasterPage = _secondPage.appliedMaster.pages.firstItem();
			if(_targetMasterPage.side !== PageSideOptions.LEFT_HAND) { break; }
			__setMarginPreferencesOfMaster(_secondPage, _targetMasterPage, false);
			break;
		default:
			_targetMasterPage = _appliedMaster.pages.firstItem();
			__setMarginPreferencesOfMaster(_activePage, _targetMasterPage, false);
	}


	function __setMarginPreferencesOfMaster(_sourcePage_, _targetPage_, _inverse_) {
		
		var _y1SourcePage_;
		var _x1SourcePage_;
		var _y2SourcePage_;
		var _x2SourcePage_;
		var _y1TargetPage_;
		var _x1TargetPage_;
		var _y2TargetPage_;
		var _x2TargetPage_;
		var _hightSourcePage_;
		var _widthSourcePage_;
		var _hightTargetPage_;
		var _widthTargetPage_;
		var _continue_;
		
		_y1SourcePage_ = Math.round(_sourcePage_.bounds[0] * 1000) / 1000;
		_x1SourcePage_ = Math.round(_sourcePage_.bounds[1] * 1000) / 1000;
		_y2SourcePage_ = Math.round(_sourcePage_.bounds[2] * 1000) / 1000;
		_x2SourcePage_ = Math.round(_sourcePage_.bounds[3] * 1000) / 1000;
		_y1TargetPage_ = Math.round(_targetPage_.bounds[0] * 1000) / 1000;
		_x1TargetPage_ = Math.round(_targetPage_.bounds[1] * 1000) / 1000;
		_y2TargetPage_ = Math.round(_targetPage_.bounds[2] * 1000) / 1000;
		_x2TargetPage_ = Math.round(_targetPage_.bounds[3] * 1000) / 1000;
		
		_hightSourcePage_ = _y2SourcePage_ - _y1SourcePage_;
		_widthSourcePage_ = _x2SourcePage_ - _x1SourcePage_;
		_hightTargetPage_ = _y2TargetPage_ - _y1TargetPage_;
		_widthTargetPage_ = _x2TargetPage_ - _x1TargetPage_;
			
		if(_hightSourcePage_ !== _hightTargetPage_ || _widthSourcePage_ !== _widthTargetPage_) { 
			_continue_ = confirm(localize(_global.differentPageSizeConfirm));
			if (!_continue_) { return; } 
		} 
		
		_targetPage_.marginPreferences.top = _sourcePage_.marginPreferences.top; /* ### -> page property */
		_targetPage_.marginPreferences.bottom = _sourcePage_.marginPreferences.bottom; /* ### -> page property */
		
		if(_inverse_) {
			_targetPage_.marginPreferences.left = _sourcePage_.marginPreferences.right; /* ### -> page property */
			_targetPage_.marginPreferences.right = _sourcePage_.marginPreferences.left; /* ### -> page property */
		} else {
			_targetPage_.marginPreferences.left = _sourcePage_.marginPreferences.left; /* ### -> page property */
			_targetPage_.marginPreferences.right = _sourcePage_.marginPreferences.right; /* ### -> page property */
		}
		
		_targetPage_.marginPreferences.columnCount = _sourcePage_.marginPreferences.columnCount; /* ### -> page property */
		_targetPage_.marginPreferences.columnGutter = _sourcePage_.marginPreferences.columnGutter; /* ### -> page property */
		_targetPage_.marginPreferences.columnDirection = _sourcePage_.marginPreferences.columnDirection; /* ### -> page property */
		_targetPage_.marginPreferences.columnsPositions = _sourcePage_.marginPreferences.columnsPositions;  /* ### -> page property *//* letzte Zuweisung! */
		
		return;
	} /* END function __setMarginPreferencesOfMaster */
	
	_global.ui.text = localize(_global.marginsTransferedToMasterLabel);
	
	return;
} /* END function __transferMarginsToMaster */



function __showMasterPageList(_masterPageArray, _activePage) {
	
	if(!_masterPageArray || !(_masterPageArray instanceof Array) || _masterPageArray.length === 0) { return false; }
	if(!_activePage || !(_activePage instanceof Page) || !_activePage.isValid) { return false; }
	
	var _pageSideLableObj = {
		"side_1818653800": localize(_global.leftHandPageSideLable),
		"side_1919382632": localize(_global.rightHandPageSideLable),
		"side_1970496888": localize(_global.singleSidedPageSideLable)
	}
	
	var _masterPageListUI = new Window ("dialog", localize(_global.masterPageListUILabel), undefined, { closeButton: true });
	with(_masterPageListUI) {
		margins = [20,20,20,12];
		spacing = 8;
		alignChildren = ["fill", "fill"];
		var _header = { numberOfColumns: 3, showHeaders: true, columnTitles: [localize(_global.prefixTopicLabel), localize(_global.nameTopicLabel), localize(_global.pageSideTopicLabel)], multiselect: true };
		var _masterPageList = add("listbox", undefined, undefined, _header); 
		with(_masterPageList) {
			minimumSize.width = 280;
			maximumSize = [1000,500];
			for(var i=0; i<_masterPageArray.length; i++) {
				with(add("item", _masterPageArray[i].parent.namePrefix)) {
					subItems[0].text = _masterPageArray[i].parent.baseName; 
					subItems[1].text = _pageSideLableObj["side_" + _masterPageArray[i].side];
					if(_activePage === _masterPageArray[i]) {
						enabled = false;
					}
				}
			}
		} /* END listbox _masterPageList */
		var _nextButtonGroup = add("group");
		with(_nextButtonGroup) {
			margins.right = 0;
			margins.left = 0;
			margins.top = 10;
			var _cancelButton = add("button", undefined, localize(_global.cancelButtonLabel), { name: "Cancel" });
			with(_cancelButton) {
				alignment = ["right","bottom"];
			} /* END _cancelButton */
			var _nextButton = add("button", undefined, localize(_global.nextButtonLabel), { name: "OK" });
			with(_nextButton) {
				alignment = ["right","bottom"];
			} /* END _nextButton */			
		}
	} /* END window _masterPageListUI */
	
	/* Callbacks */
	_cancelButton.onClick = function() {
		_masterPageListUI.hide();
		_masterPageListUI.close(2);
	}

	_nextButton.onClick = function() {
		_masterPageListUI.hide();
		_masterPageListUI.close(1);
	}
	
	_masterPageListUI.onClose = function() {	
	}
	/* END Callbacks */
	
	var _closeValue;
	var _masterPageSelection;
	var _selectionIndex;
	var _selectedMasterPages = [];
	var i;
	
	_closeValue = _masterPageListUI.show ();
	if(_closeValue === 2) { 
		return false; 
	}
	
	if(_masterPageList.selection) {
		_masterPageSelection = _masterPageList.selection;
		if(_masterPageSelection instanceof Array) {
			/* Mulitselect: true */
			for(i=0; i<_masterPageSelection.length; i++) {
				_selectionIndex = _masterPageSelection[i].index;
				_selectedMasterPages.push(_masterPageArray[_selectionIndex]);
			}	
		} else {
			/* Mulitselect: false */
			_selectionIndex = _masterPageList.index;
			_selectedMasterPages.push(_selectionIndex);
		}	
	}
	
	if(_selectedMasterPages.length === 0) {
		return false;
	} else {
		return _selectedMasterPages;
	}	
} /* END function __showMasterPageList */



function __chainMargins(_props,_input) {
	
	if(!_props || !(_props instanceof Array) || _props.length === 0) { return false; }
	if(!_input || !(_input instanceof EditText)) { return false; }
	
	var i;
	
	for(i=0; i<_props.length; i++) {
		__setMarginManual(_props[i], _input);
	}
	
	return true;
} /* END function __chainMargins */



function __swapLeftRightMargins() {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return false; }
	
	var _activePage;
	var _curMarginRight;
	var _curMarginLeft;
	var _curColumnsPositions;
	
	_activePage = __getPage("active");
	if(!_activePage || !_activePage.isValid) { return false; }
	
	_curMarginRight = _activePage.marginPreferences.right;
	_curMarginLeft = _activePage.marginPreferences.left;
	_curColumnsPositions = _activePage.marginPreferences.columnsPositions;
	
	_activePage.marginPreferences.left = 0; /* ### -> page property */
	_activePage.marginPreferences.right = 0; /* ### -> page property */

	_activePage.marginPreferences.left = _curMarginRight; /* ### -> page property */
	_activePage.marginPreferences.right = _curMarginLeft; /* ### -> page property */
	_activePage.marginPreferences.columnsPositions = _curColumnsPositions;  /* ### -> page property */
	
	return true;
} /* END function __swapLeftRightMargins */



function __setColumnCountManual(_inputValue) {
	
	if(!_global) { return false; }
	
	var _columnCount;
	var _page;
	var _gutterValue;
	
	_columnCount = parseInt(_inputValue.text);
	
	_page = __getPage("active");
	if(!_page || !_page.isValid) { return false; }
	
	if(isNaN(_columnCount) || _columnCount < 1 || _columnCount > 216) {
		_global.ui.text = localize(_global.errorColumnCountValue);
		if(_columnCount === 0) {
			_inputValue.text = "0";
		}
		return; 
	}

	_gutterValue = _page.marginPreferences.columnGutter;
	
	if(__checkMaxGutterValue(_page, _columnCount, _gutterValue)) { 
		_page.marginPreferences.columnCount = _columnCount; /* ### -> page property */
		_inputValue.text = _page.marginPreferences.columnCount;
		_global.ui.text = localize(_global.uiHead);
	} else {
		_global.ui.text = localize(_global.errorColumnGutterValue);
	}

	return true;
} /* END function __setColumnCountManual */



function __setColumnGutterManual(_inputValue) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return false; }
	
	var _doc = app.documents.firstItem();
	var _rulerUnit;
	var _gutterValueInPoints;
	var _gutterValue;
	var _columnCount;
	var _page;
	
	_rulerUnit = _doc.viewPreferences.horizontalMeasurementUnits.toString();
	
	_gutterValue = __getConvertedInputValue(_inputValue);	
	if(_gutterValue == null) { return false; }
	
	_gutterValueInPoints = __convert(_gutterValue,_rulerUnit,"pt");
	if(_gutterValueInPoints == null || _gutterValueInPoints < 0 || _gutterValueInPoints > 1440) { 
		_global.ui.text = localize(_global.errorColumnGutterValue);
		return; 
	}

	_page = __getPage("active");
	if(!_page || !_page.isValid) { return false; }
	
	_columnCount = _page.marginPreferences.columnCount;
	
	if(__checkMaxGutterValue(_page, _columnCount, _gutterValue)) { 
		_page.marginPreferences.columnGutter = _gutterValue; /* ### -> page property */
		_global.ui.text = localize(_global.uiHead);
	} else {
		_global.ui.text = localize(_global.errorColumnGutterValue);
	} 
	
	return true;
} /* END function __setColumnGutter */



function __checkMaxGutterValue(_page, _columnCount, _gutterValue) { 
	
	const _precision = 10000;
	
	var _pageWidth;
	var _pageMarginLeft;
	var _pageMarginRight;
	var _maxGutterValue;
	
	_pageWidth = _page.bounds[3] - _page.bounds[1];
	_pageMarginLeft = _page.marginPreferences.left;
	_pageMarginRight = _page.marginPreferences.right;
	
	if(_columnCount === 1) {
		_maxGutterValue =  _pageWidth - _pageMarginLeft - _pageMarginRight;
	} else {
		_maxGutterValue = (_pageWidth - _pageMarginLeft - _pageMarginRight) / (_columnCount - 1);
	}

	if((Math.ceil(_gutterValue*_precision)/_precision) < (Math.floor(_maxGutterValue*_precision)/_precision)) {
		return true;
	} else {
		return false;
	}
} /* END function __checkMaxGutterValue */


function __setColumnsPositionsManual(_inputValue) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return false; }
	
	var _inputColumnPosition;
	var _activePage;
	var _columnGutter;
	var _columnsPositions;
	var _numOfColumnsPositions;
	var _curMinPosition;
	var _curMaxPosition;
	
	var i;
	
	_inputColumnPosition = __getConvertedInputValue(_inputValue);	
	if(_inputColumnPosition == null) { return false; }
	
	_activePage = __getPage("active");
	if(!_activePage || !_activePage.isValid) { return false; }
	
	_columnGutter = _activePage.marginPreferences.columnGutter
	_columnsPositions = _activePage.marginPreferences.columnsPositions;
	_numOfColumnsPositions = _columnsPositions.length;
	
	for(i=1; i<_numOfColumnsPositions-1; i++) {
		if(
			i%2 !== 0 && 
			_inputValue.label === i.toString() 
		) { 
			_curMinPosition = _columnsPositions[i-1];
			_curMaxPosition = _columnsPositions[i+2];
			if(
				_curMinPosition < _inputColumnPosition - (_columnGutter/2) &&
				_curMaxPosition > _inputColumnPosition + (_columnGutter/2)
			) {
				_columnsPositions[i] = _inputColumnPosition - (_columnGutter/2);
				_columnsPositions[i+1] = _inputColumnPosition + (_columnGutter/2);
				_activePage.marginPreferences.columnsPositions = _columnsPositions; /* ### -> page property */
				_global.ui.text = localize(_global.uiHead);
				break;
			} else {
				_global.ui.text = localize(_global.wrongColumnPositionValueLabel);
			}
		}
	}
	
	
	
	return true;
} /* END function __setColumnsPositionsManual */


function __fillColumnsPositionsRow(_ui,_marginsTab,_lockColumnGuidesCheckbox) {
	
	/* 
		Linke Stegwerte werden nicht addiert: 
		-> Unabhaengig gegenüber Nullpunkt des Lineals
		-> Werteingabe der Spaltenbreite moeglich
	*/
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return false; }
	if(!_global.columnsPositionsFeature) { return false; }
	if(_global.lockColumnsPositionsRow === true || _lockColumnGuidesCheckbox.value === true) { return false; }
	
	try {
		if(!_ui || !_ui.hasOwnProperty("layout")) { return false; } 
		if(!_marginsTab || !_marginsTab.hasOwnProperty("children")) { return false; }
		if(!_lockColumnGuidesCheckbox || !_lockColumnGuidesCheckbox.hasOwnProperty("value")) { return false; }
	} catch(_error) {
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		}
		return false;
	}
	
	const _columnsPositionsGroupLabel = "columnsPositionsGroup";
	
	var _activePage;
	var _columnsPositionsValues;
	var _numOfColumnsPositions;
	var _columnCenterPosition;
	
	var j;
	
	__removeColumnsPositionsInputs(_ui, _marginsTab, false);
	
	_activePage = __getPage("active");
	if(!_activePage || !_activePage.isValid) { return false; }
	
	_columnsPositionsValues = _activePage.marginPreferences.columnsPositions;
	_numOfColumnsPositions = _columnsPositionsValues.length;
	
	with(_marginsTab) {
		var _columnsPositionsGroup = add("group");
		with(_columnsPositionsGroup) {
			alignChildren = ["fill","middle"];
			margins.left = 8;
			for(j=0; j<_numOfColumnsPositions; j++) {
				if(j>0 && (j%2 === 0)) { continue; }
				var _columnPositionInput = add("edittext{justify:'center'}");
				with(_columnPositionInput) {
					characters = 4;
					if(j===0 || j===_numOfColumnsPositions-1) {
						enabled = false;
						_columnCenterPosition = _columnsPositionsValues[j];
						text = __convertToOutputFormat(_columnCenterPosition);
					} else {
						_columnCenterPosition = (_columnsPositionsValues[j] + _columnsPositionsValues[j+1]) / 2;
						text = __convertToOutputFormat(_columnCenterPosition);
					}
				} /* END _columnPositionInput */
				_columnPositionInput.onChanging = function() { 
					__setColumnsPositionsManual(this);
				}
				_columnPositionInput.addEventListener('keydown', function (_event) {
					__keydown(_event, this, "columnsPositions", undefined); 
				});
				_columnPositionInput.addEventListener('focus', function (_event) {
					if(!_global) { return false; }
					_global.lockColumnsPositionsRow = true; /* Prevent focus of input field due to _ui event 'mouseover' -> __fillColumnsPositionsRow */
				});
				_columnPositionInput.addEventListener('blur', function (_event) {
					if(!_global) { return false; }
					_global.lockColumnsPositionsRow = false;
				});
				_columnPositionInput.label = j.toString();
			}
		} /* END _columnsPositionsGroup */
	} /* END _marginsTab */
	
	_columnsPositionsGroup.label = _columnsPositionsGroupLabel;
	_ui.layout.layout(true);
	
	return true;
} /* END function __fillColumnsPositionsRow */

function __removeColumnsPositionsInputs(_ui, _marginsTab, _layout) {
	
	if(!_global.columnsPositionsFeature) { return false; }
	
	const _columnsPositionsGroupLabel = "columnsPositionsGroup";
	
	var _tabChildren;
	var _numOfTabChildren;
 
	var i;
	
	_tabChildren = _marginsTab.children;
	_numOfTabChildren = _tabChildren.length;
	
	for(i=_numOfTabChildren-1; i>=0; i--) {
		if(_tabChildren[i].label === _columnsPositionsGroupLabel) { 
			_marginsTab.remove(_tabChildren[i]);
			break;
		}
	}
	
	if(_layout) {
		_ui.layout.layout(true);
	}

	return true;
} /* END function __removeColumnsPositionsInputs */



function __insertBasicTFValues(_onChange) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _doc = app.documents.firstItem();
	var _basicTFObjectStyleIndex;
	var _basicTFObjectStyle;
	var _firstBaselineOffset;
	var _minimumFirstBaselineOffset;
	
	if(!_onChange) {
		__refeshBasicTFObjectStyleDropdownList();
	}
	
	if(_global.basicTFObjectStyleDropdown.selection == null) { return; } 
	_basicTFObjectStyleIndex = _global.basicTFObjectStyleDropdown.selection.index;

	if(!_doc.allObjectStyles[_basicTFObjectStyleIndex].isValid) { return; }
	_basicTFObjectStyle = _doc.allObjectStyles[_basicTFObjectStyleIndex];
	_firstBaselineOffset = _basicTFObjectStyle.textFramePreferences.firstBaselineOffset;
	
	_global.insertBasicTFValues = true;
	
	switch (_firstBaselineOffset) {
		case FirstBaseline.ASCENT_OFFSET :
			_global.basicTFFirstBaselineOffsetDropdown.selection = 0;
			break;
		case FirstBaseline.CAP_HEIGHT :
			_global.basicTFFirstBaselineOffsetDropdown.selection = 1;
			break;
		case FirstBaseline.LEADING_OFFSET :
			_global.basicTFFirstBaselineOffsetDropdown.selection = 2;
			break;
		case FirstBaseline.X_HEIGHT :
			_global.basicTFFirstBaselineOffsetDropdown.selection = 3;
			break;
		case FirstBaseline.FIXED_HEIGHT :
			_global.basicTFFirstBaselineOffsetDropdown.selection = 4;
			break;
		default :
	}

	_minimumFirstBaselineOffset = _basicTFObjectStyle.textFramePreferences.minimumFirstBaselineOffset;
	_global.basicTFFirstBaselineMin.text = _minimumFirstBaselineOffset;

	_global.insertBasicTFValues = false;
	
	return;
} /* END function __insertBasicTFValues */



function __setBasicTFFirstBaselineOffset(_basicTFObjectStyleDropdown, _basicTFFirstBaselineOffsetDropdown) {
		
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
	
	var _doc = app.documents.firstItem();
	var _basicTFObjectStyleIndex;
	var _basicTFObjectStyle;
	var _textFramePreferences;
	
	if(_basicTFObjectStyleDropdown.selection == null) { return; }	 
	_basicTFObjectStyleIndex = _basicTFObjectStyleDropdown.selection.index;
	
	if(!_doc.allObjectStyles[_basicTFObjectStyleIndex].isValid) { return; }	
	_basicTFObjectStyle = _doc.allObjectStyles[_basicTFObjectStyleIndex]; 

	_textFramePreferences = _basicTFObjectStyle.textFramePreferences;

	switch (_basicTFFirstBaselineOffsetDropdown.selection.index) {
		case 0 :
			_textFramePreferences.firstBaselineOffset = FirstBaseline.ASCENT_OFFSET; /* ### -> basic textframe property */
			break;
		case 1 :
			_textFramePreferences.firstBaselineOffset = FirstBaseline.CAP_HEIGHT; /* ### -> basic textframe property */
			break;
		case 2 :
			_textFramePreferences.firstBaselineOffset = FirstBaseline.LEADING_OFFSET; /* ### -> basic textframe property */
			break;
		case 3 :
			_textFramePreferences.firstBaselineOffset = FirstBaseline.X_HEIGHT; /* ### -> basic textframe property */
			break;
		case 4 :
			_textFramePreferences.firstBaselineOffset = FirstBaseline.FIXED_HEIGHT; /* ### -> basic textframe property */
			break;
		default :
	}

	return true;
} /* END function __setBasicTFFirstBaselineOffset */



function __insertLayoutAdjustmentValue(_checkbox) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
	
	var _doc = app.documents.firstItem();
	
	if(_doc.hasOwnProperty("layoutAdjustmentPreferences")) {
		/* InDesign bis CC2018 */
		if(_doc.layoutAdjustmentPreferences.enableLayoutAdjustment === true) {
			_checkbox.value = true;
		} else {
			_checkbox.value = false;
		}
	} else {
		/* InDesign ab CC2019 */
		if(_doc.adjustLayoutPreferences.enableAdjustLayout === true) {
			_checkbox.value = true;
		} else {
			_checkbox.value = false;
		}
	}
	
	return;
} /* END function __insertLayoutAdjustmentValue */

function __setLayoutAdjustment(_checkbox) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
	
	var _doc = app.documents.firstItem();

	if(_doc.hasOwnProperty("layoutAdjustmentPreferences")) {
		/* InDesign bis CC2018 */
		if(_checkbox.value === true) {
			_doc.layoutAdjustmentPreferences.enableLayoutAdjustment = true;
		} else {
			_doc.layoutAdjustmentPreferences.enableLayoutAdjustment = false;
		}
	} else {
		/* InDesign ab CC2019 */
		if(_checkbox.value === true) {
			_doc.adjustLayoutPreferences.enableAdjustLayout = true;
		} else {
			_doc.adjustLayoutPreferences.enableAdjustLayout = false;
		}
	}
	
	return;
} /* END function __setLayoutAdjustment */


function __insertColumnGuideLockedValue(_checkbox) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
	
	var _doc = app.documents.firstItem();
	
	if(_doc.documentPreferences.columnGuideLocked === true) {
		_checkbox.value = true;
	} else {
		_checkbox.value = false;
	}

	return;	 
} /* END function __insertColumnGuideLockedValue */

function __setColumnGuideLock(_ui, _marginsTab, _checkbox) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _doc = app.documents.firstItem();
	
	if(_checkbox.value === true) {
		_doc.documentPreferences.columnGuideLocked = true; /* ### -> document property */
		_global.lockColumnsPositionsRow = true;
		__removeColumnsPositionsInputs(_ui, _marginsTab, true);
	} else {
		_doc.documentPreferences.columnGuideLocked = false; /* ### -> document property */
		_global.lockColumnsPositionsRow = false;
		__fillColumnsPositionsRow(_ui, _marginsTab, _checkbox);
	}

	return;
} /* END function __setColumnGuideLock */



function __insertColumnDirectionValue(_verticalRadiobutton, _horizontalRadiobutton) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return false; }
	
	var _activePage;
	
	_activePage = __getPage("active");
	if(!_activePage || !_activePage.isValid) { return false; }
	
	if(_activePage.marginPreferences.columnDirection === HorizontalOrVertical.VERTICAL) {
		_verticalRadiobutton.value = true;
	} else {
		_horizontalRadiobutton.value = true;
	}

	return;
} /* END function __insertColumnDirectionValue */

function __setColumnDirection(_verticalRadiobutton, _horizontalRadiobutton) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return false; }

	var _activePage;
	
	_activePage = __getPage("active");
	if(!_activePage || !_activePage.isValid) { return false; }
	
	if(_verticalRadiobutton.value === true) { 
		_activePage.marginPreferences.columnDirection = HorizontalOrVertical.VERTICAL;
	} else {
		_activePage.marginPreferences.columnDirection = HorizontalOrVertical.HORIZONTAL;
	}
	
	return;
} /* END function __setColumnDirection */



function __onlyTextFrames (_selectedObjects) {
	
	for(var i=0; i<_selectedObjects.length; i++) {		
		if(!(_selectedObjects[i] instanceof TextFrame)) {
			return false;
		}
	}
	
	return true;
} /* END function __onlyTextFrames */



function __onSamePage (_selectedObjects) {

	for(var i=0; i<_selectedObjects.length; i++) {
		if(_selectedObjects[i].parentPage == null) {
			return false;
		} 
	}
	
	for(var i=1; i<_selectedObjects.length; i++) {
		
		if(_selectedObjects[i-1].parentPage != _selectedObjects[i].parentPage) {
			return false;
		} 
	}

 return true;
} /* END function __onSamePage */



function __getExtreme(_ca,_selectedObjects) {
	
	var _caValues = [];
	
	for(var i=0; i<_selectedObjects.length; i++) {
		_caValues.push(Number(_selectedObjects[i].geometricBounds[_ca]));
	}

	_caValues.sort(function(a, b) { return a - b; });

	switch (_ca) {
		case 0 :
		case 1 :
			return _caValues[0]; /* Minimum */
		case 2 :
		case 3 :
			return _caValues[_caValues.length -1]; /* Maximum */
		default : 
	}

	return null;
} /* END function __getExtreme */



function __getGutterWidth(_selectedObjects) {	
		
		if(_selectedObjects.length < 2) { return -1; }
	
		var _distances = [];
		var _distance;
		var _numOfObj = _selectedObjects.length;
		var _numOfPosDistances = 0;
		
		var i, j, o;
		
		for(i=0; i<_numOfObj; i++) {
			for(j=0; j<_numOfObj; j++) {
				if(i!=j) {
					_distance = _selectedObjects[i].geometricBounds[1] - _selectedObjects[j].geometricBounds[3];
					if(_distance > 0) {
						_distances.push(_distance);
					}
				}
			}	
		}
	
		for(o=1; o<=_numOfObj; o++) {
			_numOfPosDistances += (o-1);
		}
	
		if(_numOfPosDistances == _distances.length) {		
			_distances.sort(function(a, b) { return a - b; });
			return Math.round(_distances[0] * 1000)/1000;
		} 
	
	return -1;
}	/* END function __getGutterWidth */



function __insertMasterPageLabels() {
	
	if(!_global) { return; }
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return; }
	
	var _activePage;
	var _masterPage; 
	
	_activePage = __getPage("active");
	if(!_activePage || !_activePage.isValid) { return false; }
	
	_masterPage = _activePage.appliedMaster;

	if(!_masterPage || !_masterPage.isValid) {
		_global.transferMarginsToMasterButton.text = "";
		_global.transferMarginsToMasterLabel.text = localize(_global.transferMarginsToMasterLabelText);
	} else {
		_global.transferMarginsToMasterButton.text = _masterPage.namePrefix;
		_global.transferMarginsToMasterLabel.text = _masterPage.baseName;
	}
	
	return true;
} /* END function __insertMasterPageLabels */


function __updatePageIcons() {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return false; }
	
	var _doc;
	var _page;
	var _spread;
	
	_doc = app.documents.firstItem();
	_page = __getPage("active");
	_spread = _page.parent;
	
	/* Doppelseiten */
	if(_doc.documentPreferences.facingPages && _spread.pages.length <= 2) {
		_global.spinLineGroupTop.show();
		_global.spinLineGroupBottom.show();
		_global.pageIconFacingGroup.show();
		_global.pageIconSingleGroup.hide();
		if(_spread.pages.length === 1) {
			if(_spread.pages[0].side === PageSideOptions.RIGHT_HAND) {
				_global.leftPageButton.hide();
				_global.rightPageButton.show();
				_global.rightPageButton.text = _spread.pages[0].name;
			} else {
				_global.leftPageButton.show();
				_global.rightPageButton.hide();
				_global.leftPageButton.text = _spread.pages[0].name;
			}
		} else {
			_global.leftPageButton.show();
			_global.rightPageButton.show();
			_global.leftPageButton.text = _spread.pages[0].name;
			_global.rightPageButton.text = _spread.pages[1].name;
		}
	} else {
	/* Einzelseiten oder Druckbogen mit mehr als 2 Seiten */
		_global.spinLineGroupTop.hide();
		_global.spinLineGroupBottom.hide();
		_global.pageIconFacingGroup.hide();
		_global.pageIconSingleGroup.show();
		_global.singlePageButton.text = _page.name;	
	}
	
	return true;
} /* END function __updatePageIcons */



function __getPage(_flag, _noSelectionOption) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return false; }
	if(!_flag || _flag.constructor !== String) { return false; }
	
	var _doc;
	var _leftPageIconSelected = false;
	var _rightPageIconSelected = false;
	var _spread;
	var _selection;
	var _page;
	var _textFrame;
	
	var _doc = app.documents.firstItem();
	
	if(_global.hasOwnProperty("leftPageButton")) {
		_leftPageIconSelected = _global.leftPageButton.value;
	} 
	if(_global.hasOwnProperty("rightPageButton")) {
		_rightPageIconSelected = _global.rightPageButton.value;
	}
	
	switch(_flag) {
		case "active":
			_page = app.activeWindow.activePage; /* Keine Seite ausgewaehlt oder kein zweiseitiger Druckbogen */
			_spread = _page.parent;
			if(
				_doc.documentPreferences.facingPages &&
				_spread.pages.length === 2 && 
				_spread.pages[0].side === PageSideOptions.LEFT_HAND && 
				_spread.pages[1].side === PageSideOptions.RIGHT_HAND
			) {
				/* Auswahl linke Seite */
				if(_leftPageIconSelected) {
					_page = _spread.pages[0];
				}
				/* Auswahl rechte Seite */
				if (_rightPageIconSelected) {
					_page = _spread.pages[1];
				}
			}
			break;
		case "selection":
			_selection = app.selection;
			if(_selection.length > 0) {
				_textFrame = __getTextFrame(_selection[0]);
				if(!_textFrame || !_textFrame.isValid) { return false; }
				_page = _textFrame.parentPage;
				if(!_page || !_page.isValid) { return false; }
			} else {
				if(_noSelectionOption === "alert") {
					_global.ui.text = localize(_global.noTextSelectedErrorMessage);
				} else {
					_page = app.activeWindow.activePage;
					_global.ui.text = localize(_global.uiHead);
				}
			}
			break;
		default :
			return false;
	}
	
	return _page;
} /* END function __getPage */



function __getTextFrame(_obj) {
	
	if(!_obj || !_obj.isValid) { return null; }
		
	if(_obj instanceof TextFrame) {
		return _obj;
	} else { 
		if(_obj.hasOwnProperty("parentTextFrames") && 
			 _obj.parentTextFrames != null && 
			 _obj.parentTextFrames instanceof Array &&
			 _obj.parentTextFrames.length > 0 &&
			 _obj.parentTextFrames[0] instanceof TextFrame) {
			return _obj.parentTextFrames[0];
		}
	}
	
	return null;
} /* END function __getTextFrame */




function __getConvertedInputValue(_input) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return null; }
	
	var _doc = app.documents.firstItem();
	var _inputUnit = _input.text.toLowerCase().match("(inches_decimal|inches decimal|decimal inches|dezimalzoll|millimeters|millimeter|millimetres|millimetre|zentimeter|centimeters|centimeter|centimetres|centimetre|inches|points|point|punkte|punkt|pixels|pixel|agates|agaten|ciceros|cicero|inch|picas|pica|zoll|ag|px|pt|in|mm|cm|c|p|z|\")"); 
	var _rulerUnit = _doc.viewPreferences.horizontalMeasurementUnits.toString();	
	var _inputTextSplit;
	var _inputValue;

	if(_inputUnit != null) {
		_inputTextSplit = _input.text.replace(",",".","g").toLowerCase().split(_inputUnit[0]); 
		_inputValue = Number(_inputTextSplit[0]) + (Number(_inputTextSplit[1])/12);	/* 2. Wert fuer Umrechnung von Pica und Cicero */
		_inputValue = __convert(_inputValue,_inputUnit[0],_rulerUnit);
	} else {
		_inputValue = _input.text.replace(",",".","g").match("\\d{0,}\\.{0,1}\\d{0,}");
	}
	
	if(_input.text == "" || _inputValue == null) { return null; }
	
	if(_inputValue instanceof Array) {
		_inputValue = Number(_inputValue[0]); 
	}

	if(isNaN(_inputValue)) { 
		return null; 
	} else {
		return _inputValue;
	} 
} /* END function __getConvertedInputValue */



function __convert(_value,_from,_to) {
	
	var _result = 0;
	 
	_value = String(_value);
	_value = Number(_value.replace(",",".","g").match("\\d{0,}\\.{0,1}\\d{0,}"));
	_from = __unify(_from);
	_to = __unify(_to);
	
	if(isNaN(_value) || _from == "" || _to == "") { return null; }
		
	switch (_from) {	
		/* _from */
		case "mm" :
			switch (_to) {			 
				/* _to */
				case "pt" :
					_result = _value * 72 / 25.4;
					break;	
				/* _to */
				case "inch" :
					_result = _value / 25.4;
					break;
				/* _to */
				case "cm" :
					_result = _value / 10;
					break; 
				/* _to */
				case "p" :
					_result = _value * 72 / 25.4 / 12; 
					break;
				/* _to */
				case "c" :
					_result = _value * (1/(1000/2660)) / 12; 
					break;
				/* _to */
				case "ag" :
					_result = _value / 25.4 * 14;
					break;
				default :
					_result = _value;
			}				
			break;
		/* _from */
		case "cm" :
			switch (_to) {			 
				/* _to */
				case "pt" :
					_result = _value * 72 / 25.4 * 10;
					break;
				/* _to */
				case "inch" :
					_result = _value / 25.4 * 10;
					break;
				/* _to */
				case "mm" :
					_result = _value * 10;
					break; 
				/* _to */
				case "p" :
					_result = _value * 72 / 25.4 * 10 / 12;
					break;
				/* _to */
				case "c" :
					_result = _value * (1/(1000/2660)) * 10 / 12;
					break; 
				/* _to */
				case "ag" :
					_result = _value / 25.4 * 10 * 14;
					break;
				default :
					_result = _value;
			}
			break;
		/* _from */
		case "pt" :
			switch (_to) {		
				/* _to */
				case "mm" :
					_result = _value * (1/72) * 25.4;
					break; 
				/* _to */
				case "cm" :
					_result = _value * (1/72) * 25.4 / 10;
					break;
				/* _to */
				case "inch" :
					_result = _value * (1/72);
					break;
				/* _to */
				case "p" :
					_result = _value * (6/72);
					break;
				/* _to */
				case "c" :
					_result = _value * 25.4 / ((1000/2660) * 12 * 72);
					break; 
				/* _to */
				case "ag" :
					_result = _value * (1/72) * 14;
					break;
				default :
					_result = _value;
			}
			break;
		/* _from */
		case "inch" :
			switch (_to) {
				/* _to */
				case "mm" :
					_result = _value * 25.4;
					break; 
				/* _to */
				case "cm" :
					_result = _value * 25.4 / 10;
					break;
				/* _to */
				case "pt" :
					_result = _value * 72;
					break;
				/* _to */
				case "p" :
					_result = _value * 72 / 12;
					break;
				/* _to */
				case "c" :
					_result = _value * (25.4/(1000/2660)) / 12;
					break;
				case "ag" :
					_result = _value * 14;
					break;
				default :
					_result = _value;
			}
			break;
		/* _from */
		case "p" :
			switch (_to) {		
				/* _to */
				case "mm" :
					_result = _value * (1/72) * 25.4 * 12;
					break; 
				/* _to */
				case "cm" :
					_result = _value * (1/72) * 25.4 / 10 * 12;
					break;
				/* _to */
				case "inch" :
					_result = _value * (1/72) * 12;
					break;
				/* _to */
				case "pt" :
					_result = _value * 12;
					break;
				/* _to */
				case "c" :
					_result = _value * 25.4 / ((1000/2660) * 72);
					break;
				/* _to */
				case "ag" :
					_result = _value * (1/72) * 12 * 14;
					break;
				default :
					_result = _value;
			}
			break;
		/* _from */
		case "c" :
			switch (_to) {		
				/* _to */
				case "mm" :
					_result = _value * (1000/2660) * 12;
					break; 
				/* _to */
				case "cm" :
					_result = _value * (1000/2660) / 10 * 12;
					break;
				/* _to */
				case "inch" :
					_result = _value * ((1000/2660)/25.4) * 12;
					break;
				/* _to */
				case "pt" :
					_result = _value * (1000/2660) * 12 * 72 / 25.4;
					break;
				/* _to */
				case "p" :
					_result = _value * (1000/2660) * 72 / 25.4;
					break;
				/* _to */
				case "ag" :
					_result = _value * ((1000/2660)/25.4) * 12 * 14;
					break;
				default :
					_result = _value;
			}
			break;
		/* _from */
		case "ag" :
			switch (_to) {
				/* _to */
				case "mm" :
					_result = _value * 25.4 / 14;
					break; 
				/* _to */
				case "cm" :
					_result = _value * 25.4 / 10 / 14;
					break;
				/* _to */
				case "pt" :
					_result = _value * 72 / 14;
					break;
				/* _to */
				case "p" :
					_result = _value * 72 / 12 / 14;
					break;
				/* _to */
				case "c" :
					_result = _value * (25.4/(1000/2660)) / 12 / 14;
					break;
				case "inch" :
					_result = _value / 14;
					break;
				default :
					_result = _value;
			}
			break;
		default :
			_result = _value;
	}
	
	
	
	function __unify(_unit) {
		
		_unit = _unit.replace("\\s+","","gi").toLowerCase();
	 
		switch (_unit) {		
			case "mm" :
			case "millimeter" :
			case "millimeters" :
			case "millimetre" :
			case "millimetres" :		 
				return "mm"; 
			case "cm" :
			case "zentimeter" :
			case "centimeter" :	
			case "centimeters" : 
			case "centimetre" :	
			case "centimetres" :
				return "cm";
			case "pt" :
			case "point" :
			case "points" :
			case "punkt" :
			case "punkte" :
			case "pixel" :
			case "pixels" :
			case "px" :
				return "pt";
			case "in" :	
			case "inch" :
			case "inches" :
			case "zoll" :
			case "z" :
			case "dezimalzoll" :
			case "inches_decimal" :
			case "inches decimal" :
			case "decimal inches" :
			case "\"" :
				return "inch";	 
			case "agates" :
			case "agaten" :
			case "ag" :
				return "ag";
			case "ciceros" :
			case "cicero" :
			case "c" :
				return "c";
			case "picas" :
			case "pica" :
			case "p" :
				return "p";
			default :
				return "";
		}
	} /* END function __unify */
	 
	if(!isNaN(_result)) {
		return _result;
	} else {
		return null;
	}
} /* END function __convert */



function __convertToOutputFormat(_input) {
	
	var _output;
	var _decimal;
	var _docUnit = __getDocUnits();
	
	if(_docUnit == "p" || _docUnit == "c") {
		_decimal = (Number(_input) - parseInt(_input)) * 12;
		_decimal = Math.round(_decimal * 1000)/1000;
		_output = parseInt(_input) + _docUnit + _decimal;
	} else {		
		_output = Math.round(_input * 1000)/1000 + " " + _docUnit;
	}
 
	return _output;
} /* END __convertToOutputFormat */



function __getDocUnits() {
 
	if(app.documents.length == 0 || app.layoutWindows.length == 0 || !_global) { return ""; }
	
	var _doc = app.documents.firstItem();
	var _unit = _doc.viewPreferences.horizontalMeasurementUnits.toString();
	
	switch (_unit) {
		case "MILLIMETERS" :
			_unit = "mm";
			break;
		case "CENTIMETERS" :
			_unit = "cm";
			break;
		case "POINTS" :
			_unit = "pt";
			break;
		case "INCHES" :
			_unit = localize(_global.inches);
			break;
		case "PIXELS" :
			_unit = "px";
			break;		
		case "AGATES" :
			_unit = "ag";
			break;	
		case "CICEROS" :
			_unit = "c";
			break;	
		case "PICAS" :
			_unit = "p";
			break;	
		case "INCHES_DECIMAL" :
			_unit = localize(_global.inches);
			break;		
		default : 
			_unit = "";
	}
	
	return _unit;
} /* END function __getDocUnits() */



function __setDocMeasurementUnits(_unit) {
	
	if(app.documents.length == 0 || app.layoutWindows.length == 0) { return; }
	 
	var _doc = app.documents.firstItem();

	_doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits[_unit]; /* ### -> document property */
	_doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits[_unit]; /* ### -> document property */
	
	return;
} /* END __setDocMeasurementUnits */



function __hideWaring(_uiImage) {
	
	if(app.documents.length === 0 || app.layoutWindows.length == 0) { return null; }
	
	var _doc = app.documents.firstItem();

	if(_doc.viewPreferences.horizontalMeasurementUnits === _doc.viewPreferences.verticalMeasurementUnits) {
			_uiImage.visible = false;
		} else {
			_uiImage.visible = true;
		} 
} /* END function __hideWaring */

		
		
function __buttonOnDraw(_obj) {
		
	var _x; 
	var _y;
	var _fillBrush;
	var _textPen;
	var _docUnit = __getDocUnits();
	
	try {
		with(this) {
			
			_fillBrush = graphics.newBrush(graphics.BrushType.SOLID_COLOR, [0.635, 0.635, 0.635, 1]);
			
			if(_obj.hasOwnProperty("mouseOver") && _obj.mouseOver == true) {
				if(app.generalPreferences.hasOwnProperty("uiBrightnessPreference") && app.generalPreferences.uiBrightnessPreference <= 0.5) {
					_fillBrush = graphics.newBrush(graphics.BrushType.SOLID_COLOR, [0.28,0.629,0.963, 1]);
				} else {
					_fillBrush = graphics.newBrush(graphics.BrushType.SOLID_COLOR, [0.06,0.404,0.824, 1]);
				}
			}
		
			graphics.rectPath(0,0,size[0]+2,size[1]+2);
			graphics.fillPath(_fillBrush);
			
			if(this.hasOwnProperty("icon") && icon) {
				graphics.drawImage(icon,1,1,size[0]-2,size[1]-2);
			}
		
			if(this.hasOwnProperty("text") && text) {
				if(text == _docUnit) {
					_textPen = graphics.newPen(graphics.PenType.SOLID_COLOR, [0,0,0,0.3], 1);
				} else {
					_textPen = graphics.newPen(graphics.PenType.SOLID_COLOR, [0,0,0,0.8], 1);
				}
				_x = (size[0] - graphics.measureString(text,graphics.font)[0]) / 2;
				_y = (size[1] - graphics.measureString(text,graphics.font)[1]) / 2;
				graphics.drawString (text, _textPen, _x, _y, graphics.font);
			}
		}
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		}
	}
} /* END function __buttonOnDraw */	 



function __pageIconOnDraw(_obj) {
	
	if(!_global) { return; }
	
	var _fillBrush;
	var _strokePen;
	var _textPen;
	var _xIcon;
	var _yIcon;
	var _widthIcon;
	var _heightIcon;
	var _xText; 
	var _yText;
	
	try {
		if(this.hasOwnProperty("value") && this.value === true){
			if(app.generalPreferences.hasOwnProperty("uiBrightnessPreference") && app.generalPreferences.uiBrightnessPreference <= 0.5) {
				_fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0.28,0.629,0.963,1]);
				_strokePen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.6,0.6,0.6],2);
				_textPen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [1,1,1],1);
			} else {
				_fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0.06,0.404,0.824,1]);
				_strokePen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.14,0.14,0.14],2);
				_textPen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [1,1,1],1);
			}
		} else if(_obj.hasOwnProperty("mouseOver") && _obj.mouseOver == true) {
			if(app.generalPreferences.hasOwnProperty("uiBrightnessPreference") && app.generalPreferences.uiBrightnessPreference <= 0.5) {
				_fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0.14,0.14,0.14,1]);
				_strokePen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.6,0.6,0.6],2);
				_textPen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.8,0.8,0.77],1);
			} else {
				_fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0.14,0.14,0.14,1]);
				_strokePen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.14,0.14,0.14],2);
				_textPen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.8,0.8,0.77],1);
			}
		} else {
			if(app.generalPreferences.hasOwnProperty("uiBrightnessPreference") && app.generalPreferences.uiBrightnessPreference <= 0.5) {
				_fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0.85,0.85,0.85,1]);
				_strokePen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.6,0.6,0.6,1],2);
				_textPen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.14,0.14,0.14,1],1);
			} else {
				_fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0.85,0.85,0.85,1]);
				_strokePen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.14,0.14,0.14,1],2);
				_textPen = this.graphics.newPen(this.graphics.PenType.SOLID_COLOR, [0.14,0.14,0.14,1],1);
			}
		}
		
		_xIcon = 0;
		_yIcon = 0;
		_heightIcon = this.size[1];
		
		if(
			this.helpTip === localize(_global.leftPageButtonHelpTip) &&
			this.parent.children.length > 1 &&
			this.parent.children[1].visible === true
		) {
			_widthIcon = this.size[0]+1;	
		} else {
			_widthIcon = this.size[0];
		}
		
		/* Rechteck */
		this.graphics.newPath();
		this.graphics.rectPath(0,0,_widthIcon,_heightIcon);
		
		/* Flaeche */
		this.graphics.fillPath(_fillBrush);
		
		/* Kontur */
		this.graphics.strokePath(_strokePen);
		
		/* Text */
		if(this.hasOwnProperty("text") && this.text) {
			_xText = (this.size[0] - this.graphics.measureString(this.text,this.graphics.font)[0]) / 2;
			_yText = (this.size[1] - this.graphics.measureString(this.text,this.graphics.font)[1]) / 2;
			this.graphics.drawString(this.text, _textPen, _xText, _yText, this.graphics.font);
		}		
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		} 
	}
} /* END function __pageIconOnDraw */



function __spinLineGroupOnDraw() {
	
	if(!_global) { return; }
	
	var _fillBrush;
	var _correctionFaktor; /* fuer einzelne linke Seite im Druckbogen */
	
	try {	
		if(_global.rightPageButton && _global.rightPageButton.visible === false) {
			_correctionFaktor = 1;
		} else {
			_correctionFaktor = 0;
		}
		/* Spine line between page Icons */
		if(app.generalPreferences.hasOwnProperty("uiBrightnessPreference") && app.generalPreferences.uiBrightnessPreference <= 0.5) {
			_fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0.6,0.6,0.6,1]);
		} else {
			_fillBrush = this.graphics.newBrush(this.graphics.BrushType.SOLID_COLOR, [0.14,0.14,0.14,1]);
		}
		this.graphics.newPath();
		this.graphics.rectPath((this.size[0]/2)-_correctionFaktor,0,1,this.size[1]); /* x, y, Breite, Höhe */
		this.graphics.fillPath(_fillBrush);
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		} 
	}
} /* END function __spinLineGroupOnDraw */



function __chainMarginsButtonOnDraw(_obj) {
	
	if(!_global) { return false; }
	
	var _multiplier = 0;
	
	try {
			
		if(app.generalPreferences.hasOwnProperty("uiBrightnessPreference") && app.generalPreferences.uiBrightnessPreference <= 0.5) {	
			if(!this.value) {
				if(_obj.mouseOver) { 
					_multiplier = 4;
				} else {
					_multiplier = 2;
				}
			} else {
				if(_obj.mouseOver) { 
					_multiplier = 5;
				} else {
					_multiplier = 3;
				}
			}
		} else {
			if(!this.value) {
				if(_obj.mouseOver) { 
					_multiplier = 6;
				} else {
					_multiplier = 0;
				}
			} else {
				if(_obj.mouseOver) { 
					_multiplier = 7;
				} else {
					_multiplier = 1;
				}
			}
		}
		
		if(this.hasOwnProperty("icon") && this.icon) {
			this.graphics.drawImage(this.image,-(this.size[0]*_multiplier),0);
		}
	} catch(_error) {  
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		}
	}
} /* END function __chainMarginsButtonOnDraw */



function __swapLeftRightMarginsButtonOnDraw(_obj) {
	
	if(!_global || !_obj) { return false; }
	
	var _multiplier = 0;
	
	try {

		if(app.generalPreferences.hasOwnProperty("uiBrightnessPreference") && app.generalPreferences.uiBrightnessPreference <= 0.5) {	
			if(_obj.mouseOver) {
				_multiplier = 2;
			} else {
				_multiplier = 1;
			}
		} else {
			if(_obj.mouseOver) {
				_multiplier = 3;
			} else {
				_multiplier = 0;
			}
		}
		
		if(this.hasOwnProperty("icon") && this.icon) {
			this.graphics.drawImage(this.image,-(this.size[0]*_multiplier),0);
		}
	} catch(_error) {  
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		}
	}
} /* END function __swapLeftRightMarginsButtonOnDraw */



function __press(_window, _button) {
	
	var _curBounds = [_button.bounds[0],_button.bounds[1],_button.bounds[2],_button.bounds[3]];
	
	_button.bounds = [_curBounds[0]+1,_curBounds[1]+1,_curBounds[2]-2,_curBounds[3]-2];
	$.sleep(140);
	_button.bounds = _curBounds;
} /* END function __press */


		
function __disableRulerUnitButton(_buttonGroup) {
	
	var _numberOfChildren = _buttonGroup.children.length,
			_docRulerUnit = __getDocUnits();
	
	for(var i=0; i<_numberOfChildren; i++) {
		if(_buttonGroup.children[i].enabled == false) {
			_buttonGroup.children[i].enabled = true;
		}
		if(_buttonGroup.children[i].text == _docRulerUnit) {
			_buttonGroup.children[i].enabled = false;
		}
	}

	return;
} /* END function __enableRulerUnitButton */



function __round(_input) {
	
	if(!_global) { return; }
	
	var _inputValue;
	var _outputValue;
	var _affixes;
	var _prefix = "";
	var _suffix = "";		
	var _docUnit = __getDocUnits();
	var _f = 1;
	
	_inputValue = __getConvertedInputValue(_input);
	_outputValue = __convertToOutputFormat(_inputValue);
	_affixes = _outputValue.split(_docUnit);
	
	if(_docUnit == localize(_global.inches)) { 
		_f = 10; 
	}

	_prefix = Math.round(_affixes[0].replace(",",".","g") * _f) / _f; 
	
	if(isNaN(_prefix)) { 
		return false 
	}	
	
	if(_affixes.length > 1 && _affixes[1] != "") { 
		
		var _suffix = Math.round(_affixes[1].replace(",",".","g"));
		
		if(isNaN(_suffix)) { 
			return false 
		}
	}

	if(_docUnit != "p" && _docUnit != "c") {
		_docUnit = " " + _docUnit;
	}
	_input.text = _prefix + _docUnit + _suffix;

return true;
} /* END function __round() */



function __activate(_field) {
	_field.active = true;
return;
} /* END function __activate() */



function __setUIColorIcon(_baselineColorDropdown,_icons) {
	try { 
		with(_baselineColorDropdown) {
			items[0].image = _icons.lightBlue; 
			items[1].image = _icons.red;
			items[2].image = _icons.green;
			items[3].image = _icons.blue;
			items[4].image = _icons.yellow;
			items[5].image = _icons.magenta;
			items[6].image = _icons.cyan;
			items[7].image = _icons.gray;
			items[8].image = _icons.black;
			items[9].image = _icons.orange;
			items[10].image = _icons.darkGreen;
			items[11].image = _icons.teal;
			items[12].image = _icons.tan;
			items[13].image = _icons.brown;
			items[14].image = _icons.violet;
			items[15].image = _icons.gold;
			items[16].image = _icons.darkBlue;
			items[17].image = _icons.pink;
			items[18].image = _icons.lavender;
			items[19].image = _icons.brickRed;
			items[20].image = _icons.oliveGreen;
			items[21].image = _icons.peach;
			items[22].image = _icons.burgundy;
			items[23].image = _icons.grassGreen;
			items[24].image = _icons.ochre;
			items[25].image = _icons.purple;
			items[26].image = _icons.lightGray;
			items[27].image = _icons.charcoal;
			items[28].image = _icons.gridBlue;
			items[29].image = _icons.gridOrange;
			items[30].image = _icons.fiesta;
			items[31].image = _icons.lightOlive;
			items[32].image = _icons.lipstick;
			items[33].image = _icons.cuteTeal;
			items[34].image = _icons.sulphur;
			items[35].image = _icons.gridGreen;
			items[36].image = _icons.white;
		}
	} catch(_error) { 
		if(_global.debug) {
			$.writeln(_error.message + "; Zeile: " + _error.line);
		}
	}
		
	return;
} /* END function __setUIColorIcon */




/* Icons fuer User Interface */
function __defineIconsForUI() {
	
	return { 
		refresh: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1F\x00\x00\x00\x1F\b\x02\x00\x00\x00\u0090\u00CC\u0081n\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u008BIDATx\u00DA\u00EC\u0094\u00BD\u00AB\u0082P\x18\u00C6\u00F3\u0083>\u00A6\x04#)\u0085\u0088K\u0090\u00D1T\u0093\u00AD\u00E6\u00E8\u00E0\u00BF\u00D8\u00DC\"4\u00DAR\u008B\u008B\x0E54T\u00C3\u0085\u00F0F_PC\u0094D\u00F5\\\u00E3^.W0:\u00D0\u00E63\x1D=\u0087\u00DFy}}\u009F\u0087\u00EAt:\u0089\u00B7\u0089N\u00BCS1=\u00A6\u00BF*\u00F6\u00E9\u0089\u00DB\u00ED6\u009F\u00CFg\u00B3\u00D9z\u00BD>\u009DN\u00A9TJ\x10\u0084\u008F@\x14E\u00E1\u0080\u00E38\u00CDf\u0093\u0084\u00BE\u00DF\u00EF\u00FB\u00FD\u00FEf\u00B3\u00C1\u009Aa\u0098L&s>\u009F?\x03\u008DF\u00A3v\u00BB=\u009DN\t\u00E9\u0087\u00C3\u00C14M\u00D4[(\x14\x1A\u008DF\u00B1XD\u00B1\u00D7\u00EB\u00D5\u00F3<\u00D7u\u0097\u00CBe\u00B7\u00DB\u00BD\\.$\u009D\x01\u00C5\u00B2,\u00A0\u00EB\u00F5\u00BA\u00A2(\u008F&|\u00FF(\u009A\u0096$I\x14E\\\u00BCZ\u00AD\b\u00FB\u008EoGCr\u00B9\\\u00AB\u00D5\n\u00EF\u00A2\u00F6\u00A7\u00E8(z\u00B9\\\u00D6u=\u0099L\u0086\u00B7v\u00BB\u00DD\u00F1x\u0094e\u00F9)\u009D\u008A3\u00F2\u00D5\u00BE\x0F\u0087\u00C3\u00BF\u008F\u00B5Z\u008D\u00E7\u00F9\x7Fg\u00B6\u00DB\u00AD\u00EF\u00FB\u0098\u00D7\u0097\u00E9\u0093\u00C9\u00E4w\r\u00B3\u0084\u00D1\u00D0`0\u0080\u00815M\u00C3\b\x10&A>\u009F\u0087\u0095\u00C2\u00F1`\u00DB6\u00D0\x18\u00D9R\u00A9D\u00D8w\u0096e1\u00D7\u00BD^o\u00B1X\u00C0_\x0F.\u00BC\u008A7\u00E3\u00F18\u009DN\u00AB\u00AA\n\x7F\u0091\u00A4\x18\x1AR\u00A9T\u00E0\u00D8\u00AF@\u00C8\x19\u00E0\u00903\x0F\u00F7\u00A3j\u00A0\u00B3\u00D9l\x04\u00811\f#\u0082\u008ED\u00ACV\u00AB\x1C\u00C7\u00A1pp\x11\f\u00F0\x17\x02\x07[\u0088\x07\u0084Z\u00EC\u00A6\u0098\x1E\u00D3\x7Ft\x17`\x00\u00BCn\u00B9\u00FDZh\u0091\u00E3\x00\x00\x00\x00IEND\u00AEB`\u0082",
		hideBaselineGrid: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1F\x00\x00\x00\x1F\b\x02\x00\x00\x00\u0090\u00CC\u0081n\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02RIDATx\u00DA\u00ECUM\u008B\u00B1Q\x18\x1E<,|$\x1Fih\x10\x16J\u008AdJDc\n\x1BE\u00B6\u00FE\u0090\u008D\u0095\u0085\u00B2\u0094,\b\x0B5\u009BYX\u00C8bDF\u0091,L\u00F9\u008C\u009A\u00F1\u0091\u0092|\u00CEUOi6\u00AF\u00F1\u00CE\u00F0\u00D6[\u00CE\u00E2\u00E9\u00E9>\u00D7\u00B9\u00CE}_\u00F7u\u00CE\u00A1D\u00A3\u00D1\u009B\u008B\r\u00EA\u00CD%\u00C7\u0095\u00FD\x7Fc\u00A7\u00D1hb\u00B1\u00F8R\u00EC\"\u0091(\u0099L\n\x04\u0082#\x18\u00E2g\u00D4\u00B7\u00B7\u00B7\u00B1Xl\u00B1X\u00CC\u00E7\u00F3\u00B3\u00E5\u00BE\u00D9l\u00F0e\u00B3\u00D9\u00E5r\u00B9\u00DDn{<\u009E\u00D5j\u00F5\u00AB\u00DC\u00DF\u00DF\u00DF\u00DF\u00DE\u00DE\u00BA\u00DD\u00EEd2\u0081\x0E>\u009F\x0F\u00C1\u00A7\u00A7\u00A7\u0087\u0087\u0087\u00DDnw|-q\u009C\u00F7\u00E5\u00E5\u00A5\u00DF\u00EF\u00E3\u009FN\u00A7\x0B\u0085\u00C2\u00C7\u00C7G\u00B9\\\x1E\b\x04\u00F6\u00FB}.\u0097k6\u009B&\u0093\t\u00F1\u00BFcGR\u00A5R\u00A9Z\u00AD\u0082E&\u0093i4\u009A\u00BB\u00BB;*\u0095\n\u0093\u00C4\u00E3q\u0082 \u00DCn7fQP&\u0093\u00D1\u00E9tF\u00A3\x11\u00B3'\u00B1C\u00DC\u00E7\u00E7g\u00AC\u00E4r\u00B9V\u00ABU\"\u0091\u0090q\u00C8\u008Ddk\u00B5\u009A\u00DF\u00EFg\u00B1X\u0088\x0F\x06\u0083|>\u00FF\u00FA\u00FA\u00FA\u00F1\u00F1\u00E1p8\u00B0\u00EB\u00F7]-\x14\n\u00A0\u0096J\u00A5\u0090\u00F8@\rw3\u0099\u00CCD\"\u0081\u00FFJ\u00A5B\x061\x0B\f\u0090\u00C0c\u00D5I\u009EA\x0F\u0091\u0085\u00DDn\u0087\u00D6\u0087\u00A0B\u00A1\b\u0087\u00C3d\x1B\u0087\u00C3\u00E1!\x0E\f\u0090\u00C0c\u00D5I\u00ECJ\u00A5\x12\u00E2\u00A0i\u00EB\u00F5\u00FA\u0090c*\u0095B\u00F9\x07\u00B3\x1F\u00C0\u00C0\x00\t\u00BCJ\u00A5:Iw\u008B\u00C5\u0082c\u0082b\u00D3\u00E9\u00B4\u00D3\u00E9D\u00E1\u00BD^\u00AFX,j\u00B5\u00DA\u00D1h\u0084\u00C6\u00A2\u0087$\u0092\u00D4}6\u009B\x01c6\u009BObG\u0099.\u0097\x0B\u009Ei\u00B5Z\x1C\x0E\u0087\u00CF\u00E7\u0087B!\u009B\u00CD\u00A6V\u00ABI\u00C0v\u00BB\u00EDt:\u00F5z\x1D\x19P(\x14\u00BD^\u00FF'\u00CFP\u008E\u00BC|\u00A8\x17\u00F9\x06\u0083AX\x1E\u00FAb\x1B\x06\u0083\u00B1\\.\u00A7\u00D3))\x1A\x14\u00FB\u0089\u00DF\u00C9\u0081\u0083\u0093\u00CDfq\u00A6\f\x06\x03\u0092\u0085\u00EE\u00D8\x0F9\u00F2x<H\u0081\u00F6\x1C\u00E1\u00FD\u0086\x1D\u00EE\x1E\u008F\u00C7\u00E8\u0098\u00D7\u00EB\u00C5uHj\rM`\u00CD3\u00DC\u00EF\u0090\"\x12\u0089\u00DC\u00DF\u00DF\u0083\u00FA\u00EB\u009D~\u009E\u00D7\u00A3\u00D1h\u0080\x17\u00A7\u00FC7o\x13q\u00E4\x06\u00FF\u00EA\u00EB\u00EB\u00AB}e\u00FF7\u00EC\u009F\x02\f\x00G4\f\x0E\u00FB\u00FB\x06\x13\x00\x00\x00\x00IEND\u00AEB`\u0082",
		showBaselineGrid: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1F\x00\x00\x00\x1F\b\x02\x00\x00\x00\u0090\u00CC\u0081n\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00CCIDATx\u00DA\u00ECU\u00B9\u008A\u00C2P\x145\u0089\u0082\u008D+\x16\u00C1m\u0088\"\x166\x06\u008Dv\u008A`aa\u00E3/\u00FA\x15\x16\u0082\x10PpE\x10+E\u0089\x1B\u008A(*\x16\u008A\u00EB\x19\x1F\u0084a&\u00E02\u00C8\x14\u0093[=\u00AE\u00E7\u009D{\u00EFy\u00E7\x1A*\u009B\u00CDj\u00DE\x16\u00B4\u00E6\u009D\u00A1\u00B2\u00AB\u00EC\u00FF\u0089]{\x17\u00B1Z\u00ADz\u00BD\u00DEp8\\\u00AF\u00D7\u00BB\u00DDN\u00AF\u00D7\u009BL&\u0097\u00CB\u00E5\u00F1x\u00CCf\u00F3\u00EB\u00EC\u00CB\u00E5\u00B2R\u00A9\f\x06\u0083O\u009CVk4\x1A\u00ADV+\n,\x16\u008B\u00D9lV\u00AB\u00D5\u00DCnw$\x12A\u00F29\u00F6\u00CB\u00E5R\u00AF\u00D7\u009B\u00CD\u00E6\u00F9|v8\x1C\u0081@\x00\u00CD2\fC~=\u009DN\u00A3\u00D1\u00A8\u00DDn\u00A30\x0E\u00C1`0\x14\nQ\x14\u00F5\x10;.\u00E7\u00F3yI\u0092\u00D0l,\x16\u00B3\u00DB\u00EDH\x1E\u008F\u00C7j\u00B5:\u009DNY\u0096\u00E5y\u00FE\u00E3\x16\u0093\u00C9D\x14\u00C5F\u00A3\u0081i\u0092\u00C9\u00A4\\^\x0E&\u0093\u00C9|K\u0095J\u00A5n\u00B7\u008Bf\u00D3\u00E9\u00B4\u00ACl\u00B1Xl\u00B5Z\u00DB\u00ED\x16\x05 \x0E\u00A8\u00914\x18\f~\u00BF\x1F\u00D4\x18b\u00BF\u00DFC\u00A8\u00FB\u009E\u00E9t:P9\u0091H\u00E8t:9\u00896\x15\u00CF\u00C0\x00\t<n=\u00E4H\u009F\u00CF\x07\x1D\n\u0085\u00C2\u00E1p\u0090\u0093P_\u00F1\f\f\u0090\u00C0\u00E3\u00D6O*\x05e\u009CN'\x19\x16F\u0084\x1F0>\u0092D}<\x1DX\x04A\u00A0i\u009A\f\u0091\u00CB\u00E5\u00E6\u00F39\u0084\u008A\u00C7\u00E3$\u00F95(\u00C5o\u00D3]\u00CF\u00C0\u00FE\u00F0\u00CCx<\x06\u00E3s\u009E!=\u0086\u00C3a\u00AF\u00D7[.\u00971\x04X\u0088\u00DF\u00B1Jx\u00D2\u00CDf\x03)\x00\u00C33F\u00A3Q\u008B\u00C5\u00F2\u00CA6\u00E1Z*\u0095\u00C2\u00AE\u00F6\u00FB}4\u008B\x03\u00F6\x0B\x05l6\x1BF\u00E18\u00EEW\u00BBJ\x02\x14\u00FC-\u00D4\x7F`\u0095]e\u00FFC\u00F6\u00AB\x00\x03\x00\u00C7\u00EF\u00EB\u00D0\x00I+\x06\x00\x00\x00\x00IEND\u00AEB`\u0082",
		uiOpacity:"\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1F\x00\x00\x00\x1F\b\x02\x00\x00\x00\u0090\u00CC\u0081n\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00mIDATx\u00DAb\\\u00B4h\x11\x03\u00CD\x00\x13\x03-\u00C1\u00A8\u00E9\u00C3\u00D1t\x16\u00AC\u00A2\u00B3f\u00CD\"\u00D5\u00A0\u00B4\u00B44bM\x07\u0082\u00FA\u00FAzd\u00EE\u00C6\u008D\x1B\u0091\u00B9\u00FE\u00FE\u00FE\u00C8\u00DC\u00C6\u00C6\u00C6\u00D1X\x1D\u00F4i\u0086`4\u00A2\u00C9\u008E\u0086\u00FB\x10\u0089U\u00FC\u00D1\u0088&{\u00E1\u00C2\u0085\u00D1p\x1F\n\u00B1\u008A\u00ABP\u00C5\x1F\u008DD\u0099\u008E\u00B5*\x18\u008D\u00D5Q\u00D3\u00E9`:@\u0080\x01\x00~\u0098\x1B\u00C5=,\x18\u00FD\x00\x00\x00\x00IEND\u00AEB`\u0082",
		selectionStart: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1C\x00\x00\x00\x1C\b\x02\x00\x00\x00\u00FDoH\u00C3\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00A4IDATx\u00DAb\\\u00B4h\x11\x03\u00B5\x01\x13\x03\r\u00C0\b7\u0094\u0085$\u00D5\u00B3f\u00CD\x1AR\u00DE\u00EF\u00E8\u00E8\u00D0\u00D1\u00D1\u00A1\u00A1Kyxx\u00DC\u00DD\u00DD\u00ED\u00EC\u00EC \\\x7F\x7F\x7F\t\t\t\x16\n\r\u00CD\u00CF\u00CF\x7F\u00F5\u00EA\x15??\u00BF\u0082\u0082\x020\x1FYZZ\u00CA\u00C9\u00C9\u00A1\x1B\u00AA\u00A9\u00A9)++\u008B,\u00F2\u00F8\u00F1\u00E3\u00EB\u00D7\u00AFc5\x11\x18\b\u00BC\u00BC\u00BC\u00AD\u00AD\u00AD@FLL\fDp\u00FF\u00FE\u00FD\u00E8\u0086\u00DE\u00B8q\u0083\u0083\u0083CTT\x14\u00C2}\u00FD\u00FA5P\x04\u00D38iii \u00F9\u00ED\u00DB\u00B7\u009F?\x7F\x02\u00BD/..\u00FE\u00F4\u00E9S\u009Ca\u00FA\u00FF\u00FF\u00FFK\u0097.}\u00FC\u00F8\x11\u00C8\x06\u0092@6P\x04M\rP\u00BF\u009A\u009A\u009A\u00A3\u00A3\u00A3\u008C\u008C\u00CC\u00EA\u00D5\u00AB\u0081\u00FE\x05\n\x02\x19\x10)\u00A0M\u008CX\x0B\x14666\u00A0\u008F\u00AE\\\u00B9\u00F2\u00EB\u00D7/2\u00D2)\u008A\u00F7\u00DD\u00DC\u00DC\u0090\u00B9\x0E\x0E\x0Ep\u00F6\u00AE]\u00BB\u0088\u008F=\u00C6a]\u00F4\x01\u00A3\u0082\u00CA\u0086~\u00F8\u00F0a\u00EB\u00D6\u00AD\u00BF\x7F\u00FF\u00A6\u00A6\u00A1\u00DC\u00DC\u00DC\u00C0\bdee\x05\u009A\x0E4\x1AB\u00C2\x135\u0084\u00CDB\u0086K\u00D7\u00AF_\u009F\u0096\u0096v\u00EA\u00D4\u00A9\x1F?~@\u0092spp\u00F0\u009E={ \n<==)\u008A(%%%???`\u00C6\u00BFw\u00EF\x1E\u0090\x0B\u00CC\u008A\u00C0\u00BC\x0F\u00F4\x04E\u0086\x02\u00B3\x06\u00D0\u00BF\u00C0\u009C\n\f\x13\x17\x17\x17mmm\u00A0'\u0080^\u00A1\u00A8\u0094\u00BA{\u00F7\u00EE\u00993g\u0080\u00E5\x130\u00BF\x1E;v\u00EC\u00E6\u00CD\u009B@\u00B6\u0080\u0080\x00\u00F9\u0089\x1F\u0098\u00C7\u00A4\u00A4\u00A4\u00B0\u0096\u00D6\u00E4\u00BBTUU\x15XBS\u00A1\u00E2C\x06\u008A\u008A\u008At\u00CD\u00A6\x00\x01\x06\x00\u00E2+\u00B0\u00B7>V\u0097\u00DB\x00\x00\x00\x00IEND\u00AEB`\u0082",
		selectionLastBaseline: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1C\x00\x00\x00\x1C\b\x02\x00\x00\x00\u00FDoH\u00C3\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u009BIDATx\u00DA\u00DC\u0094A\u00AB\x01Q\x18\u0086\u00D1\r\u00B3\x14\x1BJ\u00C9B\u00C9\u00ACX)eg5K[[\u00BF\u00C1\u00EF\u0098%;\u0096\u00B2\u009B\u0095,\u00C6\u00C2R\n!\x0B)\u00C5B\u0092,LJ\u00EE\u00D3=%w\u00BAs/\u00D7X\u00F0-\u00A6\u00F7\u00FB\u00CE\u009Cg\u00DE\u00EF\u00CC9\u00C7Y\u00ADV\x1Dv\u0087\u00CB\u00F1\u0084\u00B8\x1B\u00BA\u00DF\u00EF\u00BB\u00DD\u00EE+@\u00AFc:\u009D\x0E\x06\u0083\u00E3\u00F1\u0088\u00E6K|\u008F\u00CACP]\u00D7!\u00AEV\u00ABF\u00A3!\u00A0\u00EDv\x1B\u00B1\u00D9l\\\u008F\u00D8L\u00A7\u00D3\u00B9\\\x0E\u0083\u00CB\u00E5\u0092J2\u0099\u008C\u00C5b\u00F3\u00F9\u00FC\u00E3\x7FD@\u00A1P\b.\u00BE\u00DCnw \x10\u00B8\f\u00F9\u00FD\u00FE\u00BB\u009D\u00C2\u008AD\"t\u009D\u00CDfI\x11\u0098\u0085K\u00DD\u00E3\u00F1Pa\u00D4\u00F9\u00BE\u009B\u00FF\u0096\u00B8\u00EFG\u0095\u00CB\u00E5g9\u00F5\u00F9|6C\u00F9\u00CB\u00C5bQ\u0092$;\u00A1\u00DB\u00ED\u00B6^\u00AF\x1F\x0E\x07\u00E8\u00A0\u00C5S\fE\u00A3Q\u00A1\u00CDk\x1A\u008F\u00C7\u00C3\u00E1\u00F0ue\u00B1X\u008C\u00C7\u00E3K\x1A\f\x06qZ*\u0095\x14E\u00F1z\u00BDb5TU-\x14\n\u00E2\u0085J\u00A5bv:\u0099L\u00D6\u00EB\u00F5%ES\u00B1r=\x1A\u008D\u00C0\u00E1=\u0095J\u0091\x1A\u0086\u00A1i\x1AM\u0098\u00A1\u00E7\u00F3\u00B9\u00DF\u00EF\u00EFv;4O4\x15+(N\u00A5\u00AF\u0080[\u00AB\u00D5:\u009D\x0EM\u00B0 ?l\u00A9\u00D3\u00E9\u00D4\u00EB\u00F5dY\x1E\x0E\u0087\u00E8_\u00D67\u0091Hd2\u0099\u00D9l\u0086\u00E5|>O\u008A\u00E6r\u00F9vL9\u00C5V\u00F3\u009B\u00CD\u00A6i\u009Fb\nD\u00AB\u00D5\u00FAc\u00F3\u008B\u00997\x06\x17(]\u00DBp\u00A2LP{\u008E)-\u00BF\u00D7-\u00F5:\u00D0O\x01\x06\x00\u00A0Q\u00CC\u00E67\u00B4Io\x00\x00\x00\x00IEND\u00AEB`\u0082",
		selectionMarginBottom: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1C\x00\x00\x00\x1C\b\x02\x00\x00\x00\u00FDoH\u00C3\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00hIDATx\u00DAb\\\u00B4h\x11\x03\u00B5\x01\x13\x03\r\u00C0\b7\u0094\x05S\u00C8\u00CD\u00CD\u008D$#v\u00ED\u00DAE\u00D8P\u00AC\u00EAp\x01\u00AC.\x18\u008D\u00FDQCG\r\x1D\u008A\x05\n2P\x06\x034\u00C1\u00BB`@\u00BEK1\u00F5\x134\u0091(\u00EF#\u009BB\u008C\u0089\u0084\u00BD\x0F7\x0B\u008DA\u008E\u00A1\u00B8\u00CAi\u00CC\u00F0%\u00D6P\u00E2K\u00E8\u00D1\u00C4O?C\x01\x02\f\x00]a+y:\u00CE)O\x00\x00\x00\x00IEND\u00AEB`\u0082",
		selectionIncrement: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1C\x00\x00\x00\x1C\b\x02\x00\x00\x00\u00FDoH\u00C3\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00C0IDATx\u00DA\u00D4\u0095\u00BF\u00CBAa\x14\u00C7y\u00F3\u00AB\x10\u00C9\u00AF\u0090X\f2H\x12\u008B\u00B20H\x06\u008B\u00BF\u00C0\u00EA\u00DF\u00F07\u00B0Y\r\x06\u008B\u00A4\u00AC\x06E\u00C9b\u00A0\u0094\u0085\x12\u008B\u0092\u00C5\u00A7\u009Ez\u00CB\u00FB^r\u00B9\u0094g8}\u00EFs\u00CF=\u00CF9\u00DF\u00E7{\u00CEU7\u009BM\u0095\u00D2\u00EBG\u00F5\u0086\u00F5=A5\u00B2\u00BC\u00EB\u00F5\u00FAW\u0095_\u00AB\u00D5\"\u0091\u00C8\x1B35\u0099L\u00B9\\.\u009DN\u008B\u00C7b\u00B1\u00E8v\u00BB5/\x06\u00ADV\u00AB\u009B\u00CD\u00C6b\u00B1\x04\x02\x01$\u009FJ\u00A5\u00FC~\u00FFK\u0099B\u0082\u00D9ln4\x1A\u00DDn7\x1C\x0E\u008B\u00CD\u00C1`\u00F0d\u00A6^\u00AF\x17{<\x1EO\u00A7\x13\u00E5\u00BB\\\u00AE\u00F5z\u00FD\x12\u00A7|\x1F\n\u00852\u0099\u008C\u00CF\u00E7k\u00B5Z\u00D4\u00CB&@\u00BC\u00E2$\u00B5\u00AC\u00DE\x7FP\u00A7W\u00E5g\u00B3\u00D9[~\u00BD^\u00EF\u00F1\u00B3\u00A53\u00D5\u00EB\u00F5\u00D1ht2\u0099@\u00992\u00E2\u00D7j\u00B5\u00C9d\u00D2\u00E9tb\u00C1\u00CA\x04\r\x06\u0083$\u00B8\u00DDn\u00B1`e\x06\u00CA|>\u00FFt\u00EF\u00EF\u00F7{\u00D4s>\u009F\u0095\fj\u00B5Z\u00F3\u00F9\u00FC}\u00AE%\u00CAG\u00D86\u009BM\u00E0\u00DDn\u00F7\u0087\r\u00B8n\u00B7\u00DB\u0095J\x05\u0091!\u0092\u00D5jE;\u00D1\b\u00D3\u00E9t4\x1A1\x01\u00C0\x12\u0099.\u0097K\u00BC\x1D\x0E\x07\x16|'#\x1A\u00BF\\.\x1F\x0E\x07\u00DCf\u00B3Y<\x1EO$\x12\x14!\x11\x14\u00BE\u0086\u00C3!\u00B3\x07{\u009F;\u009DNG\b\u00CE\x06\u0097J%l\u00A7\u00D3\u00A1M\u00AF\u00CA/\x14\n\u00B7\x1A\f\u00EF\u00FFA\u00C7\u00E3\u00F1b\u00B1 S\u0086@\u00BF\u00DF7\x18\fB\u00E6j\u00B9\u00FF}rG\x00\u0090\x03\u00A7\x1E\u008F\x07B\u00B9:qo\u00D0-\u00B0\u00EC\u00D1\u00C77D\x04\u00D8\u00EDv\u00A3\u00D1(\u00B0X\u00BF\u00F8\u00F9\u00C9\x1F\u008B\u00C5>\u00FA7\u00BD\b0\x00\x06\u00D4\u00AE}\u00FDl\u00C3\x15\x00\x00\x00\x00IEND\u00AEB`\u0082",
		divideIncrementBy2: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x11\x00\x00\x00\x1C\b\x02\x00\x00\x00\b\u0091\u00C3s\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01kIDATx\u00DA\u00CCT\u00CD\u008A\u0082P\x14n\u0086\tA7\x12$\u0091\u009B\x04\u00B1U\u0098\u00D0Bz\x00\t\u00C2\u00D7\u00E8\u00A1Z\u00FA\n\u00E2\u00C6\x17\u00D0\u0085PQ.\u008A\u00C0}\u0082?\x1B\u00A3\u00DA\u00CCG\u008283W\u00D3Y\fs\x16\u0087s\u00EE\u00F5\u00BB\u00DF9\u00C7\u00EF\u00DE7\u00C30:-\u00ED\u00BD\u00D3\u00DE~\u0083\u00F9('\u009A\u00A6U}g\u00DB6\x19SlP\x145\u009DN\u00B7\u00DB\u00ED\u00EDvkT[\u00B7\u00DBUU\u0095\u00E38x\u00C4\u008D0\u0082 \u00E0\u00F80\f\u00E1\x11\u00BF\u00E8'\u00B7\u00D3\u00E9\u00F4\u00E7\u00B3~<\x1Eu\u0098 \b0\u00B7\u00F5z]\u00AC\x1C\x0E\x07\u00CF\u00F3Z\u00F0\u0080a\u00B3\u00D9\u00C8\u00B2\\\u0087\u00C1\u0088\u0086\u00C3a\u0091\x1E\u008FGQ\x14i\u009An\u00CAS&\u00C1\u00D0\u00B3,{1k\x18\u00DA\x00\u00C9\u00FD~\u00B7,+\u008Ec\u00AC,\u0097K\u009E\u00E7\t<\f\u00C3\u008CF#\u009C\u00BA\u00DF\u00EFA\u00C2\u00B2\u00ECl6[\u00ADV\u0083\u00C1\u00C0\u00F7}2\u008F\u00F04\u00C7q\u00E6\u00F3y\u00DE\t\u00D2$I\u00D24\u009DL&\u0095\u00FD\u0080\u00E4|>\u008F\u00C7\u00E3<\x05\u00C04M\u00D4Y\x16\u00D1w\u00CCn\u00B7S\x14%\u0097f\x0E\u00B8^\u00AF(\u00B5\u00F2.\u00C0p$\u00DA(\u00DA[,\x16\u0085\u00D8+1\u00FD~\u00BF|)\u00CAi\u00DD\u00AC%I\u00EA\u00F5zy\x1CE\u00D1O\u0099\x13\u00FE)\u0084\u0087{\n\x06x\u00C4\u008Dt\x00\x11\u00B8\u00AE{\u00B9\\\u00E0\u0089\u00BA\u00FER\u009B\u00AE\u00EBUO\n\x06H\u00C6\u00947\u00FE\u00C1\u009B\u00F8)\u00C0\x00m\u00FB\u009C^\u009D\u00C6Y[\x00\x00\x00\x00IEND\u00AEB`\u0082",
		divideIncrementBy3: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x11\x00\x00\x00\x1C\b\x02\x00\x00\x00\b\u0091\u00C3s\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01uIDATx\u00DA\u00CCT=\u00AB\u0082`\x14\u00AE\u00CB\x15\u00B1\u0086$\u00B0A\x1A\x12$'1A\u00A1_\x10-\u00FA\x1F\u00FA[\u008D\u00ED.\u00B95\x04A\u00A8\u00E0`A\u008B!\u00B4'HSb-\u00F7\u00E1\n\u00DE\u00F0\u00BE\u00DE\u00ECN\u009D\u00E1p\u00DE\u008F\u00F3>\u00E7y<\u00C7\u00E6b\u00B1h\u00BCh\x1F\u008D\u00D7\u00ED?9\u009F\u008F\u008B\u00C9dRuo\u00B5Z\u0091s\u008A\x03\u009A\u00A6G\u00A3\u00D1n\u00B7\u00CB\u00B2\u00ACVm\x14E\u008D\u00C7\u00E3^\u00AF\x07\u008F\u00B8V\u008E \bx>\u008Ecx\u00C4O\u00F8\u00E4v<\x1E\u00DFC\u00EB\u009F\u009C\u00D3\u00E9\x04\u00DD\u00E6\u00F3y\u00B1s8\x1C6\u009B\u00CD\x0B8\u00F7\u00FB=\b\x02]\u00D7\u00FF\u00CA\u0081D<\u00CF\x17\u00CB0\fEQl\u00B5Zuq\u00AE\u00D7\u00AB\u00E38\u008A\u00A2 \u0086\u00E8\u00C0|\u00A25l\u00BF\u00DFk\u009Av\u00BB\u00DD,\u00CBJ\u00D3\u0094a\x18\u00C30X\u0096%\u00E0\u00B4\u00DB\u00ED\u00C1`\x00\u0090(\u008AdY\u00C6\u00A5\u00E9t:\u009B\u00CD\u0090v>\u009F\u00C98\u00C2\u00B7\u00B9\u00AE\u00AB\u00AAj\u00DE5\x1C\u00C7-\u0097K\u00E0\u00F4\u00FB\u00FDJ>9\u0088$I\u00B9t c\u009Af\u00A7\u00D3\u00F1}\u00BF\u0092\u00CFv\u00BB-@P\u00CFz\u00BDFa\u0088Qjq\u00A7Y\u009Am<\f\x1AE;\x03\u00EAr\u00B9\u0080\u00E7\u00A3\u00E8e\x1C\x10(\u00CDEi\u0087\u00AC\u00F5p8\u00ECv\u00BBy\u009C$\u00C9\u00EF6'|S4\x1E\u00E6\x14\u00CF\u00C3#\u00AE\u00D5\x07\u00E0\u00E0y\x1E\x04\u0080/u\x00\u00A16|\u00EC\u00AA_\u008Am\u00DB\u00E4\u009C\u00C7\u00837\u0098\u00D3/\x01\x06\x00\u00B3]\u00A1(\"\u00D6\u00BA\u00AD\x00\x00\x00\x00IEND\u00AEB`\u0082",
		textFrame: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1F\x00\x00\x00\x1F\b\x02\x00\x00\x00\u0090\u00CC\u0081n\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01GIDATx\u00DA\u00ECV=\u008B\u0083@\x10\u008Dz\u00C6N\u00D0B\x1B\u008B\u0080V\u00A2\u00A0\u008D\u0082\x7F\u00C6\u00CE\x1Fe\u00A7?&\x10\bX(V\n\x16V\"\x16v\"\u00E8\r\u00B7\u00DC!\u00A2\u009B\\nS\u00E4\u00EE^\u00B1\u00CC0\u00CB\u00F3\u00ED\u00BC\u00FD\u0090\u008A\u00E3\u00F8\u00F04\u00D0\u0087g\u00E2\u0095\u00D9\u00DF\u00EE\u009Cg\u009A\u00E6\u00E9tBqUUi\u009A\u0092\u00D4\u009EeY\u00DB\u00B6\x10\u00C0\b1\u00E1\u00CE\u00CC\u00F3|\u00BD^\u009B\u00A6\u0081\x11b\u00C2\u009D\x01\u008C\u00E3x\u00B9\\^\u00C4\u00D50\fQ\x10\x04\u00C1\u00CD\u00F4\x11\u00EDQ\x14!\"\u00C4\u00B5\u0099>\u00DE\x19\u00DF\u00F7\u0091:$p3\u00C5\u0080\u00C2\u00DF3\u00A0\x11\u00B3p|u\u00AD]\u00D34\u0096e\x7Fb\u00A3\u00AE\u00EB\u00BB\u00EC\u00A2(z\u009E\u00C7q\u00DC\u00D2\u00D5/\u00F7\u00C2OlVi\u009A\u00B6m[UU\\\u00DFy\u009E\u0087I+W\u0097{c\u00D9\u008Ae\x15\u00D6\u00AD(\u00CA\rW\u00FB\u00BEO\u0092d\u00E5*\u00DEs\u0084\u00A2(\u00EA\u00BA\u00C6\u00B1w]w>\u009F\u0087a\u00D8\x13\u00BB\u00C4\u00AA:M\x13\u00C8*\u00CBr\u00F74\u00C1\u00F7\u00F1\u00A6\u00E1w\b \u00CF\u00F3{\u00F7\u00FB\u00B7\\\u00FDkg\u00F5\u00B7\u00BC\u00DApI\u00B8\u00AE{<\x1E\u00C9\u00B3S\x14\x05gX\u0092$\u00C7q\x18\u0086!\u00CCn\x18\u0086,\u00CB\x10\b\u0082`Y\x16\u00E1w5\u00FD\u00C0\u00FF\u009F\x1E)\u00BC\x0B0\x00\u00EA=\u00B6\u00BC>\u00EF4\u00D9\x00\x00\x00\x00IEND\u00AEB`\u0082",
		flipMargins: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1F\x00\x00\x00\x1F\b\x02\x00\x00\x00\u0090\u00CC\u0081n\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\u00DDIDATx\u00DA\u00ECV\u00C1\t\u00C4 \x10L\x0E%\u00BF<,A\u00D2\u0080_{H?\u0096\u0090:l\u00C1\x1E\u00FC\u00DA\u0080\u00A4\u0084<\u00F2\x13?\u00B7p \u00C1#K\x0E\u0094\x04\u00CE}MFg2\u0084]c\u00AF\u00B5\u00EE\u00AA\u00D5\u00AB\u00ABY\u00CD\u00BD\u008C\u00FB<\u00CF\x15\u00DD\u008D1\x7F\u0093\u009D$\u00C49\u00FF^^\u00D75\u00CB\u009E\u00BD\x00W\u0091#\u00AB\u0094:>.\u00CBr%;\u00A2\"\u00D9\u00D6\u00B4\u0096i\u00CE\u00B2\u00E3\u00AA\x07\u00F4\f\u00A5t\u009A\u00A6\u00D43\u0080\u0081)\u00E3>\f\u0083\u0094\u00921\u0096\u00B2\x03\x06\x06\u00F8\x02\u00EEB\u0088q\x1C\u00B3~\x07\x06\u00F8\x02\u00EE\u00CE\u00B9}\u00DF\u00B3\u00EF\x0E\f\u00F0\x05\u00DCC\b\u00D6\u00DAm\u00DBRv\u00C0\u00C0\x00\u00FF\u00C34!\x15c\u00F4\u00DE\u00A7\u00EC\x1F|\u00FF9C\u00F0\u00C1\u00BB\u00D8\u00EFg*\u0082\u008F\u00FE\u0095YET\u00FD\u0083\u00EE\x04\u00ED\u00DFtO\u00F6v[*Uo\x01\x06\x00\u00D1DhV8\x1B\x01\u009A\x00\x00\x00\x00IEND\u00AEB`\u0082",
		masterPage: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x0F\x00\x00\x00\x13\b\x02\x00\x00\x00\u00C0\u00A0\u00C0\u00FD\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\u00C3IDATx\u00DAb\\\u00B4h\x11\x03\u00D1\u0080\u0089\u0081\x14\u00C0\x02\u00A1f\u00CD\u009A\u0085_]ZZ\x1AB5\u009C\u008F\x15\u00C0\u00CD\"\u00CD%XT\u00FF\u00FE\u00FD\u00FB\u00F5\u00EB\u00D7\u00DF\u00BE}#J\u00F5\u00FD\u00FB\u00F7\u00D7\u00AF_\x7F\u00FA\u00F4i\u00A2T?x\u00F0@]]\u00FD\u00E6\u00CD\u009B\u0084U\x03\u009D\x01T\u00AD\u00A5\u00A5\x05d?}\u00FA\u0094\u0080\u00EA'O\u009E@\x18\u0082\u0082\u0082\u008F\x1E=\u00C2\x1E\u00DEp\u00F0\u00E2\u00C5\x0B \tt7\u00BE\u00D8\u0081\u0083;w\u00EEXYY\u00E9\u00E8\u00E8\x00\u009D\u00B1u\u00EB\u00D6\x0F\x1F>\b\b\b`w\t0\u00D4\f\r\r\u0095\u0094\u0094\u0080l111\u00A06\u00A07p\u009A\u00CD\u00C5\u00C5\x054\x15\u00C2fee\u0085\u00B3\u00C9LUd\u00A5Ab\u0092!B5\u009E\x04H\u00BEK\x00\x02\f\x00\u009F\u00ACG\u00E6o\u00AC\u0084\x06\x00\x00\x00\x00IEND\u00AEB`\u0082",
		chainMargins: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\u00A0\x00\x00\x00\x14\b\x06\x00\x00\x00\n\u00946N\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03\u00B6IDATx\u00DA\u00EC\u009AKhSA\x14\u0086\u0093k\x04\u008D h\x04\u00C1\u00F8$\x167\x15\x1FT\u00D1VE\x1B\u00A3\u00A2\u0082\u00DA\u008DO\x1AT\u00BASAD\x05\u0097n,\"\u00D8\u0082\u00A0\u00B6\u00A0\u00D4\u00E2\x03Qk\u00A9\u00A2E\u00DB\u0085\u00A8\x0B\u0085\u00D8E\x10\x05\u00B5\u008BT\u00C5\u0085t!\u00A4Z[\u00EB?x\u00AE\u009CN3\u00F7\u00DE\u00B4]\u009C\u0086{\u00E0kH\u00E6\u00E6\u00CF\u00DF\u00C3\u00E4\u00CC\u0099\u00B9\t\x16\x15\x15\x05\x10\x13AO`h\u009C\x01\u00AB\u00C0j\u00F6\u00DA\x04p\x16\u00EC\x03\u00BF\u00C0\x1Dp\u00C2\u00F0~/\u00E1\u00AA\u00F7\u00A4\u00BDM\u009C\u00BF\u00AA\u00B6\b\u00D7\x13\u009D\u00BF\x17/?\u008A\u00F5gQ\u00F2\u00D2\u00E0\u0080\x071u\u00ED}p\u0098\x04\u00FE\u0080C\u00A0\x19\u0084\u0087a\u00CEU\u008F&\u009F8\x7F\u00F5\u00F1\u00EFav\u008D\u00D8\u00FC\u00D1\u00E4\x13\u00EB\u00CF\u00A2\u0081jP\u00E7bR\u00895\u0081\u008D\u00E01\u0088\x11\x0FA\u0082>(\u009C\u00A79W\u00BDDy\\\u00AC?\u009A\u0084\u00A2\u00F3WV\x1A\x13\u00EDo\\$\x12Q\x17\u00A7\u00C0Wp\x19t\u00817$2\x17\u00F4\u0081g\u009A\u00D8v*\u00A7}TR\u0097\u0082M`\x12h\x1D\u00869G\u00BD\u00C6\u0086k\u00A9\u00CAdR\u00A4\u00BF\u0096\u00CEp\u00AB\u00F4\u00FC\u00CD\u009E55\u0095\u00C9t\u008B\u00F4\x17\u00A4\x1E\u00D0\u008E*p\x11\u0094\u0080\x0E\u00F6\u00FAM\u00B0K\x13\u00D3\u00D7\u00F9O`\x00D=\x18\u00CC[\x0FK\u00B1H\x7F\u00E8\x05\u00A3c!\x7FX\u008AE\u00FA\u00B3\u00B4\u0081z\u00B0\\3\x17%\u00B1\u0094A\u00CC^\u00CA-Z\u00E3\u00DDb$z\u00BE\u00BF\x02\u00F3g\u00E5\x18Li\u00CF\u00A7\u00D1\u00E3+\u0083\u0098]n\u00A7\u0083\x06\x0F\x06\u00B9\u009EE\riG\x1Ez\u00BE\u00BF\x02\u00F2\x17\u00C2\u009F\u0093lP\u00F5\x07\u00D75\u00C1\u00B7\u00D4#T;\u0098\u00DB\x00\x1E\u0081\u00D3\x1E\f\u00DAz\u00B5\u00ACOh2\u00E9a\u00E9\x15\u00EDOz\u00FE\u00B0\u00F4\u008A\u00F6\u00A7&\u00E0z\u00F6\u00E64\x19\u009C\t\"$\u00F6\x1B\u00AC\u00CBQ~y\u00A3\u00A9\u00C4v\u0080^\u0083)]o3\u00B8\u00CB\u009A\u00D4\u00DD\x0Ezb\u00FD\u00A1\u00FF\u00EB\u00F5\u00F372\x7F\u00FA&D]t\u0085\u00D6p\x15\u00CF\u00C1\x1Aj>\u00ED\u0098\x07\u008E\u0083\u0095`1\x133\u0095o]O\x19\u00B8\u00C7\u00CC\x1D\x05G\u00DC\u00F4h\x13\"\u00C6\x1F&\u009FW=\x11\u00F9\u00A3M\u00888\x7F!\u00C3\u008CW}\u00C2k:)\x1F\u00D0\u009A\u00C7\x1B`\x05\u00BD\u00AE\u00BEM\x07]z\x07\u00AEW\u00A3\u0099\u00AB\x00\u00ED#\u00D0\u00F3\u00FD\u008Dq\x7FAv+\u008E\u009F\u00DB\u00A8\x19\u00FAS\u00FB\u00C0 \u0089\u008C\x07\x0B@7\u00F8\f\u00CE\u0083bv]\u00C2\u00A0\x174|\u0086\u00AE7$\u00E8n\u0088(\x7F\u00A8\u0080N\u00E7^\u00A2\u00F2GwCD\u00FA\x0B\u00D1\u0099L\u00AEC\u00C3\u0080V\u0096\x1B\u00C1ZZ\u00E3\u00D3l\u00EC\u00BDv\u00BDI\u00AFY+\u00CBO\rz\u00FA\u00E4\x13\u00EDOz\u00FE0\u00F9D\u00FB\x0B\u00D1\u00EE\u00C7\u00C9\u009C\u008AS\u00A0\f\u00CC\x07\u00EF\u00B4\u00B1K\u00DA\u00F3\x1A\u0083^\u008Cn\u00BF\u00A8~\u00E1\u0082\u0083\u009E\x1E\u00BE\u00BF\x02\u00F6\u00A7&`%\u0095\u00C6\n\u0087\u00B5~\x19\u0095\u00E7\x1F\u00DA\u00D8\x12v[\u00C7\x0E\u0093^\u00B1\x07\u00BD\\\u00E1\u00FB+`\x7F\u00FC\u0084\u00BB\u00DF\u00A1\u00D1\\D\r$_\u00C3K\u00E8\u00B0q\x7F\x0E\u00CD\u00E1\u00E89y\u00F4\u00FD\x15\u00A8?\u00F5c\u00849x\u008C\u0083\u0085\u00F4\u00E6~\u00C39\u00D0^p\x0EL\u00A15\u00FD\x0B\u00F8F%\u00BA\u008B\u009Dv{\u00D1S\u00E5{\u008F\u00E1\u009F\x18\u00FCuK&E\u00FAk\u00E9\u00FC\u00FF\u00C3\x10\u00D1\u00F9\u00CBd\u00BAE\u00FBSK\u00F01\u00DA\u00A5\u00A8\u00F5\u00FC6\u00D8\u00A9&&\u00DBN\u00F3s\u009B\x122eG\x1D\u00BB\u00C7\u00A8\u00E2\u00AA\x07=\u00A7^$W\u00F8\u00FE\n\u00D8\u009F\u009A\u0080Y\u00B0\x15<\x00\u00DB\u00C0\x07*\u00B33\\\x0E!u\u0093\u00AA\u0091\u00BD5\nz\u0083\"Q\x1E\u00CFb',\u00D6\u009F\u00F4\u00FC\u0095\u0095\u00C6\u00B2\u00D8\t\u008B\u00F5g\u00B1$n\t\u00FC\u00FB\u00A9\u00CEd*\u00A7\u00B5y\u0088\u00D5\u00D1)w\u00CF(\u00E9\r\u0099\u0084\u0092\u00FDI\u00CF\u009F\u009A\u0084R\u00FD\u00FD\x15`\x00\u009D\u009C\x13#Hv\u00FD\u00E6\x00\x00\x00\x00IEND\u00AEB`\u0082",
		swapLeftRightMargins: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x000\x00\x00\x00\x14\b\x06\x00\x00\x00\u00CB?\u00BE\u00A7\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u008DIDATx\u00DA\u00CC\u0097?K\x03A\x10\u00C5\u00F7\u008EC\x11\u00B5\u00B2\u00B5\u00B1\u00B8F\x10\u00B4\u00F3\x03\u00E8GH\x1D\x10\x14Kc\x1B\x02\u008Ab'Z\n\u00A2\u0085\u00ADvv\u009A\u00D8)i\u00B5\u00B0\u00934\u0096V\x12\x14\x04\u00FF\u00BC\u0085\x19\x18\u0096\u00D5\u009B-Lf\u00E0\u0091d\u00F6\u00B7s\u00CC\u00ED\u00EE\u00BDKV\u0096\u00A5\u00FB#Z\u00D0\x1E\u00F4)\u0093\u00D77\x1D\x15\u00BF\u00DA\u0099r\x15\x11\u00AD\x7F{\u00F7\u00A4\u00E6\u00F3\u008A\x0B\u00D4\u00A0\x13(s\u00BA\x188\u009F+&\u00D5\u00A1\u00A3\u0084\u008B\f\u0094/(\u00B9\bMD`\u00CE\u00ADAoP\u00C3\x1A\u009F\u00D1\x19x\u0080\u00E6\x14\u00DD\u00EF\u00FA}\u00883\u00A0\u00E6q\x0EZ\u00A9\u00F5q\x06\u00D4|\u00EE\u00D2\u00C2\x1C\x1FN\u00B8\u0084\u0096\u0085zb\u00EC\x10j\u00A6\u00F0\u00B8\u00FB\u00CD\u00FF\u00AC\u00EF\u00F9\"\u0098\u00F0\f\u00B5\u00C5\u00EF>}\x1EC\u009B\u0091;0t>\\\u0081\u008FH\u00913h\x1D\x1A\u008B\u008C\r\u009D\u0097\r\u00DCC\u00DB\x01|\x0E\u00AD@\u00DE\u0091N\u00831\x13<7\u00F0H{\u00EC\u0095\u00DC\u008Ec\x07\u009A\u0084\u00AE\u00A0Y\u00917\u00C3s\x03\u00BE\u00AB\x17r\u00B9Z\u00D0\u00F5\x164\x1F\u00E4\u00CC\u00F0\u00DC\u00C0;\u00B9[=\u00B2\u00E7F\"93<?\u0085\u00F6\u00C9\u00DD\u00D8\u00ED\u0096\x043\x1D)b\u0086/h_5Dn\u00C6\u00BFp\u00FE\u00E6\x1Cp\u00E1$>\u00B5>\\8\u0089\u00CF\x13^\u00A28L\u00F1\u00FC.t\x00mP\u00AE'\u0096\u00CF\x05&\u00D2\u00A5UP\u00F1p\u00E2.}O\u00AA\u008FUP\u00F3|\x06\u00BC\u00AB\u008D\u00FB\u00FF 4\u00D0\u00AEh\u00DC\f\u00CF\r|\u0093\u00BB\u008DB\x0B\u008A\u00953\u00C3K'\u00FE\u00A2\u00E7\u00EF\u0085r\u00FB\u0099\u00E0\x7F\x04\x18\x00\u00CA\u00D0\u00C2Z\u00B3\u00E4au\x00\x00\x00\x00IEND\u00AEB`\u0082",
		rulerUnitsBg: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1F\x00\x00\x00\x14\b\x02\x00\x00\x00\u00FA\x0Bq\u00AD\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00&IDATx\u00DAb\\\u00B4h\x11\x03\u00CD\x00\x13\x03-\u00C1\u00A8\u00E9\u00A3\u00A6\u008F\u009A>j\u00FA\u00A8\u00E9\u00A3\u00A6\x0F6\u00D3\x01\x02\f\x00\u0088N\x02\x0E,\n\x13\u0084\x00\x00\x00\x00IEND\u00AEB`\u0082",
		info: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x16\x00\x00\x00\x16\b\x06\x00\x00\x00\u00C4\u00B4l;\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\rIDATx\u00DA\u0094\u0095=K\u0082Q\x14\u0080\u008F\u00FA\"\x05B\u00A6\u00A0\x16*!\x0E\x0ER!\u00D8\u00D4\u00A2\u0083\x194X\u009B\u00FD\u008AZ*h.\u0088\u0086\u00DA\x1A\x05\u0087\u00DCZ+\u00B7h\u00D1Z\u00B4D\f\u00C5\x02\u0095hQS\u00C1/\u0094\u00CE\u00B1\u00AB\u00A8\u00BC_\x1Ex\u00F0\u00E3\u009E\u00F3x\u00DF\u00EB\u00BD\u00E7*\u00C2\u00E10\b\u00C4\"\x12D\u00B6\u0091U\u00C4\u0084t\u0090\"\u0092C\u00EE\u0091\bR\u00E1+\u00E6x\u00BE\u009BC\x0E\u0091#D;5\u00A6F\x1C\u008C\x1D\u00E4\f\u00B9D\u00AE\u0090\u00E6x\u00A2r\u00AAp\x05yE\u00CEy\u00A4|\u00A1e\u00F2\x17V\u00CB+6#\u00CF\u0088\x13f\x0F'\u00AB5O\u008B\u00E9\u00F1\u00EF\u00C6\x07\u00F8\"\u009F\u00CFC(\x14\u0082X,\u00C67lf\u008E\u00F9q\u00F1\x01\u00E2\u0096\u009AV&\u0093\u0081n\u00B7\x0B\u00E9tZ(\u00C5\u00CD\\\x03\u00B1\x0E9\u0091\u00F3\u00BC6\u009Bm\u00E2U \u008E\u00C9\u00C9\u00B1-\u00B5 G\u00ECp8\u00C0n\u00B7\x03\u00C7qbi\u00E4\n\u00D2\u008C\u00B7f\u00F9\u0097$\u00A4\u00C3\u00F0S\u00D6\u00BATV\u00ADV\u0083D\"\x01\u00EDv\x1B\\.\x17\u00E8\u00F5z\u00A9\u00925\x12\x1B\u00C52*\u0095\nD\u00A3Q\u00A8\u00D7\u00EB\u00D0\u00EF\u00F7\u00A1\u00D7\u00EB\u0081\u00DF\u00EF\u0097\x12\x1Bi)\u00DAb\x19\u00F1x\x1C<\x1E\x0F(\x14\u008A\u00FF\u00A3\u00A7V\u00CBZ2\x12\x7F\u008B%x\u00BD\u00DE\u00C1\x16\u00A3\u0099R\u0098L&9\u00DE\x1F\x12\x7F\u0088e\u00D0\f\u008B\u00C5\u00E2\u00E8\u00B3\u00D5j\u0095#N\u0092\u00F8Q*\u00ABP(\f^u:\x1Dh4\x1A9\u00E2\x07%k}\u00BFB\x19\u00ADV\x0B\u00CA\u00E5\u00F2\u00E0\u00BD\u00C5b\u0081l6\x0B\u00A5RILJ\u00AE\b\u0089\u00A9\u00EAB(\u00AB\u00D1hLl\u00BBd2\tF\u00A3\u00E8F\"Wy\u00D8+\u00AE\u0091w\u00DE\u00BE\u00A8\u00D5\u0082\u00C1`\x00\u0095J\x05\u009DN\x07|>\u009F\u00D8!I1\u00D7\u00A8\u00D1S\u0093\u00DEC\u009E\u0090\u00E5\u00E9\u0093\x16\b\x04\u00E4\u00AC+\u00AD\u00CF\u00EE\u00B0\u00E1\u008F\u00F7c\u00BAn6\u00D9\u00AF\u00CE\x1A)V\u009B\x13\u00BAA>\u0091\r\u00E4\x14\u00A9\u00CA\x10VY.\u00D5|I\u00DDyMv5\u00DD \u00FB\u00D4P\u00D8e\u00BA\u00C4\u00C6\u00E9@\u00BD\u00D1\u0096Bn\u0085.\u00D3?\x01\x06\x00\u00F3\u00E5\u008B\u00B8\u00CB\x10\u008A[\x00\x00\x00\x00IEND\u00AEB`\u0082",
		warning: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x12\x00\x00\x00\x0F\b\x06\x00\x00\x00\u00E9\u0086\u009F\x12\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\u00D3IDATx\u00DAb|\u00B3_\u009A\x01\x0F0\x05\u00E2\u00A5@\u00FC\x1F\u0088\u00A3\u0081\u00F8\f.\u0085Lx\fa\x05\u00E2E@\u00AC\n\u00C4j@\u00BC\x18*F\u00B2Ay@\u00AC\u0081\u00C4\u00D7\u0080\u008Aa\x05\u008C8\u00BC&\x01\u00C47\u0081\u0098\x0FM\u00FC\x13\x10\u00AB\x03\u00F1\x0Bb]\u00D4\u0082\u00C5\x10\x06\u00A8X\x1B\u00B1^3\x01\u00E2D\x18'\u00A0V\x11\u008C\u0091@<T\r^\u0083\x18\u0081x2\u0081\u00B0c\u0082\u00AAa\u00C4gP\x1C\x10[0\x10\x06\x16P\u00B5X\r\u00E2\x05\u00E2\x0E\x06\u00E2A\x07r8\"\x1BT\x05\u008D-b\x01Hm5z\u00F4\u0083\x12\u00DDe fg \r\u00FC\x04b] \u00BE\rsQ?.C\u00B0\u00C4\x1A2`\u0087\u00EA\x05{\u00CD\x1B\u008A\u00C9\x05`\u00FD \u00AF\u00DD\u0080\u00A6VJ\u00C0M\u0090\u008Bv\x03\u00F1o\n\f\x01\u00E9\u00DD\x05\x10`\x00\u0089v%B\u00E1\u00A2n/\x00\x00\x00\x00IEND\u00AEB`\u0082",
		lightBlue: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00PIDATx\u00DAl\u008FQ\x0E\u00C0 \bC)\u00E1\u00FE\x17\u00D8a\u00BBM\rV\u0090\x0F\x02\u00BCB\x03\u00EC\u00A1\u00D1.\u0081?\u00F9bh\u0098\x13\x17\u0086C\x1D)\\S\u008A\u009A\u00DF\u00B6\u00CAY]|;a[f\x1B\x15\u00E4\u00FD\u0091\u00BD>\u00C3\u00EBqyF\u008B\u00E8\x1B\u00EA\u00F5\n0\x00]\u008F\x14\u00B46([\x1B\x00\x00\x00\x00IEND\u00AEB`\u0082",
		red: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00:IDATx\u00DAb\u00FC\u00EF\u00C5\x00\x02\u008C\f(\u00E0?T\u0084\tD1\u00C2\u00840\x00\x13\u0082\u0089l\x00#\u00A64\x03~\u00DD\u00D8\u00A51\u00AD\u00FC\u008F,\u008D\u00C3\u00CD8\fg$\u00CDn\u00BC\x00 \u00C0\x00T'\x06a\u00E1K\u00C1\u00FA\x00\x00\x00\x00IEND\u00AEB`\u0082",
		green: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00dIDATx\u00DAT\u008F\u00D1\r\x00!\bC)q\u00BD\u00DB\x7F\u0092\u00FB\u00AE\x02\x02\u0082\u0089!\u00FAZ\n\u00E4\u00FFD(V\u00F0\u009B\u00DE0Z\u00ED?\u00DE\u00A7Dq\u00CEJ\u0096W\n\x14rJ\x1FE\x16\u008B\u00C7js\u00C8c 6\u008B\u00D4G\u0092\u00B9\"\x04L\u00A0\x1D\u00B9\x18\u00F4\n\u00EA\u00F8\u009CL\u0096\u008D/\u0086\u00A1\u00CD\u009B\u0099|\x18\x04\u00EDj`\x0B0\x00\u0094\u00C4*Q\x0BM=/\x00\x00\x00\x00IEND\u00AEB`\u0082",
		blue: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00SIDATx\u00DAdP\x01\x0E\x00!\b\x02\u00D7w\u00EE\u00FF\u00CF\u00E3\u00BC\u00BA\x19\x19k\u00CE\x02\u0091E<B![\u00C21P,\u00E71q^\u00C7\u00E6\u00EC\u00B5\x10h\u00E8\u00E6\u00EC\u0082?\u0081\x16}\u0083\u00BB\u00C6\u00A7\u0092\u00CD\u00E1\u00E8/s\x1D\t\u00A2\u008F\u00D2\u00CC\u0095\u00F4JQ\x1FR\u00BBf}\x05\x18\x00\u00F5H\x13J\u00D4\u00FB\u00C3\x03\x00\x00\x00\x00IEND\u00AEB`\u0082",
		yellow: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00YIDATx\u00DAl\u008FQ\x0E\u00800\fB\u00A1\u00F1d\u00DE\u00FFH&8\u009B\u00D6Q#_o\u0094\u00D1\u008D\u00BAN,\x11\x10\n\u0090\u009CN\x00v~\u00B9\u009D\x1E\u00BB\u00BB\u00C5c4\u00C3:\x16I\u00B1]\u00CE\u00DBz(\u00CA\u0092\x0F2\u009Ei\u00DBM[\u00AA\u00CA\x06>\u00E2\u00A0\u00F8\u009F\u00B1\n\u00EC\u00E5\u00FE\u00A5\u00E6[\u0080\x01\x00\u00B7\u00F6\x1BO\u00AFE\x0E?\x00\x00\x00\x00IEND\u00AEB`\u0082",
		magenta: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00EIDATx\u00DAt\u008F\u00C1\x0E\x00 \bB\u00C1?\u00EE\u00FF\x0F\u00B4f\u00B6\u0099\u00EAM\x1EC\u00A4\u00960\u008Fa\u00A2r\u00CC_\u00BA\u00C3\u00B3Zb\u00AC\u00E1\u0095)b\u00F80Cr\x1Fk5f\x1Fj5L\u00B7\u0091;7\u00D5\u00D0|\u00B8\x05\x18\x00\u00B4\u00B2\x10\u0081\u0087`!,\x00\x00\x00\x00IEND\u00AEB`\u0082",
		cyan: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00(IDATx\u00DAbd\u00F8\u00FE\u009F\x017`b\u00C0\x0B\u00E8(\u00FD\x1F\u00BF4#V\u00E9\u00FFX\u00F4A\x00\x0BVM\u00C4:\r \u00C0\x00\u00A2a\x05\x0B\x17\u0092\u00FC\x00\x00\x00\x00\x00IEND\u00AEB`\u0082",
		gray: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00$IDATx\u00DAbllld\u00C0\r\u0098\x18\u00F0\x02r\u00A5\u00FF\u00FF\u00FF\u008FO\u009A\u0091\u0091\u0091vvSC\x1A \u00C0\x00\x1B\u00CD\x04\u0097[\u0085Z\u00EB\x00\x00\x00\x00IEND\u00AEB`\u0082",
		black: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\x10IDATx\u00DAb`\x18\x05\u00A4\x03\u0080\x00\x03\x00\x016\x00\x01\u00BA\u009Af\u00FA\x00\x00\x00\x00IEND\u00AEB`\u0082",
		orange: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00=IDATx\u00DA\u0084\u008FA\x12\x00 \b\x02\u00A1_\u00F7z\u00BA\u00D4\fj\u00D9^WP\u00A9\u0089\u008D\x00\"1\x1Ag\u009Ag\u00C8\u0091\u00A7Q\n\u0098\u00D2\u00CF\u00F2\u008A\u00AAVh\u008E\u00BA{\f\u00DF\u00DD\u00B7\u00EB\u0096\x00\x03\x00\u00E4+\t\u008D\u0096\x0Fi\u00F3\x00\x00\x00\x00IEND\u00AEB`\u0082",
		darkGreen: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00EIDATx\u00DAtNA\x0E\x00 \b\x02\u00D7\u00FF\u00FA\u00FFklk6K\u008C\u0083SA\u0084\u0098HpW\u00CF\u0085\u00A1\u00C0\u008F(i~\x15\u00F6\u00B8Ic!\u00A4x\x04\u00AD\u00A7\u00D0h\x1D\u00D7%o\u00E8\u00F2\u00F5\x1AG\u00E3\u00EC)Z\x02\f\x00\u009BV\x0Bd\u00DA\x0BH\u00CC\x00\x00\x00\x00IEND\u00AEB`\u0082",
		teal: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00cIDATx\u00DAlO[\n\u00C00\bK\u00A4\u00F7\u00FF\u00DB\u00DF\u00EE\u009A\u00A9\u00B3\u00B5e\u0093B!\u00E6%q\u00DD\u00F0! \u0081\u0084\u00D0CX\u00FE;\u0086\u0089\x04h\u00BDsiS\x19O\u00A5f8k#\u00E56\u00D5%b[\u00F2\u009B]tm\u00B9Qv\u00FC\x14^\u0087\u0080\u00F6V8;\u00CF\x12e\u00DE\u00E9\u00EC\u00E4\u00A4\u008DC\u00B6J\u00A5\u00B3#\u008F\x00\x03\x00\u00BC\x0F!K\u00B0s\u00A6\u00CF\x00\x00\x00\x00IEND\u00AEB`\u0082",
		tan: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00mIDATx\u00DALO\t\x0E\u00C0 \b\u00A3\u0086\u0097\u00EE_{\u00DD\x1E\u00D2\u0081\x05\x14\x13#\u00B1'\u00BE\u00F71X\x0E\u00ED\f`d\u00DC^\u00AB\u0081\x10\x04\x05D\u00EEK\u00BC8(\"[&\x1E\\\u00A3,\u00CA\x162\u00B4\u00D7\x1A3\u00D8\u00F9\u009F\x18>p\u008E\u00C7\u0095Q\u00D12\u00E5\u008EU\u0081\x07\u00E3U\u00A9\u00F4(\x04\u00BB\u00CF\x12\u00FCn\u00A4J\u00F2\u00F4\u00CA\t\u00A43\u00BA\u00C3F\u0084\u00CA/\u00C0\x00O<0\x06\u009E{P;\x00\x00\x00\x00IEND\u00AEB`\u0082",
		brown: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00QIDATx\u00DAlO\x01\n\x001\b\u00D2\u00D8\u00BF\u00F6\u00ED\u00FB]w\u0083:%&!dS\x1C\u009F\u008D\u0083\x04h\u00DCX\u00B5\u00D0\u00F8\x07\x11\u0092Rj\r\u00BE\u00F3\u00D5\u009A\u00C5!S\u00F6@mV\u0099<\u00D9\u0092\u00A2\x1C\u009C\u00B1\u00DD|\u00B4\u00C5\u00D5=\x0E-v\u00F3\u00D4g\u00FC\u00D1+\u00C0\x00\u00BE\x0F\x18\x11J\u009D@\x00\x00\x00\x00\x00IEND\u00AEB`\u0082",
		violet: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\\IDATx\u00DAT\u008F\x01\x0E\u00C0 \b\x03)\u00E1}{\u00EB~X1L\u00D7\u0092\x18\u00E0\u0084V\u00F1>\u008C\u0089\u00C9\u00B0\u00BA\"\u00EC\u00B6\x13\x04\u00D5\u00C1BOCF*fX\x00\u0091\x14K\u00CC\u00C1\x19\u00E4\u00F5\u00BEC4\u00A9\u00FC\b\u00C4U\u00EA\u00ED\r\u00D8\x06\u00E5\t\u00D9h\u00F7\u00A2\t\u00F9d\u00FD\u00C2\u00B0\x7F\u00F5N\u00AB.\x01\x06\x00UY\x1F\x17\u00B4\u00CE\u00FE\u00D3\x00\x00\x00\x00IEND\u00AEB`\u0082",
		gold: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00PIDATx\u00DAl\u008EK\x0E\x00!\fB)\u00F1\u00FE\u0097\u0098\u0083b\u00D4\u00D1~\u0094\x05i\u0093\x07\u00AD\u00E9\u00C3\u0090\x00{8\u00B1d\u00DB3\u00C11a\x17\\\x1C\u00FF]\u00C1\u00F1L\u009F\u00A8|\u00A5\u00B7\x19\x12:\u00C5\u0082'\t\u00CD_-\u0084V\u00BAt\n\u00F1\\\u00BB\x13\u00F1\u00FF.\u00C0\x00\u00AE\\\x1C\u00B9\x11\u00D1\n8\x00\x00\x00\x00IEND\u00AEB`\u0082",
		darkBlue: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00gIDATx\u00DA\\\u008F\x01\x0E\u00C0 \b\x03)\u00F1\x05\u00FB\u00F5^]\u0085\u00E2\u00D0iB\u0080\x1E\x15a\u00CFk\u0080\u0091\x11\u00AF\u00C3u\u00BD\u00F2\u00D6\u0098!\u00B4\u00D5t\u0083\nnYN\u0085\u00BA\u00E8\u009E.\r\u008A~=\u00F9m\x10f\u0091\u008C\u00C2e^(r/\u00A6\u00AC\x16\x0E\x03q\u00E94.\u00E7\u0093K\u00C2\u00FB3\u00AB\u008E\u00D6Fr\u00DAk\u008B\u0088\u00FC\u00DB\u0090S\u0080\x01\x00\u0092\u00CB2\u00B0\u0099\u0096K\u00B4\x00\x00\x00\x00IEND\u00AEB`\u0082",
		pink: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00eIDATx\u00DATO\t\x0E\u00800\b\u00A3\u00C4\u00FF\u00FF\u00C2\u00DF\u00F8'\u00B4P\x18\u0092e\x19\u00BD`\u0088\u00FB1\u0098\u0085\u00B1\x00\u008B\u00E0\u00CD\"\u00E4j\u0084\x14\x17<ipB\u00C5\u008F\u00A2^L\u00A2\u00DB\x14U8\u00B6\u00E2\u00A35E*-\u00D1u)g\u00B8\x7F\u0098w\u0093K\u00E5\u00BCIn\u00B7\x02&\u00F7\fp\u00CAb\u00E5\u00F6\u00BF\u0086.|\u00B91f\u00BC\x02\f\x00\x7F\u008D$\u008E\x1A\u008C\u0089\u0080\x00\x00\x00\x00IEND\u00AEB`\u0082",
		lavender: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00ZIDATx\u00DAd\u008DK\x12\u00C0 \fB!\u00E3\u00FDW]\u00F7\u00AA\u00A8\u0093\u008F\u00B1\u00CD\u00C2\u00C0\u0084\u0087|^\u0081\u00D0~\u00AE\x11@b\u00EC\u00A5\u00F0}Vz1V\u00C1\u00A2]{\u00DA*(d\u00E2(\f6\u00AB\u00BB<\u00E8\u00CED\u00AD\u00EEr\u00FC\u00B8/\u00ED\u009C\u00D2\u00B86e\u00B3\x1A$\u00856\u00B6\u00C3\u00D1\u00F9\u00C1\x14`\x00(}!K\u00DC*\u0093v\x00\x00\x00\x00IEND\u00AEB`\u0082",
		brickRed: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00gIDATx\u00DALO\u00C9\x11\u0080@\bK\x18\u009B\u00B1\u00FF\u009F\u00CDE!\u00E0\u00C2c\u0097\u00C9\x05\u00F0\u00B9AB\u00C8\"\u00B2\u00C9\u00D7\x1Fp\u00C1\\\u00F1*\u00E8\u00E3XM\u00D1\x18\u00E3\u00F2\u00A9Q\x04m\x1D\u00805\u0080\u00D6\x0B!\x1D\u00D4\u00CA\\E\x1D\x13\u00E4I\u00D3\u00BF\u00DD\u00CC\x0E\u00EC\u00D2\u00EA\u00B9\u00C3\x07\u00D2b\u00D9\u00E1\u00EB\x18\u00EB<\u00FB\u0093\u0086\u008F\u00F6:\u00AD;ix\x05\x18\x005)-\u00F9\u00E8\u00FF\u00B7\u00D9\x00\x00\x00\x00IEND\u00AEB`\u0082",
		oliveGreen: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\\IDATx\u00DA\\P[\x0E\u00C0 \bk\tW]\u00B2\u00FB_\x00'\u00B3\n\u00F2\u00A1M\x1F\u0080\u00F2}\u00B0\u008B@\u00E4\u0089\x04_9\u00A5\u0085\u00A88~XH z\u00A5\u00CBj\u00BA\x05\u00A94%\u0090\u009B_\u00C0\u0096\u00C4\u00ABk\u0082\u0080\u00A3\u00AFZ\x1A\u00CF\u00CB\u00CFTN\u00FB\u00CFn\u00AB5?\u00F5\u00F6k\u00F3\u00AA\u00D6\u00DF\x19\x02\f\x00\u009AH\x1A\u00E7\u00AA\u0098\u00A2_\x00\x00\x00\x00IEND\u00AEB`\u0082",
		peach: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00aIDATx\u00DATOA\x0E\u00C00\bB\u00D3\u00FF\u009F\u00F7\u0080\u00FD\u00D3M\x11cM\x0FP\x05\u00D1\u00E2}\u0080\x00\fY\x02b\u008E)[\u00DF\x11\x04\u009E\u00C4L#QO\x10[ME\u008F\x1Ae\u009E|7\u0082f\u00ED\u00E1\u00D5\u00DB\u008D+\u00CB\u00D99\u00DBF\u00B9\u0098\\\u00E6?\x18u\u0082\u00A4\u00A7om\x1D\u0087\u00C6\u009B\u00EA\u00AB\u00EAh-\u00FA\x04\x18\x00aY,NT$\u00B5\u00A9\x00\x00\x00\x00IEND\u00AEB`\u0082",
		burgundy: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00gIDATx\u00DA\\P\u00DB\r\x00!\b\u00A3\u0084i\u00DC\u00FF\u00EB\u0096\u00EB\x01\"\x11}$\u00C5R(\u00E2[K B\x19\x0B\u00B1I\u00EAF\u0091\u00D1\x14\u00E0\u00D9\u00CE9V\u00BF\u0081X\u00A2\nO\r\x0BbK\u00D9e\u0092g\x1CE7F\u00E8\u00D8\u00DA\u00D4\x18\x1FSr\u00D9D\u00F6\u0096S\u00AA|\u00B5\u009A\u00DE\x1BC\u00C4\u00B40\u00AD]\u00E3>\x1F`\u00E3\u00A9\u00A78\u00E1/\u00C0\x00\u00B7c,!\u00C1\u00F1\u00A7\u009D\x00\x00\x00\x00IEND\u00AEB`\u0082",
		grassGreen: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00[IDATx\u00DAlO\x01\x12\u0080 \b\u00DB8\u00BF\u00DD\u00FF\u00FA\u00D5R\u0088\u0082\u008C;\x05a\u00C3\u008D\u00C7\t\b jH W\u00DF\u00D6l\x0B\x06\u009A\x18\u0091^\x10\u00DB\x0E\u0093'\u00F0;\u008B\x1D6\x0F+\x1BY\u00FB=\u00EEG\u00E51\u00A5aJ\u00DB\u00FE\u00AB\rk<'\u00A9\u00F8\u00EC\u00C6\u0098\u00AE\u00F4\u00CB~t%\u00E2\x12`\x00*\u0083\x1Bb\x0F\x1B\x02\u00A2\x00\x00\x00\x00IEND\u00AEB`\u0082",
		ochre: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00bIDATx\u00DA\\\u008F\x01\x0E\u00C0 \b\x03)\u00F1\u00B5\u00FB\u00DC\u009EX\x07\x15e\x12M\n\u00A1W\u00C5\u00FB\x18,\u008Ay\u0081\x14\u00A5G\b\r\x10gKi\x0F\x01k\u0084%\u00D5\u00BA\u0086(\u00876>\x1E\u00B3\u00F5\u00C8\u00B0\u00CA\x13\u00A9\u00D5q\u008B\u00C6\u00B4\u00EE%\u00BF\u00A7\u00C5Q\u00DC\u00D8@\u00B6\b^O\u0093\x15-\x1B\x0B\u008E\u00F3)\u00D2\u00EC\x0F\u0098\x02\f\x008\u0080'0@,\u00E6J\x00\x00\x00\x00IEND\u00AEB`\u0082",
		purple: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00pIDATx\u00DAdO\x01\x12\u0080 \b\u00DB\u00B8\u00BE\u00D1\u00F7zD\u009F_\u00C0\f\u00BBk*\u00A2\u00C0\x06\u00BC\u00CF\u008B\u00A4 $\u0084\u00F2\u0095W/ \u00D2N\u00ACL\u00C7\u008C\u00F4\x03Z\u0089e\u00BC\u00B1\x7F\u00C2\u00CC~\u00A7\u00E5\u008A\u00C9\u0094QlC\u00DD\u00DF\rn\u00ED\\V\u00D4$\u0095n\u00F9\x07^\b\u00AB\u00DF\u00D6\u00F2A8\u00F3\u00AD\u0095[\u0094>\u0083\u00CD\u0094\u008B\u00B6S\u00D4#U\u00B5\x15I\u00E2\u0087G\u0080\x01\x00\x18\u00A9:\x10P\u00E5\u0085\u00F9\x00\x00\x00\x00IEND\u00AEB`\u0082",
		lightGray: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00VIDATx\u00DA\\\u008EQ\x0E\x00 \bB\u00D3y\u00FF\x13y7\u00B3h\u00C4\u00E4\u00A3\u00B9`\x0F,3\u00D7UU\u0099Y\u00BF}\u00F3\b\x18K\u00D4\x1EoWCs\b\u0085\u00C6a\u0093\u00DFr\x1A\u00E8\x1E\u00F0\u00D0-\\\u00F7\u00A7!\u00CBV\u00F5\u00DE4b\x07\u00F9ts\u008E\x0E$\u00D25\u00AEp\u00FCo\x01\x06\x00H\u00FFJJe|G|\x00\x00\x00\x00IEND\u00AEB`\u0082",
		charcoal: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00gIDATx\u00DAdO[\x0E\u00800\b\u00A3\x0B\u00F7?\u0086\u00DF\u00FEy\u00BCJ\u0089\u00C0T\u0096\u0094\u00B0\u00B6<p\x1E\u0097mA\x12@\u0097\u008Blb\x14CGY\u00A6\u00AF5\x18W\u00CD1\u00ED\b\u00C3\u00B2\u00CC\u0082\u00F2!#\u00CD\\\u0082\u009A\u0085\u00A4\x1Ek*\\\u00D6^\x05\u00AF\u00EDB\u00ED)\x14\u00C4O\u00AF\u00D5\u0083\u00E20V7\u00FB\u0087C=\u00E6\x12=\u00C3\x03\u00E4-\u00C0\x00\u00F3\u00EE9$\u00E7\u00F8\u0087\u0093\x00\x00\x00\x00IEND\u00AEB`\u0082",
		gridBlue: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00xIDATx\u00DAL\u008F\u00DB\x15\u00C00\bB!'\x13u\u00FA\u00EE\u00D2a\u00A8\u0082}4\x1F!\u008Ax\u00CB\u00E3\u00BCH\x02P\x1D0\u00F7T\u00A4UJ-\u00C4\u00EE\u00A1\x1D\u00BE\u00ED\u00C6\u0096%l\u00C2h\u00BC\u00C5\u00E5\u0081*\u00B8\u00ABh7{\u008F\x162\u0084_p/&\u00FDX\u00F1\u00E5\x19'\x1F\u00C2*m\u00A3u\u00CE0\x0E\x13\x02\u00E8\u00DD\u00EA\u0084\u0082\x7F\u00D0\u00FA\u008Bi;\u00D8\x7F\u00C9\u008FA\u00D2Lk\u00A6\u009C1R\u00E1\u00AF\u00CE-\u00C0\x00\f\u00D5C\u00D9\x1Dp\u00E3\u00EE\x00\x00\x00\x00IEND\u00AEB`\u0082",
		gridOrange: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00TIDATx\u00DAt\u008Fa\x1A\u0080 \bC\x1F|]\u00B5[v\u00B7\u0095F\u008A\u00A6\u00FC\x1Al\u0083a\u00BAN\x04F\u00A9\x17\u0088(\u00C3\x03\u00B5Q\u00E2\x1E\u00EC\u00B3\u0095\u00A4+n\u00DBXk{\u00C4h\u00F2\u00FDn+\b\r\x19\u00BD+\u00B7\u00B7\u00F3\u00D2\u00AC\u00A0\u00BB?fL\u00D7\x1E\u00D3\"9\u00DC\x02\f\x00q\x1E\x1D0\u0083jO\x1D\x00\x00\x00\x00IEND\u00AEB`\u0082",
		fiesta: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00CIDATx\u00DA\u008C\u008EA\n\x00 \f\u00C3Z\x1F\u00EB\u00D5\u00FF\u009F*\u008AL&+8\u00C6.\u0081d\u00D4\u00E8(G\x00\u00D1\u00E0\u0086\u00EBx\u008C\u00C0\u00DAk1\u008F*\u0085Q\u00CAu\u00C3\u00FF\u00ED\u00FCp\u0096\u00BFay\u00F9b\f\u00C1\x14`\x00@'\r\u00E6rz\u0088\u00EE\x00\x00\x00\x00IEND\u00AEB`\u0082",
		lightOlive: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00lIDATx\u00DALO\t\x0E\u00C0 \bk\u0089\u00AF\u00DD'\u00F6\u0099\u00FD\u00B3\x13\u00A8D\x12\u00A3Rz\u00C0\u00F7{\x00\u00908EH}CX\u009Cn\u00D7\u00C6XH\u0091\"?\t\u00A9\u00C1\u00C6\u008A\u009F\u00DD\u00B0\u0094\u00FA4\u008F\u00E3\x15\u00E3i>\u00EE9-\u00A7\u00E2\x05\u00A4\u00BD.\u00B6Tn\u0087\u00C4Q\u00DA\u00D1\u00EAY\x12nk\u00B4\u00CD\u009E$*a\u009B\u00A4K\u00CCF\u00BD\u0082'\u00CF\u00AA\u00BF\x00\x03\x00\u00E9O1\u009E\u00B5\u00F0\u00E3\r\x00\x00\x00\x00IEND\u00AEB`\u0082",
		lipstick: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00HIDATx\u00DAb|\u00D5\u00BD\u008D\u0091\u0091\x01\x17`B\u0092C\u00B0\u00FE\u00FF\u0087I#)\u00FD\u008FP\u00C8\u0088E\x1A\u009B\u00E1@s\u00FE\u00FF\u00C7)\u00CD\u0082\u00C7]\x10\u00C31\u00E5\x19\u0091\u00A51\u008D\u00FE\u008F,\u008Df7#\u009A\u00E1\f\u00A8\u00D6\u00A3\u00A8\x05\b0\x00\u0098\u00E4\x0EC\x1FD\u0086\u00BA\x00\x00\x00\x00IEND\u00AEB`\u0082",
		cuteTeal: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00sIDATx\u00DAL\u008F\u00C9\x11\u00C00\b\x03W\x1E\x17\u0093\u00FEk\u00C8/E\x11# \x13\u00FC0\u00C7\u00A2\x11\u00BA\u009E[\"@(\u00E2\u00FC\u00E8\u00D4\u0090\u00B9\u00D85\u00EB\u00F9\f4\u00F9\u00C2\u0091\u0090cr\u008A[\u0099\u00B5\u00A4`T\u00ADr:\u00AB\u009A\u00DE\x0B\x13\u00C9\x05\x1D\u00BBX\u00D7^\u00F1K\u00C2\x0B\u00BD-Z\u00B9<Z\u0089\u00CFZ\u009F\u00F4s\u00A0j\u00A4\u00B5\x18\u00B6MD\u00DD\u00E6\u00C3\u008A\u00AFf\u008A\u00FF9x\x05\x18\x00\u00CB\u00DCI\u00CDE\u00E8V\x19\x00\x00\x00\x00IEND\u00AEB`\u0082",
		sulphur: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00nIDATx\u00DADOA\x0E\u00C00\b\x12\u00B3\u008F\u00EF\u0085;\u00ECAN\x10\u00D7\u00A6i@\bX\u00BC\u00CF\x1DQ\u00C1\u0083*\x02\x00d\u00C2\u00A9\x11\u00C6\x00+\u00D6\u009A\u00E7?\u00E1\u00A8o\u00D3yu\u00D2\x1A\u00A0\\\u00D9\u00C6\nv\u00A5\u00F0\u00A9l\fg\x11\u00E4\u00F2\u00DA\x14\u00D4\u0082\u00E9\u00A6RV\u00E9\u0083\u00C4\t\u00B8\u00CEO\u00A2\\.)\u00D8\u008E<;\u00EF\u00BF\u00ED\u0093)\u0085H\u00FE\u00A5\u009C\u00A1\u00F7\x13`\x00\x1C\x01?8w\u00B3\x07\x12\x00\x00\x00\x00IEND\u00AEB`\u0082",
		gridGreen: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00jIDATx\u00DAT\u008E\u00D1\x11\u00C00\bB\u00C5\u00CB\u00BA\x1D\u00A9\u008Bu\x19ZA\u0093+_\u0084\x0BOp=7\x19\x16\x10c\x03\x01\u0092\u00CB\u00E9\tI\u00F4\u00BBLv\u00DAb\x01$\u0087)27\u00FF/\u00A6Q*5\u00E6\u00F3\x1AQ\u00EF\x0F\u00EEz/0e\u00C3R\r\u00CCfw\u00F4UfMa\u00E6\u0083s\u00A2\u00F2u\u00B0&b_\x10|F\u00F5\u00A2\u00C2\u00F3\u009C\x7F\x05\x18\x00pq5\u00FC\u00A0du\u00CD\x00\x00\x00\x00IEND\u00AEB`\u0082",
		white: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\b\x02\x00\x00\x00\x02PX\u00EA\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x00\x18IDATx\u00DAb\u00FC\u00FF\u00FF?\x03n\u00C0\u00C4\u0080\x17\u008CTi\u0080\x00\x03\x00\u00A5\u00E3\x03\x11\u0086\x14V\u00A5\x00\x00\x00\x00IEND\u00AEB`\u0082",
		close: "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x1F\x00\x00\x00\x1F\b\x02\x00\x00\x00\u0090\u00CC\u0081n\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x018IDATx\u00DA\u00EC\u0096\u00BF\u008EDP\x14\u00C6gL\u00A5\u00DC'\u0090h\u0089\u009EF\u00A3\"\n\u00AF(\u009E@BEM-\u0094\u0088R\u00A5\u0091\u0088\u0086\u00FDvf2+\u0097;\u00E3Nv\u00AAu\n9\u00CE\u009F\u00DF\u0089{\u00BF\u00938\u00BB\u00AE{\u00FA\u0098q\u00A7O\u00DAA?\u00E8\x7FI\u00EF\u00BA\u00CE\u00F3\u00BC\u00AA\u00AA6\u00B3\u0088#\u008B\u009Aw\u00E8h\u00F3}\u00BF\u00EF\u00FB(\u008A\u00D6\x03\x10A\x1CY\u00D4<\x19@\u00A5\x07A0\f\x03\u009Ci\u009A\u0088\x0174\u00E2\u00F0Q\x13\u0086!3]\u00D34\u008E\u00BBg\u0097\x03\u0096\u00E8\u009F~\u008ESU\u0095\x06\u00B98\u008E\u00B3\u0099\u00F8\u00BAZ]\u00D7\u00F3<\u00E3\x15O\u00F8\u00E38\u00A6i\u00BAD\x1B\u0086!\u008A\u00E2;\u00B7\u008A64/\u00BF \u00CB\u00B2\u00FD\u00E8\u00D7\u008A$\x06\u00FC\u00B6\u00ED@\u00EF\u00D2;\x10\u0092$\x11AY\u0096_\u00A2w\u00D1\u00CB\u00B2,\u008A\u0082\b\u00E6yN\u00DB\x03\x06:\u00D0q\x1C?\u00CE\u00FAak\u00992\u00D3\t4\u00CEZQ\u0094M\u00992\u00D3\u00D7h\\#\u0096\u0080P\u00D1\u00F3\x01Tz\u0092$\u009B\u00E2[\u00CB\x14\u0095\u00CCt\u00CB\u00B2x\u009E\u00DF\x14\u00DFr\x00jL\u00D3d\u00DEU\u00B4\t\u0082\u00D04\u008D\u00AE\u00EBk\u00F1\u00DD6\u00B9m[\u00DB\u00B6\u00E1\u00D0\u00E8\u00E7\u00E3\u008F\u00E3\u00A0\u00FF#\u00FA\u00B7\x00\x03\x00!q\u00D2\x1BhO\u008F\u00F9\x00\x00\x00\x00IEND\u00AEB`\u0082"
	} 
} /* END function __defineIconsForUI */





/* Deutsch-Englische Dialogtexte und Fehlermeldungen */
function __defineLocalizeStrings() {
	
	if(!_global) { return; }
	
	_global.error = { 
		en:"Oops, something went wrong!", 
		de:"Irgendetwas ist da schiefgelaufen!" 
	}				
	
	_global.uiHead = { 
		en:"Set up baseline grid (V 3.0)",
		de:"Grundlinienraster einrichten (V 3.0)"
	}
 
	_global.baselineGridLabel = { 
		en:"Baseline grid", 
		de:"Grundlinienraster" 
	}	 

	_global.valuesTabLabel = { 
		en:"Baselines", 
		de:"Grundlinien"
	}

	_global.displayTabLabel = { 
		en:"Display", 
		de:"Darstellung" 
	}

	_global.startLabel = { 
		en:"Start:", 
		de:"Anfang:" 
	}	

	_global.inches = { 
		en:"Inch", 
		de:"Zoll" 
	}

	_global.points = { 
		en:"Points", 
		de:"Punkte" 
	}
	
	_global.mm = { 
		en:"Millimeters", 
		de:"Millimeter" 
	} 
	
	_global.cm = { 
		en:"Centimeters", 
		de:"Zentimeter" 
	}

	_global.picas = { 
		en:"Picas", 
		de:"Picas" 
	}

	_global.pixels = { 
		en:"Pixels", 
		de:"Pixel" 
	}

	_global.incrementEveryLabel = { 
		en:"Increment every:", 
		de:"Einteilung alle:" 
	}

	_global.relativToLabel = { 
		en:"Relative to:", 
		de:"Relativ zu:" 
	} 
											
	_global.topOfThePageListItem = { 
		en:"Top of Page", 
		de:"Oberem Seitenrand" 
	}	 
									 
	_global.topOfTheMarginListItem = { 
		en:"Top of Margin", 
		de:"Kopfsteg" 
	}

	_global.marginTopLabel = { 
		en:"Top:", 
		de:"Oben:" 
	}

	_global.marginBottomLabel = { 
		en:"Bottom:", 
		de:"Unten:" 
	}	

	_global.marginLeftLabel = { 
		en:"Left:", 
		de:"Links:" 
	} 
	
	_global.marginRightLabel = { 
		en:"Right:", 
		de:"Rechts:" 
	}

	_global.marginInsideLabel = { 
		en:"Ins.:", 
		de:"Innen:" 
	}
	
	_global.marginOutsideLabel = { 
		en:"Outs.:", 
		de:"Au\u00dfen:" 
	}

	_global.columnsLabel = { 
		en:"Columns:", 
		de:"Spalten:" 
	}
	
	_global.numberOfColumnsLabel = { 
		en:"Number:", 
		de:"Anzahl:" 
	}

	_global.gutterLabel = { 
		en:"Gutter:", 
		de:"Abstand:" 
	}

	_global.viewThresholdLabel = { 
		en:"View Threshold:", 
		de:"Anzeigeschwellenwert:" 
	}

	_global.percentage = { 
		en:"\u0025", 
		de:"\u0025" 
	}

	_global.baselineColorLabel = { 
		en:"Color:", 
		de:"Farbe:" 
	}	

	_global.userDefined = { 
		en:"User-defined", 
		de:"Benutzerdefiniert" 
	}
	
	_global.userDefinedHelpTip = { 
		en:"User-defined color values", 
		de:"Benutzerdefiniert Farbwerte" 
	}
	
	_global.gridsInBackLabel = { 
		en:"Grids in Back", 
		de:"Raster im Hintergrund" 
	}
	
	_global.columnDirectionLabel = { 
		en:"Column direction", 
		de:"Spaltenorientierung" 
	}

	_global.columnDirectionVerticalRadiobuttonLabel = { 
		en:"Vertical", 
		de:"vertikal" 
	}
	
	_global.columnDirectionHorizontalRadiobuttonLabel = { 
		en:"Horizontal", 
		de:"horizontal" 
	}
	
	_global.noTextFrameSelectedErrorMessage = { 
		en:"Please select one or more text frames on one of the page!", 
		de:"Bitte einen oder mehrere Textrahmen auf einer Seite ausw\u00e4hlen!" 
	}

	_global.objectStyleNoneName = { 
		fr:"[Aucun]", 
		en:"[None]", 
		de:"[Ohne]" 
	}

	_global.objectStyleBasicGFName = { 
		fr:"[bloc graphique standard]", 
		en:"[Basic Graphics Frame]", 
		de:"[Einfacher Grafikrahmen]" 
	}

	_global.objectStyleBasicTFName = { 
		fr:"[bloc de texte standard]", 
		en:"[Basic Text Frame]", 
		de:"[Einfacher Textrahmen]" 
	} 

	_global.objectStyleBasicGridName = { 
		fr:"[grille standard]", 
		en:"[Basic Grid]", 
		de:"[Einfaches Raster]" 
	}
	
	_global.optionsTabLabel = { 
		en:"Options", 
		de:"Optionen" 
	}
	
	_global.basicTFPanelLabel = { 
		en:"Default Text Frame", 
		de:"Standard-Textrahmen" 
	}

	_global.generalOptionsPanelLabel = { 
		en:"General", 
		de:"Allgemein" 
	}

	_global.basicTFObjectStyle = { 
		en:"Object Style:", 
		de:"Objektformat:" 
	}
	
	_global.basicTFFirstBaselineLabel = { 
		en:"First Baseline:", 
		de:"Erste Grundlinie:" 
	} 
	
	_global.basicTFFirstBaselineOffsetLabel = { 
		en:"Offset:", 
		de:"Versatz:" 
	} 
	
	_global.basicTFFirstBaselineMinLabel = { 
		en:"Minimum:", 
		de:"Minimum:" 
	}	

	_global.firstBaselineAscentOffset = { 
		en:"Ascent", 
		de:"Oberl\u00e4nge" 
	}

	_global.firstBaselineCapHeight = { 
		en:"Cap Height", 
		de:"Versalh\u00f6he" 
	}

	_global.firstBaselineLeadingOffset = { 
		en:"Leading", 
		de:"Zeilenabstand" 
	}

	_global.firstBaselineXHeight = { 
		en:"x Height", 
		de:"x-H\u00f6he" 
	}

	_global.firstBaselineFixedHeight = { 
		en:"Fixed", 
		de:"Fester Wert" 
	}
	 
	_global.marginsPanelLabel = { 
		en:"Margins and Columns", 
		de:"Stege und Spalten" 
	} 

	_global.marginsTopLabel = { 
		en:"Top", 
		de:"Oben" 
	}
	
	_global.adjustMarginTopHelpTip = { 
		en:"Adjust top margin to selected text frame", 
		de:"Oberen Steg (Rand) an ausgew\u00e4hlten Textrahmen anpassen" 
	}
	 
	_global.marginsBottomLabel = { 
		en:"Bottom", 
		de:"Unten" 
	}
	
	_global.adjustMarginBottomHelpTip = { 
		en:"Adjust bottom margin to selected text frame", 
		de:"Unteren Steg (Rand) an ausgew\u00e4hlten Textrahmen anpassen" 
	}
	
	_global.marginsLeftLabel = { 
		en:"Left", 
		de:"Links" 
	}
	
	_global.adjustMarginLeftHelpTip = { 
		en:"Adjust left margin to selected text frame", 
		de:"Linken Steg (Rand) an ausgew\u00e4hlten Textrahmen anpassen" 
	}	
	
	_global.marginsRightLabel = { 
		en:"Right", 
		de:"Rechts" 
	}
	
	_global.adjustMarginRightHelpTip = { 
		en:"Adjust right margin to selected text frame", 
		de:"Rechten Steg (Rand) an ausgew\u00e4hlten Textrahmen anpassen" 
	}
	
	_global.adjustAllMarginsButtonLabel = { 
		en:"All", 
		de:"Alle" 
	} 
	
	_global.adjustAllMarginsHelpTip = { 
		en:"Adjust all margins to selected text frame", 
		de:"Alle Stege (R\u00e4nder) an ausgew\u00e4hlten Textrahmen anpassen" 
	}

	_global.marginValueError =	{ 
		en:"The value entered for the margin is too large!", 
		de:"Der eingegebene Wert f\u00fcr den Steg (Rand) ist zu gro\u00df!" 
	}

	_global.chainMarginsButtonHelpTip =	{ 
		en:"Make all settings the same", 
		de:"Alle Einstellungen gleichsetzen" 
	}

	_global.swapLeftRightMarginsButtonButtonHelpTip =	{ 
		en:"Swap the value of the right and left margin.", 
		de:"Wert von rechtem und linkem Steg (Rand) vertauschen" 
	}

	_global.swapLeftRightMarginsGoBackLabel =	{ 
		en:"Swap margins", 
		de:"Stege vertauschen" 
	}
	
	_global.showGridCatchLabel = { 
		en:"G", 
		de:"R" 
	}
	 
	_global.showGridHelpTip = { 
		en:"Show baseline grid", 
		de:"Grundlinienraster einblenden" 
	}

	_global.hideGridHelpTip = { 
		en:"Hide baseline grid", 
		de:"Grundlinienraster ausblenden" 
	}
	
	_global.uiOpacityCatchLabel = { 
		en:"O", 
		de:"0" 
	}
	
	_global.uiOpacityHelpTip = { 
		en:"Reduce the opacity of this window", 
		de:"Opazit\u00e4t des Fensters verringern" 
	}

	_global.actionPanelLabel = { 
		en:"Actions", 
		de:"Aktionen" 
	}

	_global.refreshHelpTip = { 
		en:"Refresh display", 
		de:"Anzeige aktualisieren" 
	} 
	
	_global.selectionStartCatchLabel = { 
		en:"S", 
		de:"S" 
	}

	_global.startInputHelpTip = { 
		en:"Crtl + Shift + \u2191/\u2193: Increment or decrease the value by the amount of line spacing", 
		de:"Crtl + Shift + \u2191/\u2193: Wert um den Betrag des Zeilenabstandes erh\u00f6hen/verringern" 
	}

	_global.selectionStartHelpTip = { 
		en:"Adjust start of the grid to first baseline of selection", 
		de:"Anfang des Grundlinienrasters an erster Grundlinie der Auswahl ausrichten" 
	} 

	_global.selectionStartAlertLabel = { 
		en:"The value for the start of the grid must be between 0 and 1000 points.", 
		de:"Der Wert für den Anfang des Grundlinienrasters muss zwischen 0 und 1000 Punkt liegen." 
	}

	_global.selectionLastBaselineCatchLabel = { 
		en:"F", 
		de:"F" 
	}
	
	_global.selectionLastBaselineHelpTip = { 
		en:"Adjust the grid to last baseline of selection", 
		de:"Grundlinienraster an letzte Grundlinie der Auswahl ausrichten" 
	} 
	
	_global.selectionMarginBottomCatchLabel = { 
		en:"M", 
		de:"S" 
	}

	_global.selectionMarginBottomHelpTip = { 
		en:"Adjust the grid to the bottom margin of the page", 
		de:"Grundlinienraster an unterem Seitenrand ausrichten" 
	}
	
	_global.selectionIncrementCatchLabel = { 
		en:"I", 
		de:"Z" 
	}
	
	_global.selectionIncrementHelpTip = { 
		en:"Adjust increment of the grid to leading of selection", 
		de:"Abstand der Rasterlinien an Zeilenabstand der Auswahl anpassen" 
	}
	
	_global.divideIncrementBy2CatchLabel = { 
		en:"1/2", 
		de:"1/2" 
	}
	
	_global.divideIncrementBy2HelpTip = { 
		en:"Divide increment by 2", 
		de:"Abstand der Rasterlinien durch 2 teilen" 
	}
	 
	_global.divideIncrementBy3CatchLabel = { 
		en:"1/3", 
		de:"1/3" 
	}
	
	_global.divideIncrementBy3HelpTip = { 
		en:"Divide increment by 3", 
		de:"Abstand der Rasterlinien durch 3 teilen" 
	}
	
	_global.selection = { 
		en:"Selection", 
		de:"Auswahl" 
	}

	_global.noTextSelectedErrorMessage = { 
		en:"Please select any text object!", 
		de:"Bitte ein beliebiges Textobjekt ausw\u00e4hlen!" 
	}

	_global.flipButtonHelpTip = { 
		en:"Flip margins horizontal", 
		de:"Stege (R\u00e4nder) horizontal spiegeln" 
	}
	
	_global.pageSelectionLabelText = { 
		en:"Active Page", 
		de:"Aktive Seite" 
	}
	
	_global.singlePageButtonHelpTip = { 
		en:"Select active page", 
		de:"Aktive Seite ausw\u00e4hlen" 
	}

	_global.leftPageButtonHelpTip = { 
		en:"Select left page as active", 
		de:"Linke Seite als aktive ausw\u00e4hlen" 
	}
	
	_global.rightPageButtonHelpTip = { 
		en:"Select right page as active", 
		de:"Recht Seite als aktive ausw\u00e4hlen" 
	}
	
	_global.transferMarginsToMasterHelpTip = { 
		en:"Transfer values to applied master page\rShift + Click: Transfer values to the left and right master page (documents with facing pages)\rAlt + Click: selection dialog for master pages", 
		de:"Werte auf angewandte Musterseite \u00fcbertragen\rShift + Klick: Werte auf linke und rechte Musterseite \u00fcbertragen (Dokument mit Doppelseiten)\rAlt + Click: Auswahldialog f\u00fcr Musterseiten" 
	}
	
	_global.transferMarginsToMasterLabelText = { 
		en:"Master Page",
		de:"Musterseite"
	}
	
	_global.transferMarginsToMasterGoBackLabel = { 
		en:"Transfer margins to master page", 
		de:"Stege (R\u00e4nder) auf Musterseite \u00fcbertragen" 
	}
	
	_global.spreadWithToManyPagesAlertLabel = { 
		en:"The active spread has more than two pages or it is a master spread.",
		de:"Der aktive Druckbogen hat mehr als zwei Seiten oder es handelt sich um einen Musterdruckbogen."
	}
	
	_global.masterWithToManyPagesAlertLabel = { 
		en:"The applied master spread has more than two pages.",
		de:"Der zugewiesene Musterdruckbogen hat mehr als Seiten."
	}

	_global.marginsTransferedToMasterLabel = { 
		en:"The values were transferred to the master page(s).",
		de:"Die Werte wurden auf die Musterseite(n) übertragen."
	}

	_global.masterPageListUILabel = { 
		en:"Select master pages", 
		de:"Musterseiten ausw\u00e4hlen" 
	}
	
	_global.prefixTopicLabel = { 
		en:"Prefix", 
		de:"Pr\u00e4fix" 
	}
	
	_global.nameTopicLabel = { 
		en:"Name of the site",
		de:"Name der Seite" 
	}
	
	_global.pageSideTopicLabel = { 
		en:"Page side", 
		de:"Seitenlage" 
	}
	
	_global.leftHandPageSideLable = { 
		en:"left hand", 
		de:"linke Seite" 
	}

	_global.rightHandPageSideLable = { 
		en:"right hand", 
		de:"rechte Seite" 
	}

	_global.singleSidedPageSideLable = { 
		en:"single sided", 
		de:"einzelne Seite" 
	}
 
	_global.cancelButtonLabel = { 
		en:"Cancel",
		de:"Abbrechen" 
	}
	
	_global.nextButtonLabel = { 
		en:"Next",
		de:"Weiter" 
	}

	_global.pageCountMismatchAlertLabel = { 
		en:"The number of page from active spread and applied master spread is not the same.",
		de:"Seitenanzahl von aktivem Druckbogen und zugewiesenem Musterdruckbogen stimmen nicht überein."
	}
	
	_global.generalOptionsDocLabel = { 
		en:"Document", 
		de:"Dokument" 
	}
	
	_global.enableLayoutAdjustmentLabel = { 
		en:"Enable layout adjustment", 
		de:"Layoutanpassung aktivieren" 
	}

	_global.lockColumnGuidesLabel = { 
		en:"Lock column guides", 
		de:"Spaltenhilfslinien sperren" 
	}

	_global.generalOptionsActivePageLabel = { 
		en:"Active page", 
		de:"Aktive Seite" 
	}

	_global.alertNoRightPage = { 
		en:"The active spread has no right page!", 
		de:"Der aktive Druckbogen hat keine rechte Seite!" 
	}

	_global.alertNoLeftPage = { 
		en:"The active spread has no left page!", 
		de:"Der aktive Druckbogen hat keine rechte Seite!" 
	}

	_global.alertTooManyPages = { 
		en:"For this action the active spread must have 2 pages!", 
		de:"F\u00fcr diese Aktion muss der aktive Druckbogen aus 2 Seiten bestehen!" 
	} 

	_global.errorColumnCountValue = { 
		en:"The entered value must be between 1 and 216!", 
		de:"Der eingegebene Wert muss zwischen 1 und 216 liegen!" 
	} 

	_global.errorColumnGutterValue = { 
		en: "Column gutter is too large for this number of columns!",
		de: "Spaltenabstand zu gro\u00DF f\u00fcr diese Spaltenanzahl!"	
	}

	_global.wrongColumnPositionValueLabel = { 
		en: "Entered value for column position out of range.",
		de: "Eingegebener Wert für Spaltenposition außerhalb des zul\u00E4ssigen Bereichs!"	
	}
	
	_global.basicTFChangeStyleHint = { 
		en:"These settings change the selected object style!", 
		de:"Diese Einstellungen ver\u00E4ndern das ausgew\u00e4hlte Objektformat!" 
	} 
	
	_global.warningDifferentUnitsHelpTip	= { 
		en:"The measurement units of the horizontal and vertical ruler in the document are different. The script therefore may not work correctly.", 
		de:"Die Ma\u00dfeinheiten des horizontalen und vertikalen Lineals im Dokument unterscheiden sich. Das Skript arbeitet daher m\u00f6glicherweise nicht korrekt." 
	} 
	
	_global.differentPageSizeConfirm = { 
		en:"The sizes of the current page and the assigned master page are different. \rContinue anyway?", 
		de:"Das Format der aktuellen Seite stimmt nicht mit dem Format der zugewiesenen Musterseite \u00fcberein.\rTrotzdem fortfahren?" 
	}
	
	_global.cancel = { 
		en:"Close", 
		de:"Schlie\u00dfen" 
	} 
	
	_global.closeWinHelpTip = { 
		en:"Close Window", 
		de:"Fenster schlie\u00dfen" 
	}

	_global.uiColors = { 
		LIGHT_BLUE: localize({ en:"Light Blue", de:"Hellblau" }),
		RED: localize({ en:"Red", de:"Rot" }),
		GREEN: localize({ en:"Green", de:"Gr\u00fcn" }),
		BLUE: localize({ en:"Blue", de:"Blau" }),
		YELLOW: localize({ en:"Yellow", de:"Gelb" }),
		MAGENTA: localize({ en:"Magenta", de:"Magenta" }),
		CYAN: localize({ en:"Cyan", de:"Cyan" }),
		GRAY: localize({ en:"Gray", de:"Grau" }),
		BLACK: localize({ en:"Black", de:"Schwarz" }),
		ORANGE: localize({ en:"Orange", de:"Orange" }),
		DARK_GREEN: localize({ en:"Dark Green", de:"Dunkelgr\u00fcn" }),
		TEAL: localize({ en:"Teal", de:"T\u00fcrkis" }),
		TAN: localize({ en:"Tan", de:"Hellbraun" }),
		BROWN: localize({ en:"Brown", de:"Braun" }),
		VIOLET: localize({ en:"Violet", de:"Violett" }),
		GOLD: localize({ en:"Gold", de:"Gold" }),
		DARK_BLUE: localize({ en:"Dark Blue", de:"Dunkelblau" }),
		PINK: localize({ en:"Pink", de:"Rosa" }),
		LAVENDER: localize({ en:"Lavender", de:"Lavendel" }),
		BRICK_RED: localize({ en:"Brick Red", de:"Rotbraun" }),
		OLIVE_GREEN: localize({ en:"Olive Green", de:"Olivgr\u00fcn" }),
		PEACH: localize({ en:"Peach", de:"Aprikot" }),
		BURGUNDY: localize({ en:"Burgundy", de:"Weinrot" }),
		GRASS_GREEN: localize({ en:"Grass Green", de:"Grasgr\u00fcn" }),
		OCHRE: localize({ en:"Ochre", de:"Ocker" }),
		PURPLE: localize({ en:"Purple", de:"Lila" }),
		LIGHT_GRAY: localize({ en:"Light Gray", de:"Hellgrau" }),
		CHARCOAL: localize({ en:"Charcoal", de:"Anthrazit" }),
		GRID_BLUE: localize({ en:"Grid Blue", de:"Rasterblau" }),
		GRID_ORANGE: localize({ en:"Grid Orange", de:"Rasterorange" }),
		FIESTA: localize({ en:"Fiesta", de:"Feuerrot" }),
		LIGHT_OLIVE: localize({ en:"Light Olive", de:"Helloliv" }),
		LIPSTICK: localize({ en:"Lipstick", de:"Lippenstift" }),
		CUTE_TEAL: localize({ en:"Cute Teal", de:"Hellt\u00fcrkis" }),
		SULPHUR: localize({ en:"Sulphur", de:"Schwefel" }),
		GRID_GREEN: localize({ en:"Grid Green", de:"Rastergr\u00fcn" }),
		WHITE: localize({ en:"White", de:"Wei\u00df" }),
		USER_DEFINED: localize({ en:"User-defined", de:"Benutzerdefiniert" }) 
	}
 
} /* END function __defineLocalizeStrings */