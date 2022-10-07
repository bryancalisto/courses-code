# This script does:
# 1. Configure cmake environment if it has not been configured yet.
# 2. Build the project.
# 3. Run the project if 'run' flag is passed.

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

If ($args[0] -eq 'run') {
  If($args[1]) {
    Invoke-Expression ./$build_dir/Debug/clox.exe $args[1]
  }
  Else {
    Invoke-Expression ./$build_dir/Debug/clox.exe
  }
}