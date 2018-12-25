<?php
require __DIR__ . '/vendor/autoload.php';


/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient()
{
    $client = new Google_Client();
    $client->setApplicationName('Google Drive API PHP Quickstart');
    $client->setScopes(array('https://www.googleapis.com/auth/drive', "https://www.googleapis.com/auth/drive.file"));
    $client->setAuthConfig('credentials.json');
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');

    // Load previously authorized token from a file, if it exists.
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    $tokenPath = 'token.json';
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }

    // If there is no previous token or it's expired.
    if ($client->isAccessTokenExpired()) {
        // Refresh the token if possible, else fetch a new one.
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        } else {
            // Request authorization from the user.
            exit('{"error":"access error"}');
        }
        // Save the token to a file.
        if (!file_exists(dirname($tokenPath))) {
            mkdir(dirname($tokenPath), 0700, true);
        }
        file_put_contents($tokenPath, json_encode($client->getAccessToken()));
    }
    return $client;
}




/*************************************************/






if(!is_numeric(@$_GET['userID'])) die("{'error':'die - no input data'}");
$userID=$_GET['userID'];


// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Drive($client);




$optParams = array(
  'pageSize' => 1,
  'fields' => 'nextPageToken, files(id, name)',
  'q' => "name contains 'vkid-$userID'"
);
$results = $service->files->listFiles($optParams);

if (count($results->getFiles()) == 0) {
    echo json_encode(array('reg'=>FALSE , 'error' => 'no files') , JSON_UNESCAPED_UNICODE);
} else {

    foreach ($results->getFiles() as $file) {

          $serviceSheets = new Google_Service_Sheets($client);

          $spreadsheetId = $file->getId();



          $range = 'N6:N'. (6+15); /** диапазон измерений шеи*/
          $response = $serviceSheets->spreadsheets_values->get($spreadsheetId, $range);
          $values = $response->getValues();

          for($i=0;$i<=15;$i++)
          {
            if(@$values[$i][0]=="") break;
          }
          $lastWeek=$i;


          $range = 'I3'; /** диапазон измерений шеи*/
          $response = $serviceSheets->spreadsheets_values->get($spreadsheetId, $range);
          $values = $response->getValues();
          $sex=$values[0][0];


          $range = 'A1:D1'; /** данные пользователю*/
          $response = $serviceSheets->spreadsheets_values->get($spreadsheetId, $range);
          $values = $response->getValues();

          $sheetLink = 'https://docs.google.com/spreadsheets/d/'.$spreadsheetId.'/edit#gid=0';
          $responce=array('reg'=>true, 'sheetLink'=>$sheetLink, 'message2user'=>$values[0] , 'lastWeek' => $lastWeek, 'sex' => $sex) ;
          echo json_encode($responce , JSON_UNESCAPED_UNICODE);


          break;
    }
}
