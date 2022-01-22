import { GetStaticProps, NextPage } from "next";
import { getHardCodedUrl } from "../components/utils/utils";
import Question from "../components/Locations/Questions";
import { SendFeedback } from "../components/utils/SendFeedback";



type FeedbackProps = {
    publishTimeUTC: string;
    hardcodedURL:string
}

const Feedback: NextPage<FeedbackProps> = ({publishTimeUTC, hardcodedURL}) => {

    return (
        <>
        {process.env.NEXT_PUBLIC_FEEDBACK_URL && <SendFeedback />}
    </>
    )
}

export const getStaticProps:GetStaticProps = async ({params, preview = false}) => {

    const nextJSHacky:FeedbackProps = JSON.parse(JSON.stringify({
        publishTimeUTC: new Date().toUTCString(),
        hardcodedURL: getHardCodedUrl()
    }));

    return {
       props: nextJSHacky
    }
}
    

export default Feedback;