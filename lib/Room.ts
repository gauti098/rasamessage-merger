import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IDepartment, ILivechatRoom, ILivechatTransferData, IVisitor } from '@rocket.chat/apps-engine/definition/livechat';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { AppSetting, DefaultMessage } from '../config/Settings';
import { Logs } from '../enum/Logs';
import { createMessage, createMessage1 } from './Message';
import { getAppSettingValue } from './Setting';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export const updateRoomCustomFields = async (rid: string, data: any, read: IRead,  modify: IModify): Promise<any> => {
    if (!rid) {
        return;
    }
    const room = await read.getRoomReader().getById(rid);
    if (!room) { throw new Error(`Invalid room id ${rid}`); }

    const botUserName = await getAppSettingValue(read, AppSetting.NslhubBotUsername);
    // const botUserName = await getAppSettingValue(read, AppSetting.IdeaBotUsername);
    if (!botUserName) { throw new Error('The Bot Username setting is not defined.'); }

    const user = await read.getUserReader().getByUsername(botUserName);
    if (!user) { throw new Error('The Bot User does not exist.'); }

    let { customFields = {} } = room;
    customFields = Object.assign(customFields, data);
    const roomBuilder = await modify.getUpdater().room(rid, user);
    roomBuilder.setCustomFields(customFields);

    try {
        modify.getUpdater().finish(roomBuilder);
    } catch (error) {
        console.error(error);
    }
};

export const closeChat = async (modify: IModify, read: IRead, rid: string) => {
    const room: IRoom = (await read.getRoomReader().getById(rid)) as IRoom;
    if (!room) { throw new Error(Logs.INVALID_ROOM_ID); }

    const closeChatMessage = await getAppSettingValue(read, AppSetting.NslhubCloseChatMessage);

    const result = await modify.getUpdater().getLivechatUpdater()
                        .closeRoom(room, closeChatMessage ? closeChatMessage : DefaultMessage.DEFAULT_NslhubCloseChatMessage);
    if (!result) { throw new Error(Logs.CLOSE_CHAT_REQUEST_FAILED_ERROR); }
};

