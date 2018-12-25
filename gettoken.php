<?php
ini_set('display_errors','On');
error_reporting('E_ALL');
require __DIR__ . '/vendor/autoload.php';

if(@$_GET['authcode']){
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

  $authCode = $_GET['authcode'];

  // Exchange authorization code for an access token.
  $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
  $client->setAccessToken($accessToken);

  // Check to see if there was an error.
  if (array_key_exists('error', $accessToken)) {
      throw new Exception(join(', ', $accessToken));
      echo 'error';
  }

// Save the token to a file.
if (!file_exists(dirname($tokenPath))) {
    mkdir(dirname($tokenPath), 0700, true);
}
if(file_put_contents($tokenPath, json_encode($client->getAccessToken())))
    echo ' ok! ';
else echo ' write error ';

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
            $authUrl = $client->createAuthUrl();
            echo "<a href=$authUrl target=_blank> $authUrl</a>
            <form><input name=authcode><input type=submit></form>
            ";
          exit(' enter code');
        }
        // Save the token to a file.
        }
    return $client;
}



$client = getClient();
if($service = new Google_Service_Drive($client))
echo "token live";
