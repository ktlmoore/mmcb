/**
 *  DOM elements
 */

var _classSelect, _classDescription, _classImage;
var _mageRitesSelect, _primaryRiteSelectBox, _secondaryRiteSelectBox;
var _godImage, _priestTypeSelect, _priestTypeSelectBox;
var _traitorPretenceSelect;
var _journeymanSkillFocusSelect;
var _combatPathSelect;

var _bgSelectBox = [null, undefined, undefined];
var _bgText = [null, undefined, undefined];

var _lvl1SkillDiv, _lvl2SkillDiv, _lvl3SkillDiv, _lvl4SkillDiv, _lvl5SkillDiv, _skillDescription;
var _noXPLeftWarning;
var _sameRiteWarning;

var _characterDiv;

/**
 *  Metadata
 */

var _character;
var _availableSkills = [];
var showAllGods = false;
var dev = false;

var fileCount = 0;

/**
 *  Wiki Data
 */

var _classArray = ["class_fighter", "class_skirmisher", "class_priest", "class_mage", "class_wayfinder", "class_journeyman"];
var _godArray = ["god_traitor", "god_leader", "god_tender", "god_builder", "god_warrior", "god_splinteredMan"];
var _ritesArray = ["rite_binding", "rite_wounding", "rite_fracturing", "rite_consumption", "rite_scribing"];

var data = {
	_classes: {},
	_gods: {},
	_backgrounds: {},
	_skills: {},
	_fighter: {},
	_wayfinder: {},
	_skirmisher: {},
	_leaderPriest: {},
	_warriorPriest: {},
	_builderPriest: {},
	_tenderPriest: {},
	_traitorPriest: {},
	_mage: {},
	_rites: {},
	_binding: {},
	_fracturing: {},
	_wounding: {},
	_consumption: {},
	_scribing: {},
	_leaderMiracles: {},
	_warriorMiracles: {},
	_builderMiracles: {},
	_tenderMiracles: {},
	_traitorMiracles: {},
	_combatPaths: {}
}

var myFiles = [
	{
		location: "data/classes.json",
		variable: "_classes"
	},
	{
		location: "data/gods.json",
		variable: "_gods"
	},
	{
		location: "data/backgrounds.json",
		variable: "_backgrounds"
	},
	{
		location: "data/skills.json",
		variable: "_skills"
	},
	{
		location: "data/fighter.json",
		variable: "_fighter"
	},
	{
		location: "data/skirmisher.json",
		variable: "_skirmisher"
	},
	{
		location: "data/wayfinder.json",
		variable: "_wayfinder"
	},
	{
		location: "data/mage.json",
		variable: "_mage"
	},
	{
		location: "data/leaderPriest.json",
		variable: "_leaderPriest"
	},
	{
		location: "data/warriorPriest.json",
		variable: "_warriorPriest"
	},
	{
		location: "data/builderPriest.json",
		variable: "_builderPriest"
	},
	{
		location: "data/tenderPriest.json",
		variable: "_tenderPriest"
	},
	{
		location: "data/traitorPriest.json",
		variable: "_traitorPriest"
	},
	{
		location: "data/rites.json",
		variable: "_rites"
	},
	{
		location: "data/binding.json",
		variable: "_binding"
	},
	{
		location: "data/fracturing.json",
		variable: "_fracturing"
	},
	{
		location: "data/wounding.json",
		variable: "_wounding"
	},
	{
		location: "data/consumption.json",
		variable: "_consumption"
	},
	{
		location: "data/scribing.json",
		variable: "_scribing"
	},
	{
		location: "data/leaderMiracles.json",
		variable: "_leaderMiracles"
	},
	{
		location: "data/warriorMiracles.json",
		variable: "_warriorMiracles"
	},
	{
		location: "data/builderMiracles.json",
		variable: "_builderMiracles"
	},
	{
		location: "data/tenderMiracles.json",
		variable: "_tenderMiracles"
	},
	{
		location: "data/traitorMiracles.json",
		variable: "_traitorMiracles"
	},
	{
		location: "data/journeyman.json",
		variable: "_journeyman"
	},
	{
		location: "data/combatPaths.json",
		variable: "_combatPaths"
	}
];

/**
 *	File IO
 */
function loadFile(filePath, done) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		result = done(this.responseText);
		fileCount++;
		if (fileCount == myFiles.length) {
			buildClassSelectOptions();
			buildPriestTypeSelectOptions();
			buildMageRitesSelectOptions();
			buildBackgroundSelectOptions();
		}
		return result;
	};
	xhr.open("GET", filePath, true);
	xhr.send();
}

/**
 * 	Organ Grinder
 */

$(document).ready(function() {

	_classSelect = $("#classSelectBox");
	_classDescription = $("#classDescription");
	_classImage = $("#classImage");
	_godImage = $("#godImage");
	_priestTypeSelect = $("#priestTypeSelect");
	_priestTypeSelectBox = $("#priestTypeSelectBox");
	_mageRitesSelect = $("#mageRitesSelect");
	_primaryRiteSelectBox = $("#primaryRiteSelectBox");
	_secondaryRiteSelectBox = $("#secondaryRiteSelectBox");
	_bgSelectBox[1] = $("#background1SelectBox");
	_bgSelectBox[2] = $("#background2SelectBox");
	_bgText[1] = $("#background1Text");
	_bgText[2] = $("#background2Text");
	_lvl1SkillDiv = $("#lvl1SkillDiv");
	_lvl2SkillDiv = $("#lvl2SkillDiv");
	_lvl3SkillDiv = $("#lvl3SkillDiv");
	_lvl4SkillDiv = $("#lvl4SkillDiv");
	_lvl5SkillDiv = $("#lvl5SkillDiv");
	_skillDescription = $("#skillDescription");
	_noXPLeftWarning = $("#noXPLeftWarning");
	_sameRiteWarning = $("#sameRiteWarning");
	_traitorPretenceSelect = $("#traitorPretenceSelect");
	_journeymanSkillFocusSelect = $("#journeymanSkillFocusSelect");
	_combatPathSelect = $("#combatPathSelect");

	_characterDiv = $("#characterDiv");

	_lvl2SkillDiv.hide();
	_lvl3SkillDiv.hide();
	_lvl4SkillDiv.hide();
	_lvl5SkillDiv.hide();
	_noXPLeftWarning.hide();
	_sameRiteWarning.hide();
	_traitorPretenceSelect.hide();
	_journeymanSkillFocusSelect.hide();
	_combatPathSelect.hide();

	/*
	 *	Load JSON
	 */

	prepareCharacter();


	myFiles.forEach(function (file, i) {
		loadFile(file.location, function(responseText) {
			data[file.variable] = JSON.parse(responseText);
		});
	});

	if (!dev) {
		_priestTypeSelect.hide();
		_mageRitesSelect.hide();
		_maxXP = 50;
	} else {
		_maxXP = 50;
	}
	
});