export const performHandover = async (modify: IModify, read: IRead, rid: string, visitorToken: string, targetDepartmentName?: string | null, targetAgentName?: string | null) => {

    // const handoverMessage: string = 'handling over to agent'
    // await createMessage(rid, read, modify, { text: handoverMessage ? handoverMessage : DefaultMessage.DEFAULT_NslhubHandoverMessage });

    const room: ILivechatRoom = (await read.getRoomReader().getById(rid)) as ILivechatRoom;
    if (!room) { throw new Error(Logs.INVALID_ROOM_ID); }

    const visitor: IVisitor = (await read.getLivechatReader().getLivechatVisitorByToken(visitorToken)) as IVisitor;
    console.log('visitor from room is', visitor);
    if (!visitor) { throw new Error(Logs.INVALID_VISITOR_TOKEN); }

    const livechatTransferData: ILivechatTransferData = {
        currentRoom: room,
    };



    // // // // if(agentid)
    // // // // {
    // const agent = sourceFile.agent;
    // console.log('checking logs in room ts file from export' , agent);
    // // // // // console.log('before user email checking');
    // const agentDB: IUser = await read.getUserReader().getById(agent) as IUser;
    // console.log('agentdb details is', agentDB);
    // // // livechatTransferData.targetAgent = agentDB;
    // // let agent = 'kDP83svj8NgPGH5A5';

    // if(agent == '')
    // {
    //     createMessage(rid, read, modify, { text:'transferring your call to Department'});
    //     const targetDepartment = targetDepartmentName || await getAppSettingValue(read, AppSetting.NslhubDefaultHandoverDepartment);
    //     if (!targetDepartment) {
    //         throw new Error(Logs.INVALID_DEPARTMENT_NAME_IN_BOTH_SETTING_AND_REQUEST);
    //     }

    //     const departmentDB: IDepartment = await read.getLivechatReader().getLivechatDepartmentByIdOrName(targetDepartment) as IDepartment;
    //     if (!departmentDB) {
    //         throw new Error(Logs.INVALID_DEPARTMENT_NAME);
    //     }

    //     livechatTransferData.targetDepartment = departmentDB.id;

    // }
    // else if(agentDB)
    // {
    //     const agentDB: IUser = await read.getUserReader().getById(agent) as IUser;
    //     if(agentDB.status == 'offline'){
    //         createMessage(rid, read, modify, { text:'Agent is offline. I am transferring your call to Department'});
    //         const targetDepartment = targetDepartmentName || await getAppSettingValue(read, AppSetting.NslhubDefaultHandoverDepartment);
    //         if (!targetDepartment) {
    //             throw new Error(Logs.INVALID_DEPARTMENT_NAME_IN_BOTH_SETTING_AND_REQUEST);
    //         }

    //         const departmentDB: IDepartment = await read.getLivechatReader().getLivechatDepartmentByIdOrName(targetDepartment) as IDepartment;
    //         if (!departmentDB) {
    //             throw new Error(Logs.INVALID_DEPARTMENT_NAME);
    //         }
    //         console.log('when agent is offline');
    //         livechatTransferData.targetDepartment = departmentDB.id;
    //         console.log('when agent is offline then handover not happening', agentDB);


    //     }
    //     else if(agentDB.status)
    //     {
    //         createMessage(rid, read, modify, { text:'handling over to agent'});
    //         console.log('when agent is online');
    //         livechatTransferData.targetAgent = agentDB;
    //         console.log('when agent is online then handover happening', agentDB);


    //     }

    // }
    // else
    // {
    //     createMessage(rid, read, modify, { text:'transferring your call to Department'});
    //     const targetDepartment = targetDepartmentName || await getAppSettingValue(read, AppSetting.NslhubDefaultHandoverDepartment);
    //     if (!targetDepartment) {
    //         throw new Error(Logs.INVALID_DEPARTMENT_NAME_IN_BOTH_SETTING_AND_REQUEST);
    //     }

    //     const departmentDB: IDepartment = await read.getLivechatReader().getLivechatDepartmentByIdOrName(targetDepartment) as IDepartment;
    //     if (!departmentDB) {
    //         throw new Error(Logs.INVALID_DEPARTMENT_NAME);
    //     }

    //     livechatTransferData.targetDepartment = departmentDB.id;


    // }

    // console.log('handovring trying');
    // const agentDB: IUser = await read.getUserReader().getById('hr3og6oWj2joc8q3i') as IUser;
    // console.log('agentdb  status checking');
    // console.log(agentDB.status);
    // if(agentDB.status !== 'online'){
    //     createMessage(rid, read, modify, { text:'Agent is offline. I am transferring your call to Department'});
    //     const targetDepartment = targetDepartmentName || await getAppSettingValue(read, AppSetting.NslhubDefaultHandoverDepartment);
    //     if (!targetDepartment) {
    //         throw new Error(Logs.INVALID_DEPARTMENT_NAME_IN_BOTH_SETTING_AND_REQUEST);
    //     }

    //     const departmentDB: IDepartment = await read.getLivechatReader().getLivechatDepartmentByIdOrName(targetDepartment) as IDepartment;
    //     if (!departmentDB) {
    //         throw new Error(Logs.INVALID_DEPARTMENT_NAME);
    //     }
    //     console.log('when agent is offline');
    //     livechatTransferData.targetDepartment = departmentDB.id;
    //     console.log('when agent is offline then handover not happening', agentDB);


    // }
    // else
    // {
    //     createMessage(rid, read, modify, { text:'handling over to agent'});
    //     console.log('when agent is online');
    //     livechatTransferData.targetAgent = agentDB;
    //     console.log('when agent is online then handover happening', agentDB);


    // }
    if(targetAgentName != null)
    {
        const agentDB: IUser = await read.getUserReader().getById(targetAgentName) as IUser;
        if(agentDB.status == 'offline'){
            createMessage1(rid, read, modify, { text:'Agent is offline. I am transferring your call to Department'},false);
            const targetDepartment = targetDepartmentName || await getAppSettingValue(read, AppSetting.NslhubDefaultHandoverDepartment);
            if (!targetDepartment) {
                throw new Error(Logs.INVALID_DEPARTMENT_NAME_IN_BOTH_SETTING_AND_REQUEST);
            }

            const departmentDB: IDepartment = await read.getLivechatReader().getLivechatDepartmentByIdOrName(targetDepartment) as IDepartment;
            if (!departmentDB) {
                throw new Error(Logs.INVALID_DEPARTMENT_NAME);
            }
            console.log('when agent is offline');
            livechatTransferData.targetDepartment = departmentDB.id;
            console.log('when agent is offline then handover not happening', agentDB);


        }
        else if(agentDB.status)
        {
            createMessage1(rid, read, modify, { text:'handling over to agent'},false);
            console.log('when agent is online');
            livechatTransferData.targetAgent = agentDB;
            console.log('when agent is online then handover happening', agentDB);


        }

    }
    else if(targetAgentName == null)
    {
        createMessage(rid, read, modify, { text:'transferring your call to Department'},false);
        const targetDepartment = targetDepartmentName || await getAppSettingValue(read, AppSetting.NslhubDefaultHandoverDepartment);
        if (!targetDepartment) {
        throw new Error(Logs.INVALID_DEPARTMENT_NAME_IN_BOTH_SETTING_AND_REQUEST);
        }

        const departmentDB: IDepartment = await read.getLivechatReader().getLivechatDepartmentByIdOrName(targetDepartment) as IDepartment;
        if (!departmentDB) {
        throw new Error(Logs.INVALID_DEPARTMENT_NAME);
        }

        livechatTransferData.targetDepartment = departmentDB.id;

    }
    else
    {
        createMessage(rid, read, modify, { text:'transferring your call to Department'},false);
        const targetDepartment = targetDepartmentName || await getAppSettingValue(read, AppSetting.NslhubDefaultHandoverDepartment);
        if (!targetDepartment) {
            throw new Error(Logs.INVALID_DEPARTMENT_NAME_IN_BOTH_SETTING_AND_REQUEST);
        }

        const departmentDB: IDepartment = await read.getLivechatReader().getLivechatDepartmentByIdOrName(targetDepartment) as IDepartment;
        if (!departmentDB) {
            throw new Error(Logs.INVALID_DEPARTMENT_NAME);
        }

        livechatTransferData.targetDepartment = departmentDB.id;


    }

    const result = await modify.getUpdater().getLivechatUpdater().transferVisitor(visitor, livechatTransferData)
        .catch((error) => {
            throw new Error(`${ Logs.HANDOVER_REQUEST_FAILED_ERROR } ${error}`);
        });
    if (!result) {
        const offlineMessage: string = await getAppSettingValue(read, AppSetting.NslhubServiceUnavailableMessage);

        await createMessage(rid, read, modify, { text: offlineMessage ? offlineMessage : DefaultMessage.DEFAULT_NslhubServiceUnavailableMessage },false);
    }
};
