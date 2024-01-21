module.exports = class Message {

    #client = null;
    #ready = false;

    constructor(data, client) {
        this.#client = client;

        this.id = data.id;
        
        this.channelID = data.channel_id ?? null;
        this.channel = null;
        this.guildID = data.guild_id ?? null;
        this.guild = null;
        this.authorID = data.author_id ?? null;
        this.author = null;
        this.member = null;

        this.#init(data);

        this.content = data.content;
        this.timestamp = data.timestamp;
        this.edited_timestamp = data.edited_timestamp;
        this.tts = data.tts;
        this.mention_everyone = data.mention_everyone;
        this.mentions = data.mentions;
        this.mention_roles = data.mention_roles;
        this.mention_channels = data.mention_channels;
        this.attachments = data.attachments;
        this.embeds = data.embeds;
        this.reactions = data.reactions;
        this.nonce = data.nonce;
        this.pinned = data.pinned;
        this.webhook_id = data.webhook_id;
        this.type = data.type;
        this.activity = data.activity;
        this.application = data.application;
        this.message_reference = data.message_reference;
        this.flags = data.flags;
        this.referenced_message = data.referenced_message;
        this.interaction = data.interaction;
        this.thread = data.thread;
        this.components = data.components;
    }

    async #init() {
        // console.log(this);
        // this.channel = await this.#client.channels.get(this.channelID);
        // this.guild = await this.#client.guilds.get(this.guildID);
        // this.author = await this.#client.users.get(this.authorID);
        // this.member = await this.#client.members.get(this.guildID, this.authorID);

        this.#ready = true;
    }

    get ready() {
        return this.#ready;
    }

    set ready(_) {
        this.#ready = true;
    }

}