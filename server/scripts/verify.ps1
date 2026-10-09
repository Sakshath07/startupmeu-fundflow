$ErrorActionPreference = "Stop"

$serverRoot = Join-Path -Path (Get-Location).Path -ChildPath "server"
$javascriptFiles = Get-ChildItem -Path $serverRoot -Recurse -File -Filter "*.js" |
    Where-Object { $_.FullName -notmatch '[\\/]node_modules[\\/]' }

foreach ($file in $javascriptFiles) {
    node --check "$($file.FullName)"
    if ($LASTEXITCODE -ne 0) {
        throw "JavaScript syntax check failed: $($file.FullName)"
    }
}

npm --prefix server test
if ($LASTEXITCODE -ne 0) {
    throw "Backend tests failed."
}

git check-ignore -v -- .env server/.env client/.env .env.local
if ($LASTEXITCODE -ne 0) {
    throw "One or more environment files are not ignored by Git."
}

git diff --check -- .
if ($LASTEXITCODE -ne 0) {
    throw "git diff --check reported whitespace errors."
}

git diff -- .
if ($LASTEXITCODE -ne 0) {
    throw "Unable to display the final diff."
}
