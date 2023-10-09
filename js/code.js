const urlBase = 'https://bchclub.club/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let editContactID = 0;


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("emailAddress").value;
	let password = document.getElementById("loginPassword").value;

	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:hash};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				localStorage.setItem("clientId", userId);

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function toEdit(userId, contactId, contactName, contactPhone, contactEmail)
{
	localStorage.setItem("userId", userId);
	localStorage.setItem("contactId", contactId);
	localStorage.setItem("nameValue", contactName);
	localStorage.setItem("phoneValue", contactPhone);
	localStorage.setItem("emailValue", contactEmail);
	window.location.href ="editContact.html";
}

function loadEdit(){
	let userId = localStorage.getItem("userId");
	let contactId = localStorage.getItem("contactId");
	
	document.getElementById("Name").placeholder=localStorage.getItem("nameValue");
	document.getElementById("phone").placeholder=localStorage.getItem("phoneValue");
	document.getElementById("email").placeholder=localStorage.getItem("emailValue");
	document.getElementById("Name").value=localStorage.getItem("nameValue");
	document.getElementById("phone").value=localStorage.getItem("phoneValue");
	document.getElementById("email").value=localStorage.getItem("emailValue");
	
	document.getElementById("createAccount").setAttribute("onclick", "updateContact("+userId+", "+contactId+");");

}

function doSignUp()
{
	userId = 0;
	username = "";
	firstName ="";
	lastName="";

	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	let login = document.getElementById("userName").value;
	let password = document.getElementById("loginPassword").value;

	if(login == "" || password == "" || firstName == "" || lastName == "")
	{
		document.getElementById("signupResult").innerHTML ="Fill in all SignUp information";
		document.getElementById("signupResult").style.display = "block";
		return;
	}

	var hash = md5( password );
	
	let tmp = {login:login, password:hash, firstName:firstName, lastName:lastName};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/SignUp.' + extension; 

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
		
				if( userId > 1 )
				{		
					document.getElementById("signupResult").innerHTML = "Username already taken";
					document.getElementById("signupResult").style.display = "block";
					
				}
				else{
					document.getElementById("signupResult").innerHTML = "Succesfully created account";
					document.getElementById("signupResult").style.display = "block";
					window.location.href = "/index.html"; 
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
	}
}

function deleteContact(contactId)
{	
	let tmp ={contact:contactId, userId:userId};

	let jsonPayload = JSON.stringify( tmp );

	let xhr = new XMLHttpRequest();
	let url = urlBase + '/DeleteContact.' + extension;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				let boolean = jsonObject.result;

				if( boolean == "true")
				{		
					document.getElementById("CRUDresult").innerHTML = "User was successfully Deleted!";
					window.location.href = "contacts.html";
				}

				else
				{
					document.getElementById("CRUDresult").innerHTML = "Could not find and delete contact.";
				}
			}
		};
		xhr.send(jsonPayload);
		window.location.reload();
	}
	catch(err)
	{
		document.getElementById("CRUDResult").innerHTML = err.message;
	}
}

function addContact()
{	
	let name = document.getElementById("NewName").value;
	let number = document.getElementById("NewPhone").value;
	let email = document.getElementById("NewEmail").value;
	var userId = localStorage.getItem("clientId");
	let tmp ={name:name, number:number, email:email, userId:userId};
	
	let jsonPayload = JSON.stringify( tmp );
	
	let xhr = new XMLHttpRequest();
	let url = urlBase + '/AddContact.' + extension;
	
	xhr.open("POST", url, true);
	
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("CRUDresult").innerHTML = "Succesfully created contact";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("CRUDresult").innerHTML = err.message;
	}

	window.location.href = "contacts.html";

}

function updateContact(userId, contactId)
{
	let name = document.getElementById("Name").value;
	let number = document.getElementById("phone").value;
	let email = document.getElementById("email").value;
	var userId = localStorage.getItem("clientId");
	
	let tmp ={name:name, number:number, email:email, contactId:contactId, userId:userId};
	let url = urlBase + '/UpdateContact.' + extension;
	let jsonPayload = JSON.stringify( tmp );

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("CRUDrResult").innerHTML = "Succesfully updated contact";
				window.location.href = "/contacts.html";
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("CRUDResult").innerHTML = err.message;
	}

	window.location.href = "contacts.html";
}

