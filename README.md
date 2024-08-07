**Anki Card Generator**
<hr>
This is a simple Automatic Anki Card Generator to be used alongside your Japanese Studies that will generate anki cards from Manga, Anime, Visual Novels and Video Games.

This will work alongside most OCR software such as Manga_OCR and ShareX, you just need to make sure that your screenshots are being saved at the same time (or before) as the detected text is being copied. 

**Prerequisites**
<hr>
Please install the following software before continuing:
<li>NodeJS</li> 
<li>Anki</li> 
<li>AnkiConnect</li> 
<li>OCR software such as ShareX</li> 
<br>

**Installation**
<hr>
<ol>1. Open a command prompt and clone this repository to your local disk or download the code as a zip file and extract it</ol> 
<ol>2. cd in to the directory you just cloned/downloaded</ol>
<ol>3. Run `npm install` to install all the packages</ol>

**Usage**
<hr>
Before you use the application, make sure you have your OCR software set-up so that it takes a screenshot and automatically copies the captured text to the clipboard. There are many guides on how to do this online.

To run the software simply run the command `node index.js` in the root directory. Now make sure you have both Anki and your OCR software open, then take a screenshot and it will automatically generate a new Anki note in your Default deck.
