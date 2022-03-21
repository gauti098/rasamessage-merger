import { ISetting, SettingType} from '@rocket.chat/apps-engine/definition/settings';

export enum AppSetting {
    NslhubBotUsername = 'Nslhub_bot_username',
    NslhubServerUrl = 'Nslhub_server_url',
    NslhubServiceUnavailableMessage = 'Nslhub_service_unavailable_message',
    NslhubHandoverMessage = 'Nslhub_handover_message',
    NslhubCloseChatMessage = 'Nslhub_close_chat_message',
    NslhubEnableCallbacks = 'Nslhub_enable_callbacks',
    NslhubDefaultHandoverDepartment = 'Nslhub_target_handover_department',
    NslhubHideQuickReplies = 'Nslhub_hide_quick_replies',
    IdeaBotUsername = 'Idea_bot_username',
    IdeaServerUrl = 'Idea_server_url',
    IdeaDefaultHandoverDepartment = 'Idea_target_handover_department',



}

export enum DefaultMessage {
    DEFAULT_NslhubServiceUnavailableMessage = 'Sorry, I\'m having trouble answering your question.',
    DEFAULT_NslhubHandoverMessage = 'Transferring to an online agent',
    DEFAULT_NslhubCloseChatMessage = 'Closing the chat, Goodbye',
}

export const settings: Array<ISetting> = [
    {
        id: AppSetting.NslhubBotUsername,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'bot_username',
        required: true,

    },
    {
        id: AppSetting.NslhubServerUrl,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Nslhub_server_url',
        required: true,
    },
    {
        id: AppSetting.NslhubServiceUnavailableMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Nslhub_service_unavailable_message',
        i18nDescription: 'Nslhub_service_unavailable_message_description',
        required: false,
    },
    {
        id: AppSetting.NslhubCloseChatMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Nslhub_close_chat_message',
        i18nDescription: 'Nslhub_close_chat_message_description',
        required: false,
    },
    {
        id: AppSetting.NslhubHandoverMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Nslhub_handover_message',
        i18nDescription: 'Nslhub_handover_message_description',
        required: false,
    },
    {
        id: AppSetting.NslhubDefaultHandoverDepartment,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Nslhub_default_handover_department',
        i18nDescription: 'Nslhub_default_handover_department_description',
        required: true,
    },
    {
        id: AppSetting.NslhubEnableCallbacks,
        public: true,
        type: SettingType.BOOLEAN,
        packageValue: false,
        value: false,
        i18nLabel: 'Nslhub_callback_message',
        i18nDescription: 'Nslhub_callback_message_description',
        required: true,
    },
    {
        id: AppSetting.NslhubHideQuickReplies,
        public: true,
        type: SettingType.BOOLEAN,
        packageValue: true,
        value: true,
        i18nLabel: 'Nslhub_hide_quick_replies',
        i18nDescription: 'Nslhub_hide_quick_replies_description',
        required: true,
    },

    {
        id: AppSetting.NslhubServiceUnavailableMessage,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Nslhub_service_unavailable_message',
        required: false,
    },
    {
        id: AppSetting.IdeaBotUsername,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'idea_bot_username',
        required: true,

    },
    {
        id: AppSetting.IdeaServerUrl,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Idea_server_url',
        required: true,
    },
    {
        id: AppSetting.IdeaDefaultHandoverDepartment,
        public: true,
        type: SettingType.STRING,
        packageValue: '',
        i18nLabel: 'Idea_default_handover_department',
        i18nDescription: 'Idea_default_handover_department_description',
        required: true,
    },
];
