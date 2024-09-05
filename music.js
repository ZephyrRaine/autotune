var Tone = require('tone');
let isStarted;
let isPlaying;

async function Init()
{
    isStarted = true;
    await Tone.start()
}

export function Enable()
{
    if(!isStarted)
        Init().then(x=>console.log("Started Tone.js"));


}