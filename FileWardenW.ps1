#Free software, on GNU lic, dont care what you do with it, print it out and wipe your ass with it xDDDDD
#folder musi byc precyzyjne!!!
#folder to œcie¿ka do folderu projektu
$folder = "D:\JSGame"
cd $folder
$filter = '*.*' 
$fsw = New-Object IO.FileSystemWatcher $folder, $filter -Property @{IncludeSubdirectories = $false;NotifyFilter = [IO.NotifyFilters]'FileName, LastWrite'}

Register-ObjectEvent $fsw Changed -SourceIdentifier FileChanged -Action {
$name = $Event.SourceEventArgs.Name
$changeType = $Event.SourceEventArgs.ChangeType
$timeStamp = $Event.TimeGenerated
Write-Host "The file '$name' was $changeType at $timeStamp" -fore white
if($name -like "*.html") {
    write-host "dart running"
  dart .\dart-sass-1.26.5\bin\sass.dart main.css
  write-host "dart finished"
}
if($name -like "*.scss") {
    write-host "dart running"
  dart .\dart-sass-1.26.5\bin\sass.dart .\main.scss .\main.css
  write-host "dart finished"
  write-host "Stylelinting:"
  $npxret = npx stylelint "**/*.scss" "!**/node_modules/**" "!**/dart-sass-1.26.5/**"
  set-content -path $folder\styleresult -Value $npxret -Force
  write-host $lint | out-gridview
}
if($name -like "*.js") {
    
}
}