/* Change listeners */
$(document).on('change', '#classSelectBox', updateClassEvent);
$(document).on('change', '#priestTypeSelectBox', updateGod);
$(document).on('change', '#primaryRiteSelectBox', updatePrimaryRite);
$(document).on('change', '#secondaryRiteSelectBox', updateSecondaryRite);
$(document).on('change', '#background1SelectBox', updateBackground1);
$(document).on('change', '#background2SelectBox', updateBackground2);
$(document).on('change', '#traitorPretenceSelectBox', updatePretence);
$(document).on('change', '#journeymanSkillFocusSelectBox', updateJourneymanSkillFocus);
$(document).on('change', '#combatPathSelectBox', updateCombatPath);

/* Input listeners */
$(document).on('input', '#charName', updateCharName);
$(document).on('input', '#playerName', updatePlayerName);
$(document).on('input', '#bio', updateBio);


function buildCharacter() {
	// Total hits
	_character.hits = 5;
	_character.armour = 2;
	for (var i = 0; i < _character.skills.length; i++) {
		var s = findById(data._skills, _character.skills[i]);
		console.log(s);
		if (s.body) {
			_character.hits += s.body;
		}
		if (s.armour) {
			_character.armour += s.armour;
		}
	}

	

	var printedCharacter = prettyPrintCharacter();
	
	_characterDiv.html(printedCharacter);
}

/**
 *	Takes an object with name and id fields and returns an option HTML string for that object.
 */
function optionify(obj, type) {
	if (obj == undefined) {
		console.log(type);
	}
	return "<option value='" + obj.id + "'>" + obj.name + "</option>";
}

/**
 *  Takes a source location of an image and returns an img HTML string for that image
 */
function imagify(src, width, height) {
	return "<img src='./assets/images/" + src + "' width='" + width + "' height='" + height + "'/>";
} 

/**
 *	Toggles whether dropdown displays all gods or just founders
 */
function toggleAllGods() {
	showAllGods = !showAllGods;
	if (showAllGods) {
		$("#toggleAllGods").val("Show Founders only");
	} else {
		$("#toggleAllGods").val("Show all gods");
	}
	buildPriestTypeSelectOptions();
}

/**
 *	Updates priest type selection options
 */
function buildPriestTypeSelectOptions() {
	_priestTypeSelectBox.html("<option disabled='true' selected='true'>Select a god</option>");
	for (var i = 0; i < _godArray.length; i++) {
		var god = data._gods[_godArray[i]];
		if (showAllGods || god.founder) {
			_priestTypeSelectBox.append(optionify(god, "god"));
		}
	}
}

/** 
 * Updates class selection options
 */
function buildClassSelectOptions() {
	console.log(data._classes);
	for (var i = 0; i < _classArray.length; i++) {
		_classSelect.append(optionify(data._classes[_classArray[i]], "class"));
	}
}

/**
 *	Updates mage rites selection options
 */
function buildMageRitesSelectOptions() {
	_primaryRiteSelectBox.html("<option disabled='true' selected='true'>Select Primary Rite</option>");
	_secondaryRiteSelectBox.html("<option disabled='true' selected='true'>Select Secondary Rite</option>");
	for (var i = 0; i < _ritesArray.length; i++) {
		var rite = data._rites[_ritesArray[i]];
		if (_character.secondaryRite != rite.id) {
			_primaryRiteSelectBox.append(optionify(rite, "rite1"));	
		}
		if (_character.primaryRite != rite.id) {
			_secondaryRiteSelectBox.append(optionify(rite, "rite2"));
		}
	}
}


/*
 *	Updates background selection options
 */
function buildBackgroundSelectOptions() {

	for (var i = 0; i < data._backgrounds.length; i++) {
		var background = data._backgrounds[i];
		_bgSelectBox[1].append(optionify(background, "bg1"));
		_bgSelectBox[2].append(optionify(background, "bg2"));
	}
}

/*
 *  Updates the skills that are available to buy
 */
