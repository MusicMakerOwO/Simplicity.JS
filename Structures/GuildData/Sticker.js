module.exports = class Sticker {
    constructor(data) {
        this.id = data.id;
        this.guild_id = data.guild_id;
        this.name = data.name;
        this.description = data.description;
        this.tags = data.tags;
        this.format_type = data.format_type;
        this.available = data.available;
        this.user = data.user;
        this.sort_value = data.sort_value;
    }
}