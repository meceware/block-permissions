import os
import shutil
import subprocess
from distutils.dir_util import copy_tree

""" Release folder """
dirRelease = ".release"
""" Plugin directory """
dirPlugin = "mcw-bp-gutenberg"

dirPluginFolders = [
  "dist",
  "lib",
]

dirPluginFiles = [
  "index.php",
  "mcw-bp-gutenberg.php",
  "README"
]

""" Check if the release folder is present, remove it if necessary """
if os.path.isdir( dirRelease ):
  shutil.rmtree( dirRelease )

""" Build the code """
command = "npm run build"
process = subprocess.Popen( command, shell = True )
process.wait()

dirReleasePlugin = os.path.join( dirRelease, dirPlugin )

""" Create the release folder again """
os.makedirs( dirReleasePlugin )

""" Copy the plugin contents """
for folder in dirPluginFolders:
  copy_tree( folder, os.path.join( dirReleasePlugin, folder ) )

""" Copy the plugin files """
for files in dirPluginFiles:
  shutil.copyfile( files, os.path.join( dirReleasePlugin, files ) )

""" Create the zip file """
shutil.make_archive( os.path.join( dirRelease, dirPlugin ), 'zip', dirRelease, dirPlugin )

""" Remove the release directory """
shutil.rmtree( dirReleasePlugin )

print("Archive file is created!")

exit()