function buildAvailableSkills() {
	
	// First acquire all the available skills.
	_character.skills = [];
	_character.level1 = [];
	_character.level2 = [];
	_character.level3 = [];
	_character.level4 = [];
	_character.level5 = [];
	_availableSkills = [];
	var _cclass = new Object();
	_lvl1SkillDiv.html("<strong>Level 1</strong><br><br>");
	_lvl2SkillDiv.html("<strong>Level 2</strong><br><br>");
	_lvl3SkillDiv.html("<strong>Level 3</strong><br><br>");
	_lvl4SkillDiv.html("<strong>Level 4</strong><br><br>");
	_lvl5SkillDiv.html("<strong>Level 5</strong><br><br>");
	_skillDescription.html("");

	var mage = false;
	var priest = false;
	var combatPath = false;
	var miracles = new Object();

	switch (_character.characterClass.id) {
		case "class_fighter":
			_cclass = data._fighter;
			combatPath = true;
			break;
		case "class_wayfinder":
			_cclass = data._wayfinder;
			break;
		case "class_skirmisher":
			_cclass = data._skirmisher;
			combatPath = true;
			break;
		case "class_leaderPriest":
			_cclass = data._leaderPriest;
			miracles = data._leaderMiracles;
			priest = true;
			break;
		case "class_warriorPriest":
			_cclass = data._warriorPriest;
			miracles = data._warriorMiracles;
			priest = true;
			break;
		case "class_builderPriest":
			_cclass = data._builderPriest;
			miracles = data._builderMiracles;
			priest = true;
			break;
		case "class_tenderPriest":
			_cclass = data._tenderPriest;
			miracles = data._tenderMiracles;
			priest = true;
			break;
		case "class_traitorPriest":
			_cclass = data._traitorPriest;
			miracles = {miracles: {level1: [], level2: [], level3: [], level4: [], level5: []}};
			var anothersMiracles = new Object();
			switch (_character.traitorPretence) {
				case "leader":
					anothersMiracles = data._leaderMiracles;
					break;
				case "warrior":
					anothersMiracles = data._warriorMiracles;
					break;
				case "builder":
					anothersMiracles = data._builderMiracles;
					break;
				case "tender":
					anothersMiracles = data._tenderMiracles;
					break;
				default:
					console.log("No pretence has yet been chosen");
					anothersMiracles = {miracles: {level1: [], level2: [], level3: [], level4: [], level5: []}};
			}
			console.log(miracles);
			console.log(data._traitorMiracles);
			miracles.miracles.level1 = miracles.miracles.level1.concat(data._traitorMiracles.miracles.level1);
			miracles.miracles.level2 = miracles.miracles.level2.concat(data._traitorMiracles.miracles.level2);
			miracles.miracles.level3 = miracles.miracles.level3.concat(data._traitorMiracles.miracles.level3);
			miracles.miracles.level4 = miracles.miracles.level4.concat(data._traitorMiracles.miracles.level4);
			miracles.miracles.level5 = miracles.miracles.level5.concat(data._traitorMiracles.miracles.level5);
			miracles.miracles.level1 = miracles.miracles.level1.concat(anothersMiracles.miracles.level1);
			miracles.miracles.level2 = miracles.miracles.level2.concat(anothersMiracles.miracles.level2);
			miracles.miracles.level3 = miracles.miracles.level3.concat(anothersMiracles.miracles.level3);
			miracles.miracles.level4 = miracles.miracles.level4.concat(anothersMiracles.miracles.level4);
			miracles.miracles.level5 = miracles.miracles.level5.concat(anothersMiracles.miracles.level5);
			
			priest = true;
			break;
		case "class_mage":
			_cclass = data._mage;
			mage = true;
			break;
		case "class_journeyman":
			_cclass = data._journeyman;
			break;
		default:
			_cclass = null;
			console.log("No character class chosen yet");
	}

	if (_cclass != null) {
		// Add all the class skills
		for (var i = 0; i < _cclass.skills.level1.length; i++) {
			var s = findById(data._skills, _cclass.skills.level1[i].skill);
			if (dev) {console.log(s);}
			s.preReqs = _cclass.skills.level1[i].preReqs;
			_availableSkills.push(s);
			_lvl1SkillDiv.append(makeSkillButton(s, 1));
		}
		for (var i = 0; i < _cclass.skills.level2.length; i++) {
			var s = findById(data._skills, _cclass.skills.level2[i].skill);
			//console.log(s);
			s.preReqs = _cclass.skills.level2[i].preReqs;
			_availableSkills.push(s);
			_lvl2SkillDiv.append(makeSkillButton(s, 2));
		}
		for (var i = 0; i < _cclass.skills.level3.length; i++) {
			var s = findById(data._skills, _cclass.skills.level3[i].skill);
			// console.log(s);
			s.preReqs = _cclass.skills.level3[i].preReqs;
			_availableSkills.push(s);
			_lvl3SkillDiv.append(makeSkillButton(s, 3));
		}
		for (var i = 0; i < _cclass.skills.level4.length; i++) {
			var s = findById(data._skills, _cclass.skills.level4[i].skill);
			// console.log(s);
			s.preReqs = _cclass.skills.level4[i].preReqs;
			_availableSkills.push(s);
			_lvl4SkillDiv.append(makeSkillButton(s, 4));
		}
		for (var i = 0; i < _cclass.skills.level5.length; i++) {
			var s = findById(data._skills, _cclass.skills.level5[i].skill);
			if (dev) {console.log(s);}
			s.preReqs = _cclass.skills.level5[i].preReqs;
			_availableSkills.push(s);
			_lvl5SkillDiv.append(makeSkillButton(s, 5));
		}		
	}

	// Then add the chosen combat path
	if (combatPath) {
		if (_character.combatPath.level1) {
			for (var i = 0; i < _character.combatPath.level1.length; i++) {
				var s = findById(data._skills, _character.combatPath.level1[i]);
				s.free = true;
				_availableSkills.push(s);
				_lvl1SkillDiv.append(makeSkillButton(s, 1, "combatPath"));
			}
			for (var i = 0; i < _character.combatPath.level2.length; i++) {
				var s = findById(data._skills, _character.combatPath.level2[i]);
				s.preReqs = {or: _character.combatPath.level1};
				_availableSkills.push(s);
				_lvl2SkillDiv.append(makeSkillButton(s, 2, "combatPath"));
			}
			for (var i = 0; i < _character.combatPath.level3.length; i++) {
				var s = findById(data._skills, _character.combatPath.level3[i]);
				s.preReqs = {or: _character.combatPath.level2};
				_availableSkills.push(s);
				_lvl3SkillDiv.append(makeSkillButton(s, 3, "combatPath"));
			}
			for (var i = 0; i < _character.combatPath.level4.length; i++) {
				var s = findById(data._skills, _character.combatPath.level4[i]);
				s.preReqs = {or: _character.combatPath.level3};
				_availableSkills.push(s);
				_lvl4SkillDiv.append(makeSkillButton(s, 4, "combatPath"));
			}
			for (var i = 0; i < _character.combatPath.level5.length; i++) {
				var s = findById(data._skills, _character.combatPath.level5[i]);
				s.preReqs = {or: _character.combatPath.level4};
				_availableSkills.push(s);
				_lvl5SkillDiv.append(makeSkillButton(s, 5, "combatPath"));
			}
		}
	}

	// Then add all the applicable rites spells
	if (mage) {
		var primaryRite, secondaryRite;
		switch (_character.primaryRite) {
			case "rite_binding":
				primaryRite = data._binding;
				break;
			case "rite_wounding":
				primaryRite = data._wounding;
				break;
			case "rite_fracturing":
				primaryRite = data._fracturing;
				break;
			case "rite_consumption":
				primaryRite = data._consumption;
				break;
			case "rite_scribing":
				primaryRite = data._scribing;
				break;
			default:
				console.log("No primary rite selected");
				primaryRite = "None";
		}
		switch (_character.secondaryRite) {
			case "rite_binding":
				secondaryRite = data._binding;
				break;
			case "rite_wounding":
				secondaryRite = data._wounding;
				break;
			case "rite_fracturing":
				secondaryRite = data._fracturing;
				break;
			case "rite_consumption":
				secondaryRite = data._consumption;
				break;
			case "rite_scribing":
				secondaryRite = data._scribing;
				break;
			default:
				console.log("No secondary rite selected");
				secondaryRite = "None";
		}
		if (primaryRite != "None") {
			for (var i = 0; i < primaryRite.spells.level1.length; i++) {
				var s = findById(data._skills, primaryRite.spells.level1[i]);
				console.log(s);
				_availableSkills.push(s);
				_lvl1SkillDiv.append(makeSkillButton(s, 1, "spell"));
			}
			for (var i = 0; i < primaryRite.spells.level2.length; i++) {
				var s = findById(data._skills, primaryRite.spells.level2[i]);
				console.log(s);
				s.preReqs = {or: [].concat(primaryRite.spells.level1)};
				_availableSkills.push(s);
				_lvl2SkillDiv.append(makeSkillButton(s, 2, "spell"));
			}
			for (var i = 0; i < primaryRite.spells.level3.length; i++) {
				var s = findById(data._skills, primaryRite.spells.level3[i]);
				console.log(s);
				s.preReqs = {or: [].concat(primaryRite.spells.level2)};
				_availableSkills.push(s);
				_lvl3SkillDiv.append(makeSkillButton(s, 3, "spell"));
			}
			for (var i = 0; i < primaryRite.spells.level4.length; i++) {
				var s = findById(data._skills, primaryRite.spells.level4[i]);
				console.log(s);
				s.preReqs = {or: [].concat(primaryRite.spells.level3)};
				_availableSkills.push(s);
				_lvl4SkillDiv.append(makeSkillButton(s, 4, "spell"));
			}
			for (var i = 0; i < primaryRite.spells.level5.length; i++) {
				var s = findById(data._skills, primaryRite.spells.level5[i]);
				console.log(s);
				s.preReqs = {or: [].concat(primaryRite.spells.level4)};
				_availableSkills.push(s);
				_lvl5SkillDiv.append(makeSkillButton(s, 5, "spell"));
			}	
		}
		if (secondaryRite != "None") {	
			console.log("SECONDARY", secondaryRite);
			for (var i = 0; i < secondaryRite.spells.level1.length; i++) {
				var s = findById(data._skills, secondaryRite.spells.level1[i]);
				console.log("LEVEL1", secondaryRite.spells.level1);
				s.preReqs = {not: []};
				for (var j = 0; j < secondaryRite.spells.level1.length; j++) {
					var t = findById(data._skills, secondaryRite.spells.level1[j]);
					if (s != t) {
						s.preReqs.not.push(t.id);
					}
				}
				_availableSkills.push(s);
				_lvl1SkillDiv.append(makeSkillButton(s, 1, "spell"));
			}
			for (var i = 0; i < secondaryRite.spells.level2.length; i++) {
				var s = findById(data._skills, secondaryRite.spells.level2[i]);
				console.log(s);
				s.preReqs = {or: [].concat(secondaryRite.spells.level1), not: []};
				for (var j = 0; j < secondaryRite.spells.level2.length; j++) {
					var t = findById(data._skills, secondaryRite.spells.level2[j]);
					if (s != t) {
						s.preReqs.not.push(t.id);
					}
				}
				console.log(s.preReqs);
				_availableSkills.push(s);
				_lvl2SkillDiv.append(makeSkillButton(s, 2, "spell"));
			}
			for (var i = 0; i < secondaryRite.spells.level3.length; i++) {
				var s = findById(data._skills, secondaryRite.spells.level3[i]);
				console.log(s);
				s.preReqs = {or: [].concat(secondaryRite.spells.level2), not: []};
				
				for (var j = 0; j < secondaryRite.spells.level3.length; j++) {
					var t = findById(data._skills, secondaryRite.spells.level3[j]);
					if (s != t) {
						s.preReqs.not.push(t.id);
					}
				}
				_availableSkills.push(s);
				_lvl3SkillDiv.append(makeSkillButton(s, 3, "spell"));
			}
			for (var i = 0; i < secondaryRite.spells.level4.length; i++) {
				var s = findById(data._skills, secondaryRite.spells.level4[i]);
				console.log(s);
				s.preReqs = {or: [].concat(secondaryRite.spells.level3), not: []};
				
				_lvl4SkillDiv.append(makeSkillButton(s, 4, "spell"));
				for (var j = 0; j < secondaryRite.spells.level4.length; j++) {
					var t = findById(data._skills, secondaryRite.spells.level4[j]);
					if (s != t) {
						s.preReqs.not.push(t.id);
					}
				}
				_availableSkills.push(s);
			}
			for (var i = 0; i < secondaryRite.spells.level5.length; i++) {
				var s = findById(data._skills, secondaryRite.spells.level5[i]);
				console.log(s);
				s.preReqs = {or: [].concat(secondaryRite.spells.level4), not: []};
				for (var j = 0; j < secondaryRite.spells.level5.length; j++) {
					var t = findById(data._skills, secondaryRite.spells.level5[j]);
					if (s != t) {
						s.preReqs.not.push(t.id);
					}
				}
				_availableSkills.push(s);
				_lvl5SkillDiv.append(makeSkillButton(s, 5, "spell"));
			}
		}

	}

	// Then add all the applicable miracles
	if (priest) {
		console.log(miracles);
		for (var i = 0; i < miracles.miracles.level1.length; i++) {
			var s = findById(data._skills, miracles.miracles.level1[i]);
			// console.log(s);
			_availableSkills.push(s);
			_lvl1SkillDiv.append(makeSkillButton(s, 1));
		}
		for (var i = 0; i < miracles.miracles.level2.length; i++) {
			var s = findById(data._skills, miracles.miracles.level2[i]);
			// console.log(s);
			s.preReqs = {or: miracles.miracles.level1};
			_availableSkills.push(s);
			_lvl2SkillDiv.append(makeSkillButton(s, 2));
		}
		for (var i = 0; i < miracles.miracles.level3.length; i++) {
			var s = findById(data._skills, miracles.miracles.level3[i]);
			if (dev) {console.log(s);}
			s.preReqs = {or: miracles.miracles.level2};
			_availableSkills.push(s);
			_lvl3SkillDiv.append(makeSkillButton(s, 3));
		}
		for (var i = 0; i < miracles.miracles.level4.length; i++) {
			var s = findById(data._skills, miracles.miracles.level4[i]);
			if (dev) {console.log(s);}
			s.preReqs = {or: miracles.miracles.level3};
			_availableSkills.push(s);
			_lvl4SkillDiv.append(makeSkillButton(s, 4));
		}
		for (var i = 0; i < miracles.miracles.level5.length; i++) {
			var s = findById(data._skills, miracles.miracles.level5[i]);
			if (dev) {console.log(s);}
			s.preReqs = {or: miracles.miracles.level4};
			_availableSkills.push(s);
			_lvl5SkillDiv.append(makeSkillButton(s, 5));
		}
	}


	// Then add background skills
	for (var n = 1; n <= 2; n++) {	

		if (_character.background[n].level1 != undefined) {	
			for (var i = 0; i < _character.background[n].level1.length; i++) {
				var s = findById(data._skills, _character.background[n].level1[i]);
				if (findById(_availableSkills, s.id) == null) {
					s.free = false;
					_availableSkills.push(s);
					_lvl1SkillDiv.append(makeSkillButton(s, 1));
				} else {
					findById(_availableSkills, s.id).free = true;
				}
			}
		}
		if (_character.background[n].level2 != undefined) {	
			for (var i = 0; i < _character.background[n].level2.length; i++) {
				var s = findById(data._skills, _character.background[n].level2[i]);			
				if (findById(_availableSkills, s.id) == null) {
					s.preReqs = {or: [].concat(_character.background[n].level1)};
					_availableSkills.push(s);
					_lvl2SkillDiv.append(makeSkillButton(s, 2));
				}
			}
		}
		if (_character.background[n].level3 != undefined) {	
			for (var i = 0; i < _character.background[n].level3.length; i++) {
				var s = findById(data._skills, _character.background[n].level3[i]);
				if (findById(_availableSkills, s.id) == null) {
					s.preReqs = {or: [].concat(_character.background[n].level2)};
					_availableSkills.push(s);
					_lvl3SkillDiv.append(makeSkillButton(s, 3));
				}
			}
		}
		if (_character.background[n].level4 != undefined) {	
			for (var i = 0; i < _character.background[n].level4.length; i++) {
				var s = findById(data._skills, _character.background[n].level4[i]);
				if (findById(_availableSkills, s.id) == null) {
					s.preReqs = {or: [].concat(_character.background[n].level3)};
					_availableSkills.push(s);
					_lvl4SkillDiv.append(makeSkillButton(s, 4));
				}
			}
		}
	}

	if (_cclass == "class_traitorPriest") {console.log(_availableSkills);}

	// Re-buy skills that are still available and were previously selected
	_character.spentXP = 0;
	modifyXP(0, 0);

	// Event listeners

	$('.skill').off('mouseover');
	$('.skill').off('click');

	$('.skill').mouseover(function(e) {
		var id = e.target.id;
		// Display skill description
		_skillDescription.html(prettyPrintSkill(findById(data._skills, id)));
	});

	$('.skill').click(function(e) {
		toggleSkill(e.target.id);
	});
}

