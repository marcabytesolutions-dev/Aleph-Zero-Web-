$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$sourceIcons = Join-Path $projectRoot 'referencias\recursos-estilo-4\recursos-extraidos-estilo-4\iconos'
$targetIcons = Join-Path $projectRoot 'codigo\public\assets\icons'

New-Item -ItemType Directory -Force -Path $targetIcons | Out-Null

foreach ($file in Get-ChildItem -LiteralPath $sourceIcons -Filter '*.png') {
  $source = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    $canvas = New-Object System.Drawing.Bitmap 128, 128
    $canvas.SetResolution(96, 96)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    try {
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $ratio = [Math]::Min(112 / $source.Width, 112 / $source.Height)
      $width = [Math]::Max(1, [int]($source.Width * $ratio))
      $height = [Math]::Max(1, [int]($source.Height * $ratio))
      $x = [int]((128 - $width) / 2)
      $y = [int]((128 - $height) / 2)
      $graphics.DrawImage($source, $x, $y, $width, $height)
      $canvas.Save((Join-Path $targetIcons $file.Name), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $graphics.Dispose()
      $canvas.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

Write-Output 'Assets optimizados: iconos de interfaz a 128 px. Las portadas originales no se modifican.'
