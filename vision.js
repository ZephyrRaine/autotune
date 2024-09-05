var cv = require('./opencv.js');

export function Init() {
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

        modules.push(
            new Module(
                input,
                function treat()
                {
                    ejferijgioe
                    gjriogjoeri
                    jgiorejgoier

                }
            )
        )

        new Instrument("module4[luminosité]")


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