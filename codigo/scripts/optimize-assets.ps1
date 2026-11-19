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

function Save-OptimizedJpeg {
  param(
    [Parameter(Mandatory)] [string] $SourceRelative,
    [Parameter(Mandatory)] [string] $TargetRelative,
    [long] $Quality = 86
  )

  $assetRoot = Join-Path $projectRoot 'codigo\public\assets'
  $sourcePath = Join-Path $assetRoot $SourceRelative
  $targetPath = Join-Path $assetRoot $TargetRelative
  $resolvedAssetRoot = (Resolve-Path $assetRoot).Path
  $resolvedSource = (Resolve-Path $sourcePath).Path
  if (-not $resolvedSource.StartsWith($resolvedAssetRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "La imagen de origen está fuera de assets: $resolvedSource"
  }

  $targetDirectory = Split-Path -Parent $targetPath
  New-Item -ItemType Directory -Force -Path $targetDirectory | Out-Null
  $temporaryPath = "$targetPath.optimizing.jpg"
  $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object MimeType -eq 'image/jpeg'
  $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters 1
  $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    $Quality
  )

  $image = [System.Drawing.Image]::FromFile($resolvedSource)
  try {
    $image.Save($temporaryPath, $jpegCodec, $encoderParameters)
  } finally {
    $image.Dispose()
    $encoderParameters.Dispose()
  }

  Move-Item -LiteralPath $temporaryPath -Destination $targetPath -Force
  if (-not $sourcePath.Equals($targetPath, [StringComparison]::OrdinalIgnoreCase)) {
    Remove-Item -LiteralPath $sourcePath -Force
  }
}

$media = @(
  @{ Source = 'hero\hero-editorial.jpg'; Target = 'hero\hero-editorial.jpg' },
  @{ Source = 'hero\hero-calzado.jpg'; Target = 'hero\hero-calzado.jpg' },
  @{ Source = 'hero\hero-perfumes.jpg'; Target = 'hero\hero-perfumes.jpg' },
  @{ Source = 'hero\hero-mobile.png'; Target = 'hero\hero-mobile.jpg' },
  @{ Source = 'hero\hero-calzado-mobile.png'; Target = 'hero\hero-calzado-mobile.jpg' },
  @{ Source = 'hero\hero-perfumes-mobile.png'; Target = 'hero\hero-perfumes-mobile.jpg' },
  @{ Source = 'editorial\sobre-nosotros-productos-oficiales.png'; Target = 'editorial\sobre-nosotros-productos-oficiales.jpg' },
  @{ Source = 'editorial\como-comprar-productos-oficiales.png'; Target = 'editorial\como-comprar-productos-oficiales.jpg' }
)

foreach ($item in $media) {
  Save-OptimizedJpeg -SourceRelative $item.Source -TargetRelative $item.Target
}

Write-Output 'Assets optimizados: iconos a 128 px y portadas/editoriales en JPEG de calidad 86, sin cambiar resolución.'
