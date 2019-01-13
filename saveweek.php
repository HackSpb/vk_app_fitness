<?php
require __DIR__ . '/vendor/autoload.php';

function translit($s) {
  $s = (string) $s; // преобразуем в строковое значение
  $s = strip_tags($s); // убираем HTML-теги
  $s = str_replace(array("\n", "\r"), " ", $s); // убираем перевод каретки
  $s = preg_replace("/\s+/", ' ', $s); // удаляем повторяющие пробелы
  $s = trim($s); // убираем пробелы в начале и конце строки
  $s = function_exists('mb_strtolower') ? mb_strtolower($s) : strtolower($s); // переводим строку в нижний регистр (иногда надо задать локаль)
  $s = strtr($s, array('а'=>'a','б'=>'b','в'=>'v','г'=>'g','д'=>'d','е'=>'e','ё'=>'e','ж'=>'j','з'=>'z','и'=>'i','й'=>'y','к'=>'k','л'=>'l','м'=>'m','н'=>'n','о'=>'o','п'=>'p','р'=>'r','с'=>'s','т'=>'t','у'=>'u','ф'=>'f','х'=>'h','ц'=>'c','ч'=>'ch','ш'=>'sh','щ'=>'shch','ы'=>'y','э'=>'e','ю'=>'yu','я'=>'ya','ъ'=>'','ь'=>''));
  $s = preg_replace("/[^0-9a-z-_ ]/i", "", $s); // очищаем строку от недопустимых символов
  $s = str_replace(" ", "-", $s); // заменяем пробелы знаком минус
  return $s; // возвращаем результат
}

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






/**********************************/



if($_POST['json'])
{
  $postData=json_decode($_POST['json'] , $assoc = TRUE );
  $valuesTemp=array(array_keys($postData),array_values($postData));

  $valuesIn=array(array(
    (isset($postData['averageWeight']))? (float)$postData['averageWeight'] :' ',
    (isset($postData['minWeight']))? (float)$postData['minWeight'] :' ',
    (isset($postData['girthNeck']))? (float)$postData['girthNeck'] :' ',
    (isset($postData['girthWaist']))? (float)$postData['girthWaist'] :' ',
    (isset($postData['girthHits']))? (float)$postData['girthHits'] :'',
    (isset($postData['averageStep']))? (int)$postData['averageStep'] :' ',
    (isset($postData['rateTrainings']))? (int)$postData['rateTrainings'] :' ',
    (isset($postData['rateNutrition']))? (int)$postData['rateNutrition'] :' ',
    (isset($postData['rateHunger']))? (int)$postData['rateHunger'] :' ',
    (isset($postData['menses']))? (bool)$postData['menses'] :' ',
    (isset($postData['foto']))? (bool)$postData['foto'] :' ',
    (isset($postData['comment']))? $postData['comment'] :' '
    )
  );
}

if(!$valuesIn or !$postData['id']) die("no data =(");

// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Drive($client);



// Print the names and IDs for up to 1 files.
$optParams = array(
  'pageSize' => 1,
  'fields' => 'nextPageToken, files(id, name)',
  'q' => 'name contains "vkid-'.$postData['id'].'"'
);
$results = $service->files->listFiles($optParams);

if (count($results->getFiles()) == 0) {
    print '{"error"=>"no result"}';
} else {

    foreach ($results->getFiles() as $file) {
        $serviceSheets = new Google_Service_Sheets($client);
        $spreadsheetId = $file->getId();

        //основные данные
        $range = 'L'.(6+$postData['weekNumber']).':W'.(6+$postData['weekNumber']);
        $requestBody = new Google_Service_Sheets_ValueRange([
            'range'=>$range,'majorDimension' => 'ROWS','values' => $valuesIn
        ]);
        $response = $serviceSheets->spreadsheets_values->update($spreadsheetId, $range, $requestBody,
            ['valueInputOption' => 'USER_ENTERED']);
      if($response['updatedCells']>2){
        $sheetLink = 'https://docs.google.com/spreadsheets/d/'.$spreadsheetId.'/edit#gid=0';
        $responce=array('succes'=>true, 'sheetLink'=>$sheetLink) ;
        echo json_encode($responce , JSON_UNESCAPED_UNICODE);

      }
       //планка
        $range = 'J'.(6+$postData['weekNumber']);
        $requestBody = new Google_Service_Sheets_ValueRange([
            'range'=>$range,'majorDimension' => 'ROWS','values' => array(array((float)$postData['caloriePlank']))
        ]);
        $response = $serviceSheets->spreadsheets_values->update($spreadsheetId, $range, $requestBody,
            ['valueInputOption' => 'USER_ENTERED']);


        break;
    }
}
