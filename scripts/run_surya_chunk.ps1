param(
  [Parameter(Mandatory = $true)][ValidateRange(1, 925)][int]$StartPage,
  [Parameter(Mandatory = $true)][ValidateRange(1, 925)][int]$EndPage,
  [string]$Root = "C:\Users\mahin\OneDrive\Documents\Manus Local Computer Folder\dontonyo-extraction",
  [switch]$Overwrite
)

$ErrorActionPreference = "Stop"
if ($EndPage -lt $StartPage) { throw "EndPage must be greater than or equal to StartPage." }

$PdfPath = Join-Path $Root "Jubayersgk.pdf"
$Python = "C:\Users\mahin\AppData\Local\Programs\Python\Python312\python.exe"
$Surya = "C:\Users\mahin\AppData\Local\Programs\Python\Python312\Scripts\surya_ocr.exe"
$Converter = Join-Path $Root "surya_results_to_pages.py"
$PageDirectory = Join-Path $Root "pages"
$ChunkDirectory = Join-Path $Root ("surya-chunk-{0:D4}-{1:D4}" -f $StartPage, $EndPage)
$LogPath = Join-Path $Root ("surya-chunk-{0:D4}-{1:D4}.log" -f $StartPage, $EndPage)

foreach ($Required in @($PdfPath, $Python, $Surya, $Converter)) {
  if (-not (Test-Path $Required)) { throw "Required file was not found: $Required" }
}

New-Item -ItemType Directory -Path $PageDirectory -Force | Out-Null
New-Item -ItemType Directory -Path $ChunkDirectory -Force | Out-Null

# Surya CLI page ranges are zero-indexed; source-page records remain one-indexed.
$SuryaRange = "{0}-{1}" -f ($StartPage - 1), ($EndPage - 1)
$env:SURYA_INFERENCE_URL = "http://127.0.0.1:8089"
$env:SURYA_INFERENCE_PARALLEL = "1"
$env:SURYA_INFERENCE_KEEP_ALIVE = "true"

"[$(Get-Date -Format o)] Starting source pages $StartPage-$EndPage (Surya range $SuryaRange)" | Tee-Object -FilePath $LogPath -Append
& $Surya $PdfPath --page_range $SuryaRange --output_dir $ChunkDirectory --keep_server 2>&1 | Tee-Object -FilePath $LogPath -Append
if ($LASTEXITCODE -ne 0) { throw "Surya exited with code $LASTEXITCODE. See $LogPath." }

$ResultJson = Join-Path $ChunkDirectory "Jubayersgk\results.json"
$ConvertArgs = @(
  (Join-Path $Root "surya_results_to_pages.py"),
  "--result-json", $ResultJson,
  "--source-pdf", $PdfPath,
  "--out-dir", $PageDirectory,
  "--start-page", "$StartPage",
  "--end-page", "$EndPage"
)
if ($Overwrite) { $ConvertArgs += "--overwrite" }

& $Python @ConvertArgs 2>&1 | Tee-Object -FilePath $LogPath -Append
if ($LASTEXITCODE -ne 0) { throw "The Surya result converter exited with code $LASTEXITCODE. See $LogPath." }

"[$(Get-Date -Format o)] Completed source pages $StartPage-$EndPage. Page artifacts: $PageDirectory" | Tee-Object -FilePath $LogPath -Append
