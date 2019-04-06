import os
import shutil
import subprocess
import re
from distutils.dir_util import copy_tree

# Release folder
dirRelease = '.release'
# Plugin directory
dirPlugin = 'mcw-bp-gutenberg'

dirPluginFolders = [
  'dist',
  'lib',
]

dirPluginFiles = [
  'index.php',
  'mcw-bp-gutenberg.php',
  'README.md',
  'readme.txt',
]

def getVersion( fileName ):
  with open( fileName, "r" ) as pluginFile:
    for  line in pluginFile:
      matches = re.search( '\*.*version:?\s?(.*)$', line, re.IGNORECASE )
      if matches:
        return matches.group( 1 )
  return ''

# Check if the release folder is present, remove it if necessary
if os.path.isdir( dirRelease ):
  shutil.rmtree( dirRelease )

version = getVersion( 'mcw-bp-gutenberg.php' )

# Build the code
command = 'npm run build'
process = subprocess.Popen( command, shell = True )
process.wait()

dirReleasePlugin = os.path.join( dirRelease, dirPlugin )

# Create the release folder again
os.makedirs( dirReleasePlugin )

# Copy the plugin contents
for folder in dirPluginFolders:
  copy_tree( folder, os.path.join( dirReleasePlugin, folder ) )

# Copy the plugin files
for files in dirPluginFiles:
  shutil.copyfile( files, os.path.join( dirReleasePlugin, files ) )

# Copy index.php files
for path, folders, files in os.walk( dirReleasePlugin, topdown = True ):
  for folder in folders:
    if os.path.isdir( os.path.join( path, folder ) ):
      shutil.copyfile( 'index.php', os.path.join( path, folder, 'index.php' ) )

# Create the zip file
shutil.make_archive( os.path.join( dirRelease, dirPlugin + ( ( '-v' + version.replace( ' ', '-' ) ) if version else '' ) ), 'zip', dirRelease, dirPlugin )

# Remove the release directory
shutil.rmtree( dirReleasePlugin )

print('Archive file is created!')

exit()
