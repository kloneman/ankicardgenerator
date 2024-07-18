import express from 'express';
import clipboardy from 'clipboardy';
import clipboardListener from 'clipboard-event'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import jsdom from 'jsdom';
import os from 'os'

const app = express();
const port = 3000;
const homedir = os.homedir()
const targetDir = homedir + '/Documents/ShareX/Screenshots';

clipboardListener.startListening();
clipboardListener.on('change', () => {
    const fileList = []
    const clipboardContent = clipboardy.readSync();
    fs.readdir(targetDir, (error, files) => {
        if (error) {
            console.error(error);
            return;
        }
        const promises = files.map(file => {
            const filePath = path.join(targetDir, file);
            return new Promise((resolve, reject) => {
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        reject(err);
                    } else {
                        const lastModifiedDate = stats.mtime;
                        fileList.push({ name: file, path: filePath, modified: lastModifiedDate });
                        resolve();
                    }
                });
            });
        });
        Promise.all(promises)
            .then(() => {
                axios.get('https://ichi.moe/cl/qr/?q=' + clipboardContent)
                    .then(res => {
                        const html = res.data;
                        const dom = new jsdom.JSDOM(html)
                        let vocab = dom.window.document.querySelectorAll(".alternatives")
                        let wordList = []
                        vocab.forEach(function (text) {
                            let meaningList = []
                            const vocab = text.getElementsByTagName("dt")[0].innerHTML
                            const meaning = text.getElementsByClassName("gloss-desc")
                            for (let i = 0; i < meaning.length; i++) {
                                meaningList.push(meaning[i].innerHTML)
                            }
                            wordList.push({ vocab: vocab, meaning: meaningList })
                        })
                        const sortedFiles = fileList.sort(function (a, b) {
                            return a.modified - b.modified;
                        })
                        const lastFile = sortedFiles[sortedFiles.length - 1]
                        wordList.forEach(function (data, i) {
                            setTimeout(() => {
                                const options = {
                                    "action": "addNote",
                                    "version": 6,
                                    "params": {
                                        "note": {
                                            "deckName": "Default",
                                            "modelName": "Basic",
                                            "fields": {
                                                "Front": data.vocab,
                                                "Back": data.meaning.toString() + '<br>'
                                            },
                                            "options": {
                                                "allowDuplicate": false,
                                                "duplicateScope": "deck",
                                                "duplicateScopeOptions": {
                                                    "deckName": "Default",
                                                    "checkChildren": false,
                                                    "checkAllModels": false
                                                }
                                            },
                                            "picture": [{
                                                "path": lastFile.path,
                                                "filename": lastFile.name,
                                                "fields": [
                                                    "Back"
                                                ]
                                            }]
                                        }
                                    }
                                }
                                console.log(options)
                                axios.post('http://127.0.0.1:8765', options)
                                    .then(res => {
                                        console.log(res);
                                    })
                            }, i * 2000);
                        })
                    })
            })
            .catch(err => {
                console.error('Error processing files:', err);
            });
    });



});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})