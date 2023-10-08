<?php 
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
   $inData = getRequestInfo();
   
   
   
   $name = $inData["name"];
   $number = $inData["number"];
   $email = $inData["email"];
   $id = $inData["userId"];

   //connecting to the database
   $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
   if( $conn->connect_error )
   {
       returnWithError( $conn->connect_error );
   }
   else
   {
       $stmt = $conn->prepare("insert into Contacts (Name, Phone, UserID, Email) values(?,?,?,?)");
        $stmt->bind_param("ssis", $name, $number, $id, $email);
        $stmt->execute();
        $result = $stmt->get_result();
       $stmt->close();
       $conn->close(); 
   }


   function getRequestInfo()
   {
       return json_decode(file_get_contents('php://input'), true);
   }

   function sendResultInfoAsJson( $result )
	{
		$retValue = '{"result":' . $result . '}';
		sendResultInfoAsJson( $retValue );
	}

   function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
	}

    // added returnWithInfo with 5 values: $firstName, $lastName, $login, $password, $id
    function returnWithInfo( $firstName, $lastName, $id, $name, $number)
	{
        $retValue = '{"id":' . $id . ',"firstName":"' . $name . '","number":"' . $number . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>