export interface INslhubMessage {
    // message: string | INslhubQuickReplies | INslhubImage | INslhubVideo ;
    message: any | INslhubQuickReplies | INslhubImage | INslhubVideo | INslcardsCarousel;
    sessionId: string;
    isFaqOrAtq: string;
    image: string;
    video: string;
    cardsCarousel: string;
    quickReplies: Object;

}

export interface INslhubQuickReplies {
    text: string;
    quickReplies: Array<INslhubQuickReply>;
}

export interface INslhubQuickReply {
    title: string;
    payload: string;
}

export interface INslhubImage{
    image: string;
}

export interface INslhubVideo{
    video: any;
}

export interface INslcardsCarousel{
    cardsCarousel: string;
}

// export interface INslhubMessage {
//     message: string | INslhubQuickReplies ;
//     image_message: string | INslhubImage;
//     video_message: any | INslhubVideo;
//     sessionId: string;
//     isFaqOrAtq: string;

// }

// export interface INslhubQuickReplies {
//     text: string;
//     quickReplies: Array<INslhubQuickReply>;
// }

// export interface INslhubQuickReply {
//     title: string;
//     payload: string;
// }

// export interface INslhubImage{
//     image: string;
// }

// export interface INslhubVideo{
//     video: any;
// }

