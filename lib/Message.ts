import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { BlockElementType, BlockType, IActionsBlock, IButtonElement, TextObjectType } from '@rocket.chat/apps-engine/definition/uikit';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { AppSetting } from '../config/Settings';
import { Logs } from '../enum/Logs';
import { INslhubMessage, INslhubQuickReplies, INslhubQuickReply, INslhubImage, INslhubVideo } from '../enum/Nslhub';
import { getAppSettingValue } from './Setting';
import { uuid } from './Helper';
import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';
import { IMessageBuilder } from '@rocket.chat/apps-engine/definition/accessors';


export const createNslhubMessage = async (rid: string, read: IRead,  modify: IModify, NslhubMessage: INslhubMessage): Promise<any> => {
    //const { text, quickReplies } = NslhubMessage.message as INslhubQuickReplies;
    // const {image} = NslhubMessage.message as INslhubImage;
    // const {video} = NslhubMessage.message as INslhubVideo;
    let isFaqOrAtq2 = false;
    if(NslhubMessage.isFaqOrAtq=="yes")
    {
        isFaqOrAtq2 = true;
    }
    if(NslhubMessage.quickReplies.hasOwnProperty('buttons'))
    {
        let title1 = NslhubMessage.quickReplies;
        console.log("title is "+JSON.stringify(title1)+" type of title "+typeof(title1));
        const msg1 = NslhubMessage.message;
        const value = NslhubMessage.quickReplies["buttons"];
        console.log("value is  "+JSON.stringify(value));
        console.log("original message is "+msg1);
        // const { text, quickReplies }  = {text: NslhubMessage.quickReplies["text"], quickReplies: [{title: NslhubMessage.quickReplies["buttons"][0].title, payload: NslhubMessage.quickReplies["buttons"][0].payload }]} as INslhubQuickReplies; 
        const { text, quickReplies }  = {text: NslhubMessage.quickReplies["text"], quickReplies: value } as INslhubQuickReplies; 
        
        // console.log("nsl qr "+text+" "+JSON.stringify(quickReplies) ,"nsl message is"+ JSON.stringify(NslhubMessage));
        if (text && quickReplies) {
        const elements: Array<IButtonElement> = quickReplies.map((payload: INslhubQuickReply) => ({
            type: BlockElementType.BUTTON,
            text: {
                type: TextObjectType.PLAINTEXT,
                text: payload.title,
            },
            value: payload.payload,
            actionId: uuid(),
        } as IButtonElement));

        const actionsBlock: IActionsBlock = { type: BlockType.ACTIONS, elements };
        await createMessage1(rid, read, modify, { text: msg1 },isFaqOrAtq2);
        await createMessage1(rid, read, modify, { text },isFaqOrAtq2);
        await createMessage1(rid, read, modify, { actionsBlock },isFaqOrAtq2);
    }
    }
    else
    {
        await createMessage(rid, read, modify, NslhubMessage,isFaqOrAtq2);
    }
    
    // if (text && quickReplies) {
    //     // NslhubMessage is instanceof INslhubQuickReplies
    //     const elements: Array<IButtonElement> = quickReplies.map((payload: INslhubQuickReply) => ({
    //         type: BlockElementType.BUTTON,
    //         text: {
    //             type: TextObjectType.PLAINTEXT,
    //             text: payload.title,
    //         },
    //         value: payload.payload,
    //         actionId: uuid(),
    //     } as IButtonElement));

    //     const actionsBlock: IActionsBlock = { type: BlockType.ACTIONS, elements };

    //     await createMessage(rid, read, modify, { text },isFaqOrAtq2);
    //     await createMessage(rid, read, modify, { actionsBlock },isFaqOrAtq2);
    // }
    // else if (image){
    //     const imageAttachment: IMessageAttachment = {type: "image", imageUrl: image}
    //     await createMessage(rid, read, modify, {imageAttachment},isFaqOrAtq2)
    // }
    // else if(video){
    //     const videoAttachment: IMessageAttachment = {type: "video", videoUrl: video.attachment.payload.src}
    //     await createMessage(rid, read, modify, {videoAttachment},isFaqOrAtq2)
    // }
    // else {
    //     // NslhubMessage is instanceof string
    //     await createMessage(rid, read, modify, { text: NslhubMessage.message },isFaqOrAtq2);
    // }
};