/*
 *	React to class change
 */ 
function updateClassEvent(e){
	updateClass(e.target.value);
}

function updateClass(id) {
	_classDescription.html(data._classes[id].description);
	_classImage.html(imagify(data._classes[id].image, 150, 200));

	if (id.toLowerCase().contains("priest")) {
		_priestTypeSelect.show();
		_godImage.show();	
	} else {
		_priestTypeSelect.hide();	
		_godImage.hide();
	}

	if (id.toLowerCase().contains("mage")) {
		_mageRitesSelect.show();
	} else {
		_mageRitesSelect.hide();
	}

	if (id.toLowerCase().contains("journeyman")) {
		_journeymanSkillFocusSelect.show();
	} else {
		_journeymanSkillFocusSelect.hide();
	}

	if (id.toLowerCase().contains("fighter") || id.toLowerCase().contains("skirmisher")) {
		_combatPathSelect.show();
	} else {
		_combatPathSelect.hide();
	}

	$("#className").html(data._classes[id].name);

	_character.characterClass = data._classes[id];

	buildAvailableSkills();
}

/*
 *	React to god change
 */
function updateGod(e) {
	var id = e.target.value;
	_godImage.html(imagify(data._gods[id].image, 150, 200));
	var priestClass = data._gods[id].priestClass;
	updateClass("class_" + priestClass);

	if (priestClass.toLowerCase().contains("traitor")) {
		_traitorPretenceSelect.show();
	} else {
		_traitorPretenceSelect.hide();
	}

}

