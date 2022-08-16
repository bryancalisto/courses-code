$build_dir = "./build"
$src_dir = "./src"

If (!(test-path -PathType container $build_dir)) {
  New-Item -ItemType Directory -Path $build_dir
  Set-Location $build_dir cmake $src_dir
}

cmake --build $build_dir

Invoke-Expression ./$build_dir/Debug/clox.exe