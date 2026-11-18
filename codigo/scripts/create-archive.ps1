$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$deliveryRoot=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..')).Path
if((Split-Path -Leaf $deliveryRoot) -ne 'Pagina Web'){throw 'Raíz de entrega inesperada'}
$archivePath=Join-Path $deliveryRoot 'Aleph-Zero-web-completa.zip'
if(Test-Path -LiteralPath $archivePath){throw 'El ZIP ya existe; no se sobrescribe automáticamente'}
$files=Get-ChildItem -LiteralPath $deliveryRoot -File -Recurse -Force | Where-Object {
  $relative=$_.FullName.Substring($deliveryRoot.Length+1).Replace('\','/')
  $relative -notmatch '^codigo/(node_modules|test-results)/' -and $relative -notmatch '\.zip$' -and $relative -ne 'VERIFICACION-ZIP.txt'
}
$archive=[IO.Compression.ZipFile]::Open($archivePath,[IO.Compression.ZipArchiveMode]::Create)
try{
  foreach($file in $files){
    $relative=$file.FullName.Substring($deliveryRoot.Length+1).Replace('\','/')
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,$file.FullName,$relative,[IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
}finally{$archive.Dispose()}
$archive=[IO.Compression.ZipFile]::OpenRead($archivePath)
try{
  foreach($entry in $archive.Entries){
    $filePath=Join-Path $deliveryRoot $entry.FullName
    if(-not $filePath.StartsWith($deliveryRoot+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Entrada fuera de raíz'}
    $stream=$entry.Open()
    try{$hash=[Security.Cryptography.SHA256]::Create();try{$inside=[Convert]::ToHexString($hash.ComputeHash($stream))}finally{$hash.Dispose()}}finally{$stream.Dispose()}
    $outside=(Get-FileHash -LiteralPath $filePath -Algorithm SHA256).Hash
    if($inside -ne $outside){throw "Archivo diferente en ZIP: $($entry.FullName)"}
  }
  foreach($required in @('index.html','ABRIR WEB.html','web/index.html','web/app.iife.js','web/styles.css','codigo/package.json','codigo/src/catalog.json')){
    if(-not $archive.GetEntry($required)){throw "Falta archivo esencial: $required"}
  }
  $count=$archive.Entries.Count
}finally{$archive.Dispose()}
$zipHash=(Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash
$result="ZIP comprobado: $count archivos; todos coinciden con los originales mediante SHA-256.`nArchivo: Aleph-Zero-web-completa.zip`nSHA-256: $zipHash`n"
Set-Content -LiteralPath (Join-Path $deliveryRoot 'VERIFICACION-ZIP.txt') -Value $result
Write-Output $result
