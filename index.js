var Tone = require('tone');
var cv = require('./opencv.js');

let rsRows = 3;
let rsCols = 3;
const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
const phaser = new Tone.Phaser({
    frequency: 15,
    octaves: 5,
    baseFrequency: 1000
}).toDestination();
const synth = new Tone.PolySynth(Tone.AMSynth, ).connect(chorus);
const kick = new Tone.MembraneSynth().connect(phaser);

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
const loopA = new Tone.Loop(time=>{mainLoop(time)}, "1m");
const loopB = new Tone.Loop(time=>{beatsLoop(time)}, "8n");
let isAttacked = false;

//attach a click listener to a play button
document.querySelector('button')?.addEventListener('click', async () => {
    console.log("clicked lol")

    await Tone.start()
    console.log('audio is ready')
    //create a synth and connect it to the main output (your speakers)
    if(isAttacked)
    {
       // osc.forEach(o=>o.stop());
        loopA.stop();
        loopB.stop();
        Tone.Transport.stop();
        isAttacked = false;
    }
    else
    {
        loopA.start(0);
        loopB.start(0);
        Tone.Transport.start().bpm.set({value:240});
        //  osc.forEach(o=>o.start());
        isAttacked = true;
    }
//play a middle 'C' for the duration of an 8th note
})
console.log("cam")
let video = document.getElementById("videoInput"); // video is the id of video tag
navigator.mediaDevices.getUserMedia({video: true})
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
        console.log("salut");
    })
    .catch(function(err) {
        console.log("An error occurred! " + err);
    });
openCvReady();

let notes = ["C", "D", "EB", "F", "G", "AB", "BB", "C"];

function getI(x, y)
{
    return y * rsCols + x;
}

function getX(i)
{
    return i % rsCols;
}

function getY(i)
{
    return i / rsCols;
}

let noteAllowed = true;
let lastNoteIndex = 0;
let n = [];
function mainLoop(time)
{
    let ns = [];
    for(let i = 0; i < 3; i++)
    {
        ns[i] = notes[Math.floor(map_range((n[i]),0,255,0,notes.length-1))] + Math.floor(map_range(meanSat,0,255,1,3));
    }
    synth.triggerAttackRelease(ns,"1m", time,1.0);

    lastNoteIndex++;
    if(lastNoteIndex >= rsCols*rsRows)
        lastNoteIndex = 0;
}

let lastKick;

function beatsLoop(time)
{
    if(lastKick == undefined)
    {
        lastKick = notes[0];
    }
    console.log(bpm);
    let f = Math.floor(map_range(bpm, 10, 100, 0, notes.length-1));

    console.log(f);
    let np = lastKick;
    if(f != -1)
    {
        np = notes[f];
        lastKick = np;
    }

    console.log(np);
    let t = Math.floor(map_range(meanSat,0,255,4,7));
    console.log(t);
    console.log(np+t);
    kick.triggerAttackRelease(np+t, "3t", time, 0.25);

}
let lastFrame;
let bpm;
let meanSat;
function openCvReady() {
    cv['onRuntimeInitialized']=()=>{
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
        var diff = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);
        let mean = new cv.Mat();
        let stddev = new cv.Mat();
        let resampled = new cv.Mat();
        let upscaled = new cv.Mat();
        let lastFrame = new cv.Mat();


        console.log("cam ready");
        const FPS = 30;
        function processVideo() {
            try {
                let begin = Date.now();
                // start processing.
                let delay = 1000/FPS - (Date.now() - begin);
                cap.read(src);
                cv.cvtColor(src, dst, cv.COLOR_RGB2HSV);
                meanSat = cv.mean(dst)[1];

                try
                {
                cv.okfokezp();
                }
                catch (e)
                {
                    console.log("err " + e);
                }
                if(lastFrame != undefined)
                {
                    try
                    {
                          cv.absdiff(dst, lastFrame, diff);
                          cv.cvtColor(diff, diff, cv.COLOR_HSV2RGB);
                          cv.cvtColor(diff, diff, cv.COLOR_RGB2GRAY);
                          bpm = (cv.mean(diff)[0]);
                        console.log(bpm);

                        //cv.threshold(src, diff, 0, 255, cv.THRESH_BINARY_INV);
                    }
                    catch (e)
                    {
                        console.log("err " + e);
                    }
                    cv.imshow('canvasFrame', diff);

                }
                try
                {
                    dst.copyTo(lastFrame);

                }
                catch (e)
                {
                    console.log("err " + e);

                }
       //        lastFrame= (src);
                //cv.cvtColor(dst, src, cv.COLOR_RGB2HSV);

                cv.imshow('canvasOutput', dst);
                cv.meanStdDev(dst, mean, stddev);
                cv.resize(dst, resampled,  new cv.Size(rsCols,rsRows),0,0, cv.INTER_AREA  );
                cv.resize(resampled, upscaled,  new cv.Size(320,240),0,0, cv.INTER_AREA  );

              //  cv.imshow('canvasFrame', upscaled);

                n = resampled.ucharPtr(getX(lastNoteIndex), getY(lastNoteIndex));


                //osc.width.value = map_range(stddev.doubleAt(0,0),0,255,-0.5,0.5);
                setTimeout(processVideo, delay);
            } catch (err) {
                //utils.printError(err);
            }
        };

// schedule the first one.
        setTimeout(processVideo, 0);
}}
