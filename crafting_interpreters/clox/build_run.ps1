# This script does:
# 1. Configure cmake environment if it has not been configured yet.
# 2. Build the project.
# 3. Run the project.

$root_dir = $pwd
$build_dir = "build"

Write-Output $build_dir

If (!(test-path -PathType container $build_dir)) {
  New-Item -ItemType Directory -Path $build_dir
  Set-Location $build_dir
  cmake ..
  Set-Location $root_dir
}

cmake --build $build_dir

Invoke-Expression ./$build_dir/Debug/clox.exe