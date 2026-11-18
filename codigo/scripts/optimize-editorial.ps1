Add-Type -AssemblyName System.Drawing
$imageDir = Join-Path $PSScriptRoot '../public/images'
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
$parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85L)
foreach ($name in @('editorial','calzado','perfumes','mobile')) {
  $source = Join-Path $imageDir "hero-$name.png"
  $target = Join-Path $imageDir "hero-$name.jpg"
  $image = [System.Drawing.Image]::FromFile($source)
  try { $image.Save($target,$codec,$parameters) } finally { $image.Dispose() }
}
$parameters.Dispose()