/*
 *	React to traitor pretence change
 */
function updatePretence(e) {
	var id = e.target.value;
	_character.traitorPretence = id;
	buildAvailableSkills();
}

/*
 *	React to skill focus change
 */
function updateJourneymanSkillFocus(e) {
	var id = e.target.value;
	var a = _character.skills.indexOf("skill_craftingUpgrades");
	var b = _character.skills.indexOf("skill_medicineHealingHands");
	var c = _character.skills.indexOf("skill_alchemyInfused");

	var rem = Math.max(a, Math.max(b, c));
	if (rem >= 0) {
		_character.skills.splice(rem, 1);
	}

	switch (id) {
		case "crafting":
			_character.skills.push("skill_craftingUpgrades");
			_character.skillFocus = "skill_craftingUpgrades";
			break;
		case "medicine":
			_character.skills.push("skill_medicineHealingHands");
			_character.skillFocus = "skill_medicineHealingHands";
			break;
		case "alchemy":
			_character.skills.push("skill_alchemyInfused");
			_character.skillFocus = "skill_alchemyInfused";
			break;
	}

	validatePreReqs();
}

/*
 *	React to combat path change
 */
function updateCombatPath(e) {
	var id = e.target.value;

	_character.combatPath = data._combatPaths[id];

	buildAvailableSkills();
}

/*
 *	React to rites changing
 */
