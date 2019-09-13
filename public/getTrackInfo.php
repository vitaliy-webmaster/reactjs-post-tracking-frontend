<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

$isPost = (!empty($_POST)) ? true : false;
if ($isPost) {
	$guid = trim(filter_var($_POST["guid"], FILTER_SANITIZE_STRING));
	$barcode = trim(filter_var($_POST["barcode"], FILTER_SANITIZE_STRING));
	$culture = trim(filter_var($_POST["culture"], FILTER_SANITIZE_STRING));
	//echo $guid." \r\n".$barcode." \r\n".$culture;
	$client = new SoapClient('http://services.ukrposhta.ua/barcodestatistic/barcodestatistic.asmx?WSDL');
	$params = new stdClass();
	$params->guid = $guid;
	$params->barcode = $barcode;
	$params->culture = $culture;
	$result = $client->GetBarcodeInfo($params)->GetBarcodeInfoResult;
	// header('Content-Type: application/json');
	echo json_encode((array)$result);
}
?>