export const createMessage = async (rid: string, read: IRead,  modify: IModify, message: any, isfaqoratq: boolean ): Promise<any> => {
    if (!message) {
        return;
    }
    // const NslbotUserName = await getAppSettingValue(read, AppSetting.NslhubBotUsername);
    // if (!NslbotUserName) {
    //     this.app.getLogger().error(Logs.EMPTY_BOT_USERNAME_SETTING);
    //     return;
    // }

    // const sender = await read.getUserReader().getByUsername(NslbotUserName);
    
    // if (!sender) {
    //     this.app.getLogger().error(Logs.INVALID_BOT_USERNAME_SETTING);
    //     return;
    // }

    const room = await read.getRoomReader().getById(rid);
    
    let bot_name = JSON.parse(JSON.stringify(room)).servedBy.username;

    const sender = await read.getUserReader().getByUsername('bot_name');

    if (!room) {
        this.app.getLogger().error(Logs.INVALID_ROOM_ID);
        return;
    }

    const msg = modify.getCreator().startMessage().setRoom(room).setSender(sender);
    // const { text, actionsBlock } = message;


    const text = message.message;
    const actionsBlock = message.actionsBlock;
    if(message.image!="no")
    {
        const imageAttachment: IMessageAttachment = {type: "image", imageUrl: message.image};
        msg.addAttachment(imageAttachment);
    }
    if(message.video!="no")
    {
        const videoAttachment: IMessageAttachment = {type: "video", videoUrl: message.video};
        msg.addAttachment(videoAttachment);
    }
    
    
    console.log("creating original message text is "+text+"image is "+ message.image + "this video"+ message.video);


    if (text) {
        msg.setText(text);
    }
    if(message.isFaqOrAtq=="yes")
    {
        msg.setParseUrls(true);
    }
    else
    {
        msg.setParseUrls(false);

    }
    // if(isfaqoratq==true)
    // {
    //     msg.setParseUrls(true);
    // }
    // else
    // {
    //     msg.setParseUrls(false);

    // }
    
    // if (actionsBlock) {
    //     const { elements } = actionsBlock as IActionsBlock;
    //     msg.addBlocks(modify.getCreator().getBlockBuilder().addActionsBlock({ elements }));
    // }
    
    // if(imageAttachment){

    //     msg.addAttachment(imageAttachment);
    // }

    // if(videoAttachment){
    //     msg.addAttachment(videoAttachment);
    // }
   

    return new Promise(async (resolve) => {
        modify.getCreator().finish(msg)
        .then((result) => resolve(result))
        .catch((error) => console.error(error));
    });
};
export const createMessage1 = async (rid: string, read: IRead,  modify: IModify, message: any, isfaqoratq: boolean ): Promise<any> => {
    if (!message) {
        return;
    }
    
    // const botUserName = await getAppSettingValue(read, AppSetting.NslhubBotUsername);

    
    const room = await read.getRoomReader().getById(rid);

    let bot_name = JSON.parse(JSON.stringify(room)).servedBy.username;

    const sender = await read.getUserReader().getByUsername('bot_name');
    
    // if (!sender) {
    //     // this.app.getLogger().error(Logs.INVALID_BOT_USERNAME_SETTING);
    //     console.log(Logs.INVALID_BOT_USERNAME_SETTING);
    //     return;
    // }

    if (!room) {
        this.app.getLogger().error(Logs.INVALID_ROOM_ID);
        return;
    }
    console.log("createmessage1 is ",message, 'and original room bot', room);


    const msg = modify.getCreator().startMessage().setRoom(room).setSender(sender);

    // const { text, actionsBlock } = message;

    const text = message.text;

    const actionsBlock = message.actionsBlock;
    // console.log("action block is",actionsBlock);

    if (text) {
        msg.setText(text);
    }
    if(isfaqoratq==true)
    {
        msg.setParseUrls(true);
    }
    else
    {
        msg.setParseUrls(false);

    }

    if (actionsBlock) {
        const { elements } = actionsBlock as IActionsBlock;
        msg.addBlocks(modify.getCreator().getBlockBuilder().addActionsBlock({ elements }));
    }



    return new Promise(async (resolve) => {
        modify.getCreator().finish(msg)
        .then((result) => resolve(result))
        .catch((error) => console.error(error));
    });
};
export const createLivechatMessage = async (rid: string, read: IRead,  modify: IModify, message: any, visitor: IVisitor ): Promise<any> => {
    if (!message) {
        return;
    }

    const NslbotUserName = await getAppSettingValue(read, AppSetting.NslhubBotUsername);

    if (!NslbotUserName) {
        this.app.getLogger().error(Logs.EMPTY_BOT_USERNAME_SETTING);
        return;
    }


    const room = await read.getRoomReader().getById(rid);
    if (!room) {
        this.app.getLogger().error(`${ Logs.INVALID_ROOM_ID } ${ rid }`);
        return;
    }
    console.log('room is', room);
    const msg = modify.getCreator().startLivechatMessage().setRoom(room).setVisitor(visitor);

    const { text, attachment } = message;

    if (text) {
        msg.setText(text);
    }

    if (attachment) {
        msg.addAttachment(attachment);
    }

    return new Promise(async (resolve) => {
        modify.getCreator().finish(msg)
        .then((result) => resolve(result))
        .catch((error) => console.error(error));
    });
};

export const deleteAllActionBlocks = async (modify: IModify, appUser: IUser, msgId: string): Promise<void> => {
    const msgBuilder = await modify.getUpdater().message(msgId, appUser);
    msgBuilder.setEditor(appUser).setBlocks(modify.getCreator().getBlockBuilder().getBlocks());
    return modify.getUpdater().finish(msgBuilder);
};

