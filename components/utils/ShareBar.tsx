import { withRouter } from 'next/router';
import { Children, useEffect, useState } from 'react';
import {
    FacebookShareCount,
    FacebookShareButton,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    EmailIcon,
    TwitterShareButton
  } from 'react-share'

type ShareBarProps = {
    children?: any
    //circleURL: string
}

function ShareBar({children}:ShareBarProps) {
    const shareUrl = 'https://gregc.dev/covid/locations';
    const title = 'Find Locations of Interest';

    return (
        <>
        {children}
        <div className="grid grid-flow-col pt-4">
            <div className="Demo__some-network">
                <FacebookShareButton
                    url={shareUrl}
                    quote={title}
                    className="Demo__some-network__share-button"
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
            <div>
                <FacebookShareCount url={shareUrl} className="Demo__some-network__share-count">
                {count => count}
                </FacebookShareCount>
            </div>
        </div>

        <div className="Demo__some-network">
          <FacebookMessengerShareButton
            url={shareUrl}
            appId="521270401588372"
            className="Demo__some-network__share-button"
          >
            <FacebookMessengerIcon size={32} round />
          </FacebookMessengerShareButton>
        </div>

        <div className="Demo__some-network">
          <TwitterShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <div className="Demo__some-network__share-count">&nbsp;</div>
        </div>



        <div className="Demo__some-network">
          <EmailShareButton
            url={shareUrl}
            subject={title}
            body="body"
            className="Demo__some-network__share-button"
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>


     {/*   <div className="Demo__some-network">
          <PinterestShareButton
            url={String(window.location)}
         //   media={`${String(window.location)}/${exampleImage}`}
            className="Demo__some-network__share-button"
          >
            <PinterestIcon size={32} round />
          </PinterestShareButton>

          <div>
            <PinterestShareCount url={shareUrl} className="Demo__some-network__share-count" />
          </div>
        </div>*/}

        <div className="Demo__some-network">
          <WhatsappShareButton
            url={shareUrl}
            title={title}
            separator=":: "
            className="Demo__some-network__share-button"
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <div className="Demo__some-network__share-count">&nbsp;</div>
            </div>
    </div>
    </>)
}


export default withRouter(ShareBar);