function updatePrimaryRite(e) {
	var id = e.target.value;
	if (id != _character.secondaryRite) {
		_character.primaryRite = id;	
		_sameRiteWarning.hide();
	} else {
		_sameRiteWarning.show();
		_primaryRiteSelectBox.val('1');
		_character.primaryRite = "None";
	}

	buildAvailableSkills();
}
function updateSecondaryRite(e) {
	var id = e.target.value;
	if (id != _character.primaryRite) {
		_character.secondaryRite = id;
		_sameRiteWarning.hide();
	} else {
		_sameRiteWarning.show();
		_secondaryRiteSelectBox.val('1');
		_character.secondaryRite = "None";
	}

	buildAvailableSkills();
}

/*
 *	React to background 1 change
 */
function updateBackground1(e) {
	updateBackground(e, 1);
}

/*
 *	React to background 2 change
 */
function updateBackground2(e) {
	updateBackground(e, 2);
}

/*
 *	React to details changing
 */
function updateCharName(e) {
	var id = e.target.value;
	_character.name = id;
}
function updatePlayerName(e) {
	var id = e.target.value;
	_character.player = id;
}
function updateBio(e) {
	var id = e.target.value;
	_character.bio = id;
}

/*
 *	React to clicking a skill
 */
function toggleSkill(id) {
	var skillIndex = _character.skills.indexOf(id);
	if (skillIndex >= 0) {
		// The skill is there, remove it, removing upper levels if it causes collapse

		if ($('#' + id).hasClass("level1")) {
			_character.level1.splice(_character.level1.indexOf(id), 1);
			if (_character.level1.length < 5 && _character.level2[0]) {
				_character.level2 = [];
				_character.level3 = [];
				_character.level4 = [];
				_character.level5 = [];
				_character.skills = [].concat(_character.level1);
				_character.spentXP = _character.level1.length;
				$(".level2").removeClass("btn-danger").addClass("btn-primary");
				$(".level3").removeClass("btn-danger").addClass("btn-primary");
				$(".level4").removeClass("btn-danger").addClass("btn-primary");
				$(".level5").removeClass("btn-danger").addClass("btn-primary");
				_lvl2SkillDiv.hide();
				_lvl3SkillDiv.hide();
				_lvl4SkillDiv.hide();
				_lvl5SkillDiv.hide();
			}
		} else if ($('#' + id).hasClass("level2")) {
			_character.level2.splice(_character.level2.indexOf(id), 1);
			if (_character.level1.length + _character.level2.length < 11 && _character.level3[0]) {
				_character.level3 = [];
				_character.level4 = [];
				_character.level5 = [];
				_character.skills = [].concat(_character.level1);
				_character.skills = _character.skills.concat(_character.level2);
				_character.spentXP = _character.level1 + _character.level2;
				$(".level3").removeClass("btn-danger").addClass("btn-primary");
				$(".level4").removeClass("btn-danger").addClass("btn-primary");
				$(".level5").removeClass("btn-danger").addClass("btn-primary");
				_lvl3SkillDiv.hide();
				_lvl4SkillDiv.hide();
				_lvl5SkillDiv.hide();
			}
		} else if ($('#' + id).hasClass("level3")) {
			_character.level3.splice(_character.level3.indexOf(id), 1);
			if (_character.level1.length + _character.level2.length + _character.level3.length < 17 && _character.level3[0]) {
				_character.level4 = [];
				_character.level5 = [];
				_character.skills = [].concat(_character.level1);
				_character.skills = _character.skills.concat(_character.level2);
				_character.skills = _character.skills.concat(_character.level3);
				_character.spentXP = _character.level1.length + _character.level2.length + _character.level3.length;
				$(".level4").removeClass("btn-danger").addClass("btn-primary");
				$(".level5").removeClass("btn-danger").addClass("btn-primary");
				_lvl4SkillDiv.hide();
				_lvl5SkillDiv.hide();
			}
		} else if ($('#' + id).hasClass("level4")) {
			_character.level4.splice(_character.level4.indexOf(id), 1);
			if (_character.level1.length + _character.level2.length + _character.level3.length + _character.level4.length < 24 && _character.level5[0]) {
				_character.level5 = [];
				_character.skills = [].concat(_character.level1);
				_character.skills = _character.skills.concat(_character.level2);
				_character.skills = _character.skills.concat(_character.level3);
				_character.skills = _character.skills.concat(_character.level4);
				_character.spentXP = _character.level1.length + _character.level2.length + _character.level3.length + _character.level4.length;
				$(".level5").removeClass("btn-danger").addClass("btn-primary");
				_lvl5SkillDiv.hide();
			}
		} else if ($('#' + id).hasClass("level5")) {
			_character.level5.splice(_character.level5.indexOf(id), 1);
		} else {
			console.log("Skill button is missing a level, " + id);
		}
		_character.skills.splice(skillIndex, 1);
		_character.spentXP = _character.level1.length + _character.level2.length + _character.level3.length + _character.level4.length + _character.level5.length;
		for (var i = 0; i < _character.skills.length; i++) {
			if (findById(_availableSkills, _character.skills[i]).free) {
				_character.spentXP--;
			}
		}
		modifyXP(0, 0);
		$('#' + id).removeClass("btn-danger").addClass("btn-primary");
		_noXPLeftWarning.hide();
	} else {
		if (_character.spentXP < _character.availableXP) {
			if ($('#' + id).hasClass("level1")) {
				_character.level1.push(id);	
			} else if ($('#' + id).hasClass("level2")) {
				_character.level2.push(id);
			} else if ($('#' + id).hasClass("level3")) {
				_character.level3.push(id);
			} else if ($('#' + id).hasClass("level4")) {
				_character.level4.push(id);
			} else if ($('#' + id).hasClass("level5")) {
				_character.level5.push(id);
			} else {
				console.log("Skill button is missing a level, " + id);
			}
			_character.skills.push(id);
			var s = findById(_availableSkills, id);
			if (!s.free) {
				spendXP();
			}
			$('#' + id).removeClass("btn-primary").addClass("btn-danger");
			_noXPLeftWarning.hide();
		} else {
			_noXPLeftWarning.show();
		}
	}
	validatePreReqs();
	
}

function validatePreReqs() {
	for (var i = 0; i < _availableSkills.length; i++) {
		if (!checkPreReqs(_availableSkills[i])) {
			if ($('#' + _availableSkills[i].id).hasClass("btn-danger")) {
				toggleSkill(_availableSkills[i].id);
			}
			$('#' + _availableSkills[i].id).removeClass("btn-primary").addClass("btn-info");
		} else {
			if (!$('#' + _availableSkills[i].id).hasClass("btn-danger") && $('#' + _availableSkills[i].id).hasClass("btn-info")) {
				$('#' + _availableSkills[i].id).removeClass("btn-info").addClass("btn-primary");
			}
		}
	}
}

