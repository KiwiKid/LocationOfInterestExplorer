// NodeJS Core
import fs from 'fs';
import path from 'path';
 
// Libs
import chromium from 'chrome-aws-lambda';
import { NextApiRequest, NextApiResponse } from 'next';
import { getHardCodedUrl } from '../../../../components/utils/utils';


const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    if(!req.query.quickLink || typeof(req.query.quickLink) !== 'string'){
        throw 'Provide a quicklink';
    }

    const quickLink = decodeURIComponent(req.query.quickLink);//.replace('reqQuery', '');
    
    /*if(post.attributes.image != null) {
        // Posts with images
        const filePath = path.resolve('./public/', post.attributes.image);
        const imageBuffer = fs.readFileSync(filePath);

        res.setHeader('Content-Type', 'image/jpg')
        res.send(imageBuffer);
    } else {*/
        // Posts without images
       // const imageAvatar = fs.readFileSync('./public/xaconi.jpg');
      //  const base64Image = new Buffer.from(imageAvatar).toString('base64');
       // const dataURI = 'data:image/jpeg;base64,' + base64Image;
        //const originalDate = new Date(post.attributes.date);
       // const formattedDate = `${originalDate.getDate()}/${('0' + (originalDate.getMonth()+1)).slice(-2)}/${originalDate.getFullYear()}`;

       const minimal_args = [
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
        '--disable-web-security'
      ];


        const browser = await chromium.puppeteer.launch({
            args: [...chromium.args, ...minimal_args],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });
/*
        const tags = post.attributes.tags?.map((tag) => {
            return `#${tag}`
        }).join(' | ') || "";*/

        const page = await browser.newPage();
        /*page.setViewport({ width: 1128, height: 600 });
        page.setContent(`<html>
            <body>
                <div class="social-image-content">
                    <h1>
                        ${ post.attributes.title }
                    </h1>
                    <div class="social-image-footer">
                        <div class="social-image-footer-left">
                            <img src="${ dataURI }" />
                            <span>Xaconi.dev · ${ formattedDate } </span>
                        </div>
                        <div class="social-image-footer-right">
                            ${tags}
                        </div>
                    </div>
                </div>
            </body>
            <style>
                html, body {
                    height : 100%;
                }
                body {
                    align-items : center;
                    display : flex;
                    height : 600px;
                    justify-content : center;
                    margin: 0;
                    width : 1128px;
                    background-color: #e2e2e2;
                }
                .social-image-content {
                    border : 2px solid black;
                    border-radius : 5px;
                    box-sizing: border-box;
                    display : flex;
                    flex-direction : column;
                    height : calc(100% - 80px);
                    margin : 40px;
                    padding : 20px;
                    width : calc(100% - 80px);
                    position: relative;
                    background-color: white;
                }
                .social-image-content::after {
                    content: ' ';
                    position: absolute;
                    top: 7px;
                    left: 7px;
                    width: 100%;
                    background-color: black;
                    height: 100%;
                    z-index: -1;
                    border-radius: 5px;
                }
                .social-image-content h1 {
                    font-size: 72px;
                    margin-top: 90px;
                }
                .social-image-footer {
                    display : flex;
                    flex-direction : row;
                    margin-top : auto;
                }
                .social-image-footer-left {
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    font-size : 28px;
                    font-weight : 600;
                    justify-content: center;
                    line-height: 40px;
                }
                .social-image-footer-left img {
                    border : 2px solid black;
                    border-radius : 50%;
                    height : 40px;
                    margin-right : 10px;
                    width : 40px;
                }
                .social-image-footer-right {
                    align-items: center;
                    display: flex;
                    flex-direction: row;
                    height : 40px;
                    justify-content: center;
                    margin-left : auto;
                    font-size : 28px;
                }
                * {
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                    font-weight : 600;
                }
            </style>
        </html>`);*/
        
        
       
        let url = `${getHardCodedUrl()}/loc/${encodeURIComponent(quickLink)}?dontShowDrawer`;
        console.log(`Going to page ${url}`);
        page.goto(url);
        console.log(`Waiting for .leaflet-container`);
        //await page.waitForText("Not an Official Ministry of Health Service");
        await page.waitUntilVisible('.leaflet-container');
        // Gross handcoded timeout
        //await page.waitForTimeout(2000);
        console.log(`Taking screenshot: ${url}`);
        const screenShotBuffer = await page.screenshot({ quality: 10, type:'jpeg'});
        if(!!screenShotBuffer){
            res.setHeader("Content-Type", "image/jpg",)
            res.setHeader("Content-Length", Buffer.byteLength(screenShotBuffer),)
            res.send(screenShotBuffer);
        }else{ 
            console.log(`Error occurred (no screenshot image): ${url}`);
            res.end("Error occurred (no screenshot image)");
        }



       // res.end(screenShotBuffer);
}

export default handler