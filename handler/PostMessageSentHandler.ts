import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IApp } from '@rocket.chat/apps-engine/definition/IApp';
import { ILivechatMessage, ILivechatRoom } from '@rocket.chat/apps-engine/definition/livechat';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { AppSetting, DefaultMessage } from '../config/Settings';
import { Logs } from '../enum/Logs';
import { INslhubMessage } from '../enum/Nslhub';
import { createMessage, createMessage1, createNslhubMessage } from '../lib/Message';
import { sendMessage } from '../lib/Nslhub';
import { getAppSettingValue } from '../lib/Setting';

export class PostMessageSentHandler {
    constructor(private app: IApp,
                private message: ILivechatMessage,
                private read: IRead,
                private http: IHttp,
                private persis: IPersistence,
                private modify: IModify) {}

    public async run() {

        const { text, editedAt, room, token, sender } = this.message;
        const livechatRoom = room as ILivechatRoom;

        const { id: rid, type, servedBy, isOpen } = livechatRoom;

        const NslhubBotUsername: string = await getAppSettingValue(this.read, AppSetting.NslhubBotUsername);
        // const IdeaBotUsername: string = await getAppSettingValue(this.read, AppSetting.IdeaBotUsername);
        
        
        if (!type || type !== RoomType.LIVE_CHAT) {
            return;
        }
       
        if (!isOpen || !token || editedAt || !text) {
            return;
        }

        // if (!servedBy || servedBy.username !== NslhubBotUsername) {
        //     return;
        // }

        if (sender.username === NslhubBotUsername) {
            return;
        }

        // if (!servedBy || servedBy.username !== IdeaBotUsername) {
        //     return;
        // }

        // if (sender.username === IdeaBotUsername) {
        //     return;
        // }

        

        if (!text || (text && text.trim().length === 0)) {
            return;
        }

        let response: Array<INslhubMessage> | null;
        try {
            response = await sendMessage(this.read, this.http, rid, this.modify, text,  this.app);
            console.log('response from bot is', response);
        } catch (error) {
            this.app.getLogger().error(`${ Logs.Nslhub_REST_API_COMMUNICATION_ERROR } ${error.message}`);
            console.log('getting error from bot',this.read,this.http,text);
            const serviceUnavailable: string = await getAppSettingValue(this.read, AppSetting.NslhubServiceUnavailableMessage);
            await createMessage1(rid, this.read, this.modify, {
                text: serviceUnavailable ? serviceUnavailable : DefaultMessage.DEFAULT_NslhubServiceUnavailableMessage,

            },false);


            return;
        }

        if (response) {
            for (const message of response) {
                await createNslhubMessage(rid, this.read, this.modify, message);
            }
        }

    }
}
