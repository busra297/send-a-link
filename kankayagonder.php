<?php
$myname = $_POST['myname'];
$myemail = $_POST['myemail'];
$url = $_POST['url'];
$todata = $_POST['todata'];

$kimlere = array();
foreach ($todata as $item) {
    $kimlere[] = $item['eposta'];
}

$to = implode(',', $kimlere);

$subject = $myname . " kankandan sana bir link tavsiyesi";

$message = "
<html>
<head>
<title>$subject</title>
</head>
<body>
<p>Kanka şu linki seninle paylaşıyorum:</p>
<br>
<p><a href='$url'>$url</a></p>
<br>
<p>$myname</p>
</body>
</html>
";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: <' . $myemail . '>' . "\r\n";

mail($to, $subject, $message, $headers);