// var suspects = ["s0","s1","s2","s3","s4","s5","s6","s7","s8"];
// var weapons = ["w0","w1","w2","w3","w4","w5","w6","w7","w8"];
// var rooms = ["r0","r1","r2","r3","r4","r5","r6","r7","r8"];
// Application assumes that the arrays' length will be multiples of 3
// Just paste in arrays with these variable names

var suspects = ["Mrs. Peacock","Mrs. Green","Miss Scarlet","Colonel Mustard","Professor Plum","Mr. Doe"];
var weapons = ["Pistol","Knife","Wrench","Lead Pipe","Candlestick","Brass Knuckles"];
var rooms = ["Kitchen","Study","Living Room","Dining Room","Library","Den"];

var randomSuspects;
var randomWeapons;
var randomRooms;
var solutionSuspect;
var solutionWeapon;
var solutionRoom;
var compSuspects;
var userSuspects;
var compWeapons;
var userWeapons;
var compRooms;
var userRooms;
var playerName;
sessionStorage.setItem("history", "");

init();

// All the page setup stuff, called each time new game is started
function init()
{
	if(localStorage.getItem("userWins") == null){localStorage.setItem("userWins", 0);}
	if(localStorage.getItem("userLosses") == null){localStorage.setItem("userLosses", 0);}
	if(localStorage.getItem("computerWins") == null){localStorage.setItem("computerWins", 0);}
	if(localStorage.getItem("computerLosses") == null){localStorage.setItem("computerLosses", 0);}
	if(localStorage.getItem("winLossHist") == null){localStorage.setItem("winLossHist", "");}
	// After I did a little more of the assignment, i realized there are much better
	// ways to populate than how I'm doing below.
	var susElem = document.getElementById("suspects");
	susElem.innerHTML = "Suspects<br/>";
	for(var i in suspects)
	{
		susElem.innerHTML += suspects[i] + " ";
	}
	var weaElem= document.getElementById("weapons");
	weaElem.innerHTML = "Weapons<br/>";
	for(var i in weapons)
	{
		weaElem.innerHTML += weapons[i] + " ";
	}
	var roomElem = document.getElementById("rooms");
	roomElem.innerHTML = "Rooms<br/>";
	for(var i in rooms)
	{
		roomElem.innerHTML += rooms[i] + " ";
	}

	// make deep copies to leave original lists unchanged
	randomSuspects = suspects.slice(0);
	shuffle(randomSuspects);

	randomWeapons = weapons.slice(0);
	shuffle(randomWeapons);

	randomRooms = rooms.slice(0);
	shuffle(randomRooms);

	// If you want to see the winning hand, just look at the console and use the last element
	// in each array
	console.log(randomSuspects);
	console.log(randomWeapons);
	console.log(randomRooms);

	// Since the array is randomized, just take the last element and then make the array shorter
	solutionSuspect = randomSuspects[randomSuspects.length-1];
	solutionWeapon = randomWeapons[randomWeapons.length-1];
	solutionRoom = randomRooms[randomRooms.length-1]; 

	// console.log(solutionSuspect);
	// console.log(solutionWeapon);
	// console.log(solutionRoom);

	randomSuspects.length -= 1;
	randomWeapons.length -= 1;
	randomRooms.length -= 1;

	// Deal the random cards out
	compSuspects = randomSuspects.slice(1,(suspects.length)/2+1);
	userSuspects = randomSuspects.slice((suspects.length)/2);

	compWeapons = randomWeapons.slice(1,(weapons.length)/2+1);
	userWeapons = randomWeapons.slice((weapons.length)/2);

	compRooms = randomRooms.slice(1,(rooms.length)/2+1);
	userRooms = randomRooms.slice((rooms.length)/2);
}


function shuffle(paramArray)
{ 
	// Kind nice javascript lets you do this...
    for(var j, x, i = paramArray.length; i; j = Math.floor(Math.random() * i), x = paramArray[--i], paramArray[i] = paramArray[j], paramArray[j] = x);
    return paramArray;
};

