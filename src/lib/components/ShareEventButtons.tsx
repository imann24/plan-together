import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    FacebookShareCount,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from 'react-share'

export default function ShareEventButtons({ shareUrl }: { shareUrl: string }) {
    return (
        <div className="flex flex-row justify-end gap-2">
            <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={32} round />
                <FacebookShareCount url={shareUrl} />
            </FacebookShareButton>
            <EmailShareButton url={shareUrl}>
                <EmailIcon size={32} round />
            </EmailShareButton>
            <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <TwitterShareButton url={shareUrl}>
                <XIcon size={32} round />
            </TwitterShareButton>
        </div>
    )
}
