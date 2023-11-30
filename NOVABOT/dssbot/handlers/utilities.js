module.exports = (client) => {

    client.checkHighest = (administrator, target, permission) => {

        if (administrator.guild.ownerId == administrator.id) return true

        if (permission) {
            if (target.permissions.has(permission)) return (administrator.roles.highest.position > target.roles.highest.position) ? true : false
        }

        return (administrator.roles.highest.position > target.roles.highest.position) ? true : false

    }

    client.db = require('better-sqlite3')('data.db');

} // Fully made by skayvs