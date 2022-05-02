# Flare Music Player
A lightweight music player built in an ElectronJS window with React. There are many, excellent music players already available. I wanted to make one that required no setup.

Built with ElectronJS, ReactJS, Howler.js, and Bootstrap

Open the app, add a folder with music files, and click play!
![image](https://user-images.githubusercontent.com/103540180/166316135-b437abe0-726a-4f42-9f43-d703e74b8b43.png)

<a href="https://youtu.be/peRCJDqpM-Q" target="_blank">Click here to view a quick demo on YouTube</a>

Features:
- Flare remembers the paths of files, so after adding a directory those songs will appear in your library until they are deleted.
- Simply select a parent directory with all of your music in it, as Flare searches all folders and sub-folders for music files
- Flare plays files through Howler.js, so many filetypes are supported (.flac, .mp3, .opus, .ogg, .wav, .aac, .m4a, .m4b, .webm)
- Automatically reads embedded music metadata so songs are properly displayed and organized
- Files are shown with audio quality information
- Audio Playback can be standard or shuffled
- Albums are automatically sorted by artist name then year released
- Songs in albums are sorted by track number
- Songs can be liked (and unliked) for easy sorting
