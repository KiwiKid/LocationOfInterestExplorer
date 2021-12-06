import ExternalLink from "./ExternalLink"

export const SendFeedback = () => {
    return (
        <>{process.env.NEXT_PUBLIC_FEEDBACK_URL && <ExternalLink 
        title="Send Feedback"
        href={process.env.NEXT_PUBLIC_FEEDBACK_URL}
    />}</>)
}