function displayContacts()
{
	let xhr = new XMLHttpRequest();
	let url = urlBase + '/DisplayContact.' + extension;
	let tmp = {userId:userId}
	let jsonPayload = JSON.stringify( tmp );
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	let idvalue ="";
	let contactName = "";
	let contactPhone = "";
	let contactEmail = "";
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{		
				myObj = JSON.parse( xhr.responseText );

				let text = "<table class = 'no-border-table'>"
				text+= "<thead>"
				text += "<tr><th style='text-align: center'>Name</th>"
				text += "<th style='text-align: center'>Phone</th>"
				text += "<th style='text-align: center'>Email</th>"
				text += "<th style='text-align: center'>Date Added</th></tr>"
				text +="</thead>"

				if(myObj.error == "No Records Found")
				{
					document.getElementById("contactList").innerHTML= text;
				}

				else
				{
					for(x=0; x< myObj.results.length;x++)
					{
						idvalue = myObj.results[x].ID.toString();
						userValue = myObj.results[x].UserID.toString();
						contactName = myObj.results[x].Name.toString();
						
						contactPhone = myObj.results[x].Phone;
						contactEmail = myObj.results[x].Email;

						text += "<tr class='contact'><td style='text-align: center'>"+ myObj.results[x].Name +"</td>"
						text += "<td style='text-align: center'>" + myObj.results[x].Phone + "</td>"
						text += "<td style='text-align: center'>" + myObj.results[x].Email + "</td>"
						text += "<td style='text-align: center'>" + myObj.results[x].DateCreated + "</td>"
						text += " <td><button class='icon' onclick='toEdit("+userValue+", "+idvalue+", \""+contactName+"\",\""+contactPhone+"\",\""+contactEmail+"\");' id='edit-button'><img src='images/editing.png' class='img-resize'/></button>"
						text += "<button class='icon' onclick='deleteContact("+ idvalue +");' id='delete-button' style='padding-left: 25px;'><img src='images/delete.png' class='img-resize'/></button></td></tr>"
					}

					text += "</table>"
					document.getElementById("contactList").innerHTML= text;
				}
					
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("SearchResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	let search = document.getElementById("contactSearchBar").value;
	let tmp ={search:search,userId:userId};

	let jsonPayload = JSON.stringify( tmp );

	let searchIdvalue = ""
 	
	let xhr = new XMLHttpRequest();
	let url = urlBase + '/SearchContact.' + extension;

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	let text = "<table class = 'no-border-table'>"
			text+= "<thead>"
			text += "<tr><th style='text-align: center'>Name</th>"
			text += "<th style='text-align: center'>Phone</th>"
			text += "<th style='text-align: center'>Email</th>"
			text += "<th style='text-align: center'>Date Added</th></tr>"
			text +="</thead>"

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				myObj = JSON.parse( xhr.responseText );

				if(myObj.error =="No Records Found")
				{
					document.getElementById("SearchResult").innerHTML = "No Contacts Found";
					document.getElementById("contactList").innerHTML= text;
				}

				else
				{

					for(x=0; x< myObj.results.length;x++)
					{
						searchIdvalue= myObj.results[x].ID.toString();
						userValue = myObj.results[x].UserID.toString();
						let contactName = myObj.results[x].Name;
						let contactPhone = myObj.results[x].Phone;
						let contactEmail = myObj.results[x].Email;

						text += "<tr class='contact'><td style='text-align: center'>"+ myObj.results[x].Name +"</td>"
			 			text += "<td style='text-align: center'>" + myObj.results[x].Phone + "</td>"
			 			text += "<td style='text-align: center'>" + myObj.results[x].Email + "</td>"
			 			text += "<td style='text-align: center'>" + myObj.results[x].DateCreated + "</td>"
			 			text += " <td><button class='icon' onclick='toEdit("+userValue+","+ searchIdvalue +",\""+contactName+"\",\""+contactPhone+"\",\""+contactEmail+"\");' id='edit-button'><img src='images/editing.png' class='img-resize'/></button>"
			 			text += "<button class='icon' onclick='deleteContact("+searchIdvalue+");' id='delete-button' style ='padding-left: 25px;'><img src='images/delete.png' class='img-resize'/></button></td></tr>"
			 
	 				}

	 				text += "</table>"

					if(text != "undefined")
					{
						document.getElementById("SearchResult").innerHTML = "Contacts has been retrieved";
						document.getElementById("contactList").innerHTML= text;
					}

				}
	 	
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("SearchResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "/index.html";
}