function nameEntered(name)
{
	playerName = document.getElementById("name").value;
	document.getElementById("greeting").innerHTML = "Welcome, " + playerName + ". Your cards are shown below";
}

function disableSubmit(elem)
{
	elem.disabled = true;
	document.getElementById("name").disabled = true;
}

function showCards()
{
	var myCards = document.getElementById("myCards");
	myCards.innerHTML = "My Suspects <font color=\"red\">" + userSuspects + "<br/>" + 
		"</font>My Weapons <font color=\"blue\">" + userWeapons + "<br/>" + 
		"</font>My Rooms <font color=\"green\">" + userRooms + 
		"<br/></font>";
}

function displayTurn()
{
	var space = document.getElementById("turnSpace");
	space.innerHTML = "<h3>Make your choice!</h3>";

	var turnString = "<form>";
	turnString += makePicklist(suspects, "Suspect") + "<br/>";
	turnString += makePicklist(weapons, "Weapon") + "<br/>";
	turnString += makePicklist(rooms, "Room") + "<br/>";
	turnString += "<input type=\"Button\" value=\"Choose\" onClick=\"choiceMade()\"/>";
	turnString += "</form>";

	space.innerHTML += turnString;
}

// helper
function makePicklist(type, label)
{
	innerHTMLString = label + ": <select id=\"" + label + "List\">";
	// length assume all are same length
	for(var i = 0; i < type.length; i++)
	{
		innerHTMLString += "<option value=\"" + type[i] + "\">" + type[i] + "</option>"
	}
	innerHTMLString += "</select>";

	return innerHTMLString;
}

// handle user move
function choiceMade(sus, weps, rooms)
{
	var space = document.getElementById("turnSpace");
	var turnString = "<h3>You made your choice.</h3>";
	var suspectValue = document.getElementById("SuspectList").value;
	var weaponValue = document.getElementById("WeaponList").value;
	var roomValue = document.getElementById("RoomList").value;
	var won = false;

	turnString += "Suspect: <font color=\"red\">" + suspectValue +
				  "</font><br/>Weapon: </font><font color=\"blue\">" + weaponValue +
				  "</font><br/>Room: <font color=\"green\">" + roomValue + "</font>";

	if(suspectValue === solutionSuspect && weaponValue === solutionWeapon && roomValue === solutionRoom)
	{
		won = true;
	}
	if(won)
	{
		turnString += "<h3>You won! Click \"Continue\" to shuffle and play again.</h3>";
		turnString += "<input type=\"Button\" value=\"Continue\" onClick=\"init(); showCards(); displayTurn()\"/>";
		userWin();
		computerLoss();
	}
	else
	{
		var choiceArray = [suspectValue, weaponValue, roomValue];
		// Get one of the wrong choices at random
		var randIncorrectChoice;
		do
		{
			randIncorrectChoice = choiceArray[getRandomNumber(0, 3)];
		}while(randIncorrectChoice === solutionSuspect || 
				randIncorrectChoice === solutionWeapon ||
				randIncorrectChoice === solutionRoom);
		// Store it for the history
		turnString += "<h3>Incorrect choice.</h3>";
		turnString += "One of your incorrect choices: " + randIncorrectChoice;
		turnString += "<br/><input type=\"Button\" value=\"Computer Turn\" onClick=\"computerTurn()\"/>";
	}
	addToHistory("User", [suspectValue, weaponValue, roomValue]);
	space.innerHTML = turnString;
}

// handle computer move
function computerTurn()
{
	var space = document.getElementById("turnSpace");
	var turnString = "<h3>Computer Turn.</h3>";

	var computerChoices = getComputerChoices();
	if(computerChoices[0] === solutionSuspect && computerChoices[1] === solutionWeapon && 
		computerChoices[2] === solutionRoom)
	{
		turnString += "COMPUTER WINS" +
					  "<br/><input type=\"Button\" value=\"Play Again\" onClick=\"location.reload(true)\"/>";
		computerWin();
		userLoss();
	}
	else
	{
		turnString += "Incorrect guess:<br/>" +
					  "<font color=\"red\">" + computerChoices[0] + "</font></br>" +
				      "<font color=\"blue\">" + computerChoices[1] + "</font></br>" +
				      "<font color=\"green\">" + computerChoices[2] + "</font></br>" +
				      "<input type=\"Button\" value=\"Continue\" onClick=\"displayTurn()\"/>";
	}
	addToHistory("Computer", computerChoices);
	space.innerHTML = turnString;

}