function allIndicesAre(val, arr) {
	var res = true;
	for (var i = 0; i < arr.length && res; i++) {
		if (arr[i] != val) {
			res = false;
		}
	}
	return res;
}

/* 
 * Helper to check if prereqs for a skill are satisfied
 */
function checkPreReqs(skill) {
	var result = true;
	if (skill.preReqs) {
		if (skill.preReqs.or) {
			result = false;
			for (var i = 0; i < skill.preReqs.or.length; i++) {
				if (_character.skills.indexOf(skill.preReqs.or[i]) >= 0) {
					result = true;
				}
			}
		} 
		if (skill.preReqs.and) {
			for (var i = 0; i < skill.preReqs.and.length; i++) {
				if (_character.skills.indexOf(skill.preReqs.and[i]) < 0) {
					result = false;
				}
			}
		}
		if (skill.preReqs.not) {
			for (var i = 0; i < skill.preReqs.not.length; i++) {
				if (_character.skills.indexOf(skill.preReqs.not[i]) >= 0) {
					result = false;
				}
			}
		}
	} else {
		result = true;
	}
	
	return result;
}

/*
 *	React to background change
 */
function updateBackground(e, backgroundNumber) {
	var id = e.target.value;
	
	var background = findById(data._backgrounds, id);

	var text = _bgText[backgroundNumber];

	if ((backgroundNumber == 1 && background == _character.background[2]) || (backgroundNumber == 2 && background == _character.background[1])) {
		text.html("");
		text.append("<strong>You already have this background.</strong><br><br>");
		_character.background[backgroundNumber] = undefined;
		return;
	}

	if (background.id == "bg_dabblerMage" || background.id == "bg_divinelyFavoured") {
		if (backgroundNumber == 1) {
			$("#chooseBackground2").hide();	
			_character.background[2] = "None";
		} else {
			$("#chooseBackground1").hide();
			_character.background[1] = "None";
		}
	} else {
		$("#chooseBackground1").show();
		$("#chooseBackground2").show();	
	}
	
	text.html("");
	text.append("<strong>" + background.name + "</strong><br><br>");
	text.append(background.description + "<br><br>");
	
	if (background.level1) {
		var powers = [];
		for (var i = 0; i < background.level1.length; i++) {
			powers.push(findById(data._skills, background.level1[i]));
		}
		text.append(prettyPrintPowers(powers, 1));
	}
	if (background.level2) {
		var powers = [];
		for (var i = 0; i < background.level2.length; i++) {
			powers.push(findById(data._skills, background.level2[i]));
		}
		text.append(prettyPrintPowers(powers, 2));
	}
	if (background.level3) {
		var powers = [];
		for (var i = 0; i < background.level3.length; i++) {
			powers.push(findById(data._skills, background.level3[i]));
		}
		text.append(prettyPrintPowers(powers, 3));
	}
	if (background.level4) {
		var powers = [];
		for (var i = 0; i < background.level4.length; i++) {
			powers.push(findById(data._skills, background.level4[i]));
		}
		text.append(prettyPrintPowers(powers, 4));
	}

	_character.background[backgroundNumber] = background;

	if (_character.background[1] != "None") {
		if (_character.background[2] != "None") {
			$("#backgroundsChosen").html(_character.background[1].name + " and " + _character.background[2].name);		
		} else {
			$("#backgroundsChosen").html(_character.background[1].name);		
		}
	} else {
		$("#backgroundsChosen").html(_character.background[2].name);
	}
	
	buildAvailableSkills();
}

/*
 *	Helper to find object in array
 */
function findById(arr, id) {
	var result = null;
	for (var i = 0; i < arr.length && result == null; i++) {
		result = arr[i].id == id ? arr[i] : null;
	}
	return result;
}

/*
 *	Helper to print powers
 */
function prettyPrintPowers(powers, level) {
	var result = "";
	if (powers.length == 0) {
		return result;
	}
	result += "<strong>Level " + level + "</strong><br><br>";
	result += "<ul>";
	for (var i = 0; i < powers.length; i++) {
		var power = powers[i];
		result += "<li>";
		result += power.name;
		result += "</li>";
		// var power = powers[i];
		// result += "<strong>" + power.name + "</strong><br>";
		// result += power.description;
		// result += "<br><br>";
	}
	result += "</ul>";
	return result;
}

/*
 *	Helper to print skill
 */
function prettyPrintSkill(skill) {
	var result = "";
	result += "<strong>" + skill.name + "</strong><br><br>";
	result += skill.description;
	if (skill.preReqs) {
		result += "<br><br>";
		result += "<i><strong>Prerequisites:  </strong>";
		if (skill.preReqs.and) {
			for (var i = 0; i < skill.preReqs.and.length; i++) {
				var s = findById(data._skills, skill.preReqs.and[i]);
				if (s == null) {break;}
				result += s.name;
				if (i < skill.preReqs.and.length - 1) {
					result += " <strong>and</strong> ";
				}
			}
		} else if (skill.preReqs.or) {
			for (var i = 0; i < skill.preReqs.or.length; i++) {
				var s = findById(data._skills, skill.preReqs.or[i]);
				if (s == null) {break;}
				result += s.name;
				if (i < skill.preReqs.or.length - 1) {
					result += " <strong>or</strong> ";
				}
			}
		} else if (skill.preReqs.not) {
			for (var i = 0; i < skill.preReqs.not.length; i++) {
				var s = findById(data._skills, skill.preReqs.not[i]);
				if (s == null) {break;}
				result += "<strong>not</strong> " + s.name;
				if (i < skill.preReqs.not.length - 1) {
					result += " and ";
				}
			}
		} else {
			result += "None";
		}
		result += "</i>";
	}
	if (skill.freeMiracle) {
		result += "<br><br><strong>Free Miracle of Level " + skill.freeMiracle + "</strong> to use once per encounter";
	}
	if (skill.free) {
		result += "<br><br><strong>Free!</strong>";
	}
	

	return result;
}

/*
 *	Helper to construct a button for a skill
 */
