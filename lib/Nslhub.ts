import { IHttp, IHttpRequest, IRead, IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { appendFile, readdirSync } from 'fs';
import { AppSetting } from '../config/Settings';
import { Headers } from '../enum/Http';
import { Logs } from '../enum/Logs';
import { INslhubMessage, INslhubQuickReplies, INslhubImage , INslhubVideo } from '../enum/Nslhub';
import { createHttpRequest } from './Http';
import { getAppSettingValue } from './Setting';
import { performHandover } from './Room';
import { createMessage } from './Message';
import { IDepartment, ILivechatRoom, ILivechatTransferData, IVisitor } from '@rocket.chat/apps-engine/definition/livechat';


let agent = null;
let flag = -1;
let visitor_mail = '';
let visitor_name = '';


export const sendMessage = async (read: IRead, http: IHttp, sender: string, modify: IModify, message: string, app:IApp): Promise<Array<INslhubMessage> | null> => {
    const NslhubServerUrl = await getAppSettingValue(read, AppSetting.NslhubServerUrl);
    const NslhubBotUsername = await getAppSettingValue(read, AppSetting.NslhubBotUsername);
    if (!NslhubServerUrl) { throw new Error(Logs.INVALID_Nslhub_SERVER_URL_SETTING); }
    const callbackEnabled: boolean = await getAppSettingValue(read, AppSetting.NslhubEnableCallbacks);
    const room = await read.getRoomReader().getById(sender);
    let bot_name = JSON.parse(JSON.stringify(room)).servedBy.username;
    app.getLogger().info('room from user is', room, 'and bot name is', bot_name);
    for(var i = 0; i <= NslhubBotUsername.split(',').length; i++)
    {
        if(NslhubBotUsername.split(',')[i] == bot_name)
        {
            flag = i;
        }

    }
    app.getLogger().info(NslhubServerUrl.split(',')[flag], 'and bot is', NslhubBotUsername.split(',')[flag]);

    const httpRequestContent: IHttpRequest = createHttpRequest(
        { 'Content-Type': Headers.CONTENT_TYPE_JSON},
        { sender, message, bot_name},
        30000000,
    

    );
    if(message == 'handover')
    {
        const httpRequestContent1: IHttpRequest = createHttpRequest({'X-Auth-Token': 'Ztpk0KyqSgxXWSsD22g1dqsOh8IKraiUNOERub7tFAo', 'X-User-Id': 'wyuDAAwN7gN8rnzfu'}, {'timeout': '30000'}, {});
        const result = await http.get(`http://localhost:3000/api/v1/rooms.info?roomId=${sender}`, httpRequestContent1);
        const visitor1 = Array(result);
        const visitor_id = visitor1[0].data.room.v._id;
        app.getLogger().info('visitor id checking',visitor1);
        app.getLogger().info('visitorID is ', visitor_id);


        const visitorInfo = await http.get(`http://localhost:3000/api/v1/livechat/visitors.info?visitorId=${visitor_id}`, httpRequestContent1);
        const token_id = Array(visitorInfo);
        const visitorDetails = token_id[0].data.visitor.token;
        app.getLogger().info('visitorDetails is', visitorDetails);
        const visitor = visitorDetails;
        app.getLogger().info('visitor from room is', visitor);
        const targetDepartmentName = await getAppSettingValue(read, AppSetting.NslhubDefaultHandoverDepartment);
        app.getLogger().info('deppttt is', targetDepartmentName.split(',')[flag]);
        const targetDepartment = targetDepartmentName.split(',')[flag];
        const targetAgent = null;
        await performHandover(modify, read, sender, visitor, targetDepartment, targetAgent);



    }
    
    const WebhookUrl = callbackEnabled ? `${NslhubServerUrl}/webhooks/callback/webhook` : `${NslhubServerUrl.split(',')[flag]}/webhooks/rest/webhook`;
    const response = await http.post(WebhookUrl, httpRequestContent);
    app.getLogger().info('raw response log', response, 'webhook url is', WebhookUrl);
    if (response.statusCode !== 200) { throw Error(`${ Logs.Nslhub_REST_API_COMMUNICATION_ERROR } ${ response.content }`); }


    if (!callbackEnabled) {
        const parsedMessage = parseNslhubResponse(response.data, app);
        app.getLogger().info('parsedMessage log', parsedMessage);
        return parsedMessage;
    }

    return null;

};



export const parseNslhubResponse = (response: any, app:IApp): Array<INslhubMessage> => {
    if (!response) { throw new Error(Logs.INVALID_RESPONSE_FROM_Nslhub_CONTENT_UNDEFINED); }
    app.getLogger().info("response", response);

    const messages: Array<INslhubMessage> = [];
    let image = "no";
    let video = "no";
    let quickReply = {};
    if(response.length==2 && response[1].hasOwnProperty('buttons'))
    {
        quickReply = response[1];
    }
    if(response.length==3 && response[1].hasOwnProperty('image'))
    {
        image = response[1].image;
        
    }
    if(response.length==2 && response[1].hasOwnProperty('image'))
    {
        image = response[1].image;
        
    }
    if(response.length==2 && response[1].hasOwnProperty('custom'))
    {
        video = response[1].custom.attachment.payload.src;
    }
    if(response.length==3 && response[2].hasOwnProperty('custom'))
    {
        video = response[2].custom.attachment.payload.src;
    }
    let isfaq = "no";
    if(response[0].hasOwnProperty('isFaqOrAtq'))
    {
        isfaq = "yes";
    }
    let m: INslhubMessage = {
        message: response[0].text,
        sessionId: response[0].recipient_id,
        isFaqOrAtq: isfaq,
        image,
        video,
        quickReplies: quickReply,
        
    }


    messages.push(m);
    return messages;

    // app.getLogger().info("response is", response);
    // response.forEach((message) => {
    //     app.getLogger().info('push message', message);
    //     // messages.push(parseSingleNslhubMessage(message, app));
        



    // });
    // app.getLogger().info('push parse message', messages);
    
    // return messages;
};



export const parseSingleNslhubMessage = (message: any, app: IApp): INslhubMessage => {
    app.getLogger().info('parseSingleNslhubMessage message', message);


    const recipient_id = message.recipient_id;
    const text = message.text;
    const buttons = message.buttons;
    const image = message.image;
    const video = message.video;
    const isFaqOrAtq = message.isFaqOrAtq;
    const quickReplies = {};

    if (buttons) {
        const quickReplyMessage: INslhubQuickReplies = {
            text,
            quickReplies: buttons,
        };
        return {
            message: quickReplyMessage,
            sessionId: recipient_id,
            image: image,
            video: video,
            isFaqOrAtq: isFaqOrAtq,
            quickReplies,

        };
    }
    // else if (image){
    //     const imageMessage: INslhubImage = {
    //         image
    //     };
    //     return {
    //         message: imageMessage,
    //         sessionId: recipient_id,
    //         image: image,
    //         video:video,
    //         isFaqOrAtq: isFaqOrAtq
    //     };
    // }
    // else if (video){
    //     const videoMessage: INslhubVideo = {
    //         video: video
    //     }
    //     return{
    //         message: videoMessage,
    //         sessionId: recipient_id,
    //         image: image,
    //         video:video,
    //         isFaqOrAtq: isFaqOrAtq


    //     }
    // }
    else {
        return {
            message: text,
            sessionId: recipient_id,
            image: image,
            video: video,
            isFaqOrAtq: isFaqOrAtq,
            quickReplies,


        };
    }
};




// export const parseSingleNslhubMessage = (message: any, app: IApp): INslhubMessage => {
//     app.getLogger().info('parseSingleNslhubMessage message', message);


//     const recipient_id = message.recipient_id;
//     const text = message.text;
//     const buttons = message.buttons;
//     const image = message.image
//     const video = message.custom;
//     const isFaqOrAtq = message.isFaqOrAtq;

//     if (buttons) {
//         const quickReplyMessage: INslhubQuickReplies = {
//             text,
//             quickReplies: buttons,
//         };
//         return {
//             message: quickReplyMessage,
//             sessionId: recipient_id,
//             isFaqOrAtq: isFaqOrAtq
//         };
//     }
//     else if (image){
//         const imageMessage: INslhubImage = {
//             image
//         };
//         return {
//             message: imageMessage,
//             sessionId: recipient_id,
//             isFaqOrAtq: isFaqOrAtq
//         };
//     }
//     else if (video){
//         const videoMessage: INslhubVideo = {
//             video: video
//         }
//         return{
//             message: videoMessage,
//             sessionId: recipient_id,
//             isFaqOrAtq: isFaqOrAtq


//         }
//     }
//     else {
//         return {
//             message: text,
//             sessionId: recipient_id,
//             isFaqOrAtq: isFaqOrAtq

//         };
//     }
// };