function getComputerChoices()
{
	var choiceArray;
	// Make sure they aren't computer's cards
	do
	{
		choiceArray= [suspects[getRandomNumber(0, suspects.length)], 
					   weapons[getRandomNumber(0, weapons.length)],
					   rooms[getRandomNumber(0, rooms.length)]];
	} 
	while(existsIn(choiceArray[0], compSuspects) || 
		  existsIn(choiceArray[1], compWeapons) ||
		  existsIn(choiceArray[2], compRooms));
	console.log("Comp Choices: " + choiceArray);
	return choiceArray;
}

// This is the function used to make sure the computer doesn't guess its own cards
function existsIn(item, arr)
{
	var exists = arr.some(function(element)
						  {
						      return element === item;
						  });
	return exists;
}

// 0 through parameter - helper
function getRandomNumber(min, max)
{
	var rand = Math.floor(Math.random() * (max - min)) + min;
	console.log("Random: " + rand);
	return rand;
}

function addToHistory(who, choiceArray)
{
	sessionStorage.setItem("history", sessionStorage.getItem("history") + 
							who + "-> " + choiceArray[0] + " " + choiceArray[1] + 
							" " + choiceArray[2] + ":");
}

function showHideHistory()
{
	var space = document.getElementById("historySpace");
	var button = document.getElementById("historyToggle");
	var innerHTMLString = "";
	
	if(button.value === "Show History")// History is not currently shown
	{
		button.value = "Hide History";
		var parseStringArray = sessionStorage.getItem("history").split(":");
		for(var i = 0; i < parseStringArray.length; i++)
		{
			innerHTMLString += parseStringArray[i] + "<br/>";
		}	
		space.innerHTML = innerHTMLString;
	}
	else
	{
		button.value = "Show History";
		space.innerHTML = "";
	}
}

function showHideRecord()
{
	var space = document.getElementById("recordSpace");
	var button = document.getElementById("recordToggle");
	var innerHTMLString = "";

	if(button.value === "Show Record")
	{
		button.value = "Hide Record";
		innerHTMLString = "Computer W-L: " + localStorage.getItem("computerWins") + "-" + localStorage.getItem("computerLosses") + "<br/>";
		var parseStringArray = localStorage.getItem("winLossHist").split(":");
		for(var i = 0; i < parseStringArray.length; i++)
		{
			innerHTMLString += parseStringArray[i] + "<br/>";
		}
		space.innerHTML = innerHTMLString;
	}
	else
	{
		button.value = "Show Record";
		space.innerHTML = "";
	}
}

function computerWin()
{
	localStorage.setItem("computerWins", parseInt(localStorage.getItem("computerWins")) + 1);
	var today = new Date();
	localStorage.setItem("winLossHist", localStorage.getItem("winLossHist") + "Opponent-> " + playerName + "<br/>" + "Date-> " + today.getMonth() + "-" + today.getDate() + "<br/>Winner-> Computer<br/>:");
}
function computerLoss()
{
	localStorage.setItem("computerLosses", parseInt(localStorage.getItem("computerLosses")) + 1);
	var today = new Date();
	localStorage.setItem("winLossHist", localStorage.getItem("winLossHist") + "Opponent-> " + playerName + "<br/>" + "Date-> " + today.getMonth() + "-" + today.getDate() + "<br/>Winner-> " + playerName + "<br/>:");
}
function userWin()
{
	localStorage.setItem("userWins", parseInt(localStorage.getItem("userWins")) + 1);
}
function userWin()
{
	localStorage.setItem("userLosses", parseInt(localStorage.getItem("userLosses")) + 1);
}