function makeSkillButton(skill, level, type) {
	var result = "";
	result += "<button id='" + skill.id + "' ";
	result += "class='skill btn btn-primary btn-block level" + level + "'"
	result += ">";
	if (skill.free) {
		result += "<strong><em>";
	}
	if (type && type == "spell") {
		result += "Spell: ";
	} else if (skill.miracle) {
		result += "Miracle: ";
	}
	result += skill.name;
	if (skill.free) {
		result += "</em></strong>";
	}
	

	return result;
}

/*
 *	Function to build a blank character model
 */

function prepareCharacter() {
	_character = new Object();
	_character.name = "Unnamed Character";
	_character.player = "Unnamed Player";
	_character.characterClass = "None";
	_character.background = [undefined, "None", "None"];
	_character.spentXP = 0;
	_character.availableXP = 7;
	_character.primaryRite = "None";
	_character.secondaryRite = "None";
	_character.skills = [];
	_character.level1 = [];
	_character.level2 = [];
	_character.level3 = [];
	_character.level4 = [];
	_character.level5 = [];
	_character.bio = "No bio";
	_character.traitorPretence = "None";
	_character.hits = 5;
	_character.armour = 2;
	_character.skillFocus = "None";
	_character.combatPath = new Object();
	_character.freeMiraclesLeft = [0, 0, 0, 0, 0, 0];
}

/*
 *	Function to pretty print a character
 */
function prettyPrintCharacter() {
	var result = "";
	result += "<h1>" + _character.name + "</h1>";
	result += "<p><strong>Player: </strong>" + _character.player + "</p>";
	result += "<h2>Background/Bio</h2>";
	result += "<p>" + _character.bio + "</p>";
	
	result += "<h2>Stats</h2>";

	result += "<p><strong>Class:</strong> ";
	result += _character.characterClass == "None" ? "TBC" : _character.characterClass.name;
	result += "</p>";
	if (_character.characterClass.id == "class_journeyman") {
		result += "<p><strong>Skill Focus: </strong>";
		var sf = findById(data._skills, _character.skillFocus);
		result += _character.skillFocus == "None" ? "TBC" : sf.name;
		result += "</p>";
	}
	if (_character.characterClass.id == "class_mage") {
		result += "<p><strong>Primary Rite:</strong> ";
		result += _character.primaryRite == "None" ? "TBC" : data._rites[_character.primaryRite].name;
		result += "</p>";
		result += "<p><strong>Secondary Rite:</strong> ";
		result += _character.secondaryRite == "None" ? "TBC" : data._rites[_character.secondaryRite].name;
		result += "</p>";
	}

	result += "<p><strong>Background #1:</strong> ";
	result += _character.background[1] == "None" ? "None" : _character.background[1].name;
	result += "</p>";
	result += "<p><strong>Background #2:</strong> ";
	result += _character.background[2] == "None" ? "None" : _character.background[2].name;
	result += "</p>";

	result += "<h3>Skills</h3>";
	if (_character.level1.length > 0) {
		result += "<strong>Level 1</strong>" + prettyListLevelSkills(_character.level1);
		if (_character.level2.length > 0) {
			result += "<strong>Level 2</strong>" + prettyListLevelSkills(_character.level2);
			if (_character.level3.length > 0) {
				result += "<strong>Level 3</strong>" + prettyListLevelSkills(_character.level3);
				if (_character.level4.length > 0) {
					result += "<strong>Level 4</strong>" + prettyListLevelSkills(_character.level4);
					if (_character.level5.length > 0) {
						result += "<strong>Level 5</strong>" + prettyListLevelSkills(_character.level5);
					}
				}
			}
		}
	} else {
		result += "None yet :(";
	}

	result += "<p><strong>Experience: </strong>" + _character.spentXP + "/" + _character.availableXP + "</p>";

	result += "<h3>Combat</h3>";
	result += "<p><strong>Body Hits: </strong>" + _character.hits + "</p>";
	result += "<p><strong>Armour Hits: </strong>" + _character.armour + "</p>";

	return result;
}

function prettyListLevelSkills(arr) {
	var result = "<ul>";
	for (var i = 0; i < arr.length; i++) {
		result += "<li>" + findById(data._skills, arr[i]).name + "</li>";
	}
	result += "</ul>";
	return result;
}

/*
 *	Functions for adding or removing XP
 */

function incXP() {
	modifyXP(1, 0);
}

function remXP() {
	modifyXP(-1, 0);
}

function modifyXP(available, spent) {
	_character.availableXP += available;
	_character.spentXP += spent;

	_character.availableXP = Math.max(_character.availableXP, 7);
	_character.availableXP = Math.min(_character.availableXP, _maxXP);

	_character.spentXP = Math.max(_character.spentXP, 0);
	if (_character.spentXP > _character.availableXP) {
		_noXPLeftWarning.show();
		_character.spentXP = Math.min(_character.spentXP, _character.availableXP);
	} else {
		_noXPLeftWarning.hide();
	}
	
	$("#pointsSpent").html(_character.spentXP + "/" + _character.availableXP);
	$("#addXP").prop("disabled", _character.availableXP == _maxXP);
	$("#remXP").prop("disabled", _character.availableXP == 7);

	if (_character.level1.length >= 5) {
		_lvl2SkillDiv.show();
		_skillDescription.removeClass("col-md-9").addClass("col-md-6");
	} else {
		_lvl2SkillDiv.hide();
		_skillDescription.removeClass("col-md-6").addClass("col-md-9");
	}
	if (_character.level1.length + _character.level2.length >= 11) {
		_lvl3SkillDiv.show();
		_skillDescription.removeClass("col-md-6").addClass("col-md-3");
	} else {
		_lvl3SkillDiv.hide();
		_skillDescription.removeClass("col-md-3").addClass("col-md-6");
	}
	if (_character.level1.length + _character.level2.length + _character.level3.length >= 17) {
		_lvl4SkillDiv.show();
	} else {
		_lvl4SkillDiv.hide();
	}
	if (_character.level1.length + _character.level2.length + _character.level3.length + _character.level4.length >= 24) {
		_lvl5SkillDiv.show();
	} else {
		_lvl5SkillDiv.hide();
	}
}

function spendXP() {
	modifyXP(0, 1);
}

function unspendXP() {
	modifyXP(0, -1);
}