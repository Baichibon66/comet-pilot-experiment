<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function fail(int $code,string $msg): void {http_response_code($code);echo json_encode(['ok'=>false,'error'=>$msg],JSON_UNESCAPED_UNICODE);exit;}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405,'POST only');
if (($_SERVER['CONTENT_TYPE']??'') !== 'application/json') fail(415,'Content-Type must be application/json');
$length=(int)($_SERVER['CONTENT_LENGTH']??0);if($length<=0||$length>750000)fail(413,'Invalid payload size');
$raw=file_get_contents('php://input');if($raw===false||strlen($raw)>750000)fail(413,'Payload too large');
$data=json_decode($raw,true);if(!is_array($data))fail(400,'Invalid JSON');
$id=$data['session_id']??'';
if(!is_string($id)||!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i',$id))fail(400,'Invalid anonymous session ID');
$lang=$data['language']??'';if(!in_array($lang,['ja','zh'],true))fail(400,'Invalid language');
$seq=$data['sequence_id']??null;if(!is_int($seq)||$seq<1||$seq>4)fail(400,'Invalid sequence');
$records=$data['records']??null;if(!is_array($records)||count($records)>300||count($records)<60)fail(400,'Invalid records');
if(($data['complete']??false)!==true)fail(400,'Incomplete session');
if(!is_string($data['started_at']??null)||!is_string($data['ended_at']??null))fail(400,'Missing dates');
$configFile=__DIR__.'/config.private.php';if(!is_file($configFile))fail(503,'Server database not configured');
try{
 $config=require $configFile;
 $pdo=new PDO($config['dsn'],$config['user'],$config['password'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false]);
 // Idempotent retry: same session ID never creates two rows; no overwrite from unauthenticated requests.
 $stmt=$pdo->prepare('INSERT IGNORE INTO comet_sessions (session_id,experiment_version,language,sequence_id,started_at,ended_at,complete,payload) VALUES (:id,:version,:lang,:sequence,:start,:end,:complete,:payload)');
 $stmt->execute([':id'=>$id,':version'=>(string)($data['version']??''),':lang'=>$lang,':sequence'=>$seq,':start'=>$data['started_at'],':end'=>$data['ended_at'],':complete'=>1,':payload'=>$raw]);
 http_response_code(200);echo json_encode(['ok'=>true,'inserted'=>$stmt->rowCount()===1]);
}catch(Throwable $e){error_log('comet save failed: '.$e->getMessage());fail(500,'Database save failed');}
